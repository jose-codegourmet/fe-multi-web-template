# Project structure — replace with the confirmed client's plan

Copy this file to repository-root `PROJECT_STRUCTURE.md` after gathering the answers in `docs/project/brief.md`. Do not treat this example as a confirmed client plan. The agent must replace every example value, describe the actual app boundaries below, and keep `briefRevision` equal to the confirmed brief's `- Revision:` value. `pnpm project:init --dry-run` validates the plan; `pnpm project:init` creates and activates its workspaces.

```project-init
{
  "schemaVersion": 1,
  "projectName": "Example Project",
  "briefRevision": "R1",
  "apps": [
    {
      "id": "landing",
      "kind": "landing",
      "port": 9000,
      "dataMode": "static",
      "routes": ["/"]
    },
    {
      "id": "mockapp",
      "kind": "mockapp",
      "port": 9001,
      "dataMode": "mock",
      "routes": ["/", "/prototype"]
    }
  ],
  "database": {
    "kind": "none",
    "reason": "This example uses static landing content and simulated mockapp actions."
  }
}
```

## App decisions

For each selected app, record purpose, users, planned routes and flows, mock versus live behavior, auth boundary, data ownership, and why it is a separate workspace. Use `kind` = `landing`, `mockapp`, `admin`, `customer`, or `custom`. Use `dataMode` = `static`, `mock`, `database`, or `external`. The initializer creates an app shell; the agent implements the routes and features from the brief afterward. App ids must be unique lowercase slugs and should avoid the bundled PawPair `web` and `admin` folders unless those references are deliberately adapted by hand.

## Database decision

Use `database.kind: none` when no selected app needs a database. This keeps `packages/db` out of the active workspace and makes root `pnpm dev` and `pnpm start` skip Supabase and Docker. Use `database.kind: supabase` only when at least one selected app has `dataMode: database`; explain which data it owns and whether Auth, Storage, or migrations are needed. The initializer activates the database package and gives the client a distinct local Supabase project identity, ports, and Docker network. It does not apply PawPair's reference schema or seed to a new client. Model client data and review migrations before applying them.

## Shared packages and integrations

Record whether the apps need the shared UI package, auth, payments, email, storage, analytics, or external APIs. Record environment variable names and access owners, never secret values. The minimal generated shells intentionally have no service integrations; add only those selected by the confirmed brief.

## Reference cleanup and next work

`project:init` does not delete the bundled PawPair directories. It excludes unselected references from the pnpm workspace, creates selected shells, and runs `pnpm install`. Record which reference content may be adapted or removed after the user-confirmed brief, and list the next implementation and validation steps.
