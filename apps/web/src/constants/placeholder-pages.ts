import { ROUTES } from "@/constants/routes";

export type PlaceholderPageKey =
  | "careers"
  | "partners"
  | "press"
  | "communityGuide"
  | "firstMeetChecklist"
  | "helpCenter"
  | "status"
  | "privacy"
  | "terms"
  | "communityGuidelines"
  | "cookieSettings"
  | "accessibility"
  | "signIn"
  | "createProfile";

export type PlaceholderPageCopy = {
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  primaryCta: { label: string; href: string };
};

export const PLACEHOLDER_PAGES: Record<PlaceholderPageKey, PlaceholderPageCopy> = {
  careers: {
    eyebrow: "Company",
    title: "Careers at PawPair",
    description: "We're not hiring in this demo, but the door stays open.",
    body: "This template page stands in for a future careers listing. In a real launch, open roles, culture notes, and application links would live here.",
    seoTitle: "Careers — PawPair",
    seoDescription: "See how PawPair thinks about future roles on the team.",
    primaryCta: { label: "Contact us", href: ROUTES.contact },
  },
  partners: {
    eyebrow: "Company",
    title: "Partner with PawPair",
    description: "Vets, trainers, parks, and local brands — this is the partnership stub.",
    body: "Use this page as a placeholder for partner programs, co-marketing, and referral offers. Reach out through the contact form for demo inquiries.",
    seoTitle: "Partners — PawPair",
    seoDescription: "Explore partnership ideas with PawPair's marketing template.",
    primaryCta: { label: "Talk partnerships", href: ROUTES.contact },
  },
  press: {
    eyebrow: "Company",
    title: "Press and media",
    description: "A simple press room stub for journalists and creators.",
    body: "Brand facts, screenshots, and media contacts would go here. Until then, send press questions through the contact form.",
    seoTitle: "Press — PawPair",
    seoDescription: "Press and media information for the PawPair demo brand.",
    primaryCta: { label: "Contact press", href: ROUTES.contact },
  },
  communityGuide: {
    eyebrow: "Resources",
    title: "Community guide",
    description: "A starter outline for building kinder local pet circles.",
    body: "This stub stands in for a longer guide: how to host a first walk, set group norms, and keep intros low-stress. Swap it for a real resource when you have copy.",
    seoTitle: "Community Guide — PawPair",
    seoDescription: "A placeholder guide for hosting safer local pet meetups.",
    primaryCta: { label: "Read the blog", href: ROUTES.blog },
  },
  firstMeetChecklist: {
    eyebrow: "Resources",
    title: "First-meet checklist",
    description: "A short safety list for first playdates and walks.",
    body: "Neutral territory, short sessions, treats, water, and a clear exit plan. Expand this stub into a printable checklist when you brand the template.",
    seoTitle: "First-Meet Checklist — PawPair",
    seoDescription: "Placeholder checklist for safer first pet introductions.",
    primaryCta: { label: "See safety notes", href: ROUTES.safety },
  },
  helpCenter: {
    eyebrow: "Support",
    title: "Help center",
    description: "Answers will live here. For now, send us a note.",
    body: "This is a marketing-site stub, not a knowledge base. FAQ articles, billing help, and account recovery would be added in a production app.",
    seoTitle: "Help Center — PawPair",
    seoDescription: "Placeholder help center for the PawPair marketing site.",
    primaryCta: { label: "Contact support", href: ROUTES.contact },
  },
  status: {
    eyebrow: "Support",
    title: "System status",
    description: "Demo status: all marketing pages are serving.",
    body: "This is not a live uptime feed. Use it as a stand-in for a status page that lists API, auth, and matching health.",
    seoTitle: "Status — PawPair",
    seoDescription: "Placeholder system status page for the PawPair demo.",
    primaryCta: { label: "Back home", href: ROUTES.home },
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy policy",
    description: "A template privacy notice — not legal advice.",
    body: "PawPair is a fictional brand in this monorepo. Replace this stub with counsel-reviewed privacy terms before any production launch. It exists so footer links resolve instead of 404ing.",
    seoTitle: "Privacy Policy — PawPair",
    seoDescription: "Placeholder privacy policy for the PawPair marketing template.",
    primaryCta: { label: "Contact us", href: ROUTES.contact },
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of use",
    description: "Placeholder terms for this marketing template.",
    body: "These terms are demo copy only. They do not create a contract. Swap them for real terms of use before you ship a live product.",
    seoTitle: "Terms of Use — PawPair",
    seoDescription: "Placeholder terms of use for the PawPair marketing template.",
    primaryCta: { label: "Contact us", href: ROUTES.contact },
  },
  communityGuidelines: {
    eyebrow: "Legal",
    title: "Community guidelines",
    description: "Be kind to pets and the people who love them.",
    body: "No harassment, no unsafe meetups, no listing animals for sale. This stub documents the tone a real PawPair community policy would set.",
    seoTitle: "Community Guidelines — PawPair",
    seoDescription: "Placeholder community guidelines for PawPair.",
    primaryCta: { label: "Read the community guide", href: ROUTES.communityGuide },
  },
  cookieSettings: {
    eyebrow: "Legal",
    title: "Cookie settings",
    description: "This demo does not set marketing cookies.",
    body: "Use this page as a stand-in for a cookie preference center. The template site does not run an analytics or ad pixel by default.",
    seoTitle: "Cookie Settings — PawPair",
    seoDescription: "Placeholder cookie settings page for the PawPair template.",
    primaryCta: { label: "Back home", href: ROUTES.home },
  },
  accessibility: {
    eyebrow: "Legal",
    title: "Accessibility",
    description: "We aim for clear type, contrast, and keyboard paths.",
    body: "This stub is a reminder to keep marketing pages usable. File accessibility feedback through the contact form when you adapt the template.",
    seoTitle: "Accessibility — PawPair",
    seoDescription: "Placeholder accessibility statement for PawPair.",
    primaryCta: { label: "Contact us", href: ROUTES.contact },
  },
  signIn: {
    eyebrow: "Account",
    title: "Sign in",
    description: "The public site does not host authentication.",
    body: "Header Sign in stays on this stub so visitors never hit a 404. Real login lives in the admin demo app, not on the marketing site.",
    seoTitle: "Sign In — PawPair",
    seoDescription: "Placeholder sign-in page for the PawPair marketing site.",
    primaryCta: { label: "See pricing", href: ROUTES.pricing },
  },
  createProfile: {
    eyebrow: "Account",
    title: "Create a profile",
    description: "Profile creation is a marketing CTA, not a live signup.",
    body: "This stub keeps Create a profile links working. The admin app has the demo signup flow; this public site stays auth-free.",
    seoTitle: "Create a Profile — PawPair",
    seoDescription: "Placeholder create-profile page for the PawPair marketing site.",
    primaryCta: { label: "See how it works", href: ROUTES.howItWorks },
  },
};
