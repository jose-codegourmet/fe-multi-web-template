"""Synthetic fixtures mirror observed schemas; no private transcript data is copied."""

import argparse
import csv
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[2] / "scripts/ai-usage-import.py"
SPEC = importlib.util.spec_from_file_location("usage_import", SCRIPT)
usage = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(usage)


def args(**changes):
    values = dict(task_id="task-1", task_description="Test, quoted \"task\"", session_id="", model="", parent_run_id="", scope=None)
    values.update(changes)
    return argparse.Namespace(**values)


def response(ident="response-1", tokens=10, timestamp="2026-11-16T10:00:00Z", session="session-1"):
    return {"type": "token_usage_record", "timestamp": timestamp, "payload": {"session_id": session, "response_id": ident, "turn_id": "turn-1", "usage": {"input_tokens": tokens, "output_tokens": 3, "cached_input_tokens": 2, "cache_write_input_tokens": 0, "reasoning_output_tokens": 1}}}


def codex_records():
    return [
        {"type": "session_meta", "payload": {"session_id": "session-1", "source": {"subagent": {"thread_spawn": {"parent_thread_id": "parent-1"}}}}},
        {"type": "turn_context", "payload": {"turn_id": "turn-1", "model": "test-model"}},
        response(), response(), response("response-2", 20),
        response("child-response", 999, session="other-session"),
        {"type": "event_msg", "payload": {"type": "token_count", "info": {"total_token_usage": {"input_tokens": 99999}}}},
    ]


