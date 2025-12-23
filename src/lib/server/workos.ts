import { WorkOS } from "@workos-inc/node";
import {
  WORKOS_API_KEY,
  WORKOS_CLIENT_ID,
  WORKOS_ORGANIZATION_ID,
  WORKOS_COOKIE_PASSWORD,
} from "$env/static/private";

if (
  !WORKOS_API_KEY ||
  !WORKOS_CLIENT_ID ||
  !WORKOS_ORGANIZATION_ID ||
  !WORKOS_COOKIE_PASSWORD
) {
  throw new Error(
    "WorkOS environment variables are not set. " +
      "Please ensure WORKOS_API_KEY, WORKOS_CLIENT_ID, WORKOS_ORGANIZATION_ID, and WORKOS_COOKIE_PASSWORD are in your .env file.",
  );
}

// Initialize WorkOS client
export const workos = new WorkOS(WORKOS_API_KEY);

// Export config for easy access
export const workosConfig = {
  clientId: WORKOS_CLIENT_ID,
  organizationId: WORKOS_ORGANIZATION_ID,
  cookiePassword: WORKOS_COOKIE_PASSWORD,
};

// WorkOS User Management authentication methods
export const workosAuth = {
  // Sign up new user in the organization
  async signUp(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) {
    try {
      // Create user with email already verified (bypass verification flow)
      const user = await workos.userManagement.createUser({
        email,
        password,
        firstName,
        lastName,
        emailVerified: true, // Auto-verify email to bypass verification code
      });

      // Add user to the organization as a member
      await workos.userManagement.createOrganizationMembership({
        userId: user.id,
        organizationId: workosConfig.organizationId,
      });

      return user;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create user",
      );
    }
  },

  // Sign in existing user
  async signIn(email: string, password: string) {
    try {
      const authResponse = await workos.userManagement.authenticateWithPassword(
        {
          clientId: workosConfig.clientId,
          email,
          password,
        },
      );

      return {
        user: authResponse.user,
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Authentication failed",
      );
    }
  },

  // Verify session with access token
  async verifySession(accessToken: string) {
    try {
      // Get user by access token
      const user = await workos.userManagement.getUser(accessToken);
      return user;
    } catch (error) {
      console.error("Session verification failed:", error);
      return null;
    }
  },

  // Refresh session
  async refreshSession(refreshToken: string) {
    try {
      const authResponse =
        await workos.userManagement.authenticateWithRefreshToken({
          clientId: workosConfig.clientId,
          refreshToken,
        });

      return {
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
      };
    } catch (error) {
      throw new Error("Failed to refresh session");
    }
  },

  // Update password
  async updatePassword(userId: string, newPassword: string) {
    try {
      await workos.userManagement.updateUser({
        userId,
        password: newPassword,
      });
      return true;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update password",
      );
    }
  },

  // Get user by ID
  async getUser(userId: string) {
    try {
      const user = await workos.userManagement.getUser(userId);
      return user;
    } catch (error) {
      throw new Error("Failed to get user");
    }
  },

  // Sign out (invalidate session)
  async signOut(sessionId?: string) {
    if (sessionId) {
      try {
        await workos.userManagement.revokeSession({ sessionId });
      } catch (error) {
        console.error("Failed to revoke session:", error);
      }
    }
    // Session cleanup happens via cookie deletion
    return true;
  },
};
