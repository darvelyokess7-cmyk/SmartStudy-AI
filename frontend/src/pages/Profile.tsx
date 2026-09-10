import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  Stack,
  Chip,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }
  }, []);

  const getInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }

    return "U";
  };

  const handleEditProfile = () => {
    alert("Profile editing will be available soon.");
  };

  const handleChangePassword = () => {
    alert("Change password will be available soon.");
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111827",
          }}
        >
          My Profile
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            mt: 1,
          }}
        >
          Manage and view your SmartStudy account information.
        </Typography>
      </Box>

      {/* =========================
          PROFILE
      ========================= */}

      {user ? (
        <Card
          sx={{
            maxWidth: "850px",
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>

            {/* PROFILE HEADER */}

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                alignItems: {
                  xs: "center",
                  sm: "flex-start",
                },
                gap: 3,
                mb: 4,
              }}
            >
              <Avatar
                sx={{
                  width: 90,
                  height: 90,
                  background:
                    "linear-gradient(135deg, #2563EB, #4F46E5)",
                  fontSize: "36px",
                  fontWeight: 700,
                }}
              >
                {getInitial()}
              </Avatar>

              <Box
                sx={{
                  flex: 1,
                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                  }}
                >
                  {user.fullName || "SmartStudy User"}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#6B7280",
                    mt: 0.5,
                  }}
                >
                  {user.email || "Email not available"}
                </Typography>

                <Chip
                  icon={<AccountCircleIcon />}
                  label="SmartStudy Student"
                  size="small"
                  sx={{
                    mt: 1.5,
                    backgroundColor: "#EEF2FF",
                    color: "#4338CA",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* ACCOUNT INFORMATION */}

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                  mb: 2.5,
                }}
              >
                Account Information
              </Typography>

              <Stack spacing={2}>

                {/* FULL NAME */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#EEF2FF",
                      color: "#4F46E5",
                    }}
                  >
                    <PersonIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                      }}
                    >
                      Full Name
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {user.fullName || "Not available"}
                    </Typography>
                  </Box>
                </Box>

                {/* EMAIL */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#EFF6FF",
                      color: "#2563EB",
                    }}
                  >
                    <EmailIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                      }}
                    >
                      Email Address
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {user.email || "Not available"}
                    </Typography>
                  </Box>
                </Box>

                {/* ACCOUNT CREATED */}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ECFDF5",
                      color: "#059669",
                    }}
                  >
                    <CalendarTodayIcon />
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                      }}
                    >
                      Account Created
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString()
                        : "Not available"}
                    </Typography>
                  </Box>
                </Box>

              </Stack>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* ACTIONS */}

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#111827",
                mb: 2,
              }}
            >
              Account Actions
            </Typography>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
            >
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  background:
                    "linear-gradient(135deg, #2563EB, #4F46E5)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1D4ED8, #4338CA)",
                  },
                }}
              >
                Edit Profile
              </Button>

              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={handleChangePassword}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                }}
              >
                Change Password
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "none",
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: 6,
            }}
          >
            <AccountCircleIcon
              sx={{
                fontSize: 60,
                color: "#9CA3AF",
                mb: 1,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#374151",
              }}
            >
              No user information found
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
                mt: 1,
              }}
            >
              Please log in again to view your profile.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Profile;