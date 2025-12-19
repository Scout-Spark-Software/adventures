import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function fixSchema() {
  console.log("Fixing hikes table schema...\n");

  try {
    // Step 1: Add unit columns if they don't exist
    console.log("1. Adding unit columns...");
    await sql`ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "distance_unit" "distance_unit" DEFAULT 'miles'`;
    await sql`ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "duration_unit" "duration_unit" DEFAULT 'hours'`;
    await sql`ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "elevation_unit" "elevation_unit" DEFAULT 'feet'`;
    console.log("   ✓ Unit columns added\n");

    // Step 2: Add temporary numeric columns
    console.log("2. Adding temporary numeric columns...");
    await sql`ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "distance_new" numeric`;
    await sql`ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "duration_new" numeric`;
    await sql`ALTER TABLE "hikes" ADD COLUMN IF NOT EXISTS "elevation_new" numeric`;
    console.log("   ✓ Temporary columns added\n");

    // Step 3: Copy and convert data
    console.log("3. Converting text values to numeric...");
    await sql`
      UPDATE "hikes" SET "distance_new" =
        CASE
          WHEN "distance" ~ '^[0-9]+\\.?[0-9]*$' THEN "distance"::numeric
          ELSE NULL
        END
      WHERE "distance_new" IS NULL;
    `;
    await sql`
      UPDATE "hikes" SET "duration_new" =
        CASE
          WHEN "duration" ~ '^[0-9]+\\.?[0-9]*$' THEN "duration"::numeric
          ELSE NULL
        END
      WHERE "duration_new" IS NULL;
    `;
    await sql`
      UPDATE "hikes" SET "elevation_new" =
        CASE
          WHEN "elevation" ~ '^[0-9]+\\.?[0-9]*$' THEN "elevation"::numeric
          ELSE NULL
        END
      WHERE "elevation_new" IS NULL;
    `;
    console.log("   ✓ Data converted\n");

    // Step 4: Drop old text columns
    console.log("4. Dropping old text columns...");
    await sql`ALTER TABLE "hikes" DROP COLUMN IF EXISTS "distance"`;
    await sql`ALTER TABLE "hikes" DROP COLUMN IF EXISTS "duration"`;
    await sql`ALTER TABLE "hikes" DROP COLUMN IF EXISTS "elevation"`;
    console.log("   ✓ Old columns dropped\n");

    // Step 5: Rename new columns
    console.log("5. Renaming new columns...");
    await sql`ALTER TABLE "hikes" RENAME COLUMN "distance_new" TO "distance"`;
    await sql`ALTER TABLE "hikes" RENAME COLUMN "duration_new" TO "duration"`;
    await sql`ALTER TABLE "hikes" RENAME COLUMN "elevation_new" TO "elevation"`;
    console.log("   ✓ Columns renamed\n");

    console.log("✓ Schema fix completed successfully!");
  } catch (error: any) {
    console.error("✗ Schema fix failed:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
}

fixSchema();
