import { PrismaClient } from "@prisma/client";

import { seedPets, seedPosts, seedPricingPlans, seedTestimonials, seedUsers } from "./constants";

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all(
    seedUsers.map((user) =>
      prisma.user.upsert({
        where: { id: user.id },
        update: { status: user.status, role: user.role },
        create: user,
      }),
    ),
  );

  const pets = await Promise.all(
    seedPets.map((pet) =>
      prisma.pet.upsert({
        where: { id: pet.id },
        update: {},
        create: pet,
      }),
    ),
  );

  await Promise.all(
    seedPosts.map(({ publishedAt, ...post }) =>
      prisma.post.upsert({
        where: { slug: post.slug },
        update: {},
        create: {
          ...post,
          tags: [...post.tags],
          publishedAt: new Date(publishedAt),
        },
      }),
    ),
  );

  await Promise.all(
    seedTestimonials.map((testimonial) =>
      prisma.testimonial.upsert({
        where: { id: testimonial.id },
        update: {},
        create: testimonial,
      }),
    ),
  );

  await Promise.all(
    seedPricingPlans.map((pricingPlan) =>
      prisma.pricingPlan.upsert({
        where: { id: pricingPlan.id },
        update: {},
        create: {
          ...pricingPlan,
          features: [...pricingPlan.features],
        },
      }),
    ),
  );

  console.log("Seed complete:", {
    users: users.map(({ email }) => email),
    pets: pets.map(({ name }) => name),
    posts: seedPosts.length,
    testimonials: seedTestimonials.length,
    pricingPlans: seedPricingPlans.map(({ name }) => name),
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
