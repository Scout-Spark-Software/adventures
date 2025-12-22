CREATE TABLE IF NOT EXISTS "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"hike_id" uuid,
	"camping_site_id" uuid,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notes_hike_id_hikes_id_fk" FOREIGN KEY ("hike_id") REFERENCES "hikes"("id") ON DELETE CASCADE,
	CONSTRAINT "notes_camping_site_id_camping_sites_id_fk" FOREIGN KEY ("camping_site_id") REFERENCES "camping_sites"("id") ON DELETE CASCADE,
	CONSTRAINT "notes_entity_check" CHECK (
		("hike_id" IS NOT NULL AND "camping_site_id" IS NULL) OR
		("hike_id" IS NULL AND "camping_site_id" IS NOT NULL)
	)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS "notes_user_id_idx" ON "notes" ("user_id");
CREATE INDEX IF NOT EXISTS "notes_hike_id_idx" ON "notes" ("hike_id");
CREATE INDEX IF NOT EXISTS "notes_camping_site_id_idx" ON "notes" ("camping_site_id");
CREATE INDEX IF NOT EXISTS "notes_user_hike_idx" ON "notes" ("user_id", "hike_id");
CREATE INDEX IF NOT EXISTS "notes_user_camping_idx" ON "notes" ("user_id", "camping_site_id");
