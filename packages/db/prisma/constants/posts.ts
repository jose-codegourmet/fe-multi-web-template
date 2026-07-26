import { SEED_USER_IDS } from "./users";

export const seedPosts = [
  {
    title: "How to plan a low-stress first pet meetup",
    slug: "how-to-plan-a-low-stress-first-pet-meetup",
    excerpt:
      "A practical checklist for choosing the right place, timing, and expectations before leashes come out.",
    content: [
      "A first meetup goes better when both pets and humans know what to expect. Start with a public park, short duration, and clear communication.",
      "Bring treats, keep leashes on for the first greeting, and leave room to pause if either pet looks overwhelmed.",
      "Compatibility cues like energy level and play style help you choose the right companion before you arrive.",
    ].join("\n\n"),
    coverImage: "/images/blog/blog-first-meetup.jpg",
    tags: ["First Meetups"],
    published: true,
    publishedAt: "2026-03-12",
    authorId: SEED_USER_IDS.aya,
  },
  {
    title: "Reading play signals: when to pause and when to continue",
    slug: "understanding-healthy-pet-play-signals",
    excerpt:
      "Learn the body language that separates joyful play from rising stress during introductions.",
    content: [
      "Healthy play often includes role reversals, soft body language, and brief pauses.",
      "Watch for stiff posture, tucked tails, or repeated mounting as signals to reset.",
      "Pausing early protects confidence—especially for shy or senior pets.",
    ].join("\n\n"),
    coverImage: "/images/blog/blog-play-signals.jpg",
    tags: ["Behavior and Play"],
    published: true,
    publishedAt: "2026-02-28",
    authorId: SEED_USER_IDS.jules,
  },
  {
    title: "Choosing the right walking buddy for a senior dog",
    slug: "choosing-a-walking-buddy-for-a-senior-dog",
    excerpt:
      "Slower companions, shorter routes, and calm temperaments can keep older pets social and comfortable.",
    content: [
      "Senior dogs still benefit from routine social walks, just at a gentler pace.",
      "Filter for low energy, similar size preferences, and neighbors with flexible schedules.",
      "Keep first walks short and celebrate calm companionship over high activity.",
    ].join("\n\n"),
    coverImage: "/images/blog/blog-senior-walking-buddy.jpg",
    tags: ["Walking and Exercise"],
    published: true,
    publishedAt: "2026-02-10",
    authorId: SEED_USER_IDS.bea,
  },
  {
    title: "Helping a shy pet meet new companions",
    slug: "helping-a-shy-pet-meet-new-companions",
    excerpt: "Patient introductions and low-pressure settings help reserved pets build trust.",
    content: [
      "Shy pets do best with gradual exposure and predictable routines.",
      "Choose quieter parks and owners who understand that friendship can grow slowly.",
    ].join("\n\n"),
    coverImage: "/images/blog/blog-first-meetup.jpg",
    tags: ["Pet Socialization"],
    published: true,
    publishedAt: "2026-01-22",
    authorId: SEED_USER_IDS.nina,
  },
] as const;
