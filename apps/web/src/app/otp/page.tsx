import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { OtpVerifySection } from "@/sections/otp/OtpVerifySection";

export const metadata: Metadata = {
  title: PAGE_SEO.otp.title,
  description: PAGE_SEO.otp.description,
};

export default function OtpPage() {
  return <OtpVerifySection />;
}
