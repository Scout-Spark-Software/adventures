-- Migration: Add indexes to addresses table for efficient searching
-- This adds indexes for:
-- 1. City searches
-- 2. State searches
-- 3. Postal code searches
-- 4. Country searches
-- 5. Geographic coordinate searches

-- Index for city searches
CREATE INDEX IF NOT EXISTS "idx_addresses_city" ON "addresses"("city");

-- Index for state searches
CREATE INDEX IF NOT EXISTS "idx_addresses_state" ON "addresses"("state");

-- Index for postal code searches
CREATE INDEX IF NOT EXISTS "idx_addresses_postal_code" ON "addresses"("postal_code");

-- Index for country searches
CREATE INDEX IF NOT EXISTS "idx_addresses_country" ON "addresses"("country");

-- Composite index for latitude and longitude (for proximity searches)
CREATE INDEX IF NOT EXISTS "idx_addresses_coordinates" ON "addresses"("latitude", "longitude");
