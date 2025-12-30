-- Create favorites table
CREATE TABLE IF NOT EXISTS "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"hike_id" uuid,
	"camping_site_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_hike_id_fkey" FOREIGN KEY ("hike_id") REFERENCES "hikes"("id") ON DELETE CASCADE,
	CONSTRAINT "favorites_camping_site_id_fkey" FOREIGN KEY ("camping_site_id") REFERENCES "camping_sites"("id") ON DELETE CASCADE
);

-- Add unique constraint to prevent duplicate favorites
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_user_hike_unique" ON "favorites" ("user_id", "hike_id") WHERE "hike_id" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_user_camping_unique" ON "favorites" ("user_id", "camping_site_id") WHERE "camping_site_id" IS NOT NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "favorites_user_id_idx" ON "favorites" ("user_id");
CREATE INDEX IF NOT EXISTS "favorites_hike_id_idx" ON "favorites" ("hike_id");
CREATE INDEX IF NOT EXISTS "favorites_camping_site_id_idx" ON "favorites" ("camping_site_id");
