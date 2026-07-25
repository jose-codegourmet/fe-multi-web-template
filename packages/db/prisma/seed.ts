import { PetSpecies, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: Role.ADMIN,
      bio: "Platform administrator",
    },
  });

  const buddy = await prisma.pet.upsert({
    where: { id: "seed-pet-buddy" },
    update: {},
    create: {
      id: "seed-pet-buddy",
      name: "Buddy",
      species: PetSpecies.DOG,
      breed: "Golden Retriever",
      age: 3,
      bio: "Friendly and loves fetch",
      ownerId: admin.id,
    },
  });

  const whiskers = await prisma.pet.upsert({
    where: { id: "seed-pet-whiskers" },
    update: {},
    create: {
      id: "seed-pet-whiskers",
      name: "Whiskers",
      species: PetSpecies.CAT,
      breed: "Tabby",
      age: 2,
      bio: "Curious and cuddly",
      ownerId: admin.id,
    },
  });

  await prisma.post.upsert({
    where: { slug: "welcome-to-pet-social" },
    update: {},
    create: {
      title: "Welcome to Pet Social",
      slug: "welcome-to-pet-social",
      excerpt: "Get started matching your pets with friends nearby.",
      content:
        "Welcome to the pet social platform! Create profiles for your pets, find playmates, and share stories from the community.",
      tags: ["welcome", "getting-started"],
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  await prisma.post.upsert({
    where: { slug: "tips-for-first-playdate" },
    update: {},
    create: {
      title: "Tips for Your First Pet Playdate",
      slug: "tips-for-first-playdate",
      excerpt: "Make the first meetup smooth and fun for everyone.",
      content:
        "Start in a neutral outdoor space, keep sessions short, and bring treats. Always supervise introductions between new pets.",
      tags: ["tips", "playdates"],
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-1" },
    update: {},
    create: {
      id: "seed-testimonial-1",
      content: "Buddy found his best friend here in a week!",
      authorName: "Alex Rivera",
      petName: "Buddy",
      rating: 5,
      published: true,
    },
  });

  await prisma.testimonial.upsert({
    where: { id: "seed-testimonial-2" },
    update: {},
    create: {
      id: "seed-testimonial-2",
      content: "The matching feature made playdates so easy to organize.",
      authorName: "Sam Chen",
      petName: "Whiskers",
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
      features: ["1 pet profile", "Basic matching", "Community posts"],
      active: true,
    },
  });

  await prisma.pricingPlan.upsert({
    where: { id: "seed-plan-pro" },
    update: {},
    create: {
      id: "seed-plan-pro",
      name: "Pro",
      price: 999,
      interval: "month",
      features: ["Unlimited pets", "Priority matching", "Advanced filters"],
      active: true,
    },
  });

  console.log("Seed complete:", {
    admin: admin.email,
    pets: [buddy.name, whiskers.name],
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
