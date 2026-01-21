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
  IconButton,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
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
      ? { bg: "rgba(16,185,129,0.12)", bd: "rgba(16,185,129,0.30)" }
      : status === "REJECTED"
      ? { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.26)" }
      : { bg: "rgba(234,179,8,0.10)", bd: "rgba(234,179,8,0.26)" };

  return (
    <Chip
      size="small"
      label={label}
      variant="outlined"
      sx={{
        fontWeight: 950,
        borderWidth: 1,
        bgcolor: tone.bg,
        borderColor: tone.bd,
        color: "rgba(15,23,42,0.86)",
      }}
    />
  );
}

function MetricPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "yellow" | "red";
}) {
  const theme =
    tone === "green"
      ? { bg: "rgba(16,185,129,0.12)", bd: "rgba(16,185,129,0.26)" }
      : tone === "red"
      ? { bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.22)" }
      : { bg: "rgba(234,179,8,0.12)", bd: "rgba(234,179,8,0.24)" };

  return (
    <Paper
      elevation={0}
      sx={{
        px: 1.4,
        py: 1.1,
        borderRadius: 3,
        border: `1px solid ${theme.bd}`,
        bgcolor: theme.bg,
      }}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 900,
          color: "rgba(15,23,42,0.62)",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 0.2,
          fontWeight: 950,
          fontSize: 20,
          color: "rgba(15,23,42,0.88)",
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default function AdminLoansPage() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("SUBMITTED");
  const [rows, setRows] = useState<LoanApplication[]>([]);
  const [selected, setSelected] = useState<LoanApplication | null>(null);

  /** Loads the current loan list for the selected filter. */
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

      const list: LoanApplication[] = data?.content ?? [];
      setRows(list);

      // If the selected loan isn't in the refreshed list, clear it.
      setSelected((prev) => {
        if (!prev) return null;
        return list.find((x) => x.id === prev.id) ?? null;
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load loan queue.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the filter changes.
  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const counts = useMemo(() => {
    let submitted = 0;
    let approved = 0;
    let rejected = 0;

    for (const r of rows) {
      if (r.status === "SUBMITTED") submitted += 1;
      else if (r.status === "APPROVED") approved += 1;
      else if (r.status === "REJECTED") rejected += 1;
    }

    return { submitted, approved, rejected };
  }, [rows]);

  const canAct = (loan?: LoanApplication | null) =>
    !!loan && loan.status === "SUBMITTED" && busyId === null;

  /** Runs an action and then refreshes the queue. */
  const runAction = async (id: number, action: "approve" | "reject") => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      if (action === "approve") {
        await approveLoan(id);
        setSuccess(`Loan #${id} approved ✅`);
      } else {
        await rejectLoan(id);
        setSuccess(`Loan #${id} rejected ❌`);
      }
      await fetchLoans();
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          `Failed to ${action} Loan #${id}`
      );
    } finally {
      setBusyId(null);
    }
  };

  const onApprove = (id: number) => runAction(id, "approve");
  const onReject = (id: number) => runAction(id, "reject");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#EEF2F7",
      }}
    >
      {/* Background image + overlay to keep text readable. */}
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
            "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.36) 45%, rgba(255,255,255,0) 100%)," +
            "radial-gradient(1100px 520px at 20% 110%, rgba(40, 69, 120, 0.12), rgba(0, 0, 0, 0) 60%)",
        }}
      />

      <AppHeader showLogout pageTitle="LOAN QUEUE" />

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
        <Box sx={{ mx: "auto", maxWidth: 1380 }}>
          {/* Top-level feedback messages. */}
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

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "340px 1fr 380px" },
              gap: 2.2,
              alignItems: "start",
            }}
          >
            {/* Left: filters + quick counts. */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3.2,
                overflow: "hidden",
                border: "1px solid rgba(15,25,40,0.10)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.10)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,247,252,0.85))",
              }}
            >
              <Box sx={{ p: 2.4 }}>
                <Typography
                  sx={{ fontWeight: 950, fontSize: 18, color: "rgba(15,23,42,0.90)" }}
                >
                  Controls
                </Typography>
                <Typography
                  sx={{ mt: 0.3, color: "rgba(15,23,42,0.62)", fontSize: 13 }}
                >
                  Filter the queue and refresh results.
                </Typography>

                <Divider sx={{ my: 1.8, borderColor: "rgba(15,25,40,0.10)" }} />

                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as StatusFilter)
                    }
                    sx={{
                      borderRadius: 2.4,
                      backgroundColor: "rgba(241,245,249,0.9)",
                    }}
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
                  startIcon={<RefreshRoundedIcon />}
                  sx={{
                    mt: 1.4,
                    fontWeight: 950,
                    textTransform: "none",
                    borderRadius: 2.5,
                    py: 1.05,
                    color: "rgba(15,23,42,0.85)",
                    borderColor: "rgba(15,23,42,0.22)",
                    "&:hover": { borderColor: "rgba(15,23,42,0.35)" },
                  }}
                >
                  Refresh
                </Button>

                <Divider sx={{ my: 1.8, borderColor: "rgba(15,25,40,0.10)" }} />

                <Typography
                  sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)", mb: 1.2 }}
                >
                  Snapshot
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.2,
                  }}
                >
                  <MetricPill
                    label="Submitted"
                    value={counts.submitted}
                    tone="yellow"
                  />
                  <MetricPill
                    label="Approved"
                    value={counts.approved}
                    tone="green"
                  />
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <MetricPill
                      label="Rejected"
                      value={counts.rejected}
                      tone="red"
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Center: selectable loan cards. */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3.2,
                overflow: "hidden",
                border: "1px solid rgba(15,25,40,0.10)",
                boxShadow: "0 20px 70px rgba(0,0,0,0.12)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,255,0.92))",
              }}
            >
              <Box
                sx={{
                  px: 2.6,
                  py: 2,
                  borderBottom: "1px solid rgba(15,25,40,0.08)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.40))",
                }}
              >
                <Typography sx={{ fontWeight: 950, color: "#0F172A" }}>
                  Applications
                </Typography>
                <Typography
                  sx={{ mt: 0.3, color: "rgba(15,23,42,0.62)", fontSize: 13 }}
                >
                  Click any card to open details on the right.
                </Typography>
              </Box>

              {loading ? (
                <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : rows.length === 0 ? (
                <Box sx={{ p: 4 }}>
                  <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                    No applications found
                  </Typography>
                  <Typography sx={{ mt: 0.35, color: "rgba(15,23,42,0.62)" }}>
                    Change the filter or refresh.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 2.4,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                    gap: 1.6,
                  }}
                >
                  {rows.map((r) => {
                    const isSelected = selected?.id === r.id;

                    return (
                      <Paper
                        key={r.id}
                        elevation={0}
                        onClick={() => setSelected(r)}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          cursor: "pointer",
                          border: isSelected
                            ? "1px solid rgba(37,99,235,0.35)"
                            : "1px solid rgba(15,23,42,0.10)",
                          background: isSelected
                            ? "rgba(37,99,235,0.06)"
                            : "rgba(255,255,255,0.78)",
                          boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
                          transition: "transform .18s ease, box-shadow .18s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 16px 36px rgba(0,0,0,0.10)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.90)" }}>
                              Loan #{r.id}
                            </Typography>
                            <Typography sx={{ mt: 0.4, color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
                              {r.fullName ?? "-"}
                            </Typography>
                          </Box>
                          <StatusChip status={r.status} />
                        </Stack>

                        <Divider sx={{ my: 1.2, borderColor: "rgba(15,25,40,0.10)" }} />

                        <Stack direction="row" justifyContent="space-between">
                          <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.58)" }}>
                              Amount
                            </Typography>
                            <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                              ${r.amount ?? "-"}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.58)" }}>
                              Tenure
                            </Typography>
                            <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                              {r.tenure ?? "-"} mo
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography sx={{ mt: 1.2, fontSize: 12.5, color: "rgba(15,23,42,0.62)" }}>
                          APR:{" "}
                          <b style={{ color: "rgba(15,23,42,0.86)" }}>
                            {r.interestRate ?? "-"}
                          </b>
                          % · Risk:{" "}
                          <b style={{ color: "rgba(15,23,42,0.86)" }}>
                            {r.riskScore ?? "-"}
                          </b>
                          /100
                        </Typography>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </Paper>

            {/* Right: full details + actions. */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3.2,
                overflow: "hidden",
                border: "1px solid rgba(15,25,40,0.10)",
                boxShadow: "0 20px 70px rgba(0,0,0,0.12)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,248,255,0.86))",
                position: { lg: "sticky", xs: "static" },
                top: { lg: 92, xs: "auto" },
                height: { lg: "calc(100vh - 180px)", xs: "auto" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  px: 2.4,
                  py: 1.8,
                  borderBottom: "1px solid rgba(15,25,40,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 950, color: "#0F172A", lineHeight: 1.1 }}>
                    Details
                  </Typography>
                  <Typography sx={{ mt: 0.35, color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
                    Select a loan from the grid.
                  </Typography>
                </Box>

                {selected && (
                  <IconButton onClick={() => setSelected(null)} size="small">
                    <CloseRoundedIcon />
                  </IconButton>
                )}
              </Box>

              <Box
                sx={{
                  p: 2.4,
                  overflowY: "auto",
                  flex: 1,
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {!selected ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.2,
                      borderRadius: 3,
                      border: "1px dashed rgba(15,23,42,0.18)",
                      bgcolor: "rgba(15,23,42,0.03)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                      No loan selected
                    </Typography>
                    <Typography sx={{ mt: 0.45, color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
                      Click a card to view full info and take action.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={1.6}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontWeight: 950, fontSize: 18, color: "rgba(15,23,42,0.90)" }}>
                        Loan #{selected.id}
                      </Typography>
                      <StatusChip status={selected.status} />
                    </Stack>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid rgba(15,23,42,0.10)",
                        bgcolor: "rgba(255,255,255,0.78)",
                      }}
                    >
                      <Typography sx={{ fontWeight: 900, color: "rgba(15,23,42,0.62)", fontSize: 12 }}>
                        Applicant
                      </Typography>
                      <Typography sx={{ mt: 0.35, fontWeight: 950, color: "rgba(15,23,42,0.88)" }}>
                        {selected.fullName ?? "-"}
                      </Typography>

                      <Divider sx={{ my: 1.4, borderColor: "rgba(15,25,40,0.10)" }} />

                      <Stack direction="row" justifyContent="space-between">
                        <Box>
                          <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.58)" }}>
                            Amount
                          </Typography>
                          <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                            ${selected.amount ?? "-"}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.58)" }}>
                            Tenure
                          </Typography>
                          <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
                            {selected.tenure ?? "-"} mo
                          </Typography>
                        </Box>
                      </Stack>

                      <Divider sx={{ my: 1.4, borderColor: "rgba(15,25,40,0.10)" }} />

                      <Typography sx={{ color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
                        Risk:{" "}
                        <b style={{ color: "rgba(15,23,42,0.86)" }}>
                          {selected.riskScore ?? "-"}
                        </b>
                        /100
                      </Typography>
                      <Typography sx={{ color: "rgba(15,23,42,0.62)", fontSize: 13, mt: 0.4 }}>
                        APR:{" "}
                        <b style={{ color: "rgba(15,23,42,0.86)" }}>
                          {selected.interestRate ?? "-"}
                        </b>
                        %
                      </Typography>
                      <Typography sx={{ color: "rgba(15,23,42,0.62)", fontSize: 13, mt: 0.4 }}>
                        Decision:{" "}
                        <b style={{ color: "rgba(15,23,42,0.86)" }}>
                          {selected.eligibilityDecision ?? "-"}
                        </b>
                      </Typography>
                    </Paper>

                    <Stack direction="row" spacing={1}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CheckCircleRoundedIcon />}
                        disabled={!canAct(selected) || busyId === selected.id}
                        onClick={() => onApprove(selected.id)}
                        sx={{
                          fontWeight: 950,
                          textTransform: "none",
                          borderRadius: 2.5,
                          py: 1.1,
                          background:
                            "linear-gradient(90deg, #1D4ED8, #2563EB, #0EA5E9)",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #1E40AF, #1D4ED8, #0284C7)",
                          },
                        }}
                      >
                        {busyId === selected.id ? "Working..." : "Approve"}
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<CancelRoundedIcon />}
                        disabled={!canAct(selected) || busyId === selected.id}
                        onClick={() => onReject(selected.id)}
                        sx={{
                          fontWeight: 950,
                          textTransform: "none",
                          borderRadius: 2.5,
                          py: 1.1,
                          color: "rgba(15,23,42,0.85)",
                          borderColor: "rgba(15,23,42,0.22)",
                          "&:hover": { borderColor: "rgba(15,23,42,0.35)" },
                        }}
                      >
                        {busyId === selected.id ? "Working..." : "Reject"}
                      </Button>
                    </Stack>

                    {selected.status !== "SUBMITTED" && (
                      <Alert severity="info">
                        Actions are available only when the status is SUBMITTED.
                      </Alert>
                    )}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
