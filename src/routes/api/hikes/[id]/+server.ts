import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { hikes } from "$lib/db/schemas";
import { eq } from "drizzle-orm";
import { requireAuth } from "$lib/auth/middleware";

export const GET: RequestHandler = async ({ params, locals }) => {
  const hike = await db.query.hikes.findFirst({
    where: eq(hikes.id, params.id),
  });

  if (!hike) {
    throw error(404, "Hike not found");
  }

  // Only show approved hikes to non-authenticated users
  if (!locals.userId && hike.status !== "approved") {
    throw error(404, "Hike not found");
  }

  return json(hike);
};

export const PUT: RequestHandler = async (event) => {
  const user = requireAuth(event);

  const hike = await db.query.hikes.findFirst({
    where: eq(hikes.id, event.params.id),
  });

  if (!hike) {
    throw error(404, "Hike not found");
  }

  // Only creator or admin can edit
  if (hike.createdBy !== user.id && user.role !== "admin") {
    throw error(403, "Not authorized to edit this hike");
  }

  const body = await event.request.json();

  // Support partial updates - only update fields that are provided
  const updateData: any = {
    updatedAt: new Date(),
  };

  // Add provided fields to update
  const allowedFields = [
    "name",
    "description",
    "difficulty",
    "distance",
    "distanceUnit",
    "duration",
    "durationUnit",
    "elevation",
    "elevationUnit",
    "trailType",
    "features",
    "permitsRequired",
    "bestSeason",
    "waterSources",
    "parkingInfo",
    "dogFriendly",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  const [updatedHike] = await db
    .update(hikes)
    .set(updateData)
    .where(eq(hikes.id, event.params.id))
    .returning();

  return json(updatedHike);
};

export const DELETE: RequestHandler = async (event) => {
  const user = requireAuth(event);

  const hike = await db.query.hikes.findFirst({
    where: eq(hikes.id, event.params.id),
  });

  if (!hike) {
    throw error(404, "Hike not found");
  }

  // Only creator or admin can delete
  if (hike.createdBy !== user.id && user.role !== "admin") {
    throw error(403, "Not authorized to delete this hike");
  }

  await db.delete(hikes).where(eq(hikes.id, event.params.id));

  return json({ success: true });
};
