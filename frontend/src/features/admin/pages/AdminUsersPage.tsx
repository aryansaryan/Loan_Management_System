// src/pages/AdminUsersPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Chip,
  Divider,
  Skeleton,
  LinearProgress,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import AppHeader from "../../../components/AppHeader";
import {
  AdminUser,
  listAdminUsers,
  updateUserActive,
  updateUserRole,
  Role,
} from "../../../lib/api/admin";

import bg from "../../../assets/homepage.png";

function rolePretty(role: Role) {
  if (role === "CUSTOMER") return "Customer";
  if (role === "ANALYST") return "Analyst";
  return "Admin";
}

function roleChipStyle(role: Role) {
  if (role === "CUSTOMER")
    return { bg: "rgba(37,99,235,0.10)", bd: "rgba(37,99,235,0.22)", fg: "rgba(15,23,42,0.85)" };
  if (role === "ANALYST")
    return { bg: "rgba(16,185,129,0.10)", bd: "rgba(16,185,129,0.22)", fg: "rgba(15,23,42,0.85)" };
  return { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.22)", fg: "rgba(15,23,42,0.85)" };
}

function StatusPill({ active }: { active: boolean }) {
  const sx = active
    ? { bg: "rgba(16,185,129,0.12)", bd: "rgba(16,185,129,0.24)", fg: "rgba(15,23,42,0.86)" }
    : { bg: "rgba(148,163,184,0.14)", bd: "rgba(148,163,184,0.30)", fg: "rgba(15,23,42,0.72)" };

  return (
    <Chip
      size="small"
      label={active ? "Active" : "Inactive"}
      variant="outlined"
      sx={{
        fontWeight: 900,
        borderWidth: 1,
        background: sx.bg,
        borderColor: sx.bd,
        color: sx.fg,
      }}
    />
  );
}

/**
 * Admin users management page (redesigned UI)
 * - Same functionality:
 *   - role filter via ?role=
 *   - update role
 *   - activate/deactivate
 */
