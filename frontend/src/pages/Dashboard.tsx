import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import NoteIcon from "@mui/icons-material/Note";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import { getDocuments } from "../services/documentService";
import { getNotes } from "../services/noteService";
import { getQuizzes } from "../services/quizService";
import { getProgress } from "../services/progressService";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [documentCount, setDocumentCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [averageProgress, setAverageProgress] = useState(0);

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);

    // Documents
    try {
      const documentsResponse = await getDocuments();
      const documents = documentsResponse.data || [];

      setDocumentCount(documents.length);
    } catch (error) {
      console.error("Documents error:", error);
    }

    // Notes
    try {
      const notesResponse = await getNotes();
      const notes = notesResponse.data || [];

      setNoteCount(notes.length);
    } catch (error) {
      console.error("Notes error:", error);
    }

    // Quizzes
    try {
      const quizzesResponse = await getQuizzes();
      const quizzes = quizzesResponse.data || [];

      setQuizCount(quizzes.length);
    } catch (error) {
      console.error("Quiz error:", error);
    }

    // Progress
    try {
      const progressResponse = await getProgress();
      const progress = progressResponse.data || [];

      if (progress.length > 0) {
        const total = progress.reduce(
          (sum: number, item: any) =>
            sum + Number(item.percentage || 0),
          0
        );

        const average = Math.round(total / progress.length);

        setAverageProgress(average);
      } else {
        setAverageProgress(0);
      }
    } catch (error) {
      console.error("Progress error:", error);
      setAverageProgress(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const firstName =
    user.fullName?.split(" ")[0] || "Student";

  const statistics = [
    {
      title: "Documents",
      value: documentCount,
      description: "Total documents",
      icon: <DescriptionIcon />,
      color: "#4F46E5",
      path: "/documents",
    },
    {
      title: "Notes",
      value: noteCount,
      description: "Total notes",
      icon: <NoteIcon />,
      color: "#10B981",
      path: "/notes",
    },
    {
      title: "Quizzes",
      value: quizCount,
      description: "Total quizzes",
      icon: <QuizIcon />,
      color: "#F59E0B",
      path: "/quiz",
    },
    {
      title: "Progress",
      value: `${averageProgress}%`,
      description: "Average progress",
      icon: <TrendingUpIcon />,
      color: "#EF4444",
      path: "/progress",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* =========================
          WELCOME SECTION
      ========================= */}

      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
          borderRadius: 4,
          padding: { xs: 3, md: 4 },
          color: "white",
          mb: 4,
          boxShadow: "0 10px 30px rgba(37, 99, 235, 0.20)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                opacity: 0.8,
                letterSpacing: 1.5,
              }}
            >
              SMARTSTUDY AI
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mt: 0.5,
                fontSize: {
                  xs: "2rem",
                  md: "2.5rem",
                },
              }}
            >
              Welcome, {firstName} 👋
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 1,
                opacity: 0.9,
              }}
            >
              Manage your studies smarter and learn more efficiently.
            </Typography>

            <Button
              variant="contained"
              startIcon={<SmartToyIcon />}
              onClick={() => navigate("/ai")}
              sx={{
                mt: 3,
                backgroundColor: "white",
                color: "#1E3A8A",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                "&:hover": {
                  backgroundColor: "#EFF6FF",
                },
              }}
            >
              Ask SmartStudy AI
            </Button>
          </Box>

          <Avatar
            sx={{
              width: 90,
              height: 90,
              bgcolor: "rgba(255,255,255,0.18)",
              border: "3px solid rgba(255,255,255,0.5)",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            {user.fullName
              ? user.fullName.charAt(0).toUpperCase()
              : "S"}
          </Avatar>
        </Box>
      </Box>

      {/* =========================
          STATISTICS
      ========================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {statistics.map((stat) => (
          <Card
            key={stat.title}
            onClick={() => navigate(stat.path)}
            sx={{
              cursor: "pointer",
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.10)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>

                <ArrowForwardIcon
                  sx={{
                    color: "#9CA3AF",
                    fontSize: 20,
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                {stat.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                  color: "#111827",
                }}
              >
                {loading ? (
                  <CircularProgress size={25} />
                ) : (
                  stat.value
                )}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                {stat.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Quick Actions
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 0.5,
              mb: 3,
            }}
          >
            Quickly access your most important study tools.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => navigate("/documents")}
              sx={{
                justifyContent: "flex-start",
                py: 1.5,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Upload / View Documents
            </Button>

            <Button
              variant="outlined"
              startIcon={<NoteIcon />}
              onClick={() => navigate("/notes")}
              sx={{
                justifyContent: "flex-start",
                py: 1.5,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Manage My Notes
            </Button>

            <Button
              variant="outlined"
              startIcon={<QuizIcon />}
              onClick={() => navigate("/quiz")}
              sx={{
                justifyContent: "flex-start",
                py: 1.5,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Take a Quiz
            </Button>

            <Button
              variant="outlined"
              startIcon={<TrendingUpIcon />}
              onClick={() => navigate("/progress")}
              sx={{
                justifyContent: "flex-start",
                py: 1.5,
                px: 2,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              View My Progress
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* =========================
          AI SECTION
      ========================= */}

      <Card
        sx={{
          mt: 3,
          borderRadius: 3,
          backgroundColor: "#EEF2FF",
          border: "1px solid #C7D2FE",
          boxShadow: "none",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 3, md: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#4F46E5",
                width: 52,
                height: 52,
              }}
            >
              <SmartToyIcon />
            </Avatar>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#1E1B4B",
                }}
              >
                Need help studying?
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#4B5563",
                  mt: 0.5,
                }}
              >
                Ask SmartStudy AI to explain a concept or help
                you prepare for your next quiz.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/ai")}
            sx={{
              backgroundColor: "#4F46E5",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                backgroundColor: "#4338CA",
              },
            }}
          >
            Open AI Assistant
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;