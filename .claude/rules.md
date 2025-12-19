# Claude Rules for Adventures Project

## Database Migrations

### Migration File Format

All migration files must follow this format:

1. **Location**: `drizzle/NNNN_description.sql`
2. **Naming**: Four-digit number prefix (0000, 0001, etc.) followed by descriptive name
3. **CREATE TYPE statements**: Must use DO blocks to avoid errors on re-runs

```sql
-- CORRECT: Use DO blocks for enums
DO $$ BEGIN
 CREATE TYPE "my_enum" AS ENUM ('value1', 'value2');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- WRONG: Direct CREATE TYPE (fails if already exists)
CREATE TYPE "my_enum" AS ENUM ('value1', 'value2');
```

4. **ALTER TABLE statements**: Must use IF NOT EXISTS where possible

```sql
-- CORRECT: Safe column additions
ALTER TABLE "tablename" ADD COLUMN IF NOT EXISTS "column_name" text;

-- WRONG: Direct ADD COLUMN (fails if column exists)
ALTER TABLE "tablename" ADD COLUMN "column_name" text;
```

### Running Migrations

**ALWAYS use the migration script, not individual migration runners:**

```bash
# Run a specific migration by number
npx tsx scripts/migrate.ts 7

# Run all migrations
npx tsx scripts/migrate.ts all
```

### Migration Script

The project uses `scripts/migrate.ts` which:

- Uses `sql.unsafe()` to execute raw SQL (required for DO blocks)
- Handles multiple statements in one file
- Provides clear error messages
- Can run individual or all migrations

### DO NOT:

- Create individual `run-NNN-migration.ts` files
- Split SQL into individual statements by semicolon
- Use `sql()` or `sql.transaction()` for migrations
- Forget to use DO blocks for CREATE TYPE
- Forget to use IF NOT EXISTS for ALTER TABLE

### Schema Sync

After running migrations, ALWAYS update the corresponding Drizzle schema file:

- `src/lib/db/schemas/hikes.ts`
- `src/lib/db/schemas/camping-sites.ts`
- etc.

The schema file must match the database structure exactly, including:

- All columns (with correct snake_case to camelCase mapping)
- Default values
- Constraints
- Types and enums

### When Creating New Migrations:

1. Create the migration file in `drizzle/` with proper format
2. Use DO blocks for all CREATE TYPE statements
3. Use IF NOT EXISTS for all ALTER TABLE ADD COLUMN statements
4. Test the migration: `npm run migrate <number>`
5. Update the corresponding schema file in `src/lib/db/schemas/`
6. Verify the schema matches database: `npx tsx scripts/check-columns.ts`
7. Test inserts work: `npx tsx scripts/test-insert2.ts`
8. Verify the API endpoints still work

### Troubleshooting Failed Migrations:

If a migration fails partway through:

1. Check actual database columns: `npx tsx scripts/check-columns.ts`
2. Compare with the schema file to identify mismatches
3. Create a fix script in `scripts/` to manually repair the database
4. Update the migration file to be idempotent (IF NOT EXISTS, DO blocks)
5. Never modify data directly - always use scripts for reproducibility

## General Project Rules

### Code Style

- Use TypeScript strict mode
- Prefer explicit types over inference where it improves clarity
- Use camelCase for TypeScript/JavaScript variables
- Use snake_case for database column names

### Error Handling

- Always provide meaningful error messages
- Use proper HTTP status codes
- Log errors with context
