export type PetProfile = {
  id: string;
  name: string;
  species: "dog" | "cat" | "other";
  breed: string;
  age: number;
  size: "small" | "medium" | "large";
  energyLevel: "low" | "medium" | "high";
  playStyles: string[];
  distanceKm: number;
  compatibilityScore: number;
  image: string;
  bio: string;
  lookingFor: string[];
  verified: boolean;
};

export type Testimonial = {
  id: string;
  quote: string;
  petParentName: string;
  petName: string;
  location: string;
  avatar: string;
  rating: number;
};

export type PricingPlan = {
  id: string;
  name: string;
  nickname: string;
  priceMonthly: number;
  description: string;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  body?: string[];
};

export const DEMO_PETS: PetProfile[] = [
  {
    id: "mochi",
    name: "Mochi",
    species: "dog",
    breed: "Shih Tzu mix",
    age: 3,
    size: "small",
    energyLevel: "medium",
    playStyles: ["Gentle chase"],
    distanceKm: 1.8,
    compatibilityScore: 92,
    image: "/images/hero/pet-mochi-profile.jpg",
    bio: "Weekend walks and small-dog playdates.",
    lookingFor: ["Weekend walks", "Small-dog playdates"],
    verified: true,
  },
  {
    id: "luna",
    name: "Luna",
    species: "dog",
    breed: "Golden Retriever",
    age: 9,
    size: "large",
    energyLevel: "low",
    playStyles: ["Calm sniff walks"],
    distanceKm: 2.4,
    compatibilityScore: 88,
    image: "/images/pets/pet-luna-profile.jpg",
    bio: "Gentle senior who prefers quiet company.",
    lookingFor: ["Calm walks"],
    verified: true,
  },
  {
    id: "atlas",
    name: "Atlas",
    species: "dog",
    breed: "Australian Shepherd",
    age: 4,
    size: "medium",
    energyLevel: "high",
    playStyles: ["Full-speed park sessions"],
    distanceKm: 3.1,
    compatibilityScore: 85,
    image: "/images/pets/pet-atlas-profile.jpg",
    bio: "High-energy dog looking for compatible play sessions.",
    lookingFor: ["Park sprint sessions"],
    verified: true,
  },
  {
    id: "pepper",
    name: "Pepper",
    species: "cat",
    breed: "Gray tabby",
    age: 5,
    size: "small",
    energyLevel: "low",
    playStyles: ["Observing", "Slow greetings"],
    distanceKm: 0.9,
    compatibilityScore: 79,
    image: "/images/pets/pet-pepper-profile.jpg",
    bio: "Curious introvert who needs patient introductions.",
    lookingFor: ["Low-pressure meetups"],
    verified: false,
  },
  {
    id: "benny",
    name: "Benny",
    species: "dog",
    breed: "Mixed breed",
    age: 6,
    size: "medium",
    energyLevel: "medium",
    playStyles: ["Neighborhood routes"],
    distanceKm: 1.2,
    compatibilityScore: 90,
    image: "/images/pets/pet-benny-profile.jpg",
    bio: "Friendly walker who loves regular neighborhood routes.",
    lookingFor: ["Weekend walking buddies"],
    verified: true,
  },
];

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "bea-luna",
    quote:
      "Luna usually gets overwhelmed at the park. PawPair helped us meet one calm dog at a time, and now she has a walking buddy every Sunday.",
    petParentName: "Bea",
    petName: "Luna",
    location: "Cebu",
    avatar: "/images/pets/pet-luna-profile.jpg",
    rating: 5,
  },
  {
    id: "marco-atlas",
    quote:
      "The energy filters saved us from guessing. Atlas finally met a dog who can keep up with him.",
    petParentName: "Marco",
    petName: "Atlas",
    location: "Manila",
    avatar: "/images/pets/pet-atlas-profile.jpg",
    rating: 5,
  },
  {
    id: "nina-pepper",
    quote:
      "I moved to a new city knowing nobody. My cat did not become a social butterfly, but I found a community that understands her.",
    petParentName: "Nina",
    petName: "Pepper",
    location: "Quezon City",
    avatar: "/images/pets/pet-pepper-profile.jpg",
    rating: 5,
  },
];

