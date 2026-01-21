import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Guards a route by role. If role doesn't match, send user to their dashboard.
export default function RoleRoute({
  allow,
  children,
}: {
  allow: string[]; // Roles allowed for this page
  children: JSX.Element; // Protected component
}) {
  const { pathname } = useLocation();

  // Get role from storage and normalize it
  const role = (localStorage.getItem("role") || "").replace(/^ROLE_/, "").toUpperCase();

  // Not logged in
  if (!role) return <Navigate to="/login" replace />;

  // Resolve dashboard route for this role
  const dashboard = role === "ADMIN" ? "/admin" : role === "ANALYST" ? "/analyst" : "/customer";

  // Role blocked: kick to dashboard (but avoid redirect loops)
  if (!allow.includes(role)) return pathname === dashboard ? children : <Navigate to={dashboard} replace />;

  // Allowed: render page
  return children;
}
