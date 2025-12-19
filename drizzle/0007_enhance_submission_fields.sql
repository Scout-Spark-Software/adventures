-- Create new enums for camping site policies
DO $$ BEGIN
 CREATE TYPE "pet_policy" AS ENUM ('allowed', 'not_allowed', 'restricted');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "fire_policy" AS ENUM ('allowed', 'not_allowed', 'fire_pits_only', 'seasonal');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "site_type" AS ENUM ('public', 'private', 'public_private_partnership');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Add new columns to hikes table
ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "dog_friendly" boolean DEFAULT false;
ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "permits_required" text;
ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "best_season" jsonb;
ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "water_sources" boolean DEFAULT false;
ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "parking_info" text;

-- Add new columns to camping_sites table
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "cost_per_night" numeric(10,2);
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "base_fee" numeric(10,2);
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "operating_season_start" text;
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "operating_season_end" text;
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "pet_policy" "pet_policy";
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "reservation_required" boolean DEFAULT false;
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "site_type" "site_type";
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "fire_policy" "fire_policy";