export const DEMO_PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    nickname: "New Friend",
    priceMonthly: 0,
    description: "Create a meaningful profile and start matching without paying.",
    features: [
      "One pet profile",
      "Standard local discovery",
      "Limited daily likes",
      "Basic compatibility details",
      "Match and chat",
      "Safety checklist access",
    ],
    ctaLabel: "Create a free profile",
  },
  {
    id: "plus",
    name: "Plus",
    nickname: "Best Friend",
    priceMonthly: 8,
    description: "More discovery power when your pack starts to grow.",
    features: [
      "Everything in Free",
      "Unlimited likes",
      "Advanced compatibility filters",
      "See who liked your pet",
      "Extended discovery radius",
      "Profile boost each month",
      "Read receipts",
      "Saved search preferences",
    ],
    ctaLabel: "Try Plus",
    featured: true,
  },
  {
    id: "pack",
    name: "Pack",
    nickname: "Community Pack",
    priceMonthly: 16,
    description: "Tools for multi-pet households and local community hosts.",
    features: [
      "Everything in Plus",
      "Up to four pet profiles",
      "Create group walks",
      "Host local pet circles",
      "Event planning tools",
      "Priority support",
      "Community moderation controls",
      "Partner discounts (coming soon)",
    ],
    ctaLabel: "Build your pack",
  },
];

export const DEMO_BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-plan-a-low-stress-first-pet-meetup",
    title: "How to plan a low-stress first pet meetup",
    excerpt:
      "A practical checklist for choosing the right place, timing, and expectations before leashes come out.",
    category: "First Meetups",
    publishedAt: "2026-03-12",
    readingTime: "6 min",
    author: {
      name: "Aya Santos",
      role: "Community Experience Lead",
      avatar: "/images/brand/logo-pawpair-icon.png",
    },
    image: "/images/blog/blog-first-meetup.jpg",
    body: [
      "A first meetup goes better when both pets and humans know what to expect. Start with a public park, short duration, and clear communication.",
      "Bring treats, keep leashes on for the first greeting, and leave room to pause if either pet looks overwhelmed.",
      "Compatibility cues like energy level and play style help you choose the right companion before you arrive.",
    ],
  },
  {
    slug: "understanding-healthy-pet-play-signals",
    title: "Reading play signals: when to pause and when to continue",
    excerpt:
      "Learn the body language that separates joyful play from rising stress during introductions.",
    category: "Behavior and Play",
    publishedAt: "2026-02-28",
    readingTime: "5 min",
    author: {
      name: "Jules Reyes",
      role: "Head of Pet Safety",
      avatar: "/images/brand/logo-pawpair-icon.png",
    },
    image: "/images/blog/blog-play-signals.jpg",
    body: [
      "Healthy play often includes role reversals, soft body language, and brief pauses.",
      "Watch for stiff posture, tucked tails, or repeated mounting as signals to reset.",
      "Pausing early protects confidence—especially for shy or senior pets.",
    ],
  },
  {
    slug: "choosing-a-walking-buddy-for-a-senior-dog",
    title: "Choosing the right walking buddy for a senior dog",
    excerpt:
      "Slower companions, shorter routes, and calm temperaments can keep older pets social and comfortable.",
    category: "Walking and Exercise",
    publishedAt: "2026-02-10",
    readingTime: "4 min",
    author: {
      name: "Bea Lim",
      role: "Pet Wellbeing Advisor",
      avatar: "/images/brand/logo-pawpair-icon.png",
    },
    image: "/images/blog/blog-senior-walking-buddy.jpg",
    body: [
      "Senior dogs still benefit from routine social walks, just at a gentler pace.",
      "Filter for low energy, similar size preferences, and neighbors with flexible schedules.",
      "Keep first walks short and celebrate calm companionship over high activity.",
    ],
  },
  {
    slug: "helping-a-shy-pet-meet-new-companions",
    title: "Helping a shy pet meet new companions",
    excerpt: "Patient introductions and low-pressure settings help reserved pets build trust.",
    category: "Pet Socialization",
    publishedAt: "2026-01-22",
    readingTime: "5 min",
    author: {
      name: "Nina Cruz",
      role: "Community Writer",
      avatar: "/images/brand/logo-pawpair-icon.png",
    },
    image: "/images/blog/blog-first-meetup.jpg",
    body: [
      "Shy pets do best with gradual exposure and predictable routines.",
      "Choose quieter parks and owners who understand that friendship can grow slowly.",
    ],
  },
];
