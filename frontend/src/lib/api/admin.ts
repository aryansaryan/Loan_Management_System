import client from "./client";

/** Roles used for UI access control. */
export type Role = "CUSTOMER" | "ANALYST" | "ADMIN";

/** System metrics shown on the admin dashboard. */
export type AdminMetrics = {
  customers: number;
  analysts: number;
  admins: number;
  loans: number;
};

/** User model exposed to admin screens. */
export type AdminUser = {
  id: number;
  username: string;
  role: Role;
  active: boolean;
};

/** Loads aggregated metrics for the admin dashboard. */
export async function getAdminMetrics(): Promise<AdminMetrics> {
  const res = await client.get("/api/admin/metrics");
  return res.data;
}

/** Returns all users or filters by role when provided. */
export async function listAdminUsers(role?: Role): Promise<AdminUser[]> {
  const res = await client.get("/api/admin/users", {
    params: role ? { role } : {},
  });
  return res.data;
}

/** Updates a user's assigned role. */
export async function updateUserRole(
  id: number,
  role: Role
): Promise<AdminUser> {
  const res = await client.put(`/api/admin/users/${id}/role`, { role });
  return res.data;
}

/** Toggles a user's active status. */
export async function updateUserActive(
  id: number,
  active: boolean
): Promise<AdminUser> {
  const res = await client.put(`/api/admin/users/${id}/active`, { active });
  return res.data;
}