export default function AdminUsersPage() {
  const [params] = useSearchParams();
  const roleParam = (params.get("role") as Role | null) || null;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const title = useMemo(() => {
    if (roleParam === "CUSTOMER") return "Customers";
    if (roleParam === "ANALYST") return "Analysts";
    if (roleParam === "ADMIN") return "Admins";
    return "All users";
  }, [roleParam]);

  const counts = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.active).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [users]);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listAdminUsers(roleParam || undefined);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleParam]);

  const changeRole = async (id: number, role: Role) => {
    await updateUserRole(id, role);
    await refresh();
  };

  const toggleActive = async (id: number, active: boolean) => {
    await updateUserActive(id, active);
    await refresh();
  };

  const loadingSkeletons = Array.from({ length: 6 }).map((_, i) => i);

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden", bgcolor: "#EEF2F7" }}>
      {/* Background image like your newer pages */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "brightness(1.03) contrast(1.04) saturate(1.02)",
          transform: "translateZ(0)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.34) 45%, rgba(255,255,255,0) 100%)," +
            "linear-gradient(90deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.24) 40%, rgba(255,255,255,0.14) 75%, rgba(255,255,255,0.00) 100%)," +
            "radial-gradient(1100px 520px at 20% 110%, rgba(40, 69, 120, 0.12), rgba(0, 0, 0, 0) 60%)",
        }}
      />

      <AppHeader showLogout pageTitle={`ADMIN • ${title.toUpperCase()}`} />

      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2.2, sm: 3.5 },
          pt: { xs: 5.5, md: 7 },
          pb: { xs: 6, md: 7 },
        }}
      >
        <Box sx={{ mx: "auto", maxWidth: 1280 }}>
          {/* Top header card (new style) */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3.2,
              p: { xs: 2.2, sm: 2.6 },
              background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,247,252,0.85))",
              border: "1px solid rgba(15,25,40,0.10)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.10)",
              mb: 2.2,
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography sx={{ fontWeight: 950, fontSize: 20, color: "rgba(20,35,55,0.92)" }}>
                  {title}
                </Typography>
                <Typography sx={{ mt: 0.4, color: "rgba(20,35,55,0.70)" }}>
                  Update user roles and toggle access. Inactive users can’t log in.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={loading ? "Loading..." : `${counts.total} total`}
                  sx={{
                    fontWeight: 900,
                    bgcolor: "rgba(255,255,255,0.70)",
                    border: "1px solid rgba(15,25,40,0.10)",
                    color: "rgba(15,23,42,0.85)",
                  }}
                />
                <Chip
                  label={loading ? "-" : `${counts.active} active`}
                  sx={{
                    fontWeight: 900,
                    bgcolor: "rgba(16,185,129,0.10)",
                    border: "1px solid rgba(16,185,129,0.20)",
                    color: "rgba(15,23,42,0.85)",
                  }}
                />
                <Chip
                  label={loading ? "-" : `${counts.inactive} inactive`}
                  sx={{
                    fontWeight: 900,
                    bgcolor: "rgba(148,163,184,0.14)",
                    border: "1px solid rgba(148,163,184,0.25)",
                    color: "rgba(15,23,42,0.75)",
                  }}
                />
              </Stack>
            </Stack>

            {/* small loading line for “live” feel */}
            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: "rgba(15,25,40,0.08)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      backgroundColor: "#2563EB",
                    },
                  }}
                />
              </Box>
            )}
          </Paper>

          {/* Users list container */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3.2,
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,255,0.92))",
              border: "1px solid rgba(255,255,255,0.65)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.14)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: { xs: 2.2, sm: 2.8 },
                py: 2,
                borderBottom: "1px solid rgba(15,25,40,0.08)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.40))",
              }}
            >
              <Typography sx={{ fontWeight: 950, fontSize: 16, color: "#0F172A" }}>
                User directory
              </Typography>
              <Typography sx={{ mt: 0.3, color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
                Changes are saved instantly.
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 2.2, sm: 2.8 } }}>
              <Stack spacing={1.4}>
                {loading ? (
                  loadingSkeletons.map((i) => (
                    <Paper
                      key={i}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid rgba(15,23,42,0.08)",
                        background: "rgba(255,255,255,0.72)",
                      }}
                    >
                      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="45%" height={30} />
                          <Skeleton variant="text" width="30%" height={22} />
                        </Box>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Skeleton variant="rounded" width={180} height={40} />
                          <Skeleton variant="rounded" width={120} height={40} />
                        </Stack>
                      </Stack>
                    </Paper>
                  ))
                ) : users.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.2,
                      borderRadius: 3,
                      border: "1px dashed rgba(15,23,42,0.18)",
                      background: "rgba(15,23,42,0.03)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                      No users found
                    </Typography>
                    <Typography sx={{ mt: 0.35, color: "rgba(15,23,42,0.62)" }}>
                      Try a different filter from the dashboard.
                    </Typography>
                  </Paper>
                ) : (
                  users.map((u) => {
                    const roleSx = roleChipStyle(u.role);
                    return (
                      <Paper
                        key={u.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: "1px solid rgba(15,23,42,0.10)",
                          background: "rgba(255,255,255,0.78)",
                          boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          spacing={2}
                          alignItems={{ xs: "flex-start", md: "center" }}
                          justifyContent="space-between"
                        >
                          {/* left */}
                          <Box sx={{ minWidth: 260 }}>
                            <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.90)" }}>
                              {u.username}
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.8 }}>
                              <Chip
                                size="small"
                                label={rolePretty(u.role)}
                                variant="outlined"
                                sx={{
                                  fontWeight: 900,
                                  borderWidth: 1,
                                  background: roleSx.bg,
                                  borderColor: roleSx.bd,
                                  color: roleSx.fg,
                                }}
                              />
                              <StatusPill active={u.active} />
                              <Chip
                                size="small"
                                label={`ID: ${u.id}`}
                                sx={{
                                  fontWeight: 900,
                                  bgcolor: "rgba(255,255,255,0.70)",
                                  border: "1px solid rgba(15,25,40,0.10)",
                                  color: "rgba(15,23,42,0.75)",
                                }}
                              />
                            </Stack>
                          </Box>

                          {/* right controls */}
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                              <InputLabel>Role</InputLabel>
                              <Select
                                value={u.role}
                                label="Role"
                                onChange={(e) => changeRole(u.id, e.target.value as Role)}
                                sx={{
                                  borderRadius: 2.4,
                                  backgroundColor: "rgba(241,245,249,0.9)",
                                }}
                              >
                                <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                                <MenuItem value="ANALYST">ANALYST</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                              </Select>
                            </FormControl>

                            <Paper
                              elevation={0}
                              sx={{
                                px: 1.4,
                                py: 0.8,
                                borderRadius: 3,
                                border: "1px solid rgba(15,23,42,0.10)",
                                background: "rgba(241,245,249,0.85)",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography sx={{ fontWeight: 900, color: "rgba(15,23,42,0.78)" }}>
                                Active
                              </Typography>
                              <Switch
                                checked={u.active}
                                onChange={(e) => toggleActive(u.id, e.target.checked)}
                              />
                            </Paper>
                          </Stack>
                        </Stack>

                        <Divider sx={{ mt: 2, borderColor: "rgba(15,25,40,0.08)" }} />
                        <Typography sx={{ mt: 1.1, fontSize: 12.5, color: "rgba(15,23,42,0.55)" }}>
                          Changes apply immediately. Deactivated users cannot sign in.
                        </Typography>
                      </Paper>
                    );
                  })
                )}
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
