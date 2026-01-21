// src/pages/LoanApplication.tsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import AppHeader from "../../../components/AppHeader";
import client from "../../../lib/api/client";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import bg from "../../../assets/homepage.png";

type EmploymentType = "SALARIED" | "SELF_EMPLOYED" | "STUDENT" | "UNEMPLOYED";
type Purpose = "HOME" | "AUTO" | "PERSONAL" | "EDUCATION" | "MEDICAL";
type StepKey = 0 | 1 | 2;

function DecisionChip({ decision }: { decision: "ELIGIBLE" | "REVIEW" | "REJECT" }) {
  const styles =
    decision === "ELIGIBLE"
      ? { label: "Eligible", bg: "rgba(16,185,129,0.12)", bd: "rgba(16,185,129,0.28)" }
      : decision === "REVIEW"
      ? { label: "Needs review", bg: "rgba(59,130,246,0.12)", bd: "rgba(59,130,246,0.26)" }
      : { label: "High risk", bg: "rgba(239,68,68,0.10)", bd: "rgba(239,68,68,0.22)" };

  return (
    <Chip
      label={styles.label}
      variant="outlined"
      sx={{
        fontWeight: 900,
        borderWidth: 1,
        background: styles.bg,
        borderColor: styles.bd,
        color: "rgba(15,23,42,0.86)",
      }}
    />
  );
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={{ color: "rgba(15,23,42,0.62)", fontWeight: 800 }}>{label}</Typography>
      <Typography sx={{ color: "rgba(15,23,42,0.88)", fontWeight: 950 }}>{value}</Typography>
    </Stack>
  );
}

