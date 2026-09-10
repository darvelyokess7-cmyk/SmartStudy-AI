import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Badge,
  Divider,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SchoolIcon from "@mui/icons-material/School";

import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/documents": "Documents",
    "/ai": "SmartStudy AI",
    "/notes": "Notes",
    "/quiz": "Quiz",
    "/progress": "Progress",
    "/profile": "Profile",
    "/settings": "Settings",
  };

  const currentPage = pageTitles[location.pathname] || "SmartStudy";

  const fullName = user.fullName || "Student";

  const initial = fullName
    .charAt(0)
    .toUpperCase();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#111827",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px",
          display: "flex",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
        }}
      >

        {/* LEFT SIDE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              backgroundColor: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SchoolIcon
              sx={{
                color: "#4F46E5",
                fontSize: 23,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
                lineHeight: 1.2,
              }}
            >
              {currentPage}
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                color: "#64748B",
              }}
            >
              SmartStudy AI
            </Typography>
          </Box>
        </Box>

        {/* RIGHT SIDE */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >

          {/* NOTIFICATION */}
          <IconButton
            sx={{
              width: 42,
              height: 42,
              color: "#64748B",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",

              "&:hover": {
                backgroundColor: "#F8FAFC",
                color: "#4F46E5",
              },
            }}
          >
            <Badge
              variant="dot"
              color="primary"
            >
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 0.5,
              borderColor: "#E5E7EB",
            }}
          />

          {/* USER */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                textAlign: "right",
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {fullName}
              </Typography>

              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#64748B",
                }}
              >
                Student
              </Typography>
            </Box>

            <Avatar
              sx={{
                width: 42,
                height: 42,
                backgroundColor: "#4F46E5",
                fontWeight: 600,
                fontSize: "16px",
                boxShadow:
                  "0 2px 6px rgba(79,70,229,0.25)",
              }}
            >
              {initial}
            </Avatar>
          </Box>

        </Box>
      </Toolbar>
    </AppBar>
  );
}