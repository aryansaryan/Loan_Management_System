/** Role values used for UI access control. */
export type Role = "ADMIN" | "ANALYST" | "CUSTOMER";

/** Stores auth data in localStorage after login. */
export function setAuth(token: string, role: Role, username: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("username", username);
}

/** Clears all stored auth data on logout. */
export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
}

/** Returns the current auth state from storage. */
export function getAuth() {
  return {
    token: localStorage.getItem("token"),
    role: (localStorage.getItem("role") as Role) || null,
    username: localStorage.getItem("username"),
  };
}

/** True if a user token exists. */
export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

/** Returns the logged-in username. */
export function getUsername() {
  return localStorage.getItem("username");
}

/** Returns the logged-in user's role. */
export function getRole(): Role | null {
  return (localStorage.getItem("role") as Role) || null;
}
