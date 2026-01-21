import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import AppHeader from "../../../components/AppHeader";
import {
  listLoans,
  approveLoan,
  rejectLoan,
  LoanApplication,
  LoanStatus,
  LOAN_STATUS_LABEL,
} from "../../../lib/api/loans";
import bg from "../../../assets/homepage.png";

type StatusFilter = "ALL" | LoanStatus;

function StatusChip({ status }: { status?: LoanStatus }) {
  if (!status) return <Chip size="small" label="-" variant="outlined" />;

  const label = LOAN_STATUS_LABEL[status] ?? status;

  const tone =
    status === "APPROVED"
      ? {
          borderColor: "rgba(16,185,129,0.30)",
          bgcolor: "rgba(16,185,129,0.10)",
        }
      : status === "REJECTED"
      ? {
          borderColor: "rgba(239,68,68,0.28)",
          bgcolor: "rgba(239,68,68,0.10)",
        }
      : {
          borderColor: "rgba(37,99,235,0.26)",
          bgcolor: "rgba(37,99,235,0.10)",
        };

  return (
    <Chip
      size="small"
      label={label}
      variant="outlined"
      sx={{
        fontWeight: 900,
        borderWidth: 1,
        borderColor: tone.borderColor,
        bgcolor: tone.bgcolor,
        color: "rgba(15,23,42,0.86)",
      }}
    />
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "green" | "red";
}) {
  const sx =
    tone === "green"
      ? { bg: "rgba(16,185,129,0.12)", bd: "rgba(16,185,129,0.22)" }
      : tone === "red"
      ? { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.20)" }
      : { bg: "rgba(37,99,235,0.10)", bd: "rgba(37,99,235,0.20)" };

  return (
    <Chip
      label={`${label}: ${value}`}
      sx={{
        fontWeight: 950,
        bgcolor: sx.bg,
        border: `1px solid ${sx.bd}`,
        color: "rgba(15,23,42,0.86)",
      }}
    />
  );
}

