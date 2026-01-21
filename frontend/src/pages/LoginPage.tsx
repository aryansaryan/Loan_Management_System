// src/pages/LoginPage.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

import { login } from "../lib/api/auth";
import { setAuth } from "../lib/auth/authStorage";

import bg from "../assets/homepage.png";
import logo from "../assets/logomain.png";

function InfoCard(props: { title: string; subtitle: string; icon: React.ReactNode }) {
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
            background:
              "linear-gradient(180deg, rgba(245,248,255,1), rgba(230,238,255,1))",
            border: "1px solid rgba(40,70,120,0.10)",
            color: "rgba(35,55,90,0.9)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
          }}
        >
          {props.icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, color: "rgba(25,35,55,0.92)" }}>
            {props.title}
          </Typography>
          <Typography sx={{ mt: 0.3, fontSize: 13, color: "rgba(25,35,55,0.62)" }}>
            {props.subtitle}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function LoginPage() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      const data = await login({ username, password });
      const role = (data.role ?? "").toString().toUpperCase().replace("ROLE_", "");

      setAuth(data.token, data.role, data.username);

      if (role === "ADMIN") nav("/admin");
      else if (role === "ANALYST") nav("/analyst");
      else nav("/dashboard");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Login failed. Check username/password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#EEF2F7",
      }}
    >
      {/* Background */}
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

      {/* Soft wash overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.34) 45%, rgba(255,255,255,0.00) 100%)," +
            "linear-gradient(90deg, rgba(255,255,255,0.23) 0%, rgba(255,255,255,0.26) 40%, rgba(255,255,255,0.17) 75%, rgba(255,255,255,0.00) 100%)," +
            "radial-gradient(1100px 520px at 20% 110%, rgba(40,69,120,0.00), rgba(0,0,0,0) 60%)",
        }}
      />

      {/* Header */}
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
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,247,252,0.85))",
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
              onClick={() => nav("/signup")}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                color: "rgba(20,35,55,0.75)",
                "&:hover": { background: "rgba(15,25,40,0.06)" },
              }}
            >
              Create account
            </Button>

            <Button
              onClick={() => nav("/login")}
              variant="contained"
              endIcon={<EastRoundedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: 999,
                px: 2.2,
                py: 1.05,
                background:
                  "linear-gradient(180deg, rgba(245,247,252,1), rgba(230,236,247,1))",
                color: "rgba(20,35,55,0.85)",
                border: "1px solid rgba(15,25,40,0.10)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.10)",
                "&:hover": {
                  background:
                    "linear-gradient(180deg, rgba(238,242,250,1), rgba(224,232,246,1))",
                },
              }}
            >
              Login
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Main */}
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 2.5, sm: 3.5 },
          pt: { xs: 6, md: 7 },
          pb: { xs: 6, md: 7 },
        }}
      >
        <Box
          sx={{
            mx: "auto",
            maxWidth: 1280,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
          }}
        >
          {/* Left: form */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(245,247,252,0.78))",
              border: "1px solid rgba(15,25,40,0.10)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
            }}
          >
            <Typography sx={{ fontWeight: 950, fontSize: 26, color: "rgba(20,35,55,0.92)" }}>
              Welcome back
            </Typography>
            <Typography sx={{ mt: 0.6, color: "rgba(20,35,55,0.65)" }}>
              Sign in to access your dashboard.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 2.2 }}>
                {error}
              </Alert>
            )}

            <Stack
              spacing={2}
              sx={{
                mt: 2.2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  backgroundColor: "rgba(255,255,255,0.75)",
                },
              }}
            >
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                autoComplete="username"
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
              />

              <Button
                onClick={submit}
                size="large"
                variant="contained"
                endIcon={<EastRoundedIcon />}
                sx={{
                  mt: 0.5,
                  py: 1.25,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 900,
                  background:
                    "linear-gradient(180deg, rgba(245,247,252,1), rgba(230,236,247,1))",
                  color: "rgba(20,35,55,0.85)",
                  border: "1px solid rgba(15,25,40,0.10)",
                  boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
                  "&:hover": {
                    background:
                      "linear-gradient(180deg, rgba(238,242,250,1), rgba(224,232,246,1))",
                  },
                }}
              >
                Login
              </Button>

              <Button
                component={RouterLink}
                to="/signup"
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  color: "rgba(20,35,55,0.80)",
                  "&:hover": { background: "rgba(15,25,40,0.06)" },
                }}
              >
                New user? Create account
              </Button>

              <Typography variant="caption" sx={{ textAlign: "center", color: "rgba(20,35,55,0.55)" }}>
                By signing in, you agree to our Terms &amp; Privacy Policy.
              </Typography>
            </Stack>
          </Paper>

          {/* Right: cards */}
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "stretch", md: "flex-end" },
              alignItems: "center",
            }}
          >
            <Stack
              spacing={2.2}
              sx={{
                width: "100%",
                maxWidth: { xs: 520, md: 420 },
                mt: { xs: 2, md: 0 },
              }}
            >
              <InfoCard
                title="Secure access"
                subtitle="Protected sessions and auth tokens"
                icon={<LockRoundedIcon />}
              />
              <InfoCard
                title="Role-based routing"
                subtitle="Admin, Analyst, and Customer dashboards"
                icon={<VerifiedUserRoundedIcon />}
              />
              <InfoCard
                title="Quick sign-in"
                subtitle="Start where you left off"
                icon={<PersonRoundedIcon />}
              />
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
