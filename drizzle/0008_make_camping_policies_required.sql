-- Migration: Make camping site policy fields NOT NULL and remove dog_friendly from hikes
-- This migration makes petPolicy, siteType, and firePolicy required fields
-- and removes the dog_friendly column from hikes table

-- Part 1: Camping Sites - Update any NULL values to a default before adding NOT NULL constraint
-- (This is a safety measure - ideally there should be no NULL values if validation is working)
UPDATE camping_sites
SET pet_policy = 'not_allowed'
WHERE pet_policy IS NULL;

UPDATE camping_sites
SET site_type = 'public'
WHERE site_type IS NULL;

UPDATE camping_sites
SET fire_policy = 'not_allowed'
WHERE fire_policy IS NULL;

-- Part 2: Camping Sites - Add NOT NULL constraints
ALTER TABLE camping_sites
ALTER COLUMN pet_policy SET NOT NULL;

ALTER TABLE camping_sites
ALTER COLUMN site_type SET NOT NULL;

ALTER TABLE camping_sites
ALTER COLUMN fire_policy SET NOT NULL;

-- Part 3: Hikes - Remove dog_friendly column
ALTER TABLE hikes
DROP COLUMN IF EXISTS dog_friendly;
