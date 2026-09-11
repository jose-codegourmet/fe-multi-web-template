import { defineConfig } from "prisma/config";

/**
 * Prisma CLI config for Prisma 6.19+.
 * Datasource URLs stay in `prisma/schema/schema.prisma` so Prisma Client
 * on the current major continues to resolve `DATABASE_URL` / `DIRECT_URL`.
 */
export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/schema/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
