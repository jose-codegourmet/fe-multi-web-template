# Local AI usage ledger

`usage.csv` is the source of truth. It starts with a header and no invented usage. The dashboard reads that file directly and does not call a provider, use credentials, or upload usage. Python 3 and Node.js 24 are sufficient; no dependencies are added.

From the repository root:

```bash
pnpm ai-usage:serve
# Open http://127.0.0.1:9010
```

Use `pnpm ai-usage:serve --port 9011` for another port. The server binds only to loopback and serves only the dashboard assets and CSV, rather than exposing the repository or session logs. Opening `index.html` as a `file://` URL cannot reliably fetch the CSV; use the server. Click **Refresh CSV** after an import. There is no background upload, filesystem watcher, or automatic scan of unrelated conversations.

## Import reported usage

Give a task a stable ID and a short description that contains no private prompt text. Reuse the same task ID for its parent and child sessions. The session must belong to that task: a resumed conversation spanning several tasks cannot be accurately split using cumulative session totals. Use a dedicated session or a separate ledger rather than attributing historical usage to a new task.

```bash
# Exact local session discovery. Include descendants in this same task.
python3 scripts/ai-usage-import.py --agent codex \
  --session-id YOUR_SESSION_ID --include-children \
  --task-id TEMPLATE-123 --task-description 'Improve template tooling'

python3 scripts/ai-usage-import.py --agent claude \
  --session-id YOUR_SESSION_ID --include-children \
  --task-id TEMPLATE-123 --task-description 'Improve template tooling'

# Import explicit saved JSONL or a structured JSON report instead.
python3 scripts/ai-usage-import.py --agent codex \
  --file /absolute/path/to/rollout.jsonl \
  --task-id TEMPLATE-123 --task-description 'Improve template tooling'

python3 scripts/ai-usage-import.py --agent claude \
  --file /absolute/path/to/result.json \
  --task-id TEMPLATE-123 --task-description 'Improve template tooling'
```

Discovery uses `$CODEX_HOME/sessions` (default `~/.codex/sessions`) or `$CLAUDE_CONFIG_DIR/projects` (default `~/.claude/projects`). It requires an explicit session ID. Codex descendants are found through `session_meta.source.subagent.thread_spawn.parent_thread_id`. Claude descendants use that session's `subagents/agent-*.jsonl` directory. Existing active logs can be imported repeatedly; rerun after agents finish to capture their final reported usage. A partial last JSONL line is ignored, but malformed complete lines fail the import without changing the ledger.

`--file` can be repeated for copies/resumed transcripts. Stable response/message IDs are deduplicated across those files before totals are calculated. Supply the entire available history, rather than independent fragments: imports replace cumulative snapshots rather than adding arbitrary file totals. Importing a file containing only a late fragment may undercount; retain complete source logs and check coverage.

`--csv /path/to/another.csv` selects another ledger. `--parent-run-id ID` supplies a relationship absent from an export. `--model EXACT_MODEL_ID` supplies a model only where the source lacks attribution; it must come from verified run metadata. Missing metadata stays blank by default. Never infer models from the agent's display name or its current configuration.

## Supported sources and verification

The collectors were checked against local JSONL record schemas on 2026-11-16. Only usage and explicitly supplied task metadata are persisted; no message content, file contents, credentials, account IDs, or raw local paths enter the CSV. Local transcript schemas are implementation details and may change. Unsupported formats fail with “No supported reported usage found”; they do not generate estimates from message text.

| Source | Imported measurement | Limits and aggregation |
| --- | --- | --- |
| Codex local rollout `token_usage_record` | Per-response `payload.usage`, keyed by `response_id`; model matched by `turn_id` to `turn_context` | Preferred. Only records with the rollout's own `session_id` count. Child sessions have separate rows. `thread_token_usage` and `turn_token_usage` are never added to per-response usage. |
| Codex older rollout `event_msg/token_count` | Latest `info.total_token_usage`, rather than the sum of repeated snapshots | Scope defaults to `unknown` and is excluded. Multiple model contexts leave model blank because a cumulative total cannot be split reliably. |
| Codex `exec --json` | Sum of the export's `turn.completed.usage`, session from `thread.started.thread_id` | Model and timestamp stay blank if absent. Reimport the complete export. Copied identical whole streams are **not** safely mergeable because documented events lack stable turn IDs; import one canonical stream. |
| Claude local assistant JSONL | Latest `message.usage` per `message.id`, model and child `agentId` | Preferred. Cache read/write categories remain separate. Child run identity is `sessionId:agentId`; `parentUuid` is a message link, never treated as a parent session. A sidechain without `agentId` is kept as `sessionId:unattributed-sidechain`, scope `unknown`, and excluded. |
| Claude structured `result` JSON / stream result | Per-model `modelUsage`, or overall `usage` if no model breakdown; `costUSD` / `total_cost_usd` | Result totals can include children and previous resumed runs. Scope defaults to `inclusive` and is excluded. Claude's reported cost is an API-equivalent **client estimate**, never an invoiced provider charge. |

