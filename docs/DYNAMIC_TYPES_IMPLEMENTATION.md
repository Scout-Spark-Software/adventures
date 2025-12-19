# Dynamic Types Implementation

This document describes the database-driven amenities, facilities, and features system implemented for the Scouts Adventures platform.

## Overview

Instead of hardcoding amenities, facilities, and hike features in the application code, these are now stored in the database and manageable through an admin UI. This provides flexibility to add, remove, or modify options without code deployments.

## Benefits

1. **Flexibility** - Admins can add/remove/edit options without code changes
2. **Scalability** - Easy to expand as needs grow
3. **Consistency** - Same options appear everywhere automatically
4. **Maintainability** - Single source of truth for all type definitions
5. **Future-Ready** - Can add translations, icons, categories later

## Database Schema

### Tables Created

#### `amenity_types`
Defines available amenities for camping sites (e.g., Water, Electricity, WiFi).

```sql
- id: uuid (primary key)
- name: text (unique) - Display name
- key: text (unique) - JSON key for storage (e.g., 'water', 'firePits')
- description: text - Optional description
- icon: text - Optional icon reference
- display_order: integer - Sort order for display
- active: boolean - Whether this option is available
- created_at: timestamp
- updated_at: timestamp
```

#### `facility_types`
Defines available facilities for camping sites (e.g., RV Sites, Boat Launch).

```sql
- id: uuid (primary key)
- name: text (unique) - Display name
- key: text (unique) - JSON key for storage (e.g., 'rvSites', 'boatLaunch')
- description: text - Optional description
- icon: text - Optional icon reference
- display_order: integer - Sort order for display
- active: boolean - Whether this option is available
- created_at: timestamp
- updated_at: timestamp
```

#### `feature_types`
Defines available features for hikes (e.g., Dog Friendly, Waterfall).

```sql
- id: uuid (primary key)
- name: text (unique) - Display name (also used as JSON array value)
- description: text - Optional description
- icon: text - Optional icon reference
- display_order: integer - Sort order for display
- active: boolean - Whether this option is available
- created_at: timestamp
- updated_at: timestamp
```

### Indexes

Performance indexes created on:
- `active` column for all three tables
- `display_order` column for all three tables

## API Endpoints

### Feature Types
- `GET /api/feature-types` - List all feature types
  - Query param: `?active=true` - Filter to active only
- `GET /api/feature-types/[id]` - Get single feature type
- `POST /api/feature-types` - Create new feature type (admin only)
- `PUT /api/feature-types/[id]` - Update feature type (admin only)
- `DELETE /api/feature-types/[id]` - Delete feature type (admin only)

### Amenity Types
- `GET /api/amenity-types` - List all amenity types
  - Query param: `?active=true` - Filter to active only
- `GET /api/amenity-types/[id]` - Get single amenity type
- `POST /api/amenity-types` - Create new amenity type (admin only)
- `PUT /api/amenity-types/[id]` - Update amenity type (admin only)
- `DELETE /api/amenity-types/[id]` - Delete amenity type (admin only)

### Facility Types
- `GET /api/facility-types` - List all facility types
  - Query param: `?active=true` - Filter to active only
- `GET /api/facility-types/[id]` - Get single facility type
- `POST /api/facility-types` - Create new facility type (admin only)
- `PUT /api/facility-types/[id]` - Update facility type (admin only)
- `DELETE /api/facility-types/[id]` - Delete facility type (admin only)

## Admin UI

### Location
Navigate to `/admin/types` to manage all types.

### Features
- **Tabbed Interface** - Switch between Feature Types, Amenity Types, and Facility Types
- **List View** - See all types with their status, order, and descriptions
- **Create/Edit Form** - Side panel for creating or editing types
- **Inline Management** - Edit and delete options directly from the list
- **Display Order** - Control the order items appear in forms
- **Active/Inactive Toggle** - Hide options without deleting them

### Fields

