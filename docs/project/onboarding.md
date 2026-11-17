# Start a client project

Every agent reads root [TODO.md](../../TODO.md) first, then [AGENTS.md](../../AGENTS.md). The template includes PawPair reference apps; their presence does not select them for a client. Maintaining this template is separately authorized work and does not complete client discovery.

## Discovery

Ask for the following, grouping questions for a useful conversation and reusing answers already saved:

1. Client and project name; what product or service is being built and what success means.
2. Intended users, their roles, and their main tasks.
3. Any combination of marketing website, visual/interactive mockup, admin dashboard, customer dashboard, and custom app types. Record what is excluded. For a mockup, clarify which actions are simulated and whether live services are needed.
4. Required features, pages, workflows, priorities, and acceptance criteria for each selected app.
5. Brand direction, copy, logos, images, design references, existing assets, and missing assets.
6. Required integrations (auth, database, payments, email, storage, APIs, analytics, etc.), existing systems, and who supplies access. Save variable names and setup needs, never secrets.

## Save and confirm

Save the actual answers in `docs/project/brief.md` using [brief-template.md](brief-template.md). Keep material open questions visible. Summarize the saved file to the user and ask them to explicitly confirm its current revision. A clear approval referring to the saved brief or revision satisfies this requirement; silence and elapsed time never do.

Until that confirmation arrives, continue discovery and planning only. Do not scaffold apps, clean out PawPair, or implement the product. Record confirmed status, revision, and the user's confirmation evidence (message/date or a short quote) in both the brief and root `TODO.md`. Never invent evidence. A request to improve the template does not authorize product implementation.

At the next chat, read these saved records and continue from the checklist; do not repeat discovery that is already answered and confirmed. If the client materially changes selected apps, features, or users, update the saved brief and explicitly confirm that revision before dependent implementation.

## Write the project structure and initialize

After gathering answers and confirming the saved brief, copy [PROJECT_STRUCTURE.template.md](PROJECT_STRUCTURE.template.md) to repository-root `PROJECT_STRUCTURE.md`. Replace its example manifest and decisions with the confirmed client's selected apps, routes, data modes, and explicit database decision. Show the structure to the user as the implementation plan. The JSON block is machine-readable; the surrounding sections explain the choices. The `briefRevision` must match the confirmed brief.

Run `pnpm project:init --dry-run` to validate the selection, then `pnpm project:init` to create only the selected app shells, activate their pnpm workspaces, and install their dependencies. The command refuses to overwrite PawPair reference apps or any unrecognized existing app directory. It leaves unselected reference folders on disk but outside the active workspace. Implement routes, branding, auth, integrations, and any client database schema as separate tasks from the confirmed brief. If the structure changes materially, update and reconfirm the brief, revise `PROJECT_STRUCTURE.md`, then rerun initialization. Pristine generated shells can be refreshed; customized apps require manual adaptation before their structure fields change.

A landing page and mockapp can use `dataMode: static` and `dataMode: mock` with `database.kind: none`. Root `pnpm dev` and `pnpm start` then launch only those apps without Docker or Supabase. A plan using Supabase activates `packages/db` and the local service, but never auto-applies PawPair's example migrations or seed to the new client.

## Select apps deliberately

Map each selected deliverable to its workspace name, port, users, routes, auth needs, and data ownership during phase 3. A marketing site can adapt `apps/web`; an admin portal can adapt `apps/admin`. Mockups, customer dashboards, and custom apps have no pre-created dedicated workspace: create one only when selected and confirmed. Several deliverables can share an app when the approved architecture explains that choice.

Do not generate all app types by default. The template ships two reference workspaces for learning and reuse; retain, adapt, or remove them deliberately after approval so only selected client apps remain. Reuse shared packages instead of copying infrastructure.

## Replace example content safely

Before removing examples, inventory brand names and copy, page/SEO/social metadata, navigation and links, logos/fonts/images, demo pages and features, auth email templates, fixtures/seeds, and example docs. Check imports and data consumers before removing files or models. Preserve needed workspace/tooling, shared UI wiring, environment scaffolding, auth boundaries, and database infrastructure.

`python scripts/cleanup-unused.py` only finds some unused web component folders by imports. Its dry run helps review components; it cannot decide business scope, rebrand metadata, remove demo features across apps, clean email templates or seed data, or complete client cleanup. Review its output before any deletion.

Never delete real database data or rewrite applied migrations as example cleanup. Review seed scripts before running them and use isolated disposable development data; use new forward migrations when schema changes are required. Retain useful PawPair documentation clearly labeled as reference, or replace/remove obsolete example docs deliberately after approval.

## Collaboration and handoff

Follow the seven ordered phases in root `TODO.md`: gather and confirm the brief; add project documentation; define structure and selected apps; clean up examples; add and review mockups/artifacts; implement code; validate and update documentation. Run shared tasks once; copy the app checklist for each selected app and mark irrelevant tasks N/A with a reason. Keep the brief, checklist, and implementation docs consistent. When the user requests subagents, assign bounded ownership and pass the brief, current phase, required docs, and validation requirements. The main agent reconciles results; subagents cannot approve the brief.

All agents follow [the shared usage policy](../../ai-usage/README.md), including delegated work. View available usage with `pnpm ai-usage:serve`; do not estimate token counts as measured values.
