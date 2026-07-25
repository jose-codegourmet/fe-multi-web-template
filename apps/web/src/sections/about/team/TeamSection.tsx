import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollReveal,
} from "@fe-template/ui";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const eyebrow = "The team";
const headline = "A small pack with big care for pets.";
const supporting =
  "Fictional roles that show how PawPair thinks about product, safety, community, and craft.";
const members = [
  {
    name: "Maya Ortega",
    role: "Founder and Product Lead",
    bio: "Former pet parent turned product builder. Focused on making introductions feel safer and more intentional.",
    imageSrc: "/images/brand/logo-pawpair-icon.png",
    socialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com" },
      { label: "X", href: "https://x.com" },
    ],
  },
  {
    name: "Jules Reyes",
    role: "Head of Pet Safety",
    bio: "Shapes meetup guidance, reporting tools, and wellbeing standards so every first meet starts on solid ground.",
    imageSrc: "/images/brand/logo-pawpair-icon.png",
    socialLinks: [{ label: "LinkedIn", href: "https://www.linkedin.com" }],
  },
  {
    name: "Aya Santos",
    role: "Community Experience Lead",
    bio: "Builds programs for local packs, shelters, and trainers who help pets thrive together.",
    imageSrc: "/images/brand/logo-pawpair-icon.png",
    socialLinks: [
      { label: "LinkedIn", href: "https://www.linkedin.com" },
      { label: "Instagram", href: "https://instagram.com" },
    ],
  },
  {
    name: "Kenji Park",
    role: "Design Engineer",
    bio: "Crafts interfaces that stay calm under pressure—clear CTAs, readable profiles, and accessible flows.",
    imageSrc: "/images/brand/logo-pawpair-icon.png",
    socialLinks: [{ label: "GitHub", href: "https://github.com" }],
  },
];

type TeamSectionProps = {
  className?: string;
};

function TeamSection({ className }: TeamSectionProps) {
  return (
    <section
      data-slot="team-section"
      className={cn("bg-brand-warm-cream/50 px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-brand-deep-ink md:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-ink-500 md:text-lg">
            {supporting}
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <ScrollReveal key={member.name} delay={0.08 * (index + 1)}>
              <Card className="h-full border-none bg-brand-white ring-brand-ink-200/40">
                <CardHeader className="gap-4">
                  <div className="relative mx-auto size-20 overflow-hidden rounded-full bg-brand-cream-200">
                    <Image
                      src={member.imageSrc}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain p-4 opacity-70"
                    />
                  </div>
                  <div className="text-center">
                    <CardTitle className="font-display text-lg font-semibold text-brand-deep-ink">
                      {member.name}
                    </CardTitle>
                    <p className="mt-1 text-sm font-medium text-brand-coral">{member.role}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <CardDescription className="text-center text-sm leading-relaxed text-brand-ink-500">
                    {member.bio}
                  </CardDescription>
                  {member.socialLinks.length > 0 ? (
                    <ul className="mt-auto flex flex-wrap justify-center gap-3">
                      {member.socialLinks.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-brand-ink-700 underline-offset-4 hover:text-brand-coral hover:underline"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { TeamSection };