For **Amenities and Facilities**:
- Name (required) - Display name shown to users
- Key (required) - camelCase identifier for JSON storage (e.g., 'firePits', 'rvSites')
- Description (optional) - Help text or additional details
- Display Order - Numeric sort order
- Active - Enable/disable this option

For **Features**:
- Name (required) - Display name (no key needed, uses name as array value)
- Description (optional) - Help text or additional details
- Display Order - Numeric sort order
- Active - Enable/disable this option

## How It Works

### Submit Forms
1. Forms load active types from database on page load
2. Options are dynamically rendered as checkboxes
3. Selected values are stored as JSON in the hikes/camping_sites tables
4. For amenities/facilities: JSON object with keys matching type keys
5. For features: JSON array of feature names

### Detail Pages
- Existing JSON data is displayed
- Works with both old hardcoded values and new database-driven values
- Features shown as badges
- Amenities/facilities shown with checkmark icons

### Backward Compatibility
The system is fully backward compatible:
- Existing entries with hardcoded values continue to work
- New entries use database-driven options
- Display logic handles both formats seamlessly

## Initial Seed Data

### Hike Features (10 items)
1. Dog Friendly
2. Kid Friendly
3. Wheelchair Accessible
4. Waterfall
5. Lake
6. River
7. Wildlife
8. Scenic Views
9. Historical Site
10. Camping Available

### Camping Amenities (8 items)
1. Water (key: 'water')
2. Electricity (key: 'electricity')
3. Restrooms (key: 'restrooms')
4. Showers (key: 'showers')
5. WiFi (key: 'wifi')
6. Fire Pits (key: 'firePits')
7. Picnic Tables (key: 'picnicTables')
8. Trash Disposal (key: 'trashDisposal')

### Camping Facilities (8 items)
1. RV Sites (key: 'rvSites')
2. Tent Sites (key: 'tentSites')
3. Cabins (key: 'cabins')
4. Playground (key: 'playground')
5. Boat Launch (key: 'boatLaunch')
6. Fishing (key: 'fishing')
7. Swimming (key: 'swimming')
8. Hiking Trails (key: 'hikingTrails')

## Migration Files

- `drizzle/0004_create_types_tables.sql` - Creates the three tables and indexes
- `drizzle/0005_seed_types_tables.sql` - Seeds initial data
- `scripts/run-migrations.ts` - Helper script to run SQL migrations

## Usage Examples

### Adding a New Amenity (Admin)
1. Navigate to `/admin/types`
2. Click "Amenities" tab
3. Click "Add New"
4. Fill in:
   - Name: "Pet Washing Station"
   - Key: "petWashing"
   - Description: "Facilities for washing pets"
   - Display Order: 9
   - Active: ✓
5. Click "Save"

The new amenity immediately appears in the submit form for all users.

### Disabling a Feature
1. Navigate to `/admin/types`
2. Click "Features" tab
3. Find the feature in the list
4. Click "Edit"
5. Uncheck "Active"
6. Click "Save"

The feature will no longer appear in the submit form, but existing hikes with this feature will still display it.

## Future Enhancements

Potential additions to this system:
- **Icons** - Custom SVG icons for each type
- **Categories** - Group related items together
- **Translations** - Multi-language support
- **Rich Descriptions** - Markdown or HTML descriptions
- **Usage Analytics** - Track which features are most popular
- **Conditional Logic** - Show/hide options based on other selections

## Technical Notes

### JSON Storage
- Amenities and facilities are stored as JSON objects: `{"water": true, "electricity": false}`
- Features are stored as JSON arrays: `["Dog Friendly", "Waterfall"]`
- This format maintains compatibility with existing data

### Performance Considerations
- Types are cached in page data (loaded once per form view)
- Only active types are loaded for public forms
- All types (including inactive) are shown in admin UI
- Database indexes optimize filtering by active status and ordering

### Security
- All write operations (POST, PUT, DELETE) require admin authentication
- Read operations are public for active types only
- Input sanitization applied to all fields
- SQL injection prevention through parameterized queries
