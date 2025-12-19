import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function runMigration(filename: string) {
  console.log(`Running migration: ${filename}`);
  const migrationPath = join(__dirname, "..", "drizzle", filename);
  const migrationSQL = readFileSync(migrationPath, "utf-8");

  try {
    // Execute raw SQL without parameterization
    const result = await (sql as any).unsafe(migrationSQL);
    console.log(`✓ Successfully ran ${filename}`);
  } catch (error) {
    console.error(`✗ Error running ${filename}:`, error);
    throw error;
  }
}

async function main() {
  console.log("Running migration 0007...\n");

  try {
    await runMigration("0007_enhance_submission_fields.sql");

    console.log("\n✓ Migration completed successfully!");
  } catch (error) {
    console.error("\n✗ Migration failed");
    process.exit(1);
  }
}

main();
