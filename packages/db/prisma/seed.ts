import { PrismaClient, Role, UserStatus } from "@prisma/client";

import {
  seedContacts,
  seedPetMatches,
  seedPets,
  seedPosts,
  seedPricingPlans,
  seedTestimonials,
  seedUsers,
} from "./constants";

const prisma = new PrismaClient();

type AuthUserRow = {
  id: string;
  email: string | null;
  raw_user_meta_data: unknown;
};

function profileNameFromAuthUser(row: AuthUserRow): string | undefined {
  if (row.raw_user_meta_data && typeof row.raw_user_meta_data === "object") {
    const name = (row.raw_user_meta_data as { name?: unknown }).name;
    if (typeof name === "string" && name.trim().length > 0) {
      return name;
    }
  }

  return undefined;
}

/**
 * `Profile.id` has a required FK to Supabase `auth.users` (see
 * `20260727060109_add_profiles_table`). Demo `User` rows use string IDs such as
 * `seed-user-admin` and are not Auth users. This seed never inserts into
 * `auth.users` and never invents Profile UUIDs. It only upserts Profile when a
 * real `auth.users` row already exists (for example after an admin signs up).
 */
async function seedProfilesFromExistingAuthUsers() {
  let authUsers: AuthUserRow[];

  try {
    authUsers = await prisma.$queryRaw<AuthUserRow[]>`
      SELECT id::text AS id, email, raw_user_meta_data
      FROM auth.users
    `;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.log("Profile seed skipped: could not read auth.users.", detail);
    return [];
  }

  if (authUsers.length === 0) {
    console.log(
      "Profile seed skipped: no auth.users rows. Sign up through Supabase Auth first; do not invent auth.users IDs.",
    );
    return [];
  }

  return Promise.all(
    authUsers
      .filter((row): row is AuthUserRow & { email: string } => Boolean(row.email))
      .map((row) => {
        const demoUser = seedUsers.find((user) => user.email === row.email);

        return prisma.profile.upsert({
          where: { id: row.id },
          update: {
            email: row.email,
            name: profileNameFromAuthUser(row) ?? demoUser?.name,
            role: demoUser?.role ?? Role.USER,
            status: demoUser?.status ?? UserStatus.VERIFIED,
          },
          create: {
            id: row.id,
            email: row.email,
            name: profileNameFromAuthUser(row) ?? demoUser?.name,
            role: demoUser?.role ?? Role.USER,
            status: demoUser?.status ?? UserStatus.VERIFIED,
          },
        });
      }),
  );
}

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

  const contacts = await Promise.all(
    seedContacts.map((contact) =>
      prisma.contact.upsert({
        where: { id: contact.id },
        update: {},
        create: contact,
      }),
    ),
  );

  const petMatches = await Promise.all(
    seedPetMatches.map((petMatch) =>
      prisma.petMatch.upsert({
        where: { id: petMatch.id },
        update: {},
        create: petMatch,
      }),
    ),
  );

  const profiles = await seedProfilesFromExistingAuthUsers();

  console.log("Seed complete:", {
    users: users.map(({ email }) => email),
    pets: pets.map(({ name }) => name),
    posts: seedPosts.length,
    testimonials: seedTestimonials.length,
    pricingPlans: seedPricingPlans.map(({ name }) => name),
    contacts: contacts.map(({ id, status }) => ({ id, status })),
    petMatches: petMatches.map(({ id, status }) => ({ id, status })),
    profiles: profiles.map(({ id, email }) => ({ id, email })),
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
