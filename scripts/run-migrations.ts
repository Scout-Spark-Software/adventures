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
    // Split SQL into individual statements and execute each one
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      // Use tagged template syntax required by neon
      await sql`${sql.unsafe(statement)}`;
    }
    console.log(`✓ Successfully ran ${filename}`);
  } catch (error) {
    console.error(`✗ Error running ${filename}:`, error);
    throw error;
  }
}

async function main() {
  console.log("Running migrations...\n");

  try {
    await runMigration("0004_create_types_tables.sql");
    await runMigration("0005_seed_types_tables.sql");

    console.log("\n✓ All migrations completed successfully!");
  } catch (error) {
    console.error("\n✗ Migration failed");
    process.exit(1);
  }
}

main();
