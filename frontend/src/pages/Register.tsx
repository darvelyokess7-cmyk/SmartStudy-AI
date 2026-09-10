import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { register } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        fullName,
        email,
        password,
      });

      console.log(
        "Registration successful:",
        response
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

      setError(
        "Registration failed. This email may already be registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 50%, #DBEAFE 100%)",
        padding: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1050,
          minHeight: 600,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          border: "1px solid #E5E7EB",
          boxShadow:
            "0 20px 50px rgba(30, 58, 138, 0.12)",
        }}
      >

        {/* =========================
            LEFT SIDE
        ========================= */}

        <Box
          sx={{
            width: "50%",
            display: {
              xs: "none",
              md: "flex",
            },
            flexDirection: "column",
            justifyContent: "center",
            padding: 6,
            color: "white",
            background:
              "linear-gradient(135deg, #1E3A8A 0%, #2563EB 55%, #4F46E5 100%)",
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "rgba(255,255,255,0.15)",
              mb: 3,
            }}
          >
            <SchoolIcon sx={{ fontSize: 42 }} />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Join SmartStudy AI
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.9,
              mb: 3,
            }}
          >
            Start learning smarter today.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              lineHeight: 1.8,
              maxWidth: 420,
            }}
          >
            Create your account and unlock your
            personal AI-powered study assistant.
            Organize your documents, notes, quizzes
            and learning progress in one place.
          </Typography>

          <Box
            sx={{
              mt: 5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Typography>
              ✓ AI-powered study assistance
            </Typography>

            <Typography>
              ✓ Smart document summaries
            </Typography>

            <Typography>
              ✓ Automatic quizzes & flashcards
            </Typography>

            <Typography>
              ✓ Progress tracking
            </Typography>
          </Box>
        </Box>

        {/* =========================
            REGISTER FORM
        ========================= */}

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: {
              xs: 3,
              sm: 5,
              md: 6,
            },
            backgroundColor: "white",
          }}
        >

          {/* Mobile logo */}

          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              alignItems: "center",
              gap: 1.5,
              mb: 4,
            }}
          >
            <SchoolIcon
              sx={{
                color: "#2563EB",
                fontSize: 38,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#1E3A8A",
              }}
            >
              SmartStudy AI
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Create your account
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              mt: 1,
              mb: 4,
            }}
          >
            Join SmartStudy and start learning smarter.
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleRegister}
          >

            {/* =========================
                FULL NAME
            ========================= */}

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#374151",
                mb: 1,
              }}
            >
              Full Name
            </Typography>

            <TextField
              fullWidth
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              slotProps={{
                htmlInput: {
                  autoComplete: "name",
                },
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* =========================
                EMAIL
            ========================= */}

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#374151",
                mb: 1,
              }}
            >
              Email
            </Typography>

            <TextField
              fullWidth
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              slotProps={{
                htmlInput: {
                  autoComplete: "email",
                },
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* =========================
                PASSWORD
            ========================= */}

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#374151",
                mb: 1,
              }}
            >
              Password
            </Typography>

            <TextField
              fullWidth
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create a password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        edge="end"
                        type="button"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  autoComplete: "new-password",
                },
              }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* =========================
                CONFIRM PASSWORD
            ========================= */}

            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: "#374151",
                mb: 1,
              }}
            >
              Confirm Password
            </Typography>

            <TextField
              fullWidth
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        edge="end"
                        type="button"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  autoComplete: "new-password",
                },
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* =========================
                REGISTER BUTTON
            ========================= */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #2563EB, #4F46E5)",
                boxShadow:
                  "0 6px 15px rgba(37,99,235,0.25)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1D4ED8, #4338CA)",
                },
              }}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </Button>
          </Box>

          {/* =========================
              LOGIN LINK
          ========================= */}

          <Box
            sx={{
              textAlign: "center",
              mt: 4,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
              }}
            >
              Already have an account?{" "}

              <Typography
                component={Link}
                to="/"
                sx={{
                  color: "#2563EB",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign In
              </Typography>
            </Typography>
          </Box>

          {/* =========================
              BACK TO LOGIN
          ========================= */}

          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{
              mt: 2,
              color: "#6B7280",
              textTransform: "none",
              alignSelf: "center",
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;