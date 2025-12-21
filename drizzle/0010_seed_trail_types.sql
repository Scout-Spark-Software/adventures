-- Seed trail_types with common trail types
INSERT INTO "trail_types" ("name", "key", "description", "display_order", "active") VALUES
	('Loop', 'loop', 'Trail forms a complete loop, returning to start without backtracking', 1, true),
	('Out & Back', 'out-and-back', 'Trail goes to a destination and returns via the same path', 2, true),
	('Point to Point', 'point-to-point', 'Trail starts at one location and ends at another', 3, true),
	('Lollipop', 'lollipop', 'Combination of out-and-back with a loop at the end', 4, true),
	('Other', 'other', 'Trail type does not fit standard categories', 5, true)
ON CONFLICT (key) DO NOTHING;
