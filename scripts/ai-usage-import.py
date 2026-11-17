#!/usr/bin/env python3
"""Import reported usage only; never read credentials or persist conversation text."""

import argparse
import csv
import fcntl
import json
import os
from pathlib import Path
import tempfile
from decimal import Decimal, InvalidOperation

ROOT = Path(__file__).resolve().parents[1]
FIELDS = "task_id task_description session_id run_id parent_run_id datetime agent agent_id model input_tokens output_tokens cached_input_tokens cache_write_input_tokens reasoning_output_tokens provider_cost_usd estimated_cost_usd cost_status aggregation_scope measurement_source completeness pricing_source pricing_effective_date".split()
COUNTS = "input_tokens output_tokens cached_input_tokens cache_write_input_tokens reasoning_output_tokens".split()
KEY = ("agent", "session_id", "model", "measurement_source")


def number(value):
    if isinstance(value, bool) or value is None or value == "":
        return ""
    try:
        result = Decimal(str(value))
        return str(result) if result.is_finite() and result >= 0 else ""
    except InvalidOperation:
        return ""


def count(value):
    result = number(value)
    return str(int(Decimal(result))) if result and Decimal(result) == int(Decimal(result)) else ""


def events(path):
    """Accept a JSON report, JSON array, or JSONL; tolerate an unfinished last line."""
    raw = path.read_text(encoding="utf-8")
    try:
        obj = json.loads(raw)
        values = obj if isinstance(obj, list) else [obj]
    except json.JSONDecodeError:
        values = []
        lines = raw.splitlines()
        for index, line in enumerate(lines):
            if not line.strip():
                continue
            try:
                values.append(json.loads(line))
            except json.JSONDecodeError as error:
                if index == len(lines) - 1 and not raw.endswith("\n"):
                    continue
                raise ValueError(f"Invalid JSON at line {index + 1}") from error
    if any(not isinstance(value, dict) for value in values):
        raise ValueError("Expected JSON objects")
    return values


def blank(args, agent, session, model, source, timestamp="", parent="", scope="exclusive"):
    row = dict.fromkeys(FIELDS, "")
    row.update(task_id=args.task_id, task_description=args.task_description,
               session_id=session, run_id=session, parent_run_id=args.parent_run_id or parent,
               datetime=timestamp, agent=agent, model=model or "",
               measurement_source=source, completeness="partial", cost_status="unavailable",
               aggregation_scope=args.scope or scope)
    return row


def totals(usages, mapping):
    result = {}
    for target, source in mapping.items():
        values = [count(usage.get(source)) for usage in usages]
        result[target] = str(sum(int(value) for value in values)) if values and all(value != "" for value in values) else ""
    return result


CODEX_MAP = {name: name for name in COUNTS}
CLAUDE_MAP = {**CODEX_MAP, "cached_input_tokens": "cache_read_input_tokens", "cache_write_input_tokens": "cache_creation_input_tokens"}


