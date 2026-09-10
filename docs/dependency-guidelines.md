# Dependency Guidelines — fe-multi-web-template

Where to add dependencies and how to avoid duplicate shared functionality.

---

## Dependency placement rules

| Location | When to add here |
|---|---|
| Root `package.json` | Workspace-wide tooling only (e.g., Biome, Husky, commitlint, Turborepo). Avoid app runtime dependencies here. |
| `apps/web/package.json` | Anything only the marketing site needs (e.g., `framer-motion`, `embla-carousel-react`, Redux). |
| `apps/admin/package.json` | Anything only the admin portal needs (e.g., `@supabase/ssr`, `react-hook-form`, `@hookform/resolvers`). |
| `packages/ui/package.json` | Dependencies required by shared UI components (e.g., `@base-ui/react`, `lucide-react`, `recharts`). |
| `packages/db/package.json` | Prisma and database tooling only. |
| `packages/config/package.json` | Currently a placeholder. Do not add dependencies without a documented plan. |

---

## Shared UI vs app-local components

- Always prefer `@fe-template/ui` for primitives (Button, Card, Dialog, Form, etc.).
- App-local components should be app-specific composition pieces (page sections, header/footer, layout shell).
- Do not create a `src/components/ui/` folder inside apps.
- If a primitive is needed in two apps, add it to `packages/ui`.

---

## Shared data access

- Use `@fe-template/db` for any server-side Prisma access.
- Do not add Prisma or `@prisma/client` directly to apps; depend on the workspace package instead.
- Do not duplicate Prisma client initialization logic in apps; use the exported `prisma` singleton.

---

## Avoiding duplicate functionality

Before adding a new package or utility, check:

1. `packages/ui` — does a component already exist?
2. `packages/db` — does the model or helper already exist?
3. Existing apps — is there a hook or section you can extract instead of rewriting?
4. Root devDependencies — is the tooling already installed (e.g., Biome, TypeScript)?

If you find duplicate functionality, open a plan to consolidate it rather than adding a third implementation.

---

## Workspace imports

Apps import packages by their workspace name:

```json
"@fe-template/ui": "workspace:*",
"@fe-template/db": "workspace:*"
```

No app currently imports `@fe-template/config`. Do not add the dependency unless it has real exports to consume.

---

## Peer dependencies

`packages/ui` declares `react` and `react-dom` as peer dependencies. Apps satisfy them. When adding new peer dependencies to a package, make sure all consuming apps install them.

---

## Adding a new shared package

If a new package is needed:

1. Create `packages/<name>/` with a `package.json`.
2. Add it to `pnpm-workspace.yaml` if it does not match `packages/*` (it should).
3. Add workspace imports to consuming apps: `"@fe-template/<name>": "workspace:*"`.
4. Create `packages/<name>/AGENTS.md` and `packages/<name>/docs/README.md`.
5. Use the template at `docs/templates/package-documentation-template.md`.
6. Update `docs/README.md`, `docs/architecture.md`, and root `AGENTS.md` if the new package changes the graph.

---

## Adding a new app

If a new app is needed:

1. Create `apps/<name>/` with a `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, and `.env.example`.
2. Add workspace imports to shared packages as needed.
3. Configure `transpilePackages: ["@fe-template/ui"]` and the `@source` directive in `globals.css`.
4. Create `apps/<name>/AGENTS.md` and `apps/<name>/docs/README.md`.
5. Use the template at `docs/templates/app-documentation-template.md`.
6. Update `docs/README.md`, `docs/architecture.md`, and root `AGENTS.md` if the new app changes the graph.
