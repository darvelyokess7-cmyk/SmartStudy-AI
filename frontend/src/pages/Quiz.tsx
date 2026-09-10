import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  TextField,
} from "@mui/material";

import QuizIcon from "@mui/icons-material/Quiz";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlined";

import {
  getQuizzes,
  createQuiz,
  deleteQuiz,
} from "../services/quizService";

function Quiz() {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [documentId, setDocumentId] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getQuizzes();

      setQuizzes(response.data || []);
    } catch (error) {
      console.error("Failed to load quizzes:", error);
      setError("Unable to load your quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleAddQuiz = async () => {
    setError("");

    if (
      !question.trim() ||
      !answer.trim() ||
      !documentId.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedDocumentId = Number(documentId);

    if (
      Number.isNaN(parsedDocumentId) ||
      parsedDocumentId <= 0
    ) {
      setError("Please enter a valid Document ID.");
      return;
    }

    try {
      setCreating(true);

      await createQuiz({
        question: question.trim(),
        answer: answer.trim(),
        documentId: parsedDocumentId,
      });

      setQuestion("");
      setAnswer("");
      setDocumentId("");

      setOpenDialog(false);

      await loadQuizzes();
    } catch (error) {
      console.error("Create quiz error:", error);
      setError("Failed to create quiz.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteQuiz(id);

      await loadQuizzes();
    } catch (error) {
      console.error("Delete quiz error:", error);
      setError("Failed to delete quiz.");
    } finally {
      setDeletingId(null);
    }
  };


  const handleCloseDialog = () => {
    if (creating) {
      return;
    }

    setOpenDialog(false);

    setQuestion("");
    setAnswer("");
    setDocumentId("");
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: 2,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          mb: 4,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
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
                backgroundColor: "#FEF3C7",
                color: "#F59E0B",
              }}
            >
              <QuizIcon />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              My Quizzes
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              mt: 1,
            }}
          >
            Create and manage questions to test your
            knowledge.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1.2,
            background:
              "linear-gradient(135deg, #F59E0B, #D97706)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #D97706, #B45309)",
            },
          }}
        >
          Create Quiz
        </Button>
      </Box>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* =========================
          QUIZ COUNT
      ========================= */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: "#6B7280",
          }}
        >
          {quizzes.length}{" "}
          {quizzes.length === 1 ? "quiz" : "quizzes"} available
        </Typography>
      </Box>

      {/* =========================
          LOADING
      ========================= */}

      {loading ? (
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "none",
          }}
        >
          <CardContent
            sx={{
              py: 8,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={28} />

            <Typography sx={{ color: "#6B7280" }}>
              Loading your quizzes...
            </Typography>
          </CardContent>
        </Card>
      ) : quizzes.length === 0 ? (
        /* =========================
           EMPTY STATE
        ========================= */

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
              py: 8,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FEF3C7",
                color: "#F59E0B",
                mb: 2,
              }}
            >
              <QuizIcon sx={{ fontSize: 35 }} />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#374151",
              }}
            >
              No quizzes yet
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
                mt: 1,
                mb: 3,
              }}
            >
              Create your first quiz question and
              start testing your knowledge.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#F59E0B",
                "&:hover": {
                  backgroundColor: "#D97706",
                },
              }}
            >
              Create Your First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* =========================
           QUIZ GRID
        ========================= */

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          {quizzes.map((quiz: any) => (
            <Card
              key={quiz.id}
              sx={{
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Quiz header */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 45,
                        height: 45,
                        minWidth: 45,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FEF3C7",
                        color: "#F59E0B",
                      }}
                    >
                      <HelpOutlineIcon />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      Question
                    </Typography>
                  </Box>

                  <IconButton
                    color="error"
                    disabled={
                      deletingId === quiz.id
                    }
                    onClick={() =>
                      handleDelete(quiz.id)
                    }
                  >
                    {deletingId === quiz.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DeleteOutlineIcon />
                    )}
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Question */}

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.6,
                  }}
                >
                  {quiz.question}
                </Typography>

                {/* Answer */}

                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#ECFDF5",
                    border: "1px solid #A7F3D0",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#047857",
                      fontWeight: 600,
                      mb: 0.5,
                    }}
                  >
                    Correct Answer
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#374151",
                      lineHeight: 1.7,
                    }}
                  >
                    {quiz.answer}
                  </Typography>
                </Box>

                {/* Metadata */}

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: "wrap" }}
                >
                  {quiz.document?.fileName && (
                    <Chip
                      size="small"
                      icon={<DescriptionIcon />}
                      label={quiz.document.fileName}
                      sx={{
                        maxWidth: "100%",
                        backgroundColor: "#EFF6FF",
                        color: "#1D4ED8",
                      }}
                    />
                  )}

                  {quiz.createdAt && (
                    <Chip
                      size="small"
                      icon={<AccessTimeIcon />}
                      label={new Date(
                        quiz.createdAt
                      ).toLocaleDateString()}
                      sx={{
                        backgroundColor: "#F3F4F6",
                        color: "#4B5563",
                      }}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* =========================
          CREATE QUIZ DIALOG
      ========================= */}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          Create a New Quiz

          <IconButton
            onClick={handleCloseDialog}
            disabled={creating}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              mb: 3,
            }}
          >
            Create a question and answer associated
            with one of your study documents.
          </Typography>

          <TextField
            fullWidth
            label="Question"
            placeholder="Example: What is object-oriented programming?"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            multiline
            minRows={2}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            fullWidth
            label="Correct Answer"
            placeholder="Enter the correct answer..."
            value={answer}
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            multiline
            minRows={3}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            fullWidth
            type="number"
            label="Document ID"
            placeholder="Example: 1"
            value={documentId}
            onChange={(e) =>
              setDocumentId(e.target.value)
            }
            helperText="Enter the ID of the document associated with this quiz."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={creating}
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={
              creating ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <SaveIcon />
              )
            }
            onClick={handleAddQuiz}
            disabled={creating}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #F59E0B, #D97706)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #D97706, #B45309)",
              },
            }}
          >
            {creating ? "Creating..." : "Create Quiz"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Quiz;