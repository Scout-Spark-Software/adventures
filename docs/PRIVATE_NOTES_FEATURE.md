# Private Notes Feature Implementation Plan

## Overview
Add a private notes feature that allows users to write and save multiple notes about hikes and camping sites. Notes can be written in plain text or markdown with a preview mode. Notes will be displayed in a separate tab on detail pages and in a tabbed section on the profile page.

## Requirements Summary
- **Multiple notes per adventure**: Users can create multiple notes for each hike or camping site
- **Markdown support**: Plain text stored in DB, rendered as markdown on frontend with preview mode
- **Private**: Notes are only visible to the user who created them
- **UI placement**: 
  - Detail pages: Separate tab for notes
  - Profile page: Tabbed section showing all user notes across all adventures
- **Character limit**: 10,000 characters per note

## Database Layer

### 1. Create Notes Schema
**File**: `/src/lib/db/schemas/notes.ts`

Create new schema file following the existing pattern from favorites:

```typescript
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { hikes } from './hikes';
import { campingSites } from './camping-sites';

export const notes = pgTable('notes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  hikeId: uuid('hike_id').references(() => hikes.id, { onDelete: 'cascade' }),
  campingSiteId: uuid('camping_site_id').references(() => campingSites.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
```

**Key design decisions**:
- Similar to favorites table pattern (one of hikeId or campingSiteId must be set)
- CASCADE delete when hike/camping site is deleted
- updatedAt timestamp for tracking edits
- No FK constraint on userId (follows existing auth pattern)

### 2. Update Schema Index
**File**: `/src/lib/db/schemas/index.ts`

Add export:
```typescript
export * from "./notes";
```

### 3. Create Migration
**File**: `/drizzle/0011_create_notes_table.sql`

```sql
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
```

**Migration execution**: Run `npm run db:push` or use Drizzle migration commands

## API Layer

### 4. Create Notes Collection Endpoint
**File**: `/src/routes/api/notes/+server.ts`

```typescript
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { notes } from '$lib/db/schemas';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '$lib/auth/middleware';

// GET /api/notes?hike_id=xxx or ?camping_site_id=xxx or neither (all user notes)
export const GET: RequestHandler = async ({ locals, url }) => {
  const user = requireAuth({ locals } as any);
  
  const hikeId = url.searchParams.get('hike_id');
  const campingSiteId = url.searchParams.get('camping_site_id');
  
  const conditions = [eq(notes.userId, user.id)];
  
  if (hikeId) {
    conditions.push(eq(notes.hikeId, hikeId));
  }
  
  if (campingSiteId) {
    conditions.push(eq(notes.campingSiteId, campingSiteId));
  }
  
  const results = await db.query.notes.findMany({
    where: and(...conditions),
    orderBy: [desc(notes.updatedAt)]
  });
  
  return json(results);
};

// POST /api/notes - Create new note
export const POST: RequestHandler = async ({ request, locals }) => {
  const user = requireAuth({ locals } as any);
  
  const body = await request.json();
  const { hikeId, campingSiteId, content } = body;
  
  // Validation
  if (!hikeId && !campingSiteId) {
    throw error(400, 'Either hikeId or campingSiteId is required');
  }
  
  if (hikeId && campingSiteId) {
    throw error(400, 'Cannot create note for both hike and camping site');
  }
  
  if (!content || typeof content !== 'string') {
    throw error(400, 'Content is required');
  }
  
  const trimmedContent = content.trim();
  
  if (trimmedContent.length === 0) {
    throw error(400, 'Content cannot be empty');
  }
  
  if (trimmedContent.length > 10000) {
    throw error(400, 'Content cannot exceed 10,000 characters');
  }
  
  const [newNote] = await db
    .insert(notes)
    .values({
      userId: user.id,
      hikeId: hikeId || null,
      campingSiteId: campingSiteId || null,
      content: trimmedContent
    })
    .returning();
  
  return json(newNote, { status: 201 });
};
```

### 5. Create Individual Note Endpoint
**File**: `/src/routes/api/notes/[id]/+server.ts`

