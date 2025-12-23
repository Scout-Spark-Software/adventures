import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { workosAuth } from "$lib/server/workos";

const authHandle: Handle = async ({ event, resolve }) => {
  // Get the access token from cookies
  const accessToken = event.cookies.get("workos_access_token");
  const refreshToken = event.cookies.get("workos_refresh_token");

  if (accessToken) {
    try {
      // Validate the session with WorkOS
      let user = await workosAuth.verifySession(accessToken);

      if (user) {
        // Set user info in locals for use throughout the app
        event.locals.user = {
          id: user.id,
          email: user.email,
          name: user.firstName
            ? `${user.firstName} ${user.lastName || ""}`.trim()
            : user.email,
        };
        event.locals.userId = user.id;
      } else {
        // Invalid or expired session
        event.locals.user = null;
        event.locals.userId = null;
      }
    } catch (error) {
      // Session validation failed
      console.error("Session validation error:", error);
      event.locals.user = null;
      event.locals.userId = null;
    }
  } else if (refreshToken) {
    // No access token but have refresh token - try to refresh
    try {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await workosAuth.refreshSession(refreshToken);

      // Set new cookies
      const cookieOptions = {
        path: "/",
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
      };

      event.cookies.set("workos_access_token", newAccessToken, {
        ...cookieOptions,
        maxAge: 60 * 60, // 1 hour
      });

      event.cookies.set("workos_refresh_token", newRefreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Verify new access token and set user
      const user = await workosAuth.verifySession(newAccessToken);
      if (user) {
        event.locals.user = {
          id: user.id,
          email: user.email,
          name: user.firstName
            ? `${user.firstName} ${user.lastName || ""}`.trim()
            : user.email,
        };
        event.locals.userId = user.id;
      } else {
        event.locals.user = null;
        event.locals.userId = null;
      }
    } catch (error) {
      // Refresh failed, clear cookies
      console.error("Session refresh error:", error);
      event.cookies.delete("workos_access_token", { path: "/" });
      event.cookies.delete("workos_refresh_token", { path: "/" });
      event.locals.user = null;
      event.locals.userId = null;
    }
  } else {
    // No session tokens
    event.locals.user = null;
    event.locals.userId = null;
  }

  return resolve(event);
};

export const handle: Handle = sequence(authHandle);
