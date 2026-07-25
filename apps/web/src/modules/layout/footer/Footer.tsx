"use client";

import { buttonVariants } from "@fe-template/ui";
import { Globe, Monitor, Moon, Share2, Sun, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, type ThemeMode } from "@/store/slices/themeSlice";

type FooterProps = { className?: string };

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: ROUTES.howItWorks },
      { label: "Features", href: ROUTES.features },
      { label: "Pricing", href: ROUTES.pricing },
      { label: "Safety", href: ROUTES.safety },
      { label: "Download app", href: ROUTES.download },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: ROUTES.about },
      { label: "Contact", href: ROUTES.contact },
      { label: "Careers", href: ROUTES.careers },
      { label: "Partners", href: ROUTES.partners },
      { label: "Press", href: ROUTES.press },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: ROUTES.blog },
      { label: "Community guide", href: ROUTES.communityGuide },
      { label: "First-meet checklist", href: ROUTES.firstMeetChecklist },
      { label: "Help center", href: ROUTES.helpCenter },
      { label: "Status", href: ROUTES.status },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: ROUTES.privacy },
      { label: "Terms", href: ROUTES.terms },
      { label: "Community guidelines", href: ROUTES.communityGuidelines },
      { label: "Cookie settings", href: ROUTES.cookieSettings },
      { label: "Accessibility", href: ROUTES.accessibility },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  { label: "Community", href: "#", icon: Users },
  { label: "Share", href: "#", icon: Share2 },
  { label: "Website", href: "#", icon: Globe },
] as const;

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function FooterThemeSelector() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.theme.mode);

  return (
    <fieldset className="m-0 flex items-center gap-1 border-0 p-0">
      <legend className="sr-only">Theme</legend>
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          className={buttonVariants({
            variant: mode === value ? "secondary" : "ghost",
            size: "icon-sm",
          })}
          onClick={() => dispatch(setTheme(value))}
          aria-label={label}
          aria-pressed={mode === value}
          title={label}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </fieldset>
  );
}

function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      data-slot="footer"
      className={cn("mt-auto border-t border-border bg-muted/30", className)}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
          <div className="max-w-sm shrink-0 space-y-4">
            <Link href={ROUTES.home} className="inline-flex" aria-label="PawPair home">
              <Image
                src="/images/brand/logo-pawpair-primary.png"
                alt="PawPair"
                width={140}
                height={36}
                className="h-8 w-auto dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Better matches, happier tails, and stronger local pet communities.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 text-sm font-semibold text-foreground">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">© {year} PawPair. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4">
            <FooterThemeSelector />

            <nav className="flex items-center gap-1" aria-label="Social links">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </nav>

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="sr-only">Language</span>
              <select
                className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground"
                defaultValue="en"
                aria-label="Language"
                disabled
              >
                <option value="en">English</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { FOOTER_COLUMNS, Footer };
