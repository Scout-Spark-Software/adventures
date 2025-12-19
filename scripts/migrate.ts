import { neon } from "@neondatabase/serverless";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(databaseUrl);

/**
 * Run a single migration file
 */
async function runMigration(filename: string): Promise<void> {
  console.log(`Running migration: ${filename}`);
  const migrationPath = join(__dirname, "..", "drizzle", filename);
  const migrationSQL = readFileSync(migrationPath, "utf-8");

  try {
    // Use unsafe to execute raw SQL without parameterization
    // This is necessary for DDL statements with DO blocks and complex SQL
    await (sql as any).unsafe(migrationSQL);
    console.log(`✓ Successfully ran ${filename}`);
  } catch (error) {
    console.error(`✗ Error running ${filename}:`, error);
    throw error;
  }
}

/**
 * Run all migrations in order
 */
async function runAllMigrations(): Promise<void> {
  const drizzlePath = join(__dirname, "..", "drizzle");
  const files = readdirSync(drizzlePath)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`Found ${files.length} migration files\n`);

  for (const file of files) {
    await runMigration(file);
  }
}

/**
 * Run a specific migration by number (e.g., 7 for 0007_*.sql)
 */
async function runSpecificMigration(num: number): Promise<void> {
  const paddedNum = num.toString().padStart(4, "0");
  const drizzlePath = join(__dirname, "..", "drizzle");
  const files = readdirSync(drizzlePath)
    .filter((f) => f.startsWith(paddedNum) && f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.error(`No migration found for number: ${num}`);
    process.exit(1);
  }

  if (files.length > 1) {
    console.error(`Multiple migrations found for number: ${num}`);
    console.error(files.join("\n"));
    process.exit(1);
  }

  await runMigration(files[0]);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage:");
    console.log("  npm run migrate         - Run all migrations");
    console.log("  npm run migrate 7       - Run migration 0007");
    console.log("  npm run migrate all     - Run all migrations\n");
    process.exit(0);
  }

  const command = args[0];

  try {
    if (command === "all") {
      await runAllMigrations();
    } else if (!isNaN(parseInt(command))) {
      await runSpecificMigration(parseInt(command));
    } else {
      console.error(`Invalid command: ${command}`);
      process.exit(1);
    }

    console.log("\n✓ Migration completed successfully!");
  } catch (error) {
    console.error("\n✗ Migration failed");
    process.exit(1);
  }
}

main();