class UsageImportTests(unittest.TestCase):
    def test_codex_dedup_and_child_exclusion(self):
        rows = usage.codex(codex_records(), args())
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["input_tokens"], "30")
        self.assertEqual(rows[0]["output_tokens"], "6")
        self.assertEqual(rows[0]["parent_run_id"], "parent-1")
        self.assertEqual(rows[0]["model"], "test-model")
        self.assertEqual(rows[0]["aggregation_scope"], "exclusive")
        self.assertEqual(rows[0]["provider_cost_usd"], "")

    def test_model_switch_and_unknown_model(self):
        data = codex_records()[:3]
        unknown = response("unknown", 7)
        unknown["payload"]["turn_id"] = "absent"
        data.append(unknown)
        rows = usage.codex(data, args())
        self.assertEqual({r["model"] for r in rows}, {"", "test-model"})
        self.assertEqual(sum(int(r["input_tokens"]) for r in rows), 17)

    def test_legacy_cumulative_latest_not_sum_unknown_scope(self):
        data = [{"type": "session_meta", "payload": {"id": "legacy"}}]
        for count in (10, 40, 40):
            data.append({"type": "event_msg", "payload": {"type": "token_count", "info": {"total_token_usage": {"input_tokens": count}}}})
        row = usage.codex(data, args())[0]
        self.assertEqual(row["input_tokens"], "40")
        self.assertEqual(row["output_tokens"], "")
        self.assertEqual(row["aggregation_scope"], "unknown")

    def test_codex_exec_report(self):
        row = usage.codex([{"type": "thread.started", "thread_id": "exec-1"}, {"type": "turn.completed", "usage": {"input_tokens": 10, "output_tokens": 4}}], args())[0]
        self.assertEqual(row["model"], "")
        self.assertEqual(row["input_tokens"], "10")
        self.assertEqual(row["measurement_source"], "codex.exec")
        with self.assertRaises(ValueError):
            usage.codex([{"type": "thread.started", "thread_id": "exec-1"}, {"type": "thread.started", "thread_id": "exec-1"}, {"type": "turn.completed", "usage": {"input_tokens": 10}}], args())

    def test_claude_message_updates_and_children(self):
        def message(ident, agent="", output=3):
            return {"type": "assistant", "sessionId": "parent", "agentId": agent, "timestamp": "2026-11-16T10:00:00Z", "message": {"id": ident, "model": "claude-test", "usage": {"input_tokens": 2, "output_tokens": output, "cache_read_input_tokens": 8, "cache_creation_input_tokens": 5}}}
        rows = usage.claude([message("msg-1"), message("msg-1", output=7), message("msg-2", "child")], args())
        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0]["output_tokens"], "7")
        self.assertEqual(rows[1]["session_id"], "parent:child")
        self.assertEqual(rows[1]["parent_run_id"], "parent")
        self.assertEqual(rows[0]["reasoning_output_tokens"], "")

    def test_claude_result_is_estimate_and_inclusive(self):
        row = usage.claude([{"type": "result", "session_id": "report-1", "modelUsage": {"claude-test": {"inputTokens": 50, "outputTokens": 7, "cacheReadInputTokens": 20, "cacheCreationInputTokens": 0, "costUSD": 0.25}}}], args())[0]
        self.assertEqual(row["cost_status"], "reported_estimate")
        self.assertEqual(row["estimated_cost_usd"], "0.25")
        self.assertEqual(row["provider_cost_usd"], "")
        self.assertEqual(row["aggregation_scope"], "inclusive")

    def test_claude_unidentified_sidechain_is_excluded(self):
        row = usage.claude([{"type": "assistant", "sessionId": "parent", "isSidechain": True, "message": {"id": "message", "model": "claude-test", "usage": {"input_tokens": 5}}}], args())[0]
        self.assertEqual(row["session_id"], "parent:unattributed-sidechain")
        self.assertEqual(row["parent_run_id"], "parent")
        self.assertEqual(row["aggregation_scope"], "unknown")

    def test_rates_require_provenance_and_do_not_invent_categories(self):
        row = usage.codex(codex_records(), args())[0]
        rate = {"test-model": {"input_tokens": 1, "output_tokens": 2, "cached_input_tokens": 0.1, "cache_write_input_tokens": 1, "source": "https://provider.example/pricing", "effective_date": "2026-11-16"}}
        usage.price(row, rate)
        self.assertEqual(row["estimated_cost_usd"], "0.0000384")
        self.assertEqual(row["cost_status"], "calculated")
        row["cache_write_input_tokens"] = ""
        row["estimated_cost_usd"] = ""
        usage.price(row, rate)
        self.assertEqual(row["estimated_cost_usd"], "")

    def test_unknown_and_invalid_numbers(self):
        for value in (None, "", -1, "NaN", "Infinity", True, "nonsense"):
            self.assertEqual(usage.number(value), "")
        self.assertEqual(usage.count("2.5"), "")
        self.assertEqual(usage.count(0), "0")
        self.assertEqual(usage.count("1.0"), "1")
        self.assertEqual(usage.totals([{"input_tokens": "1.0"}], {"input_tokens": "input_tokens"}), {"input_tokens": "1"})

    def test_atomic_upsert_roundtrip_stale_snapshot_and_attribution(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "usage.csv"
            row = usage.codex(codex_records(), args())[0]
            usage.upsert(path, [row])
            first = path.read_bytes()
            usage.upsert(path, [row])
            self.assertEqual(first, path.read_bytes())
            updated = {**row, "input_tokens": "50", "datetime": "2026-11-16T12:00:00Z"}
            usage.upsert(path, [updated])
            usage.upsert(path, [row])
            with path.open(newline="") as source:
                saved = list(csv.DictReader(source))
            self.assertEqual(len(saved), 1)
            self.assertEqual(saved[0]["input_tokens"], "50")
            self.assertEqual(saved[0]["task_description"], row["task_description"])
            with self.assertRaises(ValueError):
                usage.upsert(path, [{**row, "task_id": "other-task"}])

    def test_concurrent_processes_keep_all_records(self):
        with tempfile.TemporaryDirectory() as directory:
            directory = Path(directory)
            path = directory / "usage.csv"
            processes = []
            for index in range(8):
                record = {**usage.codex(codex_records(), args())[0], "session_id": f"session-{index}", "run_id": f"session-{index}"}
                source = directory / f"record-{index}.json"
                source.write_text(json.dumps(record))
                processes.append(subprocess.Popen([sys.executable, str(SCRIPT), "--agent", "codex", "--task-id", "task-1", "--record", str(source), "--csv", str(path)], stdout=subprocess.PIPE, stderr=subprocess.PIPE))
            for process in processes:
                out, err = process.communicate(timeout=15)
                self.assertEqual(process.returncode, 0, (out, err))
            with path.open(newline="") as source:
                self.assertEqual(len(list(csv.DictReader(source))), 8)

    def test_jsonl_partial_tail_and_invalid_middle(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "events.jsonl"
            path.write_text('{"type":"a"}\n{"unfinished":')
            self.assertEqual(usage.events(path), [{"type": "a"}])
            path.write_text('{"type":"a"}\nbad\n{"type":"b"}\n')
            with self.assertRaises(ValueError):
                usage.events(path)

    def test_schema_refuses_corrupt_existing_ledger(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "usage.csv"
            path.write_text("wrong,schema\n")
            with self.assertRaises(ValueError):
                usage.upsert(path, usage.codex(codex_records(), args()))
            self.assertEqual(path.read_text(), "wrong,schema\n")


if __name__ == "__main__":
    unittest.main()
