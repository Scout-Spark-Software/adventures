import type { LayoutServerLoad } from "./$types";
import { isAdmin } from "$lib/auth";

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user;
  console.log("user:", user);

  if (!user) {
    return { user: null };
  }
  return {
    user: {
      ...user,
    },
  };
};
