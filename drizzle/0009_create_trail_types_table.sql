-- Create trail_types table
CREATE TABLE IF NOT EXISTS "trail_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"description" text,
	"icon" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trail_types_name_unique" UNIQUE("name"),
	CONSTRAINT "trail_types_key_unique" UNIQUE("key")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "trail_types_active_idx" ON "trail_types" ("active");
CREATE INDEX IF NOT EXISTS "trail_types_display_order_idx" ON "trail_types" ("display_order");
