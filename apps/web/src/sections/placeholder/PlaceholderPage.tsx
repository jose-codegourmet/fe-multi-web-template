import type { Metadata } from "next";
import {
  type PlaceholderPageKey,
  PLACEHOLDER_PAGES,
} from "@/constants/placeholder-pages";
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
