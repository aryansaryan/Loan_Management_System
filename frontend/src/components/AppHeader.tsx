import React from "react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import logo from "../assets/logomain.png";
import { clearAuth } from "../lib/auth/authStorage";

type Props = {
  pageTitle?: string;
  showLogout?: boolean;
  showCreateAccount?: boolean;
};

export default function AppHeader({
  pageTitle,
  showLogout,
  showCreateAccount,
}: Props) {
  const nav = useNavigate();

  return (
    <Box sx={{ position: "relative", zIndex: 3, px: 2.5, pt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          mx: "auto",
          maxWidth: 1280,
          borderRadius: 999,
          px: 2.2,
          py: 1.2,
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          overflow: "visible",
          position: "relative",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,247,252,0.85))",
          border: "1px solid rgba(15,25,40,0.10)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.10)",
        }}
      >
        {/* Logo */}
        <Stack direction="row" alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            component="img"
            src={logo}
            alt="Loan Management System"
            onClick={() => nav("/")}
            sx={{
              height: 60,
              width: "auto",
              objectFit: "contain",
              cursor: "pointer",
              display: "block",
              transform: "scale(2)",
              transformOrigin: "left center",
            }}
          />
        </Stack>

        {/* Page title */}
        <Box sx={{ display: "flex", justifyContent: "center", minWidth: 0 }}>
          {pageTitle ? (
            <Typography
              noWrap
              sx={{
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.73)",
                px: 1,
              }}
            >
              {pageTitle}
            </Typography>
          ) : null}
        </Box>

        {/* Actions */}
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ minWidth: "max-content" }}
        >
          {showCreateAccount ? (
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
              Create Account
            </Button>
          ) : null}

          {showLogout ? (
            <Button
              onClick={() => {
                clearAuth();
                nav("/login");
              }}
              startIcon={<LogoutRoundedIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                color: "rgba(20,35,55,0.75)",
                "&:hover": { background: "rgba(15,25,40,0.06)" },
              }}
            >
              Logout
            </Button>
          ) : null}
        </Stack>
      </Paper>
    </Box>
  );
}
