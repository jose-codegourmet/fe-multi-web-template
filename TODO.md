# Project checklist

Read this file first in every chat. Update it as work completes and leave the next concrete task for handoff. This template checklist is not evidence that a client approved a project.

## Discovery status

- Mode: template reference; client discovery not started.
- Client/project: not supplied.
- Saved client brief: none (`docs/project/brief.md` after discovery).
- Project structure: none (`PROJECT_STRUCTURE.md` is created from `docs/project/PROJECT_STRUCTURE.template.md` after the confirmed brief).
- Brief revision / explicit user confirmation: none.
- Selected apps: none. Bundled PawPair `web` and `admin` are references.
- Current work: template maintenance is authorized separately; it does not confirm a client brief.
- Next client task: collect discovery answers using [the onboarding workflow](docs/project/onboarding.md), save the brief, and request explicit confirmation.
- Template maintenance (2026-11-16): root `pnpm dev` and `pnpm start` now prepare the local Supabase stack and Prisma data automatically; `start` also builds. Both commands were exercised locally; web, admin login, and Studio returned HTTP 200. Hosted deployments use `pnpm start:apps`.
- Template maintenance (2026-11-17): `pnpm project:init` now derives active app workspaces and optional database from a confirmed `PROJECT_STRUCTURE.md`. This reference checkout has no client brief, so initialization has not been run here. Validation: root lint and typecheck passed (lint retains 10 reference warnings); five isolated initializer tests passed; an isolated landing + mockapp plan installed, built, typechecked, and served both apps without Docker. Next client task remains collecting and confirming actual discovery answers before writing the client structure plan.
- Template maintenance (2026-11-17): disconnected the web and admin Vercel projects from Git and added a manual-only GitHub Actions deployment workflow. The three Vercel IDs are configured as GitHub repository variables. Validation: `pnpm lint` passed with existing reference warnings, `pnpm typecheck` passed, and Actionlint passed. Set the `VERCEL_TOKEN` repository secret before the first manual run; production app environment variables and any database migrations remain deployment prerequisites.

Keep phases in order. Shared tasks run once; repeat the app checklist for each selected app. Mark an inapplicable task `[x] N/A — reason`, never silently skip it. Do not mark a phase complete until its completion criteria are met. Record validation results and blockers with the relevant task.

## 1. Gather client information and confirm project brief

- [ ] Collect client/name, product, intended users, goals, features, brand/assets, and integrations.
- [ ] Select any combination of marketing website, mockup, admin dashboard, customer dashboard, and custom apps; record exclusions and mock versus production behavior.
- [ ] Save actual answers to `docs/project/brief.md` with revision, open questions, and acceptance criteria.
- [ ] Present the saved brief and record explicit user confirmation of its revision here and in the brief.
- [ ] Create root `PROJECT_STRUCTURE.md` from the confirmed answers; record selected apps, routes, data modes, and the database decision.

Completion: a saved brief contains actual answers, `Status: confirmed`, confirmed revision, and actual user confirmation evidence. Silence, a checked TODO alone, template maintenance, and agent assumptions do not satisfy this gate.

## 2. Add project documentation

- [ ] Add client/product documentation from the confirmed brief: users, requirements, brand/assets, integrations, acceptance criteria, and exclusions.
- [ ] Identify missing assets and integration access owners; document environment variable names without secret values.
- [ ] Record shared work, decisions, open questions, and a concrete implementation plan based on nearby examples.
- [ ] Prepare project/app documentation locations and link them from the docs index.

Completion: confirmed requirements and decisions are recorded durably and another chat can resume without repeating answered discovery.

## 3. Define repository structure and selected apps

- [ ] Map only selected apps to workspace names, ports, routes, users, auth boundaries, and data ownership.
- [ ] Define shared UI/database/config responsibilities, dependencies, and required integrations; mark unused infrastructure N/A with a reason.
- [ ] Verify the toolchain and prepare configuration/environment scaffolding for selected apps.
- [ ] Run `pnpm project:init --dry-run`, then `pnpm project:init`; verify only selected workspaces are active and no database service starts when `database.kind` is `none`.
- [ ] Copy the repeatable app checklist below for each selected app and fill in purpose, routes, users, configuration, and documentation.

