import React from "react";
import { Navigate } from "react-router-dom";

// Sends the user to the right dashboard based on saved role.
// Used after login or when hitting a generic dashboard route.
export default function RoleDashboardRedirect() {
  // Pull role directly from storage (saved during auth)
  const roleRaw = localStorage.getItem("role") || "";

  // Normalize: strip ROLE_ prefix and force uppercase
  const role = roleRaw.replace(/^ROLE_/, "").toUpperCase();

  // Route based on resolved role
  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "ANALYST") return <Navigate to="/analyst" replace />;

  // Default → customer dashboard
  return <Navigate to="/customer" replace />;
}
