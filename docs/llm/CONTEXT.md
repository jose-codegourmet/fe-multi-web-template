# Agent Context — fe-template

Concise context for AI agents working in this repository.

---

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js App Router (latest) |
| Monorepo | pnpm workspaces |
| UI | shadcn/ui (restructured into kebab-case folders), Tailwind CSS |
| State | Redux Toolkit (`themeSlice`) |
| Theme | next-themes (DOM), Redux source of truth |
| Data | TanStack Query + TanStack Table |
| Motion | Framer Motion (scroll-reveal only) |
| Docs | Storybook co-located with components |
| Lint | Biome, Husky, commitlint |

---

## Folder Map

```text
apps/web/src/
├── app/              ← pages (section composition only)
├── components/       ← UI, sections, navigation, footer, table, motion
├── constants/        ← routes.ts, seo.ts, demo-content.ts
├── hooks/            ← use-*/client.ts + server.ts
└── store/            ← Redux store + themeSlice
```

Root-level reference docs:

```text
docs/aboustwebsite.md   ← PawPair content direction
docs/branding.md        ← Brand identity
image-guide.md          ← Image placement guide
docs/template/          ← Human-facing docs
docs/llm/               ← This folder
scripts/cleanup-unused.py
```

---

## How to Add Things

| Task | Location | Files |
| --- | --- | --- |
| New page | `app/[route]/page.tsx` + `components/sections/[page]/` | `page.tsx` composes sections only |
| New section | `components/sections/[page]/[section]/` | `.tsx` + `.stories.tsx` + `.usecase.md`; add `.schema.ts` + `.defaultvalues.ts` only if it is a form |
| New component | `components/[name]/` | `.tsx` + `.stories.tsx` + `.usecase.md`; add `.schema.ts` + `.defaultvalues.ts` only if it is a form |
| New hook | `hooks/use-[name]/` | `client.ts` (React Query) + `server.ts` (server prefetch) |
| New route constant | `constants/routes.ts` | Add to `ROUTES` object |
| New SEO entry | `constants/seo.ts` | Add page metadata |

---

## Brand & Content Summary

### 1. PawPair — Product

Fictional pet social discovery app. Tagline: **"Better matches. Happier tails."**

Users create pet profiles, discover compatible pets nearby, match, chat, and arrange playdates. This is a **marketing showcase only** — no real backend, auth, or matchmaking algorithm.

Primary CTAs: Find a playmate, Create a pet profile, Start matching, Join the pack.

Full content direction: [`docs/aboustwebsite.md`](../aboustwebsite.md)

### 2. Branding

| Token | Value |
| --- | --- |
| Primary CTA | PawPair Coral `#FF6B6B` |
| Display font | Fraunces (Google Fonts via `next/font`) |
| Body font | Manrope (Google Fonts via `next/font`) |
| Light background | Warm Cream `#FFF8EE` |
| Dark background | Night `#111015` |

Brand personality: playful, friendly, smart, trustworthy, modern — not childish or corporate.

Full brand guide: [`docs/branding.md`](../branding.md)

### 3. Images

Assets live in `apps/web/public/images/`:

```text
brand/  hero/  product/  features/  about/  community/  pets/  blog/  illustrations/
```

Rules:
- Use `next/image` for all photography and raster assets
- Keep UI text, buttons, pricing, and scores in React — never bake them into images
- Pet portraits use `4:5` aspect ratio with `object-cover`
- Only above-the-fold images use `priority` loading
- Fallback: warm cream background + PawPair icon centred

Full placement guide: [`image-guide.md`](../../image-guide.md)

---

## Cleanup Script

Remove unused shadcn components after copying the template:

```bash
python scripts/cleanup-unused.py           # dry-run
python scripts/cleanup-unused.py --delete  # delete unused folders
```

---

## Commits

All commits must pass Husky + commitlint. Use Conventional Commits:

```bash
feat(sections): add hero to pricing page
docs(llm): update CONTEXT brand summary
```

---

## Further Reading

- [`docs/template/`](../template/) — Human-facing docs (README, COMPONENTS, HOOKS, PAGES)
- [`PATTERNS.md`](./PATTERNS.md) — Required code patterns
- [`PROMPTS.md`](./PROMPTS.md) — Copy-paste agent prompts
