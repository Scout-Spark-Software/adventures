import { fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { requireAuth } from "$lib/auth/middleware";
import { stackAuth } from "$lib/server/auth";

export const load: PageServerLoad = async (event) => {
  const user = requireAuth(event);
  return {
    user,
  };
};

export const actions: Actions = {
  changePassword: async ({ request, cookies }) => {
    const accessToken = cookies.get("stack_access_token");

    if (!accessToken) {
      return fail(401, { error: "Not authenticated" });
    }

    const formData = await request.formData();
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { error: "All fields are required" });
    }

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return fail(400, { error: "Invalid input" });
    }

    if (newPassword !== confirmPassword) {
      return fail(400, { error: "New passwords do not match" });
    }

    if (newPassword.length < 8) {
      return fail(400, {
        error: "Password must be at least 8 characters long",
      });
    }

    if (currentPassword === newPassword) {
      return fail(400, {
        error: "New password must be different from current password",
      });
    }

    try {
      await stackAuth.changePassword(accessToken, currentPassword, newPassword);
      return { success: true, message: "Password updated successfully" };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";
      return fail(400, { error: errorMessage });
    }
  },
};