def codex(records, args):
    meta = next((r.get("payload", {}) for r in records if r.get("type") == "session_meta"), {})
    sid = meta.get("session_id") or meta.get("id") or args.session_id
    parent = ((meta.get("source") or {}).get("subagent", {}).get("thread_spawn", {}).get("parent_thread_id", "")
              if isinstance(meta.get("source"), dict) else "")
    contexts = {r.get("payload", {}).get("turn_id"): r.get("payload", {}).get("model", "")
                for r in records if r.get("type") == "turn_context" and r.get("payload", {}).get("turn_id")}
    responses = {}
    for record in records:
        p = record.get("payload", {})
        if record.get("type") != "token_usage_record" or not isinstance(p.get("usage"), dict):
            continue
        if not sid:
            sid = p.get("session_id")
        if p.get("session_id") != sid:
            continue  # Never attribute another session's totals to this parent.
        response = p.get("response_id")
        if not response:
            continue  # A stable response identity is required for deduplication.
        model = p.get("model") or contexts.get(p.get("turn_id")) or args.model or ""
        value = (model, p["usage"], record.get("timestamp", ""))
        if response not in responses or value[2] >= responses[response][2]:
            responses[response] = value
    rows = []
    for model in sorted({value[0] for value in responses.values()}):
        group = [v for v in responses.values() if v[0] == model]
        row = blank(args, "codex", sid, model, "codex.response", max(v[2] for v in group), parent)
        if isinstance(meta.get("source"), dict):
            row["agent_id"] = meta["source"].get("subagent", {}).get("thread_spawn", {}).get("agent_path", "")
        row.update(totals([v[1] for v in group], CODEX_MAP))
        rows.append(row)
    if rows:
        return rows
    # Legacy rollout cumulative totals cannot safely be split across model changes.
    snapshots = [r for r in records if r.get("type") == "event_msg" and r.get("payload", {}).get("type") == "token_count"
                 and isinstance((r["payload"].get("info") or {}).get("total_token_usage"), dict)]
    models = set(filter(None, contexts.values()))
    if snapshots and sid:
        latest = snapshots[-1]
        model = next(iter(models)) if len(models) == 1 else args.model or ""
        row = blank(args, "codex", sid, model, "codex.rollout_total", latest.get("timestamp", ""), parent, "unknown")
        row.update(totals([latest["payload"]["info"]["total_token_usage"]], CODEX_MAP))
        return [row]
    # Documented codex exec --json output has per-turn usage, no model identity.
    sid = next((r.get("thread_id") for r in records if r.get("type") == "thread.started"), sid)
    completed = [r for r in records if r.get("type") == "turn.completed" and isinstance(r.get("usage"), dict)]
    if completed and sid:
        if sum(r.get("type") == "thread.started" for r in records) > 1:
            raise ValueError("Codex exec exports lack stable turn IDs; import one canonical complete stream per session")
        row = blank(args, "codex", sid, args.model, "codex.exec", completed[-1].get("timestamp", ""), parent)
        row.update(totals([r["usage"] for r in completed], CODEX_MAP))
        return [row]
    return []


def claude(records, args):
    messages = {}
    for record in records:
        message = record.get("message", {})
        if record.get("type") != "assistant" or not isinstance(message.get("usage"), dict) or not message.get("id"):
            continue
        sid = record.get("sessionId") or record.get("session_id") or args.session_id
        if not sid:
            continue
        agent = record.get("agentId", "")
        # Child transcripts share sessionId; agentId creates an exclusive stable run.
        run = f"{sid}:{agent}" if agent else f"{sid}:unattributed-sidechain" if record.get("isSidechain") else sid
        model = message.get("model") or args.model or ""
        key = (run, model, message["id"])
        value = (message["usage"], record.get("timestamp", ""), sid, agent, "unknown" if record.get("isSidechain") and not agent else "exclusive")
        if key not in messages or value[1] >= messages[key][1]:
            messages[key] = value
    rows = []
    for run, model in sorted({key[:2] for key in messages}):
        group = [value for key, value in messages.items() if key[:2] == (run, model)]
        row = blank(args, "claude", run, model, "claude.message", max(v[1] for v in group), group[0][2] if run != group[0][2] else "", group[0][4])
        row["agent_id"] = group[0][3]
        row.update(totals([v[0] for v in group], CLAUDE_MAP))
        rows.append(row)
    if rows:
        return rows
    # Result usage/cost can include subagents and previous resumed runs. Exclude by default.
    for record in reversed(records):
        if record.get("type") != "result" or not record.get("session_id"):
            continue
        sid = record["session_id"]
        model_usage = record.get("modelUsage", {})
        if not isinstance(model_usage, dict):
            model_usage = {}
        for model, usage in model_usage.items():
            row = blank(args, "claude", sid, model, "claude.result", record.get("timestamp", ""), scope="inclusive")
            row.update(totals([usage], {"input_tokens": "inputTokens", "output_tokens": "outputTokens", "cached_input_tokens": "cacheReadInputTokens", "cache_write_input_tokens": "cacheCreationInputTokens"}))
            row["estimated_cost_usd"] = number(usage.get("costUSD"))
            row["cost_status"] = "reported_estimate" if row["estimated_cost_usd"] else "unavailable"
            row["pricing_source"] = "Claude Code client estimate" if row["estimated_cost_usd"] else ""
            rows.append(row)
        if not rows:
            row = blank(args, "claude", sid, args.model, "claude.result", record.get("timestamp", ""), scope="inclusive")
            row.update(totals([record.get("usage", {})], CLAUDE_MAP))
            row["estimated_cost_usd"] = number(record.get("total_cost_usd"))
            row["cost_status"] = "reported_estimate" if row["estimated_cost_usd"] else "unavailable"
            row["pricing_source"] = "Claude Code client estimate" if row["estimated_cost_usd"] else ""
            rows.append(row)
        return rows
    return []


