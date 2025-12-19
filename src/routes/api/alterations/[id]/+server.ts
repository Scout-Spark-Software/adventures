import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/db";
import { alterations, hikes, campingSites } from "$lib/db/schemas";
import { eq } from "drizzle-orm";
import { requireModerator } from "$lib/auth/middleware";
import { updateModerationStatus } from "$lib/moderation";

export const GET: RequestHandler = async ({ params }) => {
  const alteration = await db.query.alterations.findFirst({
    where: eq(alterations.id, params.id),
  });

  if (!alteration) {
    throw error(404, "Alteration not found");
  }

  return json(alteration);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const user = await requireModerator({ locals } as any);

  const body = await request.json();
  const { status, apply } = body;

  if (!status || !["approved", "rejected"].includes(status)) {
    throw error(400, 'status must be "approved" or "rejected"');
  }

  const alteration = await db.query.alterations.findFirst({
    where: eq(alterations.id, params.id),
  });

  if (!alteration) {
    throw error(404, "Alteration not found");
  }

  // Update moderation status
  await updateModerationStatus("alteration", alteration.id, status, user.id);

  // Update alteration record
  const [updatedAlteration] = await db
    .update(alterations)
    .set({
      status,
      reviewedBy: user.id,
      reviewedAt: new Date(),
    })
    .where(eq(alterations.id, params.id))
    .returning();

  // If approved and apply is true, apply the alteration to the entity
  if (status === "approved" && apply) {
    if (alteration.hikeId) {
      await db
        .update(hikes)
        .set({
          [alteration.fieldName]: alteration.newValue,
          updatedAt: new Date(),
        })
        .where(eq(hikes.id, alteration.hikeId));
    } else if (alteration.campingSiteId) {
      await db
        .update(campingSites)
        .set({
          [alteration.fieldName]: alteration.newValue,
          updatedAt: new Date(),
        })
        .where(eq(campingSites.id, alteration.campingSiteId));
    }
  }

  return json(updatedAlteration);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const user = requireAuth({ locals } as any);

  const alteration = await db.query.alterations.findFirst({
    where: eq(alterations.id, params.id),
  });

  if (!alteration) {
    throw error(404, "Alteration not found");
  }

  // Only creator or admin can delete
  if (alteration.submittedBy !== user.id) {
    const { isAdmin } = await import("$lib/auth");
    const isUserAdmin = await isAdmin(user.id);
    if (!isUserAdmin) {
      throw error(403, "Not authorized to delete this alteration");
    }
  }

  await db.delete(alterations).where(eq(alterations.id, params.id));

  return json({ success: true });
};
