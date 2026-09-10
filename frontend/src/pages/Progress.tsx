import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  Stack,
} from "@mui/material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";

import {
  getProgress,
  createProgress,
  deleteProgress,
} from "../services/progressService";

import { getDocuments } from "../services/documentService";

function Progress() {
  const [progress, setProgress] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const [percentage, setPercentage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [documentId, setDocumentId] = useState("");

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");


  const loadProgress = async () => {
    try {
      const response = await getProgress();

      setProgress(response.data || []);
    } catch (error) {
      console.error("Failed to load progress:", error);
      setError("Unable to load your progress.");
    }
  };


  const loadDocuments = async () => {
    try {
      const response = await getDocuments();

      setDocuments(response.data || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
      setError("Unable to load your documents.");
    }
  };


  useEffect(() => {
    loadProgress();
    loadDocuments();
  }, []);


  const handleAddProgress = async () => {
    setError("");

    if (!percentage || !documentId) {
      setError("Please enter a percentage and select a document.");
      return;
    }

    const numericPercentage = Number(percentage);

    if (
      numericPercentage < 0 ||
      numericPercentage > 100
    ) {
      setError("Percentage must be between 0 and 100.");
      return;
    }

    try {
      setLoading(true);

      await createProgress({
        percentage: numericPercentage,
        completed,
        documentId: Number(documentId),
      });

      setPercentage("");
      setCompleted(false);
      setDocumentId("");

      await loadProgress();
    } catch (error) {
      console.error("Create progress error:", error);
      setError("Failed to create progress.");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this progress?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteProgress(id);

      await loadProgress();
    } catch (error) {
      console.error("Delete progress error:", error);
      setError("Failed to delete progress.");
    } finally {
      setDeletingId(null);
    }
  };

  const averageProgress =
    progress.length > 0
      ? Math.round(
          progress.reduce(
            (sum: number, item: any) =>
              sum + Number(item.percentage || 0),
            0
          ) / progress.length
        )
      : 0;

  const completedCount = progress.filter(
    (item: any) => item.completed
  ).length;

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
          My Progress
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            mt: 1,
          }}
        >
          Track your learning progress and monitor your study
          achievements.
        </Typography>
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
          STATISTICS
      ========================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Average */}

        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EEF2FF",
                color: "#4F46E5",
                mb: 2,
              }}
            >
              <TrendingUpIcon />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "#6B7280" }}
            >
              Average Progress
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#111827",
                mt: 0.5,
              }}
            >
              {averageProgress}%
            </Typography>
          </CardContent>
        </Card>

        {/* Documents */}

        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EFF6FF",
                color: "#2563EB",
                mb: 2,
              }}
            >
              <DescriptionIcon />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "#6B7280" }}
            >
              Documents Tracked
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#111827",
                mt: 0.5,
              }}
            >
              {progress.length}
            </Typography>
          </CardContent>
        </Card>

        {/* Completed */}

        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ECFDF5",
                color: "#10B981",
                mb: 2,
              }}
            >
              <CheckCircleIcon />
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "#6B7280" }}
            >
              Completed
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#111827",
                mt: 0.5,
              }}
            >
              {completedCount}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* =========================
          ADD PROGRESS
      ========================= */}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EEF2FF",
                color: "#4F46E5",
              }}
            >
              <AddTaskIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Update Your Progress
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#6B7280" }}
              >
                Add your current learning progress for a document.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
            }}
          >
            {/* Percentage */}

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "#374151",
                }}
              >
                Progress Percentage
              </Typography>

              <input
                type="number"
                min="0"
                max="100"
                placeholder="Example: 75"
                value={percentage}
                onChange={(e) =>
                  setPercentage(e.target.value)
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </Box>

            {/* Document */}

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "#374151",
                }}
              >
                Document
              </Typography>

              <select
                value={documentId}
                onChange={(e) =>
                  setDocumentId(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "16px",
                  background: "white",
                }}
              >
                <option value="">
                  Select a document
                </option>

                {documents.map((doc: any) => (
                  <option
                    key={doc.id}
                    value={doc.id}
                  >
                    {doc.fileName}
                  </option>
                ))}
              </select>
            </Box>
          </Box>

          {/* Completed */}

          <Box sx={{ mt: 3 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) =>
                  setCompleted(e.target.checked)
                }
                style={{
                  width: "18px",
                  height: "18px",
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Mark this document as completed
              </Typography>
            </label>
          </Box>

          {/* Button */}

          <Button
            variant="contained"
            startIcon={<AddTaskIcon />}
            onClick={handleAddProgress}
            disabled={loading}
            sx={{
              mt: 3,
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
            {loading ? "Saving..." : "Add Progress"}
          </Button>
        </CardContent>
      </Card>

      {/* =========================
          PROGRESS LIST
      ========================= */}

      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#111827",
            mb: 2,
          }}
        >
          Progress History
        </Typography>

        {progress.length === 0 ? (
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
              <TrendingUpIcon
                sx={{
                  fontSize: 55,
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
                No progress yet
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  mt: 1,
                }}
              >
                Start tracking your learning progress above.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {progress.map((item: any) => (
              <Card
                key={item.id}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E5E7EB",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.04)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <DescriptionIcon
                          sx={{
                            color: "#2563EB",
                            fontSize: 22,
                          }}
                        />

                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          {item.document?.fileName ||
                            `Document #${item.documentId}`}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6B7280",
                          mb: 2,
                        }}
                      >
                        Updated{" "}
                        {item.updatedAt
                          ? new Date(
                              item.updatedAt
                            ).toLocaleDateString()
                          : "Recently"}
                      </Typography>

                      <Box sx={{ mb: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            mb: 0.8,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "#374151",
                            }}
                          >
                            Learning Progress
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: "#2563EB",
                            }}
                          >
                            {item.percentage}%
                          </Typography>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={Math.min(
                            Math.max(
                              Number(
                                item.percentage || 0
                              ),
                              0
                            ),
                            100
                          )}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            backgroundColor: "#E5E7EB",
                            "& .MuiLinearProgress-bar":
                              {
                                borderRadius: 5,
                              },
                          }}
                        />
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        {item.completed ? (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Completed"
                            size="small"
                            sx={{
                              backgroundColor:
                                "#ECFDF5",
                              color: "#047857",
                              fontWeight: 600,
                            }}
                          />
                        ) : (
                          <Chip
                            label="In Progress"
                            size="small"
                            sx={{
                              backgroundColor:
                                "#EFF6FF",
                              color: "#1D4ED8",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    </Box>

                    <IconButton
                      color="error"
                      disabled={
                        deletingId === item.id
                      }
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      {deletingId === item.id ? (
                        "..."
                      ) : (
                        <DeleteOutlineIcon />
                      )}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default Progress;