```typescript
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/db';
import { notes } from '$lib/db/schemas';
import { eq, and } from 'drizzle-orm';
import { requireAuth } from '$lib/auth/middleware';

// GET /api/notes/[id] - Get single note
export const GET: RequestHandler = async ({ params, locals }) => {
  const user = requireAuth({ locals } as any);
  
  const note = await db.query.notes.findFirst({
    where: and(
      eq(notes.id, params.id),
      eq(notes.userId, user.id)
    )
  });
  
  if (!note) {
    throw error(404, 'Note not found');
  }
  
  return json(note);
};

// PUT /api/notes/[id] - Update note
export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const user = requireAuth({ locals } as any);
  
  const body = await request.json();
  const { content } = body;
  
  if (!content || typeof content !== 'string') {
    throw error(400, 'Content is required');
  }
  
  const trimmedContent = content.trim();
  
  if (trimmedContent.length === 0) {
    throw error(400, 'Content cannot be empty');
  }
  
  if (trimmedContent.length > 10000) {
    throw error(400, 'Content cannot exceed 10,000 characters');
  }
  
  // Verify ownership
  const existingNote = await db.query.notes.findFirst({
    where: and(
      eq(notes.id, params.id),
      eq(notes.userId, user.id)
    )
  });
  
  if (!existingNote) {
    throw error(404, 'Note not found');
  }
  
  const [updatedNote] = await db
    .update(notes)
    .set({
      content: trimmedContent,
      updatedAt: new Date()
    })
    .where(eq(notes.id, params.id))
    .returning();
  
  return json(updatedNote);
};

// DELETE /api/notes/[id] - Delete note
export const DELETE: RequestHandler = async ({ params, locals }) => {
  const user = requireAuth({ locals } as any);
  
  // Verify ownership
  const existingNote = await db.query.notes.findFirst({
    where: and(
      eq(notes.id, params.id),
      eq(notes.userId, user.id)
    )
  });
  
  if (!existingNote) {
    throw error(404, 'Note not found');
  }
  
  await db.delete(notes).where(eq(notes.id, params.id));
  
  return json({ success: true });
};
```

## Frontend Components

### 6. Create Tab Component (Reusable)
**File**: `/src/lib/components/Tabs.svelte`

```svelte
<script lang="ts">
  export let tabs: { id: string; label: string; count?: number }[];
  export let activeTab: string;
  
  function selectTab(tabId: string) {
    activeTab = tabId;
  }
</script>

<div class="border-b border-gray-200">
  <nav class="-mb-px flex space-x-8" aria-label="Tabs">
    {#each tabs as tab}
      <button
        on:click={() => selectTab(tab.id)}
        class="
          {activeTab === tab.id
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
        "
        aria-current={activeTab === tab.id ? 'page' : undefined}
      >
        {tab.label}
        {#if tab.count !== undefined}
          <span
            class="
              {activeTab === tab.id
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-gray-100 text-gray-900'}
              ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
            "
          >
            {tab.count}
          </span>
        {/if}
      </button>
    {/each}
  </nav>
</div>

<div class="mt-6">
  <slot />
</div>
```

### 7. Create Notes Component
**File**: `/src/lib/components/NotesSection.svelte`

Component with full CRUD functionality, markdown preview, character counter, and error handling. See full implementation in the complete plan document.

Key features:
- Create new notes with write/preview toggle
- Edit existing notes inline
- Delete notes with confirmation
- Character counter (10,000 limit)
- Basic markdown rendering (headings, bold, italic)
- Loading and error states
- Timestamps showing created/updated dates

### 8. Update Hike Detail Page
**File**: `/src/routes/hikes/[id]/+page.svelte`

Add tabs for Details and Notes:

1. Import components:
```svelte
import Tabs from "$lib/components/Tabs.svelte";
import NotesSection from "$lib/components/NotesSection.svelte";
```

2. Add tab state:
```svelte
let activeTab = 'details';
$: tabs = [
  { id: 'details', label: 'Details' },
  { id: 'notes', label: 'Notes', count: data.notesCount }
];
```

3. Wrap main content in Tabs component and show NotesSection in notes tab