export default function AnalystDashboard() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("SUBMITTED");
  const [rows, setRows] = useState<LoanApplication[]>([]);

  /** Loads the current queue based on the selected status filter. */
  const fetchLoans = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await listLoans({
        page: 0,
        size: 25,
        sortBy: "createdAt",
        direction: "desc",
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setRows(data?.content ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load loan queue.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when the filter changes.
  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const submittedCount = useMemo(
    () => rows.filter((r) => r.status === "SUBMITTED").length,
    [rows]
  );
  const approvedCount = useMemo(
    () => rows.filter((r) => r.status === "APPROVED").length,
    [rows]
  );
  const rejectedCount = useMemo(
    () => rows.filter((r) => r.status === "REJECTED").length,
    [rows]
  );

  /** Approves a single loan and refreshes the queue. */
  const onApprove = async (id: number) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await approveLoan(id);
      setSuccess(`Loan #${id} approved ✅`);
      await fetchLoans();
    } catch (e: any) {
      setError(e?.response?.data?.message || `Failed to approve Loan #${id}`);
    } finally {
      setBusyId(null);
    }
  };

  /** Rejects a single loan and refreshes the queue. */
  const onReject = async (id: number) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await rejectLoan(id);
      setSuccess(`Loan #${id} rejected ❌`);
      await fetchLoans();
    } catch (e: any) {
      setError(e?.response?.data?.message || `Failed to reject Loan #${id}`);
    } finally {
      setBusyId(null);
    }
  };

  const canAct = (r: LoanApplication) => busyId === null && r.status === "SUBMITTED";

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden", bgcolor: "#EEF2F7" }}>
      {/* Background + overlay for consistent contrast. */}
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

      <AppHeader showLogout pageTitle="ANALYST DASHBOARD" />

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
                  Loan review queue
                </Typography>
                <Typography sx={{ mt: 0.4, color: "rgba(20,35,55,0.70)" }}>
                  Review submitted applications and take action.
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <StatPill label="Submitted" value={submittedCount} tone="blue" />
                <StatPill label="Approved" value={approvedCount} tone="green" />
                <StatPill label="Rejected" value={rejectedCount} tone="red" />
              </Stack>
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(15,25,40,0.10)" }} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  sx={{ borderRadius: 2.4, backgroundColor: "rgba(241,245,249,0.9)" }}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="SUBMITTED">Pending (Submitted)</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={fetchLoans}
                sx={{
                  fontWeight: 950,
                  textTransform: "none",
                  borderRadius: 2.5,
                  py: 1.05,
                  px: 2.2,
                  color: "rgba(15,23,42,0.85)",
                  borderColor: "rgba(15,23,42,0.22)",
                  "&:hover": { borderColor: "rgba(15,23,42,0.35)" },
                  whiteSpace: "nowrap",
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

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
                Applications
              </Typography>
              <Typography sx={{ mt: 0.3, color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
                Latest applications appear first.
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ p: 5, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : rows.length === 0 ? (
              <Box sx={{ p: 4 }}>
                <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                  No applications found
                </Typography>
                <Typography sx={{ mt: 0.35, color: "rgba(15,23,42,0.62)" }}>
                  Try changing the status filter or click Refresh.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: { xs: 2.2, sm: 2.8 } }}>
                <Stack spacing={1.4}>
                  {rows.map((r) => (
                    <Paper
                      key={r.id}
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
                        alignItems={{ xs: "stretch", md: "center" }}
                        justifyContent="space-between"
                      >
                        <Box sx={{ minWidth: 280 }}>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.90)" }}>
                              Loan #{r.id}
                            </Typography>
                            <StatusChip status={r.status} />
                          </Stack>

                          <Typography sx={{ mt: 0.8, color: "rgba(15,23,42,0.62)" }}>
                            Applicant: <b style={{ color: "rgba(15,23,42,0.86)" }}>{r.fullName ?? "-"}</b>
                          </Typography>
                          <Typography sx={{ mt: 0.2, color: "rgba(15,23,42,0.62)" }}>
                            Amount: <b style={{ color: "rgba(15,23,42,0.86)" }}>${r.amount ?? "-"}</b> · Tenure:{" "}
                            <b style={{ color: "rgba(15,23,42,0.86)" }}>{r.tenure ?? "-"} mo</b>
                          </Typography>
                          <Typography sx={{ mt: 0.2, color: "rgba(15,23,42,0.62)" }}>
                            Risk: <b style={{ color: "rgba(15,23,42,0.86)" }}>{r.riskScore ?? "-"}/100</b> · APR:{" "}
                            <b style={{ color: "rgba(15,23,42,0.86)" }}>{r.interestRate ?? "-"}%</b> · Decision:{" "}
                            <b style={{ color: "rgba(15,23,42,0.86)" }}>{r.eligibilityDecision ?? "-"}</b>
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            disabled={!canAct(r) || busyId === r.id}
                            onClick={() => onApprove(r.id)}
                            sx={{
                              fontWeight: 950,
                              textTransform: "none",
                              borderRadius: 2.5,
                              py: 1.05,
                              background: "linear-gradient(90deg, #1D4ED8, #2563EB, #0EA5E9)",
                              boxShadow: "0 14px 26px rgba(37,99,235,0.18)",
                              "&:hover": {
                                background: "linear-gradient(90deg, #1E40AF, #1D4ED8, #0284C7)",
                              },
                            }}
                          >
                            {busyId === r.id ? "Working..." : "Approve"}
                          </Button>

                          <Button
                            variant="outlined"
                            disabled={!canAct(r) || busyId === r.id}
                            onClick={() => onReject(r.id)}
                            sx={{
                              fontWeight: 950,
                              textTransform: "none",
                              borderRadius: 2.5,
                              py: 1.05,
                              color: "rgba(15,23,42,0.85)",
                              borderColor: "rgba(15,23,42,0.22)",
                              "&:hover": { borderColor: "rgba(15,23,42,0.35)" },
                            }}
                          >
                            {busyId === r.id ? "Working..." : "Reject"}
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
