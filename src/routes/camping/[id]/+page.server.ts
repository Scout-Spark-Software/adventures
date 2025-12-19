import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/db";
import { addresses } from "$lib/db/schemas";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
  const campingSite = await fetch(`/api/camping-sites/${params.id}`).then(
    (r) => {
      if (!r.ok) throw error(r.status, "Camping site not found");
      return r.json();
    },
  );

  const files = await fetch(
    `/api/files?entity_type=camping_site&entity_id=${params.id}`,
  ).then((r) => r.json());

  // Fetch address if addressId exists
  let address = null;
  if (campingSite.addressId) {
    address = await db.query.addresses.findFirst({
      where: eq(addresses.id, campingSite.addressId),
    });
  }

  return {
    campingSite,
    address,
    files: files || [],
    userId: locals.userId || null,
  };
};
