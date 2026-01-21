// src/pages/ApplicationStatusPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  TextField,
} from "@mui/material";
import AppHeader from "../../../components/AppHeader";
import client from "../../../lib/api/client";
import { LoanApplication, LoanStatus, LOAN_STATUS_LABEL } from "../../../lib/api/loans";
import bg from "../../../assets/homepage.png";

function StatusChip({ status }: { status?: LoanStatus }) {
  if (!status) return <Chip label="-" size="small" />;

  const label = LOAN_STATUS_LABEL[status] ?? status;

  const tone =
    status === "APPROVED"
      ? {
          bgcolor: "rgba(16,185,129,0.14)",
          borderColor: "rgba(16,185,129,0.35)",
          color: "#065F46",
        }
      : status === "REJECTED"
      ? {
          bgcolor: "rgba(239,68,68,0.12)",
          borderColor: "rgba(239,68,68,0.28)",
          color: "#7F1D1D",
        }
      : {
          bgcolor: "rgba(59,130,246,0.12)",
          borderColor: "rgba(59,130,246,0.28)",
          color: "#1E3A8A",
        };

  return (
    <Chip
      variant="outlined"
      label={label}
      size="small"
      sx={{ fontWeight: 900, borderWidth: 1, ...tone }}
    />
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(15,23,42,0.10)",
        background: "rgba(255,255,255,0.78)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.10)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Soft glow behind the number. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(500px 260px at 15% 10%, ${accent}, transparent 55%)`,
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.58)" }}>
          {label}
        </Typography>
        <Typography sx={{ mt: 0.4, fontSize: 26, fontWeight: 950, color: "rgba(15,23,42,0.90)" }}>
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function ApplicationStatusPage() {
  const [status, setStatus] = useState<LoanStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<LoanApplication[]>([]);
  const [error, setError] = useState("");

  // Local-only filter (name/id). Does not affect backend results.
  const [q, setQ] = useState("");

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", "0");
      params.set("size", "50");
      params.set("sortBy", "createdAt");
      params.set("direction", "desc");
      if (status !== "ALL") params.set("status", status);

      const res = await client.get(`/api/loans?${params.toString()}`);

      // Supports both Page<LoanApplication> and plain arrays.
      const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setRows(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load applications");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Reload when status filter changes.
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const stats = useMemo(() => {
    const total = rows.length;
    const approved = rows.filter((r) => r.status === "APPROVED").length;
    const rejected = rows.filter((r) => r.status === "REJECTED").length;
    const submitted = rows.filter((r) => r.status === "SUBMITTED").length;
    return { total, approved, rejected, submitted };
  }, [rows]);

  const visibleRows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const name = (r.fullName ?? "").toLowerCase();
      const id = String(r.id ?? "");
      return name.includes(s) || id.includes(s);
    });
  }, [rows, q]);

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden", bgcolor: "#EEF2F7" }}>
      {/* Background + overlay for readability. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "brightness(1.03) contrast(1.04) saturate(1.02)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.34) 45%, rgba(255,255,255,0) 100%)," +
            "radial-gradient(1100px 520px at 20% 110%, rgba(40,69,120,0.14), rgba(0,0,0,0) 60%)",
        }}
      />

      <AppHeader showLogout pageTitle="APPLICATION STATUS" />

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
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: { xs: 2.2, sm: 3 },
              border: "1px solid rgba(15,23,42,0.10)",
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 26px 90px rgba(0,0,0,0.14)",
              overflow: "hidden",
              position: "relative",
              mb: 2.2,
            }}
          >
            {/* Decorative gradients for the hero card. */}
            <Box
              sx={{
                position: "absolute",
                inset: -40,
                background:
                  "radial-gradient(circle at 15% 20%, rgba(59,130,246,0.22), transparent 40%)," +
                  "radial-gradient(circle at 85% 70%, rgba(16,185,129,0.18), transparent 45%)," +
                  "radial-gradient(circle at 50% 110%, rgba(239,68,68,0.14), transparent 55%)",
                filter: "blur(18px)",
                pointerEvents: "none",
              }}
            />

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2.2}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Box>
                <Typography sx={{ fontWeight: 950, fontSize: 22, color: "rgba(15,23,42,0.92)" }}>
                  Track your applications
                </Typography>
                <Typography sx={{ mt: 0.5, color: "rgba(15,23,42,0.62)" }}>
                  View statuses and history in one place.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                  gap: 1.2,
                  minWidth: { md: 720 },
                }}
              >
                <StatCard label="Total" value={stats.total} accent="rgba(59,130,246,0.28)" />
                <StatCard label="Submitted" value={stats.submitted} accent="rgba(59,130,246,0.22)" />
                <StatCard label="Approved" value={stats.approved} accent="rgba(16,185,129,0.22)" />
                <StatCard label="Rejected" value={stats.rejected} accent="rgba(239,68,68,0.18)" />
              </Box>
            </Stack>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              position: "sticky",
              top: 86,
              zIndex: 3,
              borderRadius: 3,
              p: 1.6,
              mb: 2,
              border: "1px solid rgba(15,23,42,0.10)",
              background: "rgba(255,255,255,0.80)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.10)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.2}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
            >
              <TextField
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or ID..."
                size="small"
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.4,
                    backgroundColor: "rgba(241,245,249,0.9)",
                  },
                }}
              />

              <FormControl sx={{ minWidth: 260 }} size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value as LoanStatus | "ALL")}
                  sx={{
                    borderRadius: 2.4,
                    backgroundColor: "rgba(241,245,249,0.9)",
                  }}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="SUBMITTED">{LOAN_STATUS_LABEL.SUBMITTED}</MenuItem>
                  <MenuItem value="APPROVED">{LOAN_STATUS_LABEL.APPROVED}</MenuItem>
                  <MenuItem value="REJECTED">{LOAN_STATUS_LABEL.REJECTED}</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid rgba(15,23,42,0.10)",
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.14)",
              overflow: "hidden",
            }}
          >
            <Box sx={{ px: { xs: 2.2, sm: 3 }, py: 2.1 }}>
              <Typography sx={{ fontWeight: 950, fontSize: 18, color: "rgba(15,23,42,0.90)" }}>
                Applications
              </Typography>
              <Typography sx={{ mt: 0.4, color: "rgba(15,23,42,0.62)" }}>
                Showing {visibleRows.length} result{visibleRows.length === 1 ? "" : "s"}.
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(15,23,42,0.08)" }} />

            {loading ? (
              <Stack alignItems="center" sx={{ py: 7 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, color: "rgba(15,23,42,0.62)" }}>Loading...</Typography>
              </Stack>
            ) : visibleRows.length === 0 ? (
              <Box sx={{ p: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.4,
                    borderRadius: 3,
                    background: "rgba(15,23,42,0.03)",
                    border: "1px dashed rgba(15,23,42,0.18)",
                  }}
                >
                  <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                    No applications found
                  </Typography>
                  <Typography sx={{ mt: 0.4, color: "rgba(15,23,42,0.62)" }}>
                    Try changing the filter or clearing search.
                  </Typography>
                </Paper>
              </Box>
            ) : (
              <Box sx={{ p: { xs: 2.2, sm: 3 } }}>
                <Stack spacing={1.4}>
                  {visibleRows.map((r) => (
                    <Paper
                      key={r.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid rgba(15,23,42,0.10)",
                        background: "rgba(255,255,255,0.78)",
                        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
                        transition: "transform 150ms ease, box-shadow 150ms ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 22px 55px rgba(0,0,0,0.12)",
                        },
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1.6}
                        alignItems={{ xs: "flex-start", md: "center" }}
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.90)" }}>
                            {r.fullName ?? "—"}
                          </Typography>
                          <Typography sx={{ mt: 0.35, fontSize: 13, color: "rgba(15,23,42,0.62)" }}>
                            ID: <b>{r.id ?? "—"}</b> • Created:{" "}
                            <b>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</b>
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Paper
                            elevation={0}
                            sx={{
                              px: 1.6,
                              py: 0.9,
                              borderRadius: 999,
                              border: "1px solid rgba(15,23,42,0.10)",
                              background: "rgba(241,245,249,0.9)",
                            }}
                          >
                            <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                              {typeof r.amount === "number" ? `$${r.amount.toLocaleString()}` : "—"}
                            </Typography>
                          </Paper>

                          <StatusChip status={r.status} />
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                <Typography sx={{ mt: 2, fontSize: 12.5, color: "rgba(15,23,42,0.55)" }}>
                  Tip: Submitted means it’s still under review.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
