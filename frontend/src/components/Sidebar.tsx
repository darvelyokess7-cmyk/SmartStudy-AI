import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteIcon from "@mui/icons-material/Note";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SchoolIcon from "@mui/icons-material/School";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    {
      text: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
    },
    {
      text: "Documents",
      path: "/documents",
      icon: <DescriptionIcon />,
    },
    {
      text: "SmartStudy AI",
      path: "/ai",
      icon: <SmartToyIcon />,
    },
    {
      text: "Notes",
      path: "/notes",
      icon: <NoteIcon />,
    },
    {
      text: "Quiz",
      path: "/quiz",
      icon: <QuizIcon />,
    },
    {
      text: "Progress",
      path: "/progress",
      icon: <TrendingUpIcon />,
    },
  ];

  const accountMenu = [
    {
      text: "Profile",
      path: "/profile",
      icon: <PersonIcon />,
    },
    {
      text: "Settings",
      path: "/settings",
      icon: <SettingsIcon />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const renderMenu = (items: any[]) =>
    items.map((item) => {
      const isActive = location.pathname === item.path;

      return (
        <ListItemButton
          key={item.path}
          component={Link}
          to={item.path}
          sx={{
            mx: 1.5,
            mb: 0.7,
            minHeight: 48,
            borderRadius: "10px",
            color: isActive ? "#FFFFFF" : "#CBD5E1",
            backgroundColor: isActive
              ? "#4F46E5"
              : "transparent",

            transition: "all 0.2s ease",

            "&:hover": {
              backgroundColor: isActive
                ? "#4338CA"
                : "#263B72",
              color: "#FFFFFF",
              transform: "translateX(3px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 42,
              color: isActive ? "#FFFFFF" : "#94A3B8",
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.text}
            sx={{

              "& .MuiListItemText-primary": {
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
              },
            }}
          />
        </ListItemButton>
      );
    });

  return (
    <Box
      sx={{
        width: 250,
        minHeight: "100vh",
        backgroundColor: "#172554",
        color: "white",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 15px rgba(0,0,0,0.08)",
      }}
    >
      {/* LOGO */}
      <Box
        sx={{
          px: 3,
          py: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            backgroundColor: "#4F46E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SchoolIcon sx={{ fontSize: 25 }} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            SmartStudy
          </Typography>

          <Typography
            sx={{
              fontSize: "11px",
              color: "#94A3B8",
            }}
          >
            AI Learning Assistant
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor: "#263B72",
          mx: 2,
        }}
      />

      {/* MAIN MENU */}
      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            px: 3,
            mb: 1,
            fontSize: "11px",
            fontWeight: 600,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Main Menu
        </Typography>

        <List disablePadding>
          {renderMenu(menu)}
        </List>
      </Box>

      {/* ACCOUNT */}
      <Box sx={{ mt: 2 }}>
        <Typography
          sx={{
            px: 3,
            mb: 1,
            fontSize: "11px",
            fontWeight: 600,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Account
        </Typography>

        <List disablePadding>
          {renderMenu(accountMenu)}
        </List>
      </Box>

      {/* LOGOUT */}
      <Box sx={{ mt: "auto", pb: 2 }}>
        <Divider
          sx={{
            borderColor: "#263B72",
            mx: 2,
            mb: 1,
          }}
        />

        <ListItemButton
          onClick={handleLogout}
          sx={{
            mx: 1.5,
            borderRadius: "10px",
            color: "#CBD5E1",
            minHeight: 48,

            "&:hover": {
              backgroundColor: "#7F1D1D",
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 42,
              color: "#94A3B8",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            sx={{

              "& .MuiListItemText-primary": {
                fontSize: "14px",
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}