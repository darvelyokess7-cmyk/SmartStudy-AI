import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      console.log("Login response:", response);

      if (!response.data?.token) {
        setError("No token received from server.");
        return;
      }

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        "Invalid email or password. Please try again."
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
            SmartStudy AI
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              opacity: 0.9,
              mb: 3,
            }}
          >
            Your intelligent learning assistant.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              opacity: 0.8,
              lineHeight: 1.8,
              maxWidth: 420,
            }}
          >
            Upload your study documents, generate
            summaries, create flashcards, take quizzes
            and improve your learning with AI.
          </Typography>

          <Box
            sx={{
              mt: 5,
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor:
                  "rgba(255,255,255,0.12)",
              }}
            >
               Smart Learning
            </Box>

            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor:
                  "rgba(255,255,255,0.12)",
              }}
            >
               AI Assistant
            </Box>
          </Box>
        </Box>

        {/* =========================
            LOGIN FORM
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
            Welcome back 👋
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              mt: 1,
              mb: 4,
            }}
          >
            Sign in to continue your learning journey.
          </Typography>

          {/* Error */}

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

          {/* Form */}

          <Box
            component="form"
            onSubmit={handleLogin}
          >
            {/* Email */}

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
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />

            {/* Password */}

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
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (previous) => !previous
                          )
                        }
                        edge="end"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
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
              }}
            />

            {/* Login button */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              endIcon={
                !loading ? <ArrowForwardIcon /> : null
              }
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>

          {/* Register */}

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
              Don't have an account?{" "}
              <Typography
                component={Link}
                to="/register"
                sx={{
                  color: "#2563EB",
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Register
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;