export default function LoanApplication() {
  const navigate = useNavigate();

  // Fields
  const [fullName, setFullName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [monthlyDebt, setMonthlyDebt] = useState<string>("");
  const [creditScore, setCreditScore] = useState<string>("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("SALARIED");
  const [purpose, setPurpose] = useState<Purpose>("PERSONAL");

  // UI
  const [step, setStep] = useState<StepKey>(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const steps = ["Applicant", "Financials", "Review"];

  const canAnalyze = useMemo(() => {
    return (
      fullName.trim() !== "" &&
      amount.trim() !== "" &&
      tenure.trim() !== "" &&
      monthlyIncome.trim() !== "" &&
      monthlyDebt.trim() !== "" &&
      creditScore.trim() !== ""
    );
  }, [fullName, amount, tenure, monthlyIncome, monthlyDebt, creditScore]);

  const analysis = useMemo(() => {
    if (!canAnalyze) return null;

    const amt = Number(amount);
    const ten = Number(tenure);
    const income = Number(monthlyIncome);
    const debt = Number(monthlyDebt);
    const cs = Number(creditScore);

    if ([amt, ten, income, debt, cs].some((n) => Number.isNaN(n))) return null;
    if (amt <= 0 || ten <= 0 || income <= 0) return null;
    if (cs < 300 || cs > 850) return null;

    const dti = income > 0 ? debt / income : 1;
    let risk = 0;

    if (cs >= 780) risk += 10;
    else if (cs >= 740) risk += 20;
    else if (cs >= 700) risk += 35;
    else if (cs >= 650) risk += 50;
    else risk += 70;

    if (dti <= 0.2) risk += 5;
    else if (dti <= 0.35) risk += 20;
    else if (dti <= 0.5) risk += 40;
    else risk += 60;

    if (employmentType === "SALARIED") risk += 5;
    else if (employmentType === "SELF_EMPLOYED") risk += 15;
    else if (employmentType === "STUDENT") risk += 25;
    else risk += 35;

    const amountToAnnualIncome = amt / (income * 12);
    if (amountToAnnualIncome <= 1.5) risk += 5;
    else if (amountToAnnualIncome <= 3) risk += 15;
    else risk += 25;

    risk = Math.max(0, Math.min(100, risk));

    let decision: "ELIGIBLE" | "REVIEW" | "REJECT" = "ELIGIBLE";
    if (cs < 600 || dti > 0.6 || risk >= 80) decision = "REJECT";
    else if (cs < 680 || dti > 0.45 || risk >= 55) decision = "REVIEW";

    const rate = Math.round((7.5 + risk * 0.08) * 10) / 10;

    return { dti, risk, decision, rate };
  }, [canAnalyze, amount, tenure, monthlyIncome, monthlyDebt, creditScore, employmentType]);

  const completion = useMemo(() => {
    let score = 0;
    if (fullName.trim()) score += 25;
    if (amount.trim()) score += 15;
    if (tenure.trim()) score += 15;
    if (monthlyIncome.trim()) score += 15;
    if (monthlyDebt.trim()) score += 10;
    if (creditScore.trim()) score += 10;
    if (employmentType) score += 5;
    if (purpose) score += 5;
    return Math.min(100, score);
  }, [fullName, amount, tenure, monthlyIncome, monthlyDebt, creditScore, employmentType, purpose]);

  const stepValid = useMemo(() => {
    if (step === 0) return fullName.trim().length > 1;
    if (step === 1)
      return (
        amount.trim() &&
        tenure.trim() &&
        monthlyIncome.trim() &&
        monthlyDebt.trim() &&
        creditScore.trim()
      );
    return true;
  }, [step, fullName, amount, tenure, monthlyIncome, monthlyDebt, creditScore]);

  const submit = async () => {
    setSuccess("");
    setError("");

    const amt = Number(amount);
    const ten = Number(tenure);
    const income = Number(monthlyIncome);
    const debt = Number(monthlyDebt);
    const cs = Number(creditScore);

    if (!fullName.trim()) return setError("Please enter your full name.");
    if ([amt, ten, income, debt, cs].some((n) => Number.isNaN(n)))
      return setError("Please fill all numeric fields correctly.");
    if (amt <= 0 || ten <= 0) return setError("Loan amount and tenure must be greater than 0.");
    if (income <= 0) return setError("Monthly income must be greater than 0.");
    if (cs < 300 || cs > 850) return setError("Credit score must be between 300 and 850.");

    setSubmitting(true);
    try {
      await client.post("/api/loans/apply", {
        fullName,
        amount: amt,
        tenure: ten,
        monthlyIncome: income,
        monthlyDebt: debt,
        creditScore: cs,
        employmentType,
        purpose,
      });
      setShowSuccessModal(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to submit loan");
    } finally {
      setSubmitting(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/dashboard");
  };

  const reset = () => {
    setFullName("");
    setAmount("");
    setTenure("");
    setMonthlyIncome("");
    setMonthlyDebt("");
    setCreditScore("");
    setEmploymentType("SALARIED");
    setPurpose("PERSONAL");
    setError("");
    setSuccess("");
    setStep(0);
  };

  const decisionBarColor = (d: "ELIGIBLE" | "REVIEW" | "REJECT") => {
  if (d === "ELIGIBLE") return "#22C55E"; // green
  if (d === "REVIEW") return "#EAB308";   // yellow
  return "#EF4444";                      // red
};



  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden", bgcolor: "#EEF2F7" }}>
      {/* Background */}
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

      <AppHeader showLogout pageTitle="LOAN APPLICATION" />

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
          {/* Stepper header + progress */}
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
              spacing={2.2}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography sx={{ fontWeight: 950, fontSize: 20, color: "rgba(20,35,55,0.92)" }}>
                  Guided application
                </Typography>
                <Typography sx={{ mt: 0.3, color: "rgba(20,35,55,0.70)" }}>
                  Complete steps and review before submitting.
                </Typography>
              </Box>

              <Box sx={{ width: { xs: "100%", md: 520 } }}>
                <Typography sx={{ color: "rgba(20,35,55,0.70)", fontWeight: 900, mb: 0.8 }}>
                  Progress: {completion}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={completion}
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: "rgba(15,25,40,0.08)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #1D4ED8, #2563EB, #0EA5E9)",
                    },
                  }}
                />
              </Box>
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(15,25,40,0.10)" }} />

            <Stepper activeStep={step} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": { fontWeight: 900, color: "rgba(20,35,55,0.78)" },
                      "& .MuiStepIcon-root": { color: "rgba(29,78,216,0.75)" },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Two-column layout */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 420px" },
              gap: 2.2,
              alignItems: "start",
            }}
          >
            {/* Step card */}
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
                <Typography sx={{ fontWeight: 950, fontSize: 18, color: "#0F172A" }}>
                  {step === 0 ? "Applicant" : step === 1 ? "Financial details" : "Review & submit"}
                </Typography>
                <Typography sx={{ mt: 0.4, color: "rgba(15,23,42,0.62)" }}>
                  {step === 0
                    ? "Enter your identity and loan purpose."
                    : step === 1
                    ? "Provide financial data used for eligibility indicators."
                    : "Confirm details, then submit the application."}
                </Typography>
              </Box>

              <Box sx={{ px: { xs: 2.2, sm: 2.8 }, py: { xs: 2.2, sm: 2.6 } }}>
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {step === 0 && (
                  <Stack
                    spacing={2.2}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.4,
                        backgroundColor: "rgba(241,245,249,0.9)",
                      },
                    }}
                  >
                    <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <FormControl fullWidth>
                        <InputLabel>Purpose</InputLabel>
                        <Select value={purpose} label="Purpose" onChange={(e) => setPurpose(e.target.value as Purpose)}>
                          <MenuItem value="HOME">Home</MenuItem>
                          <MenuItem value="AUTO">Auto</MenuItem>
                          <MenuItem value="PERSONAL">Personal</MenuItem>
                          <MenuItem value="EDUCATION">Education</MenuItem>
                          <MenuItem value="MEDICAL">Medical</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel>Employment</InputLabel>
                        <Select
                          value={employmentType}
                          label="Employment"
                          onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                        >
                          <MenuItem value="SALARIED">Salaried</MenuItem>
                          <MenuItem value="SELF_EMPLOYED">Self-Employed</MenuItem>
                          <MenuItem value="STUDENT">Student</MenuItem>
                          <MenuItem value="UNEMPLOYED">Unemployed</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: "rgba(15,23,42,0.03)",
                        border: "1px solid rgba(15,23,42,0.08)",
                      }}
                    >
                      
                      <Typography sx={{ mt: 0.4, color: "rgba(15,23,42,0.62)" }}>
                        *Use your legal name as it appears on your documents.
                      </Typography>
                    </Paper>
                  </Stack>
                )}

                {step === 1 && (
                  <Stack
                    spacing={2.2}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2.4,
                        backgroundColor: "rgba(241,245,249,0.9)",
                      },
                    }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField label="Loan Amount ($)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />
                      <TextField label="Tenure (Months)" type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} fullWidth />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField label="Monthly Income ($)" type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} fullWidth />
                      <TextField label="Monthly Debt Payments ($)" type="number" value={monthlyDebt} onChange={(e) => setMonthlyDebt(e.target.value)} fullWidth />
                    </Stack>

                    <TextField label="Credit Score (300 - 850)" type="number" value={creditScore} onChange={(e) => setCreditScore(e.target.value)} fullWidth />

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background: "rgba(29,78,216,0.06)",
                        border: "1px solid rgba(29,78,216,0.12)",
                      }}
                    >
                      <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>*Privacy note</Typography>
                      <Typography sx={{ mt: 0.4, color: "rgba(15,23,42,0.62)" }}>
                        Preview only. Final eligibility is determined by analyst review.
                      </Typography>
                    </Paper>
                  </Stack>
                )}

                {step === 2 && (
                  <Stack spacing={2}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.2,
                        borderRadius: 3,
                        background: "rgba(15,23,42,0.03)",
                        border: "1px solid rgba(15,23,42,0.08)",
                      }}
                    >
                      <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>Review</Typography>
                      <Divider sx={{ my: 1.6, borderColor: "rgba(15,23,42,0.10)" }} />

                      <Stack spacing={1.2}>
                        <StatRow label="Applicant" value={fullName || "—"} />
                        <StatRow label="Purpose" value={purpose} />
                        <StatRow label="Employment" value={employmentType} />
                        <Divider sx={{ my: 0.8, borderColor: "rgba(15,23,42,0.10)" }} />
                        <StatRow label="Amount" value={amount ? `$${Number(amount).toLocaleString()}` : "—"} />
                        <StatRow label="Tenure" value={tenure ? `${tenure} months` : "—"} />
                        <StatRow label="Income" value={monthlyIncome ? `$${Number(monthlyIncome).toLocaleString()}/mo` : "—"} />
                        <StatRow label="Debt" value={monthlyDebt ? `$${Number(monthlyDebt).toLocaleString()}/mo` : "—"} />
                        <StatRow label="Credit Score" value={creditScore || "—"} />
                      </Stack>
                    </Paper>

                    <Typography sx={{ color: "rgba(15,23,42,0.62)" }}>
                      Submit to send your application for analyst review.
                    </Typography>
                  </Stack>
                )}

                <Divider sx={{ my: 2.4, borderColor: "rgba(15,25,40,0.10)" }} />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.4}>
                  <Button
                    variant="outlined"
                    onClick={reset}
                    sx={{
                      textTransform: "none",
                      fontWeight: 950,
                      borderRadius: 2.5,
                      py: 1.15,
                      color: "#0F172A",
                      borderColor: "rgba(15,23,42,0.22)",
                      "&:hover": { borderColor: "rgba(15,23,42,0.35)" },
                    }}
                  >
                    Reset
                  </Button>

                  <Box sx={{ flex: 1 }} />

                  <Button
                    variant="contained"
                    disabled={step === 0}
                    onClick={() => setStep((s) => (Math.max(0, s - 1) as StepKey))}
                    sx={{
                      textTransform: "none",
                      fontWeight: 950,
                      borderRadius: 2.5,
                      py: 1.15,
                      background: "linear-gradient(180deg, rgba(245,247,252,1), rgba(230,236,247,1))",
                      color: "rgba(20,35,55,0.85)",
                      border: "1px solid rgba(15,25,40,0.10)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
                      "&:hover": {
                        background: "linear-gradient(180deg, rgba(238,242,250,1), rgba(224,232,246,1))",
                      },
                    }}
                  >
                    Back
                  </Button>

                  {step < 2 ? (
                    <Button
                      variant="contained"
                      disabled={!stepValid}
                      onClick={() => setStep((s) => (Math.min(2, s + 1) as StepKey))}
                      sx={{
                        textTransform: "none",
                        fontWeight: 950,
                        borderRadius: 2.5,
                        py: 1.15,
                        background: "linear-gradient(90deg, #1D4ED8, #2563EB, #0EA5E9)",
                        boxShadow: "0 14px 26px rgba(37,99,235,0.20)",
                        "&:hover": {
                          background: "linear-gradient(90deg, #1E40AF, #1D4ED8, #0284C7)",
                        },
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={submit}
                      disabled={submitting}
                      sx={{
                        textTransform: "none",
                        fontWeight: 950,
                        borderRadius: 2.5,
                        py: 1.15,
                        background: "linear-gradient(90deg, #1D4ED8, #2563EB, #0EA5E9)",
                        boxShadow: "0 14px 26px rgba(37,99,235,0.20)",
                        "&:hover": {
                          background: "linear-gradient(90deg, #1E40AF, #1D4ED8, #0284C7)",
                        },
                      }}
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Paper>

            {/* Sticky summary (REPLACE YOUR CURRENT ONE WITH THIS) */}
<Box sx={{ position: { lg: "sticky", xs: "static" }, top: { lg: 92, xs: "auto" } }}>
  <Paper
    elevation={0}
    sx={{
      borderRadius: 3.6,
      overflow: "hidden",
      border: "1px solid rgba(15,25,40,0.10)",
      boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(248,250,255,0.72) 100%)",
    }}
  >
    {/* Header */}
    <Box
      sx={{
        px: 2.4,
        py: 1.9,
        borderBottom: "1px solid rgba(15,25,40,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.80), rgba(255,255,255,0.58))",
      }}
    >
      <Typography sx={{ fontWeight: 950, fontSize: 16, color: "#0F172A", lineHeight: 1.05 }}>
        Summary
      </Typography>
      <Typography sx={{ mt: 0.45, color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
        Quick overview before you submit.
      </Typography>
    </Box>

    <Box sx={{ p: 2.4 }}>
      {/* Compact identity */}
      <Paper
        elevation={0}
        sx={{
          p: 1.6,
          borderRadius: 3,
          border: "1px solid rgba(15,23,42,0.08)",
          background: "rgba(15,23,42,0.03)",
          mb: 1.6,
        }}
      >
        <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.88)" }}>
          {fullName ? fullName : "Applicant name"}
        </Typography>
        <Typography sx={{ mt: 0.35, color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
          Employment: <b>{employmentType}</b> • Purpose: <b>{purpose}</b>
        </Typography>
      </Paper>

      {/* Key loan facts (minimal + clean) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1.2,
          mb: 1.8,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 1.4,
            borderRadius: 3,
            background: "rgba(255,255,255,0.70)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.58)" }}>
            Loan amount
          </Typography>
          <Typography sx={{ mt: 0.35, fontWeight: 950, color: "rgba(15,23,42,0.88)" }}>
            {amount ? `$${Number(amount).toLocaleString()}` : "—"}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 1.4,
            borderRadius: 3,
            background: "rgba(255,255,255,0.70)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.58)" }}>
            Tenure
          </Typography>
          <Typography sx={{ mt: 0.35, fontWeight: 950, color: "rgba(15,23,42,0.88)" }}>
            {tenure ? `${tenure} months` : "—"}
          </Typography>
        </Paper>
      </Box>

      {/* Decision (minimal) */}
      {!analysis ? (
        <Paper
          elevation={0}
          sx={{
            p: 1.8,
            borderRadius: 3,
            background: "rgba(255,255,255,0.65)",
            border: "1px dashed rgba(15,23,42,0.18)",
          }}
        >
          <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
            Eligibility preview
          </Typography>
          <Typography sx={{ mt: 0.45, color: "rgba(15,23,42,0.62)", fontSize: 13 }}>
            Complete financial fields to see the pre-decision and APR.
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 1.8,
            borderRadius: 3,
            border: "1px solid rgba(15,23,42,0.10)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.74), rgba(245,248,255,0.62))",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.2}>
            <Typography sx={{ fontWeight: 950, color: "rgba(15,23,42,0.86)" }}>
              Pre-decision
            </Typography>
            <DecisionChip decision={analysis.decision} />
          </Stack>

          <Typography sx={{ mt: 1.0, fontSize: 13, color: "rgba(15,23,42,0.62)" }}>
            Recommended APR*: <b style={{ color: "rgba(15,23,42,0.88)" }}>{analysis.rate}%</b>
          </Typography>

          {/* Clean meter (no risk number) */}
          <Box sx={{ mt: 1.4 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(15,23,42,0.58)", mb: 0.7 }}>
              Risk indicator
            </Typography>
            <LinearProgress
              variant="determinate"
              value={analysis.risk}
              sx={{
                height: 10,
                borderRadius: 999,
                backgroundColor: "rgba(15,25,40,0.08)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  backgroundColor: decisionBarColor(analysis.decision),
                },
              }}
            />
          </Box>

          <Typography sx={{ mt: 1.1, fontSize: 12.5, color: "rgba(15,23,42,0.55)" }}>
            *Preview only. Final approval is done by the bank team.
          </Typography>
        </Paper>
      )}
    </Box>
  </Paper>
</Box>

          </Box>
        </Box>
      </Container>

      <Dialog open={showSuccessModal} onClose={closeSuccessModal}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Application Submitted
          <IconButton onClick={closeSuccessModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Your loan application has been submitted successfully. Our analysts will review it shortly.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
