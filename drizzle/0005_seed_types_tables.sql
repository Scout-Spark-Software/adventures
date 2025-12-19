-- Seed amenity_types with existing hardcoded values
INSERT INTO "amenity_types" ("name", "key", "description", "display_order", "active") VALUES
	('Water', 'water', 'Potable water available on site', 1, true),
	('Electricity', 'electricity', 'Electrical hookups available', 2, true),
	('Restrooms', 'restrooms', 'Bathroom facilities available', 3, true),
	('Showers', 'showers', 'Shower facilities available', 4, true),
	('WiFi', 'wifi', 'Wireless internet access', 5, true),
	('Fire Pits', 'firePits', 'Fire pits or rings for campfires', 6, true),
	('Picnic Tables', 'picnicTables', 'Picnic tables available', 7, true),
	('Trash Disposal', 'trashDisposal', 'Trash and recycling facilities', 8, true)
ON CONFLICT (key) DO NOTHING;

-- Seed facility_types with existing hardcoded values
INSERT INTO "facility_types" ("name", "key", "description", "display_order", "active") VALUES
	('RV Sites', 'rvSites', 'Sites suitable for RVs and motorhomes', 1, true),
	('Tent Sites', 'tentSites', 'Sites suitable for tent camping', 2, true),
	('Cabins', 'cabins', 'Cabin rentals available', 3, true),
	('Playground', 'playground', 'Playground equipment for children', 4, true),
	('Boat Launch', 'boatLaunch', 'Boat launch ramp available', 5, true),
	('Fishing', 'fishing', 'Fishing opportunities available', 6, true),
	('Swimming', 'swimming', 'Swimming area or beach', 7, true),
	('Hiking Trails', 'hikingTrails', 'Hiking trails on or near property', 8, true)
ON CONFLICT (key) DO NOTHING;

-- Seed feature_types with existing hardcoded values
INSERT INTO "feature_types" ("name", "description", "display_order", "active") VALUES
	('Dog Friendly', 'Dogs are welcome on this trail', 1, true),
	('Kid Friendly', 'Suitable for children', 2, true),
	('Wheelchair Accessible', 'Accessible for wheelchairs and mobility devices', 3, true),
	('Waterfall', 'Features one or more waterfalls', 4, true),
	('Lake', 'Trail includes or leads to a lake', 5, true),
	('River', 'Trail follows or crosses a river', 6, true),
	('Wildlife', 'Good wildlife viewing opportunities', 7, true),
	('Scenic Views', 'Panoramic or scenic viewpoints', 8, true),
	('Historical Site', 'Includes historical or cultural points of interest', 9, true),
	('Camping Available', 'Camping facilities available along trail', 10, true)
ON CONFLICT (name) DO NOTHING;
