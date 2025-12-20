import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { campingSites } from "$lib/db/schemas";
import { eq } from "drizzle-orm";
import { requireAuth } from "$lib/auth/middleware";

export const GET: RequestHandler = async ({ params, locals }) => {
  const campingSite = await db.query.campingSites.findFirst({
    where: eq(campingSites.id, params.id),
  });

  if (!campingSite) {
    throw error(404, "Camping site not found");
  }

  // Only show approved camping sites to non-authenticated users
  if (!locals.userId && campingSite.status !== "approved") {
    throw error(404, "Camping site not found");
  }

  return json(campingSite);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const user = requireAuth({ locals } as any);

  const campingSite = await db.query.campingSites.findFirst({
    where: eq(campingSites.id, params.id),
  });

  if (!campingSite) {
    throw error(404, "Camping site not found");
  }

  // Only creator or admin can edit
  if (campingSite.createdBy !== user.id) {
    const { isAdmin } = await import("$lib/auth");
    const isUserAdmin = await isAdmin(user.id);
    if (!isUserAdmin) {
      throw error(403, "Not authorized to edit this camping site");
    }
  }

  const body = await request.json();

  // Support partial updates - only update fields that are provided
  const updateData: any = {
    updatedAt: new Date(),
  };

  // Add provided fields to update
  const allowedFields = [
    "name",
    "description",
    "capacity",
    "amenities",
    "facilities",
    "reservationInfo",
    "costPerNight",
    "baseFee",
    "operatingSeasonStart",
    "operatingSeasonEnd",
    "petPolicy",
    "reservationRequired",
    "siteType",
    "firePolicy",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  const [updatedCampingSite] = await db
    .update(campingSites)
    .set(updateData)
    .where(eq(campingSites.id, params.id))
    .returning();

  return json(updatedCampingSite);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const user = requireAuth({ locals } as any);

  const campingSite = await db.query.campingSites.findFirst({
    where: eq(campingSites.id, params.id),
  });

  if (!campingSite) {
    throw error(404, "Camping site not found");
  }

  // Only creator or admin can delete
  if (campingSite.createdBy !== user.id) {
    const { isAdmin } = await import("$lib/auth");
    const isUserAdmin = await isAdmin(user.id);
    if (!isUserAdmin) {
      throw error(403, "Not authorized to delete this camping site");
    }
  }

  await db.delete(campingSites).where(eq(campingSites.id, params.id));

  return json({ success: true });
};
