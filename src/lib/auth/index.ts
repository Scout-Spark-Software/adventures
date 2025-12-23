import { workos, workosConfig } from "../server/workos";

export type UserRole = "admin" | "moderator" | "user";

export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    // Get role from organization membership for the specific organization
    const memberships = await workos.userManagement.listOrganizationMemberships(
      {
        userId: userId,
        organizationId: workosConfig.organizationId,
      },
    );
    console.log("Memberships:", memberships?.data);
    if (memberships.data.length > 0) {
      const role = memberships.data[0].role?.slug || "user";
      return role as UserRole;
    }

    return "user";
  } catch (error) {
    console.error("Error getting user role from WorkOS:", error);
    return "user";
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  console.log("Is Admin: ", role);
  return role === "admin";
}

export async function isModerator(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === "admin" || role === "moderator";
}

export async function setUserRole(
  userId: string,
  role: UserRole,
): Promise<void> {
  // Note: Roles should be managed in WorkOS dashboard
  // This function is deprecated and kept for backwards compatibility
  console.warn(
    "setUserRole is deprecated. Please manage user roles in the WorkOS dashboard.",
  );
}
