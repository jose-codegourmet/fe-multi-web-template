# Documentation Guidelines — fe-multi-web-template

How this repository's docs are structured, when to update which layer, and how to resolve docs-versus-code drift.

---

## Layers

| Layer | Location | Owns |
|---|---|---|
| Root agent routing | `/AGENTS.md` | Which docs to read first, validation commands, scope rules |
| Root docs | `docs/*.md` | Cross-app architecture, conventions, commands, env, testing, deployment |
| Docs index | `docs/README.md` | Task routing table and links to every root document |
| LLM / template guides | `docs/llm/`, `docs/template/` | Compact patterns and human-facing scaffolding |
| App docs | `apps/<app>/AGENTS.md`, `apps/<app>/docs/` | Routes, local patterns, app-only env and commands |
| Package docs | `packages/<package>/AGENTS.md`, `packages/<package>/docs/` | Public API, consumers, package commands |
| New-workspace templates | `docs/templates/` | Boilerplate for a new app or package |

Do not duplicate a full API or route table in every layer. Put the canonical list in the owning app or package doc and link to it from root docs.

---

## When to update which docs

Update **root `docs/`** when repository-wide architecture, commands, conventions, env names, or dependency rules change.

Update **`apps/<app>/AGENTS.md` and `apps/<app>/docs/`** when that app gains or loses a route, changes auth, consumes a new package, or needs a new env var.

Update **`packages/<package>/AGENTS.md` and `packages/<package>/docs/`** when exported APIs, usage patterns, or package scripts change.

Update **`/AGENTS.md`** when workspace filters, ports, or the documentation routing table change.

When you add a new root document, add it to the tables in `docs/README.md` and, if agents should be routed there, to `/AGENTS.md`.

When you create a new app or package, start from `docs/templates/` and register the workspace in `/AGENTS.md`, `docs/README.md`, and `docs/repository-structure.md`.

---

## Drift rule

Where documentation and implementation disagree, **the implementation is the source of truth**. Correct the docs to match the code unless a task explicitly changes behavior.

Before citing a path, symbol, hook name, route, or env var, confirm it exists in the current tree. Do not invent helpers (for example a `getApiOrigin` that is not in `src/lib/utils.ts`).

`CURRENT_STATE.md` at the repo root is an audit snapshot, not a living style guide. Prefer the files under `docs/` and each workspace's `AGENTS.md` for day-to-day work.

---

## Writing rules

- Use the existing voice: short, concrete, path-heavy.
- Cite files that exist. Prefer `apps/admin/src/app/(dashboard)/posts/post-form/PostForm.tsx` over a deleted flat `post-form.tsx`.
- Name symbols as they are exported (`fetchUsers`, `usersQueryKey.list()`, `new QueryClient()`), not as they used to be named.
- Document required env **names** only. Never paste secret values from `.env` files.
- If a convention is followed only in one workspace (for example `.usecase.md` in `packages/ui`), say so instead of stating a repo-wide mandatory rule.

---

## Validation

After a docs change:

1. Grep for the old path or symbol and confirm no stale copies remain in the files you intended to update.
2. Open every new Markdown link from `docs/README.md` and confirm the target file exists.
3. If you changed a command table, confirm the script exists in the relevant `package.json`.

There is no separate docs linter. Accuracy is checked by matching the tree.
