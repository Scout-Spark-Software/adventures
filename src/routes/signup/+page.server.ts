import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { workosAuth } from "$lib/server/workos";
import { setUserRole } from "$lib/auth";

export const actions: Actions = {
  signup: async ({ request, cookies }) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!name || !email || !password) {
      return fail(400, { error: "Name, email, and password are required" });
    }

    try {
      // Parse name into firstName and lastName
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || undefined;

      // Create user in WorkOS
      const user = await workosAuth.signUp(
        email,
        password,
        firstName,
        lastName,
      );

      // Authenticate to get tokens
      const { accessToken, refreshToken } = await workosAuth.signIn(
        email,
        password,
      );

      // Create default role in local database
      await setUserRole(user.id, "user");

      // Set cookie options
      const cookieOptions = {
        path: "/",
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
      };

      // Set the access token cookie (1 hour)
      cookies.set("workos_access_token", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60, // 1 hour
      });

      // Set the refresh token cookie (7 days)
      cookies.set("workos_refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Redirect to home or dashboard
      throw redirect(303, "/");
    } catch (error) {
      // SvelteKit redirects throw a special Redirect object with a status property
      // We need to re-throw it so SvelteKit can handle the redirect
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "location" in error
      ) {
        throw error;
      }
      return fail(500, {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  },
};
