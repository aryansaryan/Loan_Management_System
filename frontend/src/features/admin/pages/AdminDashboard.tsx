import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import RequestQuoteRoundedIcon from "@mui/icons-material/RequestQuoteRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { useNavigate } from "react-router-dom";
import AppHeader from "../../../components/AppHeader";
import { getAdminMetrics, AdminMetrics } from "../../../lib/api/admin";
import bg from "../../../assets/homepage.png";

type TileProps = {
  label: string;
  value: number;
  helper: string;
  icon: React.ReactNode;
  accent: string;
  onClick: () => void;
  loading?: boolean;
  progress?: number;
};

/** Single metric tile used on the dashboard grid. */
function MetricTile({
  label,
  value,
  helper,
  icon,
  accent,
  onClick,
  loading,
  progress,
}: TileProps) {
  const pct =
    typeof progress === "number" ? Math.max(0, Math.min(100, progress)) : 100;

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(15,25,40,0.10)",
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 22px 70px rgba(0,0,0,0.12)",
        transition: "transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 30px 95px rgba(0,0,0,0.16)",
        },
        "&:active": { transform: "translateY(-2px)" },
      }}
    >
      <Box
        sx={{
          p: 2.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))",
          borderBottom: "1px solid rgba(15,25,40,0.08)",
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              background: "rgba(15,23,42,0.04)",
              border: "1px solid rgba(15,23,42,0.08)",
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 950,
                letterSpacing: 0.35,
                textTransform: "uppercase",
                fontSize: 12,
                color: "rgba(15,23,42,0.68)",
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{ color: "rgba(15,23,42,0.55)", fontSize: 13, mt: 0.2 }}
            >
              {helper}
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            size="small"
            label="OPEN"
            sx={{
              fontWeight: 900,
              color: "rgba(15,23,42,0.80)",
              bgcolor: "rgba(15,23,42,0.04)",
              border: "1px solid rgba(15,23,42,0.10)",
            }}
          />
          <ArrowForwardRoundedIcon sx={{ color: "rgba(15,23,42,0.45)" }} />
        </Box>
      </Box>

      <Box sx={{ p: 2.2 }}>
        {loading ? (
          <Skeleton
            variant="text"
            width={140}
            height={56}
            sx={{ bgcolor: "rgba(15,23,42,0.08)" }}
          />
        ) : (
          <Typography
            sx={{
              fontWeight: 950,
              fontSize: 44,
              lineHeight: 1.05,
              color: "rgba(15,23,42,0.90)",
            }}
          >
            {value}
          </Typography>
        )}

        <Divider sx={{ my: 1.6, borderColor: "rgba(15,23,42,0.10)" }} />

        {/* Progress bar is just a visual share indicator. */}
        <Box
          sx={{
            height: 10,
            borderRadius: 999,
            backgroundColor: "rgba(15,25,40,0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${pct}%`,
              background: accent,
              borderRadius: 999,
              transition: "width 260ms ease",
            }}
          />
        </Box>

        <Typography sx={{ mt: 1, color: "rgba(15,23,42,0.58)", fontSize: 12.5 }}>
          {typeof progress === "number"
            ? `${Math.round(pct)}% share`
            : "All applications included"}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function AdminDashboard() {
  const nav = useNavigate();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  /** Pulls the latest metrics; refresh button calls the same function. */
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const m = await getAdminMetrics();
      setMetrics(m);
      setUpdatedAt(new Date());
    } finally {
      setLoading(false);
    }
  };

  // Initial load.
  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalUsers = useMemo(() => {
    const c = metrics?.customers ?? 0;
    const a = metrics?.analysts ?? 0;
    const ad = metrics?.admins ?? 0;
    return c + a + ad;
  }, [metrics]);

  /** Converts a count into a % share of total users. */
  const pct = (v: number) => (totalUsers ? (v / totalUsers) * 100 : 0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#EEF2F7",
      }}
    >
      {/* Background image + overlay for readability. */}
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
            "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.36) 45%, rgba(255,255,255,0.02) 100%)," +
            "radial-gradient(1100px 520px at 20% 110%, rgba(40, 69, 120, 0.12), rgba(0, 0, 0, 0) 60%)",
        }}
      />

      <AppHeader showLogout pageTitle="ADMIN DASHBOARD" />

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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "360px 1fr" },
              gap: 2.2,
              alignItems: "start",
            }}
          >
            {/* Left panel stays visible on large screens. */}
            <Box
              sx={{
                position: { lg: "sticky", xs: "static" },
                top: { lg: 92, xs: "auto" },
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid rgba(15,25,40,0.10)",
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 22px 70px rgba(0,0,0,0.12)",
                }}
              >
                <Box
                  sx={{
                    p: 2.2,
                    borderBottom: "1px solid rgba(15,25,40,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 3,
                          display: "grid",
                          placeItems: "center",
                          background: "rgba(59,130,246,0.10)",
                          border: "1px solid rgba(59,130,246,0.20)",
                        }}
                      >
                        <AdminPanelSettingsRoundedIcon />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 950,
                            fontSize: 16,
                            color: "rgba(15,23,42,0.88)",
                          }}
                        >
                          Admin Control
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.3,
                            color: "rgba(15,23,42,0.60)",
                            fontSize: 13,
                          }}
                        >
                          Quick access & status
                        </Typography>
                      </Box>
                    </Stack>

                    <Tooltip title="Refresh metrics">
                      <span>
                        <IconButton
                          onClick={fetchMetrics}
                          disabled={loading}
                          sx={{
                            borderRadius: 3,
                            border: "1px solid rgba(15,23,42,0.10)",
                            background: "rgba(255,255,255,0.70)",
                          }}
                        >
                          <RefreshRoundedIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>

                  <Divider sx={{ my: 2, borderColor: "rgba(15,23,42,0.10)" }} />

                  {/* Small status chips for at-a-glance info. */}
                  <Stack spacing={1}>
                    <Chip
                      label={totalUsers ? `${totalUsers} total users` : "No users yet"}
                      sx={{
                        justifyContent: "space-between",
                        fontWeight: 900,
                        bgcolor: "rgba(15,23,42,0.04)",
                        border: "1px solid rgba(15,23,42,0.10)",
                        color: "rgba(15,23,42,0.82)",
                      }}
                    />
                    <Chip
                      label={
                        updatedAt
                          ? `Updated ${updatedAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "Updated —"
                      }
                      sx={{
                        justifyContent: "space-between",
                        fontWeight: 900,
                        bgcolor: "rgba(59,130,246,0.10)",
                        border: "1px solid rgba(59,130,246,0.20)",
                        color: "rgba(15,23,42,0.82)",
                      }}
                    />
                    <Chip
                      label={loading ? "Fetching metrics…" : "LIVE metrics"}
                      sx={{
                        justifyContent: "space-between",
                        fontWeight: 900,
                        bgcolor: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.26)",
                        color: "rgba(15,23,42,0.82)",
                      }}
                    />
                  </Stack>
                </Box>

                <Box sx={{ p: 2.2 }}>
                  <Typography
                    sx={{ fontWeight: 950, color: "rgba(15,23,42,0.88)" }}
                  >
                    Shortcuts
                  </Typography>
                  <Typography
                    sx={{ mt: 0.4, color: "rgba(15,23,42,0.60)", fontSize: 13 }}
                  >
                    Jump into the most-used admin sections.
                  </Typography>

                  <Stack spacing={1.2} sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => nav("/admin/users")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 950,
                        borderRadius: 3,
                        py: 1.15,
                        background:
                          "linear-gradient(90deg, #1D4ED8, #2563EB, #0EA5E9)",
                        boxShadow: "0 14px 26px rgba(37,99,235,0.20)",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #1E40AF, #1D4ED8, #0284C7)",
                        },
                      }}
                    >
                      Manage All Users
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => nav("/admin/loans")}
                      sx={{
                        textTransform: "none",
                        fontWeight: 950,
                        borderRadius: 3,
                        py: 1.1,
                        color: "#0F172A",
                        borderColor: "rgba(15,23,42,0.22)",
                        "&:hover": { borderColor: "rgba(15,23,42,0.35)" },
                      }}
                    >
                      View All Loans
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Box>

            {/* Right side: overview + tiles. */}
            <Box>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 2.4,
                  border: "1px solid rgba(15,25,40,0.10)",
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 22px 70px rgba(0,0,0,0.12)",
                  mb: 2.2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 950,
                    fontSize: 20,
                    color: "rgba(15,23,42,0.90)",
                  }}
                >
                  Admin Overview
                </Typography>
                <Typography sx={{ mt: 0.5, color: "rgba(15,23,42,0.62)" }}>
                  Monitor system totals and open details from any tile.
                </Typography>
              </Paper>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: 2.2,
                  mb: 2.2,
                }}
              >
                <MetricTile
                  label="Customers"
                  value={metrics?.customers ?? 0}
                  helper="Registered borrowers"
                  icon={<PeopleAltRoundedIcon />}
                  accent="#2563EB"
                  onClick={() => nav("/admin/users?role=CUSTOMER")}
                  progress={pct(metrics?.customers ?? 0)}
                  loading={loading}
                />

                <MetricTile
                  label="Analysts"
                  value={metrics?.analysts ?? 0}
                  helper="Review & approve loans"
                  icon={<ManageAccountsRoundedIcon />}
                  accent="#10B981"
                  onClick={() => nav("/admin/users?role=ANALYST")}
                  progress={pct(metrics?.analysts ?? 0)}
                  loading={loading}
                />

                <MetricTile
                  label="Loans"
                  value={metrics?.loans ?? 0}
                  helper="Applications in the system"
                  icon={<RequestQuoteRoundedIcon />}
                  accent="#F59E0B"
                  onClick={() => nav("/admin/loans")}
                  loading={loading}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
