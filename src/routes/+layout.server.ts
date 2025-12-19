import type { LayoutServerLoad } from "./$types";
import { isAdmin } from "$lib/auth";

export const load: LayoutServerLoad = async ({ locals }) => {
  const user = locals.user;

  if (!user) {
    return { user: null };
  }

  const userIsAdmin = await isAdmin(user.id);

  return {
    user: {
      ...user,
      isAdmin: userIsAdmin,
    },
  };
};
