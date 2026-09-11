import type { Metadata } from "next";
import { PLACEHOLDER_PAGES, type PlaceholderPageKey } from "@/constants/placeholder-pages";
import { PlaceholderHeroSection } from "@/sections/placeholder/hero/PlaceholderHeroSection";

export function placeholderMetadata(page: PlaceholderPageKey): Metadata {
  const copy = PLACEHOLDER_PAGES[page];
  return {
    title: copy.seoTitle,
    description: copy.seoDescription,
  };
}

export function PlaceholderPage({ page }: { page: PlaceholderPageKey }) {
  return <PlaceholderHeroSection {...PLACEHOLDER_PAGES[page]} />;
}