def price(row, rates):
    rate = rates.get(row["model"])
    if not rate or not rate.get("source") or not rate.get("effective_date"):
        return
    required = ["input_tokens", "output_tokens", "cached_input_tokens", "cache_write_input_tokens"]
    if any(row[key] == "" or number(rate.get(key)) == "" for key in required):
        return
    counts = {key: Decimal(row[key]) for key in required}
    # OpenAI input includes cached tokens; Anthropic input excludes read/write caches.
    if row["agent"] == "codex":
        counts["input_tokens"] -= counts["cached_input_tokens"] + counts["cache_write_input_tokens"]
    if counts["input_tokens"] < 0:
        return
    row["estimated_cost_usd"] = str(sum(counts[key] * Decimal(str(rate[key])) for key in required) / Decimal(1000000))
    row.update(cost_status="calculated", pricing_source=rate["source"], pricing_effective_date=rate["effective_date"])


def validate(row):
    if set(row) - set(FIELDS):
        raise ValueError("Unknown CSV fields")
    row = {field: str(row.get(field, "")) for field in FIELDS}
    if any(not row[key] for key in (*KEY, "task_id") if key != "model"):
        raise ValueError("task_id, agent, session_id and measurement_source are required")
    for key in COUNTS:
        if row[key] and count(row[key]) == "":
            raise ValueError(f"Invalid {key}")
    for key in ("provider_cost_usd", "estimated_cost_usd"):
        if row[key] and number(row[key]) == "":
            raise ValueError(f"Invalid {key}")
    if row["aggregation_scope"] not in ("exclusive", "inclusive", "unknown"):
        raise ValueError("aggregation_scope must be exclusive, inclusive, or unknown")
    if row["cost_status"] not in ("unavailable", "calculated", "reported_estimate", "provider_reported"):
        raise ValueError("Invalid cost_status")
    if row["provider_cost_usd"] and row["cost_status"] != "provider_reported":
        raise ValueError("Provider charges require provider_reported status")
    if row["estimated_cost_usd"] and row["cost_status"] not in ("calculated", "reported_estimate", "provider_reported"):
        raise ValueError("Estimates require provenance status")
    if row["cost_status"] == "calculated" and not (row["pricing_source"] and row["pricing_effective_date"]):
        raise ValueError("Calculated costs require pricing source and effective date")
    if row["completeness"] not in ("partial", "reported_complete"):
        raise ValueError("completeness must be partial or reported_complete")
    return row


