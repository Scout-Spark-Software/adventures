-- Create amenity_types table
CREATE TABLE IF NOT EXISTS "amenity_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"description" text,
	"icon" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "amenity_types_name_unique" UNIQUE("name"),
	CONSTRAINT "amenity_types_key_unique" UNIQUE("key")
);

-- Create facility_types table
CREATE TABLE IF NOT EXISTS "facility_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"description" text,
	"icon" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "facility_types_name_unique" UNIQUE("name"),
	CONSTRAINT "facility_types_key_unique" UNIQUE("key")
);

-- Create feature_types table
CREATE TABLE IF NOT EXISTS "feature_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_types_name_unique" UNIQUE("name")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "amenity_types_active_idx" ON "amenity_types" ("active");
CREATE INDEX IF NOT EXISTS "amenity_types_display_order_idx" ON "amenity_types" ("display_order");
CREATE INDEX IF NOT EXISTS "facility_types_active_idx" ON "facility_types" ("active");
CREATE INDEX IF NOT EXISTS "facility_types_display_order_idx" ON "facility_types" ("display_order");
CREATE INDEX IF NOT EXISTS "feature_types_active_idx" ON "feature_types" ("active");
CREATE INDEX IF NOT EXISTS "feature_types_display_order_idx" ON "feature_types" ("display_order");
