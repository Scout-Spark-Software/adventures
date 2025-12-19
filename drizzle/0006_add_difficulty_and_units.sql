-- Create new enums for difficulty and unit types
CREATE TYPE "difficulty" AS ENUM ('easy', 'moderate', 'hard', 'very_hard');
CREATE TYPE "distance_unit" AS ENUM ('miles', 'kilometers');
CREATE TYPE "duration_unit" AS ENUM ('minutes', 'hours');
CREATE TYPE "elevation_unit" AS ENUM ('feet', 'meters');

-- Alter hikes table to add new columns and change existing ones
-- First, add the new unit columns with defaults
ALTER TABLE "hikes" ADD COLUMN "distance_unit" "distance_unit" DEFAULT 'miles';
ALTER TABLE "hikes" ADD COLUMN "duration_unit" "duration_unit" DEFAULT 'hours';
ALTER TABLE "hikes" ADD COLUMN "elevation_unit" "elevation_unit" DEFAULT 'feet';

-- Create temporary columns for numeric values
ALTER TABLE "hikes" ADD COLUMN "distance_new" numeric;
ALTER TABLE "hikes" ADD COLUMN "duration_new" numeric;
ALTER TABLE "hikes" ADD COLUMN "elevation_new" numeric;
ALTER TABLE "hikes" ADD COLUMN "difficulty_new" "difficulty";

-- Copy converted data (attempt to parse text values to numeric where possible)
-- This is a best-effort migration - invalid values will be set to NULL
UPDATE "hikes" SET "distance_new" =
  CASE
    WHEN "distance" ~ '^[0-9]+\.?[0-9]*$' THEN "distance"::numeric
    ELSE NULL
  END;

UPDATE "hikes" SET "duration_new" =
  CASE
    WHEN "duration" ~ '^[0-9]+\.?[0-9]*$' THEN "duration"::numeric
    ELSE NULL
  END;

UPDATE "hikes" SET "elevation_new" =
  CASE
    WHEN "elevation" ~ '^[0-9]+\.?[0-9]*$' THEN "elevation"::numeric
    ELSE NULL
  END;

-- Convert difficulty text to enum (map common values)
UPDATE "hikes" SET "difficulty_new" =
  CASE
    WHEN LOWER("difficulty") IN ('easy', 'beginner') THEN 'easy'::difficulty
    WHEN LOWER("difficulty") IN ('moderate', 'intermediate', 'medium') THEN 'moderate'::difficulty
    WHEN LOWER("difficulty") IN ('hard', 'difficult', 'challenging') THEN 'hard'::difficulty
    WHEN LOWER("difficulty") IN ('very hard', 'very_hard', 'expert', 'extreme') THEN 'very_hard'::difficulty
    ELSE NULL
  END;

-- Drop old columns
ALTER TABLE "hikes" DROP COLUMN "distance";
ALTER TABLE "hikes" DROP COLUMN "duration";
ALTER TABLE "hikes" DROP COLUMN "elevation";
ALTER TABLE "hikes" DROP COLUMN "difficulty";

-- Rename new columns to original names
ALTER TABLE "hikes" RENAME COLUMN "distance_new" TO "distance";
ALTER TABLE "hikes" RENAME COLUMN "duration_new" TO "duration";
ALTER TABLE "hikes" RENAME COLUMN "elevation_new" TO "elevation";
ALTER TABLE "hikes" RENAME COLUMN "difficulty_new" TO "difficulty";
