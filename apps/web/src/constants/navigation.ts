import { ROUTES } from "./routes";

export const NAV_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "About", href: ROUTES.about },
  { label: "How it works", href: ROUTES.howItWorks },
  { label: "Pricing", href: ROUTES.pricing },
  { label: "Blog", href: ROUTES.blog },
  { label: "Contact", href: ROUTES.contact },
  { label: "Showcase", href: ROUTES.showcase },
] as const;
