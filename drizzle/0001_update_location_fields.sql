-- Migration: Update location fields to structured address and numeric coordinates
-- Affects: hikes and camping_sites tables

-- Update hikes table
ALTER TABLE "hikes" DROP COLUMN IF EXISTS "location";
ALTER TABLE "hikes" ADD COLUMN "address" text;
ALTER TABLE "hikes" ADD COLUMN "city" text;
ALTER TABLE "hikes" ADD COLUMN "state" text;
ALTER TABLE "hikes" ADD COLUMN "country" text;
ALTER TABLE "hikes" ADD COLUMN "postal_code" text;

-- Convert latitude/longitude to double precision
ALTER TABLE "hikes" ALTER COLUMN "latitude" TYPE double precision USING CASE
  WHEN "latitude" ~ '^-?[0-9]+\.?[0-9]*$' THEN "latitude"::double precision
  ELSE NULL
END;

ALTER TABLE "hikes" ALTER COLUMN "longitude" TYPE double precision USING CASE
  WHEN "longitude" ~ '^-?[0-9]+\.?[0-9]*$' THEN "longitude"::double precision
  ELSE NULL
END;

-- Update camping_sites table
ALTER TABLE "camping_sites" DROP COLUMN IF EXISTS "location";
ALTER TABLE "camping_sites" ADD COLUMN "address" text;
ALTER TABLE "camping_sites" ADD COLUMN "city" text;
ALTER TABLE "camping_sites" ADD COLUMN "state" text;
ALTER TABLE "camping_sites" ADD COLUMN "country" text;
ALTER TABLE "camping_sites" ADD COLUMN "postal_code" text;

-- Convert latitude/longitude to double precision
ALTER TABLE "camping_sites" ALTER COLUMN "latitude" TYPE double precision USING CASE
  WHEN "latitude" ~ '^-?[0-9]+\.?[0-9]*$' THEN "latitude"::double precision
  ELSE NULL
END;

ALTER TABLE "camping_sites" ALTER COLUMN "longitude" TYPE double precision USING CASE
  WHEN "longitude" ~ '^-?[0-9]+\.?[0-9]*$' THEN "longitude"::double precision
  ELSE NULL
END;
