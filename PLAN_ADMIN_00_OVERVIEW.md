# PawPair Admin Restyle — Overview

## Goal

Restyle `apps/admin` to match the attached Stitch mockups' warm, editorial Fraunces + Manrope aesthetic — wiring the existing PawPair brand tokens into full light/dark/auto themes, redesigning the shell (sidebar/header), adding a real growth chart and activity feed to the dashboard, restyling every CRUD page, and adding a login redesign, custom 404, and a new profile page.

## Scope (in)

- Dashboard, Pets, Users, Blog (Posts), Testimonials, Contacts
- Login page redesign
- Custom 404 pages (dashboard shell + root fallback)
- New Profile page (edit name/bio, change password, theme control)

## Scope (out)

- Meetups and Safety & Moderation pages — no `Meetup` / `SafetyReport` Prisma models exist
- No new Prisma migrations or invented mock metrics
- Global search and notifications are decorative only (no backend)

## Color source of truth

Existing PawPair brand palette in `apps/admin/src/app/globals.css` and `docs/about-example-site/branding.md`. Mockups guide layout, spacing, shapes, and interaction patterns only — not hex values.

Key tokens: `--color-brand-coral #FF6B6B`, `--color-brand-deep-ink #17151F`, `--color-brand-warm-cream #FFF8EE`, `--color-brand-night #111015`, `--color-brand-night-elevated #1C1922`.

## File map

| Stream | File | Focus |
|--------|------|-------|
| 01 | `PLAN_ADMIN_01_THEME_TOKENS.md` | Semantic tokens + theme switcher |
| 02 | `PLAN_ADMIN_02_LAYOUT_SHELL.md` | Sidebar + Header |
| 03 | `PLAN_ADMIN_03_DASHBOARD.md` | Hero, stats, chart, activity |
| 04 | `PLAN_ADMIN_04_PETS_AND_USERS.md` | Pets + Users restyle |
| 05 | `PLAN_ADMIN_05_BLOG_TESTIMONIALS_CONTACTS.md` | Blog, Testimonials, Contacts |
| 06 | `PLAN_ADMIN_06_AUTH_404_PROFILE.md` | Login, 404, Profile |

## Execution guardrails

- **Before every stream:** `nvm use 24` (repo `.nvmrc` pins Node 24)
- **After every stream:** typecheck/lint (except this docs-only unit), then a scoped git commit
- Do not bundle streams into one commit
- Do not commit unrelated pre-existing uncommitted work sitting on `main`
