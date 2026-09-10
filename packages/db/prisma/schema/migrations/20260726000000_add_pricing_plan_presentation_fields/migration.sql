ALTER TABLE "PricingPlan"
ADD COLUMN "nickname" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "ctaLabel" TEXT,
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
