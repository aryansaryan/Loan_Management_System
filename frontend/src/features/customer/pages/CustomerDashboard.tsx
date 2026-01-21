import React from "react";
import { Box, Container, Paper, Typography, Button, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../../components/AppHeader";
import { getAuth } from "../../../lib/auth/authStorage";
import bg from "../../../assets/homepage.png";

export default function CustomerDashboard() {
  const nav = useNavigate();
  const { username } = getAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#EEF2F7",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background + overlay to keep text readable. */}
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
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.34) 45%, rgba(255,255,255,0.00) 100%)," +
            "linear-gradient(90deg, rgba(255,255,255,0.23) 0%, rgba(255,255,255,0.26) 40%, rgba(255,255,255,0.17) 75%, rgba(255,255,255,0.00) 100%)," +
            "radial-gradient(1100px 520px at 20% 110%, rgba(40,69,120,0.00), rgba(0,0,0,0) 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Header sits above the backdrop. */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <AppHeader showLogout pageTitle="CUSTOMER DASHBOARD" />
      </Box>

      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          px: { xs: 2.5, sm: 3.5 },
          py: { xs: 4, md: 6 },
          display: "grid",
          alignItems: "center",
        }}
      >
        <Box sx={{ mx: "auto", maxWidth: 1280, width: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              background: "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(245,247,252,0.78))",
              border: "1px solid rgba(15,25,40,0.10)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 950,
                lineHeight: 1.05,
                letterSpacing: -0.6,
                fontSize: { xs: 26, sm: 32, md: 36 },
                color: "rgba(20,35,55,0.92)",
              }}
            >
              Welcome, {username || "Customer"}
            </Typography>

            <Typography sx={{ mt: 0.8, color: "rgba(20,35,55,0.65)" }}>
              Logged in as <b>{username || "-"}</b>
            </Typography>

            <Divider sx={{ my: 3, borderColor: "rgba(15,25,40,0.10)" }} />

            {/* Primary customer actions. */}
            <Stack spacing={2.2}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.4,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(15,25,40,0.10)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                }}
              >
                <Typography sx={{ fontWeight: 900, color: "rgba(20,35,55,0.90)" }}>
                  Apply for a Loan
                </Typography>
                <Typography sx={{ mt: 0.5, color: "rgba(20,35,55,0.65)" }}>
                  Start a new application.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => nav("/loan-application")}
                  sx={actionBtnSx}
                >
                  New Application
                </Button>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 2.4,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.72)",
                  border: "1px solid rgba(15,25,40,0.10)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                }}
              >
                <Typography sx={{ fontWeight: 900, color: "rgba(20,35,55,0.90)" }}>
                  My Applications
                </Typography>
                <Typography sx={{ mt: 0.5, color: "rgba(20,35,55,0.65)" }}>
                  Check status and history.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => nav("/application-status")}
                  sx={actionBtnSx}
                >
                  View Status
                </Button>
              </Paper>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

const actionBtnSx = {
  mt: 1.8,
  textTransform: "none",
  fontWeight: 900,
  borderRadius: 2.5,
  px: 3,
  py: 1.1,
  background: "linear-gradient(180deg, rgba(245,247,252,1), rgba(230,236,247,1))",
  color: "rgba(20,35,55,0.85)",
  border: "1px solid rgba(15,25,40,0.10)",
  boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
  "&:hover": {
    background: "linear-gradient(180deg, rgba(238,242,250,1), rgba(224,232,246,1))",
  },
} as const;
