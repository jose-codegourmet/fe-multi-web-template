import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";

/**
 * Profile.id is a foreign key to Supabase `auth.users` (applied in
 * `20260727060109_add_profiles_table`). That table exists only on Supabase
 * Postgres — hosted or `supabase start` locally. This preflight fails fast
 * so `prisma migrate` does not die on a cryptic missing-relation error.
 *
 * The applied migration SQL is left unchanged so existing Supabase checksums
 * stay valid.
 */
loadEnv({ path: resolve(import.meta.dirname, "../.env"), quiet: true });

const MESSAGE = `This template requires Supabase Postgres.

Profile.id references auth.users(id) ON DELETE CASCADE (see
packages/db/prisma/schema/migrations/20260727060109_add_profiles_table).
Plain Postgres (Docker, CI, other hosts) has no auth schema, so migrations fail.

Supported targets:
  - Hosted Supabase (project database)
  - Local Supabase via \`supabase start\` (provides auth.users)

Point DATABASE_URL and DIRECT_URL at that instance. See packages/db/README.md
and packages/db/docs/development.md. Do not drop the FK to "support" plain Postgres.`;

async function main() {
  if (!process.env.DATABASE_URL && !process.env.DIRECT_URL) {
    console.error("DATABASE_URL or DIRECT_URL must be set in packages/db/.env.\n");
    console.error(MESSAGE);
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    log: ["error"],
  });

  try {
    const rows = await prisma.$queryRaw<Array<{ found: unknown }>>`
      SELECT to_regclass('auth.users') AS found
    `;
    if (rows[0]?.found == null) {
      console.error(MESSAGE);
      process.exit(1);
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error("Could not verify Supabase auth.users before migrating.\n");
    console.error(detail);
    console.error(`\n${MESSAGE}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

await main();
