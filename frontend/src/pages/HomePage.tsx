import React from "react";
import { Box, Container, Typography, Button, Stack, Chip, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

import bg from "../assets/homepage.png";
import logo from "../assets/logomain.png";

function WorkflowCard({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        px: 2.2,
        py: 1.8,
        width: { xs: "100%", md: 360 },
        background: "linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0))",
        border: "1px solid rgba(255,255,255,0)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        backdropFilter: "blur(1px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <Stack direction="row" spacing={1.6} alignItems="center">
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2.2,
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(180deg, rgba(245,248,255,1), rgba(230,238,255,1))",
            border: "1px solid rgba(40,70,120,0.10)",
            color: "rgba(35,55,90,0.9)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, color: "rgba(25,35,55,0.92)" }}>{title}</Typography>
          <Typography sx={{ mt: 0.3, fontSize: 13, color: "rgba(25,35,55,0.62)" }}>{subtitle}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function HomePage() {
  const nav = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden", bgcolor: "#EEF2F7" }}>
      {/* Photo layer */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${bg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "brightness(1.05) contrast(1.05) saturate(1.02)",
          transform: "translateZ(0)",
        }}
      />

      {/* Readability overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.34) 45%, rgba(255,255,255,0) 100%)," +
            "linear-gradient(90deg, rgba(255,255,255,0.23) 0%, rgba(255,255,255,0.26) 40%, rgba(255,255,255,0.17) 75%, rgba(255,255,255,0.00) 100%)," +
            "radial-gradient(900px 500px at 30% 35%, rgba(90,159,255,0), rgba(0,0,0,0) 60%)," +
            "radial-gradient(1100px 520px at 20% 110%, rgba(40,69,120,0), rgba(0,0,0,0) 60%)",
        }}
      />

      {/* Top bar */}
      <Box sx={{ position: "relative", zIndex: 2, px: 2.5, pt: 2 }}>
        <Paper
          elevation={0}
          sx={{
            mx: "auto",
            maxWidth: 1280,
            borderRadius: 999,
            px: 2.2,
            py: 1.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            overflow: "visible",
            position: "relative",
            background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,247,252,0.85))",
            border: "1px solid rgba(15,25,40,0.10)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.10)",
          }}
        >
          <Stack direction="row" alignItems="center">
            <Box
              component="img"
              src={logo}
              alt="Loan Management System Logo"
              onClick={() => nav("/")}
              sx={{
                height: 60,
                width: "auto",
                objectFit: "contain",
                cursor: "pointer",
                display: "block",
                transform: "scale(2.0)",
                transformOrigin: "left center",
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.4} alignItems="center">
            <Button
              onClick={() => nav("/login")}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                color: "rgba(20,35,55,0.75)",
                "&:hover": { background: "rgba(15,25,40,0.06)" },
              }}
            >
              Login
            </Button>

            <Button
              onClick={() => nav("/signup")}
              variant="contained"
              endIcon={<EastRoundedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: 999,
                px: 2.2,
                py: 1.05,
                background: "linear-gradient(180deg, rgba(245,247,252,1), rgba(230,236,247,1))",
                color: "rgba(20,35,55,0.85)",
                border: "1px solid rgba(15,25,40,0.10)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
                "&:hover": {
                  background: "linear-gradient(180deg, rgba(238,242,250,1), rgba(224,232,246,1))",
                },
              }}
            >
              Create Account
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Hero */}
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2.5, sm: 3.5 },
          pt: { xs: 6, md: 8 },
          pb: { xs: 6, md: 7 },
        }}
      >
        <Box
          sx={{
            mx: "auto",
            maxWidth: 1280,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          {/* Copy */}
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<LockRoundedIcon sx={{ color: "inherit" }} />}
                label="Bank-grade security"
                sx={{
                  background: "rgba(255,255,255,0.70)",
                  border: "1px solid rgba(15,25,40,0.10)",
                  fontWeight: 700,
                  color: "rgba(20,35,55,0.80)",
                }}
              />
              <Chip
                icon={<VerifiedUserRoundedIcon sx={{ color: "inherit" }} />}
                label="Role-based access"
                sx={{
                  background: "rgba(255,255,255,0.70)",
                  border: "1px solid rgba(15,25,40,0.10)",
                  fontWeight: 700,
                  color: "rgba(20,35,55,0.80)",
                }}
              />
              <Chip
                icon={<BoltRoundedIcon sx={{ color: "inherit" }} />}
                label="Fast decisions"
                sx={{
                  background: "rgba(255,255,255,0.70)",
                  border: "1px solid rgba(15,25,40,0.10)",
                  fontWeight: 700,
                  color: "rgba(20,35,55,0.80)",
                }}
              />
            </Stack>

            <Typography
              sx={{
                mt: 2.4,
                fontWeight: 950,
                lineHeight: 1.05,
                letterSpacing: -1.0,
                fontSize: { xs: 44, sm: 56, md: 66 },
                color: "rgba(20,35,55,0.92)",
              }}
            >
              <Box
                component="span"
                sx={{
                  background: "linear-gradient(180deg, #1D4E89 0%, #2F6CB6 55%, #3E7FD6 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Finance.
              </Box>{" "}
              <Box component="span" sx={{ color: "rgba(20,35,55,0.85)" }}>
                Reimagined.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 640,
                fontSize: { xs: 15, sm: 16.5 },
                lineHeight: 1.7,
                color: "rgba(20,35,55,0.70)",
              }}
            >
              Apply for loans, track status, and manage approvals with a clean, secure workflow for customers and bank
              teams.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6} sx={{ mt: 3.2, maxWidth: 620 }}>
              <Button
                size="large"
                onClick={() => nav("/login")}
                variant="contained"
                endIcon={<EastRoundedIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  borderRadius: 2.5,
                  px: 2.6,
                  py: 1.25,
                  background: "linear-gradient(180deg, rgba(245,247,252,1), rgba(230,236,247,1))",
                  color: "rgba(20,35,55,0.85)",
                  border: "1px solid rgba(15,25,40,0.10)",
                  boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
                  "&:hover": {
                    background: "linear-gradient(180deg, rgba(238,242,250,1), rgba(224,232,246,1))",
                  },
                }}
              >
                Continue
              </Button>

              <Button
                size="large"
                onClick={() => nav("/signup")}
                variant="contained"
                endIcon={<EastRoundedIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  borderRadius: 2.5,
                  px: 2.6,
                  py: 1.25,
                  background: "linear-gradient(180deg, rgba(245,247,252,1), rgba(230,236,247,1))",
                  color: "rgba(20,35,55,0.85)",
                  border: "1px solid rgba(15,25,40,0.10)",
                  boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
                  "&:hover": {
                    background: "linear-gradient(180deg, rgba(238,242,250,1), rgba(224,232,246,1))",
                  },
                }}
              >
                Create Account
              </Button>
            </Stack>
          </Box>

          {/* Flow cards */}
          <Box sx={{ display: "flex", justifyContent: { xs: "stretch", md: "flex-end" }, alignItems: "center" }}>
            <Stack spacing={2.2} sx={{ width: "100%", maxWidth: { xs: 520, md: 420 }, mt: { xs: 3, md: 0 } }}>
              <WorkflowCard title="Application" subtitle="Customer submits request" icon={<PersonRoundedIcon />} />
              <WorkflowCard title="Review" subtitle="Analyst checks eligibility" icon={<CheckRoundedIcon />} />
              <WorkflowCard title="Approval" subtitle="Decision & status update" icon={<TaskAltRoundedIcon />} />
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