### 9. Update Camping Detail Page
**File**: `/src/routes/camping/[id]/+page.svelte`

Apply same tab pattern as hike detail page.

### 10. Update Profile Page
**File**: `/src/routes/profile/+page.svelte`

Add tabbed interface with Profile, Favorites, and Notes tabs:

```svelte
<script lang="ts">
  import Tabs from "$lib/components/Tabs.svelte";
  import NotesSection from "$lib/components/NotesSection.svelte";
  
  let activeTab = 'profile';
  $: tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'notes', label: 'Notes' }
  ];
</script>

<Tabs {tabs} bind:activeTab>
  {#if activeTab === 'profile'}
    <!-- Existing profile content -->
  {:else if activeTab === 'favorites'}
    <!-- TODO: Add favorites section -->
  {:else if activeTab === 'notes'}
    <NotesSection userId={data.user.id} />
  {/if}
</Tabs>
```

## Data Loading

### 11. Update Page Load Functions

**File**: `/src/routes/hikes/[id]/+page.server.ts`

Add notes count to page data:
```typescript
const notesCount = userId ? await db.query.notes.count({
  where: and(
    eq(notes.userId, userId),
    eq(notes.hikeId, params.id)
  )
}) : 0;

return { 
  hike, 
  address, 
  files, 
  userId, 
  userRole,
  notesCount 
};
```

**File**: `/src/routes/camping/[id]/+page.server.ts`

Same pattern as hikes.

## Implementation Checklist

### Phase 1: Database
- [ ] Create `/src/lib/db/schemas/notes.ts`
- [ ] Update `/src/lib/db/schemas/index.ts`
- [ ] Create migration `/drizzle/0011_create_notes_table.sql`
- [ ] Run migration: `npm run db:push`

### Phase 2: API
- [ ] Create `/src/routes/api/notes/+server.ts` (GET, POST)
- [ ] Create `/src/routes/api/notes/[id]/+server.ts` (GET, PUT, DELETE)
- [ ] Test API endpoints with curl/Postman

### Phase 3: Components
- [ ] Create `/src/lib/components/Tabs.svelte`
- [ ] Create `/src/lib/components/NotesSection.svelte`
- [ ] Test components in isolation

### Phase 4: Integration
- [ ] Update `/src/routes/hikes/[id]/+page.svelte` with tabs
- [ ] Update `/src/routes/hikes/[id]/+page.server.ts` with notes count
- [ ] Update `/src/routes/camping/[id]/+page.svelte` with tabs
- [ ] Update `/src/routes/camping/[id]/+page.server.ts` with notes count
- [ ] Update `/src/routes/profile/+page.svelte` with tabs

### Phase 5: Polish
- [ ] Add markdown library (optional: `npm install marked`)
- [ ] Improve markdown rendering in NotesSection
- [ ] Add loading states and error handling
- [ ] Test character limit validation
- [ ] Test edit/delete functionality
- [ ] Test responsive design on mobile

## Future Enhancements (Not in Scope)
- Rich markdown editor with toolbar
- Note attachments/images
- Note sharing functionality
- Note search across all user notes
- Note tags/categories
- Export notes to PDF/markdown file
- Note version history

## Critical Files Summary

**New Files**:
1. `/src/lib/db/schemas/notes.ts` - Database schema
2. `/drizzle/0011_create_notes_table.sql` - Migration
3. `/src/routes/api/notes/+server.ts` - Collection API
4. `/src/routes/api/notes/[id]/+server.ts` - Individual note API
5. `/src/lib/components/Tabs.svelte` - Tab component
6. `/src/lib/components/NotesSection.svelte` - Notes UI

**Modified Files**:
1. `/src/lib/db/schemas/index.ts` - Export notes schema
2. `/src/routes/hikes/[id]/+page.svelte` - Add tabs
3. `/src/routes/hikes/[id]/+page.server.ts` - Load notes count
4. `/src/routes/camping/[id]/+page.svelte` - Add tabs
5. `/src/routes/camping/[id]/+page.server.ts` - Load notes count
6. `/src/routes/profile/+page.svelte` - Add tabbed interface