def upsert(path, incoming):
    incoming = [validate(row) for row in incoming]
    path.parent.mkdir(parents=True, exist_ok=True)
    # Lock a separate stable inode: os.replace changes the CSV's inode.
    with path.with_suffix(path.suffix + ".lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        current = []
        if path.exists():
            with path.open(newline="", encoding="utf-8") as source:
                reader = csv.DictReader(source)
                if reader.fieldnames != FIELDS:
                    raise ValueError("Existing CSV schema differs; refusing to overwrite")
                current = [validate(row) for row in reader]
        indexed = {tuple(row[key] for key in KEY): row for row in current}
        for row in incoming:
            key = tuple(row[field] for field in KEY)
            old = indexed.get(key)
            if old and old["task_id"] != row["task_id"]:
                raise ValueError("Session already belongs to another task; use a separate CSV or explicitly edit attribution")
            if old and old["datetime"] and row["datetime"] and row["datetime"] < old["datetime"]:
                continue  # A stale snapshot cannot replace a later resumed session.
            if old and not row["datetime"] and all(old[k] != "" and row[k] != "" for k in ("input_tokens", "output_tokens")):
                if any(int(row[k]) < int(old[k]) for k in ("input_tokens", "output_tokens")):
                    continue
            indexed[key] = row
        handle, temp = tempfile.mkstemp(prefix=".usage-", suffix=".csv", dir=path.parent)
        try:
            with os.fdopen(handle, "w", newline="", encoding="utf-8") as output:
                writer = csv.DictWriter(output, fieldnames=FIELDS)
                writer.writeheader()
                writer.writerows(indexed[key] for key in sorted(indexed))
                output.flush()
                os.fsync(output.fileno())
            os.replace(temp, path)
        finally:
            if os.path.exists(temp):
                os.unlink(temp)


def discover(args):
    if not args.session_id or any(char not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_" for char in args.session_id):
        raise ValueError("Discovery requires an explicit safe --session-id")
    if args.agent == "codex":
        root = Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))) / "sessions"
        found = list(root.rglob(f"rollout-*{args.session_id}.jsonl"))
        if args.include_children:
            known = {args.session_id}
            candidates = list(root.rglob("*.jsonl"))
            while True:
                before = len(known)
                for path in candidates:
                    with path.open(encoding="utf-8") as source:
                        try:
                            meta = json.loads(source.readline()).get("payload", {})
                        except json.JSONDecodeError:
                            continue
                    origin = meta.get("source", {})
                    parent = origin.get("subagent", {}).get("thread_spawn", {}).get("parent_thread_id") if isinstance(origin, dict) else None
                    if parent in known:
                        known.add(meta.get("session_id") or meta.get("id"))
                        found.append(path)
                if before == len(known):
                    break
        return sorted(set(found))
    root = Path(os.environ.get("CLAUDE_CONFIG_DIR", str(Path.home() / ".claude"))) / "projects"
    found = list(root.glob(f"*/{args.session_id}.jsonl"))
    if args.include_children:
        for parent in list(found):
            found.extend((parent.parent / args.session_id / "subagents").glob("agent-*.jsonl"))
    return sorted(set(found))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--agent", choices=("codex", "claude"), required=True)
    parser.add_argument("--file", type=Path, action="append", default=[])
    parser.add_argument("--session-id", default="", help="Discover this exact local session if --file is absent")
    parser.add_argument("--include-children", action="store_true")
    parser.add_argument("--task-id", required=True)
    parser.add_argument("--task-description", default="")
    parser.add_argument("--model", default="", help="Explicit attribution only when absent in source")
    parser.add_argument("--parent-run-id", default="")
    parser.add_argument("--scope", choices=("exclusive", "inclusive", "unknown"), help="Override only after verifying source scope")
    parser.add_argument("--rates", type=Path, help="Optional exact-model rates JSON, USD per million tokens")
    parser.add_argument("--csv", type=Path, default=ROOT / "ai-usage/usage.csv")
    parser.add_argument("--record", type=Path, help="Import a sanitized CSV-schema JSON record/list instead of session logs")
    args = parser.parse_args()
    try:
        rows = []
        if args.record:
            rows = events(args.record)
            for row in rows:
                row.update(task_id=args.task_id, task_description=args.task_description or row.get("task_description", ""))
                if row.get("agent") != args.agent:
                    raise ValueError("Record agent differs from --agent")
        else:
            paths = args.file or discover(args)
            if not paths:
                raise ValueError("No matching local session files")
            collector = codex if args.agent == "codex" else claude
            # Merge copied/resumed files before deduplication; never add file totals together.
            records = [record for path in paths for record in events(path)]
            # Each rollout has its own session metadata; preserve child boundaries.
            if args.agent == "codex":
                by_session = {}
                for path in paths:
                    local = events(path)
                    meta = next((r.get("payload", {}) for r in local if r.get("type") == "session_meta"), {})
                    sid = meta.get("session_id") or meta.get("id") or next((r.get("thread_id") for r in local if r.get("type") == "thread.started"), args.session_id)
                    by_session.setdefault(sid, []).extend(local)
                rows = [row for local in by_session.values() for row in collector(local, args)]
            else:
                rows = collector(records, args)
        if not rows:
            raise ValueError("No supported reported usage found; nothing written")
        if args.rates:
            rates = json.loads(args.rates.read_text(encoding="utf-8"))
            for row in rows:
                price(row, rates)
        upsert(args.csv, rows)
        print(f"Upserted {len(rows)} usage records into {args.csv}")
    except (OSError, ValueError, TypeError, KeyError) as error:
        parser.exit(1, f"Usage import failed: {error}\n")


if __name__ == "__main__":
    main()
