import { PetSpecies, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { id: "seed-user-admin" },
    update: {},
    create: {
      id: "seed-user-admin",
      email: "admin@example.com",
      name: "Admin User",
      role: Role.ADMIN,
      bio: "Platform administrator",
    },
  });

  const bea = await prisma.user.upsert({
    where: { id: "seed-user-bea" },
    update: {},
    create: {
      id: "seed-user-bea",
      email: "bea@example.com",
      name: "Bea Lim",
      role: Role.USER,
      bio: "Pet Wellbeing Advisor",
    },
  });

  const marco = await prisma.user.upsert({
    where: { id: "seed-user-marco" },
    update: {},
    create: {
      id: "seed-user-marco",
      email: "marco@example.com",
      name: "Marco",
      role: Role.USER,
    },
  });

  const nina = await prisma.user.upsert({
    where: { id: "seed-user-nina" },
    update: {},
    create: {
      id: "seed-user-nina",
      email: "nina@example.com",
      name: "Nina Cruz",
      role: Role.USER,
      bio: "Community Writer",
    },
  });

  const aya = await prisma.user.upsert({
    where: { id: "seed-user-aya" },
    update: {},
    create: {
      id: "seed-user-aya",
      email: "aya@example.com",
      name: "Aya Santos",
      role: Role.USER,
      bio: "Community Experience Lead",
    },
  });

  const jules = await prisma.user.upsert({
    where: { id: "seed-user-jules" },
    update: {},
    create: {
      id: "seed-user-jules",
      email: "jules@example.com",
      name: "Jules Reyes",
      role: Role.USER,
      bio: "Head of Pet Safety",
    },
  });

  const mochi = await prisma.pet.upsert({
    where: { id: "seed-pet-mochi" },
    update: {},
    create: {
      id: "seed-pet-mochi",
      name: "Mochi",
      species: PetSpecies.DOG,
      breed: "Shih Tzu mix",
      age: 3,
      bio: "Weekend walks and small-dog playdates.",
      photoUrl: "/images/hero/pet-mochi-profile.jpg",
      ownerId: admin.id,
    },
  });

  const luna = await prisma.pet.upsert({
    where: { id: "seed-pet-luna" },
    update: {},
    create: {
      id: "seed-pet-luna",
      name: "Luna",
      species: PetSpecies.DOG,
      breed: "Golden Retriever",
      age: 9,
      bio: "Gentle senior who prefers quiet company.",
      photoUrl: "/images/pets/pet-luna-profile.jpg",
      ownerId: bea.id,
    },
  });

  const atlas = await prisma.pet.upsert({
    where: { id: "seed-pet-atlas" },
    update: {},
    create: {
      id: "seed-pet-atlas",
      name: "Atlas",
      species: PetSpecies.DOG,
      breed: "Australian Shepherd",
      age: 4,
      bio: "High-energy dog looking for compatible play sessions.",
      photoUrl: "/images/pets/pet-atlas-profile.jpg",
      ownerId: marco.id,
    },
  });

  const pepper = await prisma.pet.upsert({
    where: { id: "seed-pet-pepper" },
    update: {},
    create: {
      id: "seed-pet-pepper",
      name: "Pepper",
      species: PetSpecies.CAT,
      breed: "Gray tabby",
      age: 5,
      bio: "Curious introvert who needs patient introductions.",
      photoUrl: "/images/pets/pet-pepper-profile.jpg",
      ownerId: nina.id,
    },
  });

  const benny = await prisma.pet.upsert({
    where: { id: "seed-pet-benny" },
    update: {},
    create: {
      id: "seed-pet-benny",
      name: "Benny",
      species: PetSpecies.DOG,
      breed: "Mixed breed",
      age: 6,
      bio: "Friendly walker who loves regular neighborhood routes.",
      photoUrl: "/images/pets/pet-benny-profile.jpg",
      ownerId: admin.id,
    },
  });

  await prisma.post.upsert({
    where: { slug: "how-to-plan-a-low-stress-first-pet-meetup" },
    update: {},
    create: {
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
      publishedAt: new Date("2026-03-12"),
      authorId: aya.id,
    },
  });

  await prisma.post.upsert({
    where: { slug: "understanding-healthy-pet-play-signals" },
    update: {},
    create: {
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
      publishedAt: new Date("2026-02-28"),
      authorId: jules.id,
    },
  });

  await prisma.post.upsert({
    where: { slug: "choosing-a-walking-buddy-for-a-senior-dog" },
    update: {},
    create: {
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
      publishedAt: new Date("2026-02-10"),
      authorId: bea.id,
    },
  });

  await prisma.post.upsert({
    where: { slug: "helping-a-shy-pet-meet-new-companions" },
    update: {},
    create: {
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
      publishedAt: new Date("2026-01-22"),
      authorId: nina.id,
    },
  });

  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-bea-luna" },
    update: {},
    create: {
      id: "seed-testimonial-bea-luna",
      content:
        "Luna usually gets overwhelmed at the park. PawPair helped us meet one calm dog at a time, and now she has a walking buddy every Sunday.",
      authorName: "Bea",
      petName: "Luna",
      rating: 5,
      published: true,
    },
  });

  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-marco-atlas" },
    update: {},
    create: {
      id: "seed-testimonial-marco-atlas",
      content:
        "The energy filters saved us from guessing. Atlas finally met a dog who can keep up with him.",
      authorName: "Marco",
      petName: "Atlas",
      rating: 5,
      published: true,
    },
  });

  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-nina-pepper" },
    update: {},
    create: {
      id: "seed-testimonial-nina-pepper",
      content:
        "I moved to a new city knowing nobody. My cat did not become a social butterfly, but I found a community that understands her.",
      authorName: "Nina",
      petName: "Pepper",
      rating: 5,
      published: true,
    },
  });

  await prisma.pricingPlan.upsert({
    where: { id: "seed-plan-free" },
    update: {},
    create: {
      id: "seed-plan-free",
      name: "Free",
      price: 0,
      interval: "month",
      features: [
        "One pet profile",
        "Standard local discovery",
        "Limited daily likes",
        "Basic compatibility details",
        "Match and chat",
        "Safety checklist access",
      ],
      active: true,
    },
  });

  await prisma.pricingPlan.upsert({
    where: { id: "seed-plan-plus" },
    update: {},
    create: {
      id: "seed-plan-plus",
      name: "Plus",
      price: 800,
      interval: "month",
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
      active: true,
    },
  });

  await prisma.pricingPlan.upsert({
    where: { id: "seed-plan-pack" },
    update: {},
    create: {
      id: "seed-plan-pack",
      name: "Pack",
      price: 1600,
      interval: "month",
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
      active: true,
    },
  });

  console.log("Seed complete:", {
    users: [admin.email, bea.email, marco.email, nina.email, aya.email, jules.email],
    pets: [mochi.name, luna.name, atlas.name, pepper.name, benny.name],
    posts: 4,
    testimonials: 3,
    pricingPlans: ["Free", "Plus", "Pack"],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
