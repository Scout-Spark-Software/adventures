import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/db";
import { hikes, addresses } from "$lib/db/schemas";
import { eq } from "drizzle-orm";
import { requireAuth } from "$lib/auth/middleware";
import { getUserRole } from "$lib/auth";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.userId) {
    throw redirect(302, `/hikes/${params.id}`);
  }

  const hike = await db.query.hikes.findFirst({
    where: eq(hikes.id, params.id),
  });

  if (!hike) {
    throw error(404, "Hike not found");
  }

  // Fetch address if addressId exists
  let address = null;
  if (hike.addressId) {
    address = await db.query.addresses.findFirst({
      where: eq(addresses.id, hike.addressId),
    });
  }

  const userRole = await getUserRole(locals.userId);

  return {
    hike,
    address,
    userRole,
  };
};

export const actions: Actions = {
  updateField: async ({ request, params, locals, fetch }) => {
    const user = requireAuth({ locals } as any);
    const formData = await request.formData();

    const fieldName = formData.get("fieldName") as string;
    const newValue = formData.get("newValue") as string;
    const reason = formData.get("reason") as string;

    const userRole = await getUserRole(user.id);
    const isAdmin = userRole === "admin";

    // Handle location updates
    if (fieldName === "location") {
      const addressData = formData.get("address") as string;
      const city = formData.get("city") as string;
      const state = formData.get("state") as string;
      const country = formData.get("country") as string;
      const postalCode = formData.get("postal_code") as string;
      const latitudeStr = formData.get("latitude") as string;
      const longitudeStr = formData.get("longitude") as string;

      if (!city || !state) {
        return { success: false, error: "City and state are required" };
      }

      const hike = await db.query.hikes.findFirst({
        where: eq(hikes.id, params.id),
      });

      if (!hike) {
        return { success: false, error: "Hike not found" };
      }

      if (isAdmin) {
        // Admin updates address directly
        let addressId = hike.addressId;

        if (addressId) {
          // Update existing address
          await db
            .update(addresses)
            .set({
              address: addressData,
              city,
              state,
              country,
              postalCode,
              latitude: latitudeStr ? parseFloat(latitudeStr) : null,
              longitude: longitudeStr ? parseFloat(longitudeStr) : null,
            })
            .where(eq(addresses.id, addressId));
        } else {
          // Create new address
          const [newAddress] = await db
            .insert(addresses)
            .values({
              address: addressData,
              city,
              state,
              country,
              postalCode,
              latitude: latitudeStr ? parseFloat(latitudeStr) : null,
              longitude: longitudeStr ? parseFloat(longitudeStr) : null,
            })
            .returning();

          // Link to hike
          await db
            .update(hikes)
            .set({ addressId: newAddress.id })
            .where(eq(hikes.id, params.id));
        }

        return { success: true, message: "Location updated successfully!" };
      } else {
        // Regular user submits alteration for location
        const locationData = JSON.stringify({
          address: addressData,
          city,
          state,
          country,
          postalCode,
          latitude: latitudeStr ? parseFloat(latitudeStr) : null,
          longitude: longitudeStr ? parseFloat(longitudeStr) : null,
        });

        const oldAddress = hike.addressId
          ? await db.query.addresses.findFirst({
              where: eq(addresses.id, hike.addressId),
            })
          : null;

        const response = await fetch("/api/alterations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hikeId: params.id,
            fieldName: "location",
            oldValue: oldAddress
              ? JSON.stringify({
                  address: oldAddress.address,
                  city: oldAddress.city,
                  state: oldAddress.state,
                  country: oldAddress.country,
                  postalCode: oldAddress.postalCode,
                  latitude: oldAddress.latitude,
                  longitude: oldAddress.longitude,
                })
              : "",
            newValue: locationData,
            reason,
          }),
        });

        if (!response.ok) {
          return { success: false, error: "Failed to submit alteration" };
        }

        return {
          success: true,
          message: "Location edit suggestion submitted for review!",
        };
      }
    }

    // Handle regular field updates
    if (!fieldName || !newValue) {
      return { success: false, error: "Field name and new value are required" };
    }

    if (isAdmin) {
      // Admin can edit directly
      const response = await fetch(`/api/hikes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [fieldName]: newValue,
        }),
      });

      if (!response.ok) {
        return { success: false, error: "Failed to update hike" };
      }

      return { success: true, message: "Hike updated successfully!" };
    } else {
      // Regular user submits alteration
      const hike = await db.query.hikes.findFirst({
        where: eq(hikes.id, params.id),
      });

      if (!hike) {
        return { success: false, error: "Hike not found" };
      }

      const response = await fetch("/api/alterations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hikeId: params.id,
          fieldName,
          oldValue: String((hike as any)[fieldName] || ""),
          newValue,
          reason,
        }),
      });

      if (!response.ok) {
        return { success: false, error: "Failed to submit alteration" };
      }

      return {
        success: true,
        message: "Edit suggestion submitted for review!",
      };
    }
  },
};
