import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  Switch,
  FormControl,
  TextField,
  Alert,
  MenuItem,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";

function Settings() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  const [message, setMessage] = useState("");


  useEffect(() => {
    // Load user
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedDarkMode === "true") {
      setDarkMode(true);
    }

    const savedNotifications =
      localStorage.getItem("notifications");

    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }

    const savedLanguage =
      localStorage.getItem("language");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      darkMode.toString()
    );
  }, [darkMode]);


  const handleSave = () => {
    localStorage.setItem(
      "notifications",
      notifications.toString()
    );

    localStorage.setItem(
      "language",
      language
    );

    localStorage.setItem(
      "darkMode",
      darkMode.toString()
    );

    setMessage("Settings saved successfully!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const backgroundColor = darkMode
    ? "#111827"
    : "#F8FAFC";

  const cardColor = darkMode
    ? "#1F2937"
    : "#FFFFFF";

  const textColor = darkMode
    ? "#FFFFFF"
    : "#111827";

  const secondaryTextColor = darkMode
    ? "#CBD5E1"
    : "#6B7280";

  const borderColor = darkMode
    ? "#374151"
    : "#E5E7EB";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor,
        transition: "all 0.3s ease",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
    >

      {/* =========================
          HEADER
      ========================= */}

      <Box sx={{ mb: 4 }}>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
          }}
        >

          <Avatar
            sx={{
              width: 52,
              height: 52,
              background:
                "linear-gradient(135deg, #2563EB, #4F46E5)",
            }}
          >
            <SettingsIcon />
          </Avatar>

          <Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: textColor,
              }}
            >
              Settings
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: secondaryTextColor,
              }}
            >
              Manage your SmartStudy account and preferences.
            </Typography>

          </Box>
        </Box>
      </Box>

      {/* =========================
          SUCCESS MESSAGE
      ========================= */}

      {message && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {message}
        </Alert>
      )}

      {/* =========================
          ACCOUNT INFORMATION
      ========================= */}

      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: cardColor,
          border: `1px solid ${borderColor}`,
          boxShadow: darkMode
            ? "0 4px 15px rgba(0,0,0,0.2)"
            : "0 4px 15px rgba(0,0,0,0.04)",
          mb: 3,
        }}
      >

        <CardContent
          sx={{
            p: { xs: 3, md: 4 },
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >

            <Avatar
              sx={{
                backgroundColor: darkMode
                  ? "#312E81"
                  : "#EEF2FF",
                color: "#4F46E5",
              }}
            >
              <PersonIcon />
            </Avatar>

            <Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: textColor,
                }}
              >
                Account Information
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: secondaryTextColor,
                }}
              >
                Your SmartStudy account details.
              </Typography>

            </Box>

          </Box>

          <Divider sx={{ mb: 3 }} />

          {user ? (

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 1fr",
                },
                gap: 3,
              }}
            >

              {/* FULL NAME */}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: darkMode
                    ? "#111827"
                    : "#F8FAFC",
                }}
              >

                <Typography
                  variant="caption"
                  sx={{
                    color: secondaryTextColor,
                  }}
                >
                  Full Name
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: textColor,
                    mt: 0.5,
                  }}
                >
                  {user.fullName || "Not available"}
                </Typography>

              </Box>

              {/* EMAIL */}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: darkMode
                    ? "#111827"
                    : "#F8FAFC",
                }}
              >

                <Typography
                  variant="caption"
                  sx={{
                    color: secondaryTextColor,
                  }}
                >
                  Email
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: textColor,
                    mt: 0.5,
                  }}
                >
                  {user.email || "Not available"}
                </Typography>

              </Box>

            </Box>

          ) : (

            <Typography
              sx={{
                color: secondaryTextColor,
              }}
            >
              No account information available.
            </Typography>

          )}

        </CardContent>
      </Card>

      {/* =========================
          PREFERENCES
      ========================= */}

      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: cardColor,
          border: `1px solid ${borderColor}`,
          boxShadow: darkMode
            ? "0 4px 15px rgba(0,0,0,0.2)"
            : "0 4px 15px rgba(0,0,0,0.04)",
          mb: 3,
        }}
      >

        <CardContent
          sx={{
            p: { xs: 3, md: 4 },
          }}
        >

          {/* TITLE */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >

            <Avatar
              sx={{
                backgroundColor: darkMode
                  ? "#312E81"
                  : "#EEF2FF",
                color: "#4F46E5",
              }}
            >
              <SettingsIcon />
            </Avatar>

            <Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: textColor,
                }}
              >
                Preferences
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: secondaryTextColor,
                }}
              >
                Customize your SmartStudy experience.
              </Typography>

            </Box>

          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* =========================
              NOTIFICATIONS
          ========================= */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              gap: 2,
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >

              <NotificationsIcon
                sx={{
                  color: "#2563EB",
                }}
              />

              <Box>

                <Typography
                  sx={{
                    fontWeight: 600,
                    color: textColor,
                  }}
                >
                  Notifications
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: secondaryTextColor,
                  }}
                >
                  Receive study reminders and updates.
                </Typography>

              </Box>

            </Box>

            <Switch
              checked={notifications}
              onChange={(e) =>
                setNotifications(e.target.checked)
              }
            />

          </Box>

          <Divider />

          {/* =========================
              DARK MODE
          ========================= */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              gap: 2,
            }}
          >

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >

              <DarkModeIcon
                sx={{
                  color: "#7C3AED",
                }}
              />

              <Box>

                <Typography
                  sx={{
                    fontWeight: 600,
                    color: textColor,
                  }}
                >
                  Dark Mode
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: secondaryTextColor,
                  }}
                >
                  Use a darker appearance for SmartStudy.
                </Typography>

              </Box>

            </Box>

            <Switch
              checked={darkMode}
              onChange={(e) =>
                setDarkMode(e.target.checked)
              }
            />

          </Box>

          <Divider />

          {/* =========================
              LANGUAGE
          ========================= */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              py: 3,
            }}
          >

            <LanguageIcon
              sx={{
                color: "#10B981",
              }}
            />

            <FormControl
              sx={{
                minWidth: 220,
              }}
            >

              <TextField
                select
                label="Language"
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                size="small"
              >

                <MenuItem value="English">
                  English
                </MenuItem>

                <MenuItem value="French">
                  French
                </MenuItem>

              </TextField>

            </FormControl>

          </Box>

          {/* =========================
              SAVE BUTTON
          ========================= */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.2,
                background:
                  "linear-gradient(135deg, #2563EB, #4F46E5)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1D4ED8, #4338CA)",
                },
              }}
            >
              Save Settings
            </Button>

          </Box>

        </CardContent>
      </Card>

      {/* =========================
          LOGOUT
      ========================= */}

      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: cardColor,
          border: "1px solid #FECACA",
          mb: 4,
          boxShadow: "none",
        }}
      >

        <CardContent
          sx={{
            p: { xs: 3, md: 4 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >

          <Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: textColor,
              }}
            >
              Sign out
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: secondaryTextColor,
                mt: 0.5,
              }}
            >
              Sign out from your SmartStudy account.
            </Typography>

          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Logout
          </Button>

        </CardContent>
      </Card>

    </Box>
  );
}

export default Settings;