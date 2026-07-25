import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type AnnouncementSectionProps = {
  className?: string;
};

function AnnouncementSection({ className }: AnnouncementSectionProps) {
  return (
    <div
      data-slot="announcement-section"
      className={cn(
        "bg-gradient-to-r from-brand-coral to-brand-lavender px-4 py-2.5 text-center",
        className,
      )}
    >
      <Link
        href={ROUTES.createProfile}
        className="text-sm font-medium text-white underline-offset-4 transition-opacity hover:opacity-90 hover:underline md:text-[0.9375rem]"
      >
        PawPair is rolling out city by city. Join the early pack →
      </Link>
    </div>
  );
}

export { AnnouncementSection };
