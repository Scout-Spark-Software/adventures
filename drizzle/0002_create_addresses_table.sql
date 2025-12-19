-- Migration: Create addresses table and update hikes/camping_sites to reference it
-- This migration:
-- 1. Creates the addresses table
-- 2. Removes address fields from hikes and camping_sites
-- 3. Adds address_id foreign key to both tables

-- Create addresses table
CREATE TABLE IF NOT EXISTS "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text,
	"city" text,
	"state" text,
	"country" text,
	"postal_code" text,
	"latitude" double precision,
	"longitude" double precision,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Update hikes table
ALTER TABLE "hikes" DROP COLUMN IF EXISTS "address";
ALTER TABLE "hikes" DROP COLUMN IF EXISTS "city";
ALTER TABLE "hikes" DROP COLUMN IF EXISTS "state";
ALTER TABLE "hikes" DROP COLUMN IF EXISTS "country";
ALTER TABLE "hikes" DROP COLUMN IF EXISTS "postal_code";
ALTER TABLE "hikes" DROP COLUMN IF EXISTS "latitude";
ALTER TABLE "hikes" DROP COLUMN IF EXISTS "longitude";
ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "address_id" uuid;

-- Update camping_sites table
ALTER TABLE "camping_sites" DROP COLUMN IF EXISTS "address";
ALTER TABLE "camping_sites" DROP COLUMN IF EXISTS "city";
ALTER TABLE "camping_sites" DROP COLUMN IF EXISTS "state";
ALTER TABLE "camping_sites" DROP COLUMN IF EXISTS "country";
ALTER TABLE "camping_sites" DROP COLUMN IF EXISTS "postal_code";
ALTER TABLE "camping_sites" DROP COLUMN IF EXISTS "latitude";
ALTER TABLE "camping_sites" DROP COLUMN IF EXISTS "longitude";
ALTER TABLE "camping_sites" ADD COLUMN IF NOT EXISTS "address_id" uuid;

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "hikes" ADD CONSTRAINT "hikes_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "camping_sites" ADD CONSTRAINT "camping_sites_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
