import type { Metadata } from "next";
import Link from "next/link";
import { ComponentsShowcase } from "./ComponentsShowcase";
import { SectionsShowcase } from "./SectionsShowcase";
import { ThemePreview } from "./ThemePreview";

export const metadata: Metadata = {
  title: "Showcase — PawPair",
  description: "Developer reference: pages, sections, components, and theme preview.",
};

export const dynamic = "force-dynamic";

const SAMPLE_PAGES = [
  {
    name: "Home",
    href: "/",
    description: "Landing page with full marketing section stack.",
  },
  {
    name: "About",
    href: "/about",
    description: "Mission, values, team, and community commitment.",
  },
  {
    name: "Pricing",
    href: "/pricing",
    description: "Plans, comparison table, FAQ, and final CTA.",
  },
  {
    name: "Blog",
    href: "/blog",
    description: "Article list with featured post and filters.",
  },
  {
    name: "Blog Grid",
    href: "/blog/grid",
    description: "Alternate blog index using a card grid layout.",
  },
  {
    name: "Blog Post",
    href: "/blog/how-to-plan-a-low-stress-first-pet-meetup",
    description: "Single article with body, related posts, and newsletter.",
  },
  {
    name: "Contact",
    href: "/contact",
    description: "Contact form, options, FAQ preview, and CTA.",
  },
  {
    name: "OTP",
    href: "/otp",
    description: "One-time password verification sample flow.",
  },
  {
    name: "404",
    href: "/this-page-does-not-exist",
    description: "Custom not-found page with branded illustration.",
  },
] as const;

const NAV_LINKS = [
  { label: "Pages", href: "#pages" },
  { label: "Sections", href: "#sections" },
  { label: "Components", href: "#components" },
  { label: "Theme", href: "#theme" },
] as const;

export default function ShowcasePage() {
  return (
    <div className="space-y-24 py-16">
      <header className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-brand-coral">Developer reference</p>
        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          Showcase
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Catalog of sample pages, live section modules, live UI components, and a side-by-side
          light / dark landing preview for the PawPair template.
        </p>

        <nav
          aria-label="Showcase sections"
          className="sticky top-16 z-30 -mx-4 flex gap-2 overflow-x-auto border-y border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border sm:px-3"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="pages" className="mx-auto max-w-7xl scroll-mt-28 space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h2 className="font-display text-3xl tracking-tight text-foreground">Pages</h2>
          <p className="text-sm text-muted-foreground">
            Links to every sample page currently available in the app.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_PAGES.map((page) => (
            <article
              key={page.href}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm"
            >
              <div className="space-y-1">
                <h3 className="text-base font-semibold">{page.name}</h3>
                <p className="font-mono text-xs text-muted-foreground">{page.href}</p>
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {page.description}
              </p>
              <Link
                href={page.href}
                className="inline-flex w-fit text-sm font-medium text-brand-coral hover:underline"
              >
                Visit →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="sections" className="scroll-mt-28 space-y-8">
        <div className="mx-auto max-w-7xl space-y-2 px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl tracking-tight text-foreground">Sections</h2>
          <p className="text-sm text-muted-foreground">
            Live renders of every page-level section module from{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@/sections/</code>.
          </p>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <SectionsShowcase />
        </div>
      </section>

      <section
        id="components"
        className="mx-auto max-w-7xl scroll-mt-28 space-y-6 px-4 sm:px-6 lg:px-8"
      >
        <div className="space-y-2">
          <h2 className="font-display text-3xl tracking-tight text-foreground">Components</h2>
          <p className="text-sm text-muted-foreground">
            Live examples of UI primitives from{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">@fe-template/ui</code>.
          </p>
        </div>

        <ComponentsShowcase />
      </section>

      <section id="theme" className="mx-auto max-w-7xl scroll-mt-28 space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h2 className="font-display text-3xl tracking-tight text-foreground">
            Light & dark landing preview
          </h2>
          <p className="text-sm text-muted-foreground">
            Side-by-side mini landing cards forced into light and dark themes via the{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.dark</code> class —
            independent of the site-wide theme toggle.
          </p>
        </div>

        <ThemePreview />
      </section>
    </div>
  );
}