The documented Codex JSON stream includes `thread.started` and `turn.completed.usage`: [official non-interactive mode documentation](https://developers.openai.com/codex/noninteractive/). Claude documents JSON result metadata and explains that resumed results include earlier spend and that costs are client estimates: [Run Claude Code programmatically](https://code.claude.com/docs/en/headless). The local-log collectors above rely on observed schemas, rather than claiming those undocumented files are a stable public API.

Only use `--scope exclusive` after independently verifying that an exported total excludes child usage. Unknown/inclusive rows remain visible in the CSV but do not contribute to the dashboard. Never import an inclusive parent as exclusive while also importing the same children. If only an inclusive total is available, retain its excluded row and report incomplete coverage. The importer does not guess an exclusive parent delta by subtracting potentially incomplete children.

## Record identity and source precedence

There is one replaceable latest cumulative record per **`(agent, session_id, model, measurement_source)`**. For Claude child agents the normalized `session_id` is the composite run identity described above; `run_id` repeats that stable identity and `parent_run_id` identifies its parent. Parent and child records share `task_id`. Different model rows preserve model changes within a session.

Reimporting the same source is idempotent. A newer resumed snapshot replaces the prior row; an older timestamp cannot overwrite a newer one. If timestamps are absent, a smaller input/output snapshot cannot replace the stored larger one. Changing the task ID of an existing record is rejected to prevent accidental reassignment. A session belongs to one task; a ledger spanning unrelated tasks needs separate sessions. Do not hand-edit `task_id` just to silence this check.

The dashboard deduplicates exact CSV record keys and chooses **one source for the whole agent/session**, across all models, so a legacy whole-session snapshot cannot overlap per-model rows. Precedence is `codex.response` > `codex.rollout_total` > `codex.exec`, and `claude.message` > `claude.result`; only exclusive sources are eligible. Custom source names have lowest priority; equal custom priorities use the source name alphabetically. Alternative sources stay in the CSV but are excluded. Do not give the same measurement two different session IDs.

Writers use an advisory lock on `usage.csv.lock` and an atomic temporary-file replacement under that lock. The lock file is ignored by Git and is intentionally not deleted (deleting it would permit two different lock inodes). This protects cooperating local import processes on macOS/Linux. It does not coordinate simultaneous Git merges, hand edits, network filesystems, or Windows environments without `fcntl`. The reader sees the old or new complete CSV. Stop import processes before a manual correction.

## Costs and unknown values

Empty cells mean **unknown**, including unknown costs; `0` means an actual reported zero. All money is USD. The dashboard keeps `provider_cost_usd` and `estimated_cost_usd` separate and never adds the two. Local Codex logs do not establish provider charges. Claude client cost reports do not establish invoices or subscription charges. Subscription access does not imply a zero API-equivalent cost.

Optional `--rates /absolute/path/to/verified-rates.json` calculates an estimate only when the exact model exists in the supplied rates, all four token categories are reported, and both a pricing source and effective date are supplied. No prices are bundled or inferred. Supply a JSON object mapping the exact model ID to these fields:

| Rate field | Meaning |
| --- | --- |
| `input_tokens` | Verified uncached input USD per million tokens |
| `output_tokens` | Verified output USD per million tokens |
| `cached_input_tokens` | Verified cache-read USD per million tokens |
| `cache_write_input_tokens` | Verified cache-write USD per million tokens |
| `source` | Pricing page URL or auditable rate-card reference |
| `effective_date` | Date those rates apply, e.g. `YYYY-MM-DD` |

For Codex, cached input is a subset of reported input: uncached input = input minus cache read/write. For Claude, input excludes cache read/write; those categories are charged separately. Reasoning output is a subset of output, not an additional category to charge. Mixed cache durations, special tool charges, different service tiers, regional rates, negotiated prices, or long-context price bands require a reviewed external calculation; the simple flat-rate calculator cannot model them. Do not use a single cache-write rate for a mixed-duration Claude transcript. Leave costs unknown when the pricing basis is uncertain.

To import a separately verified provider charge or externally calculated snapshot, use `--record /path/to/sanitized-record.json` with a JSON object or array containing the CSV column names. Required identity fields, `aggregation_scope`, `cost_status`, and `completeness` must be present. `--agent` must match; `--task-id` supplies the task attribution. This replaces a whole record, so preserve its counts and identity when enriching an existing row. Provider charges require `cost_status: provider_reported`. Calculated estimates require `cost_status: calculated`, `pricing_source`, and `pricing_effective_date`. A provider invoice must be attributable to this exclusive session/model before recording it. Do not use an inclusive account invoice as an exclusive task charge. The generic record path does not verify an invoice for you.

## Dashboard totals and coverage

Recorded token totals are derived from reported categories: Codex `input_tokens + output_tokens`; Claude `input_tokens + cached_input_tokens + cache_write_input_tokens + output_tokens`. Cached/reasoning subsets are never counted twice. Unknown categories contribute no number and mark the displayed known sum incomplete. Unknown agents have no assumed total-token formula. Task aggregation uses the shared task ID and sums exclusive rows once; parent links do not recursively add the same child again.

Local log snapshots always have `completeness: partial`, because they cannot establish billing completeness or detect every missing descendant. `reported_complete` is available only for an independently verified sanitized record. The dashboard labels incomplete rows and excluded sources, preserves unknowns, and skips malformed individual CSV data rows with an invalid-row count. Broken headers, broken quoting, missing files, and fetch errors display a load error. Text is inserted through `textContent`, never interpreted as HTML. Quoted commas, escaped quotes, CRLF, BOM, and newlines in descriptions are supported.

## Validation

```bash
python3 -m unittest discover -s ai-usage/tests -p 'test_*.py' -v
node --test ai-usage/tests/dashboard.test.mjs
python3 -m py_compile scripts/ai-usage-import.py scripts/ai-usage-serve.py
```

The synthetic fixtures cover Codex response IDs, Claude message updates/child identity, model changes and unknowns, cumulative snapshots, inclusive-parent exclusion, source precedence, cache-aware totals, missing categories, pricing provenance, stale/imported snapshots, quoted/invalid CSV rows, and simultaneous writer processes. They contain no real prompts or credentials. Repository lint and type-check commands remain required for template changes; these standalone Python/JavaScript tools do not require a Next.js build.