Completion: selected apps and shared boundaries have a documented structure; no unselected app is scaffolded.

## 4. Clean up example content

- [ ] Inventory PawPair brand/copy, metadata, navigation, assets, pages, features, auth email templates, seed fixtures, and example documentation against the confirmed brief.
- [ ] Replace/remove irrelevant surfaces and unselected workspaces deliberately, preserving needed infrastructure and imports.
- [ ] Replace sample seed content safely; never delete real database data or rewrite applied migrations as cleanup.
- [ ] Review residual example references and document intentionally retained references. Treat `cleanup-unused.py` only as an optional import-based component aid.

Completion: runtime content and selected workspaces match client scope, retained references are explained, and infrastructure remains usable.

## 5. Add and review mockups and artifacts

- [ ] Gather required design references, supplied assets, and brand direction; record missing inputs.
- [ ] Add appropriate wireframes, mockups, flows, and other review artifacts for each selected app, or mark N/A with a reason.
- [ ] Review artifacts against users, routes, features, responsive/accessibility needs, and acceptance criteria; record feedback and revisions.
- [ ] Record mock versus live behavior and any material scope changes; explicitly confirm an updated brief before dependent work.

Completion: required artifacts are available and reviewed, with decisions recorded and blocking feedback resolved or clearly identified.

## 6. Implement the code

- [ ] Implement shared foundations once, reusing existing packages and preserving required infrastructure.
- [ ] Complete implementation tasks in every selected app checklist: layout, navigation, pages, brand/assets, metadata, features, data flows, and required auth/permissions/integrations.
- [ ] Implement loading, empty, error, and success states; label mock data/actions explicitly.
- [ ] Review migrations and seeds safely; use new forward migrations rather than changing applied history.
- [ ] Update app/package docs and local AGENTS as entry points, behavior, configuration, and boundaries change.

Completion: code for every selected app meets its confirmed requirements and reviewed artifacts; unselected apps have no implementation tasks.

## 7. Validate the result and update documentation

- [ ] Run root lint and scoped typechecks; run relevant builds/tests and end-to-end checks for changed behavior.
- [ ] Verify selected user flows, cross-app links, data ownership, required auth/permissions/integrations, responsive/accessibility states, metadata, assets, and remaining example references.
- [ ] Complete validation for each selected app and record commands, results, limitations, and fixes.
- [ ] Document selected apps' deployment/setup needs and environment variable names; verify authorized deployments or mark deployment N/A with a reason.
- [ ] Update README, app/package docs, confirmed brief, and this checklist to describe the result and remaining work.
- [ ] Record usage under `ai-usage/README.md`; review with `pnpm ai-usage:serve`.
- [ ] Record final evidence, ownership, unresolved limitations, and the next concrete task for handoff.

Completion: required checks pass and confirmed acceptance criteria are met, or blockers are documented without claiming completion. Another person or agent can resume from the saved records.

## Repeatable checklist — one copy per selected app

Complete these tasks during the corresponding phases above. Replace this heading with the actual workspace name for each copy. Do not create copies for unselected apps; mark individual inapplicable tasks `[x] N/A — reason`.

- [ ] Purpose: record selected app type, product goal, brief revision, and acceptance criteria (phases 2–3).
- [ ] Users and routes: record roles, main flows, route map, auth/permissions, and data ownership (phases 2–3).
- [ ] Configuration: record workspace name, port, dependencies, environment variable names, integrations, and shared package wiring (phase 3).
- [ ] Documentation: create/update local AGENTS and app docs with behavior, commands, setup, and boundaries (phases 2–3, 6–7).
- [ ] Mockups and artifacts: add and review required designs, assets, flows, responsive states, and feedback (phase 5).
- [ ] Implementation: build confirmed pages/features/data flows, brand/metadata, and loading/empty/error/success states (phase 6).
- [ ] Validation: record lint/typecheck, relevant builds/tests, user-flow checks, limitations, and acceptance evidence (phase 7).
