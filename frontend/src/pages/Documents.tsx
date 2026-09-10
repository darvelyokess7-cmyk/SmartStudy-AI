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
  Divider,
  Alert,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import QuizIcon from "@mui/icons-material/Quiz";
import StyleIcon from "@mui/icons-material/Style";
import SummarizeIcon from "@mui/icons-material/Summarize";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  summarizeDocument,
  generateFlashcards,
  generateQuiz,
} from "../services/documentService";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [flashcards, setFlashcards] = useState<any[]>([]);

  const [quiz, setQuiz] = useState<any[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number | null>(null);

  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      setError("");

      const response = await getDocuments();

      setDocuments(response.data || []);
    } catch (error) {
      console.error("Documents error:", error);
      setError("Unable to load your documents.");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);


  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();

    formData.append("document", selectedFile);

    try {
      setLoadingUpload(true);
      setError("");

      await uploadDocument(formData);

      setSelectedFile(null);

      await loadDocuments();
    } catch (error) {
      console.error("Upload error:", error);
      setError("Document upload failed.");
    } finally {
      setLoadingUpload(false);
    }
  };


  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteDocument(id);

      if (selectedDocumentId === id) {
        setSelectedDocumentId(null);
        setSummary("");
        setFlashcards([]);
        setQuiz([]);
      }

      await loadDocuments();
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSummarize = async (id: number) => {
    try {
      setSelectedDocumentId(id);
      setLoadingSummary(true);
      setError("");
      setSummary("");

      const response = await summarizeDocument(id);

      setSummary(response.summary || "");
    } catch (error) {
      console.error("Summary error:", error);
      setError("Failed to generate the summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateFlashcards = async (id: number) => {
    try {
      setSelectedDocumentId(id);
      setError("");
      setFlashcards([]);

      const response = await generateFlashcards(id);

      setFlashcards(response.flashcards || []);
    } catch (error) {
      console.error("Flashcards error:", error);
      setError("Failed to generate flashcards.");
    }
  };

  const handleGenerateQuiz = async (id: number) => {
    try {
      setSelectedDocumentId(id);
      setLoadingQuiz(true);
      setError("");
      setQuiz([]);

      const response = await generateQuiz(id);

      setQuiz(response.quiz || []);
    } catch (error) {
      console.error("Quiz error:", error);
      setError("Failed to generate quiz.");
    } finally {
      setLoadingQuiz(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* HEADER */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111827",
          }}
        >
          My Documents
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#6B7280",
            mt: 1,
          }}
        >
          Upload your study materials and use AI to learn smarter.
        </Typography>
      </Box>

      {/* ERROR */}

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

      {/* UPLOAD CARD */}

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
              <CloudUploadIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Upload a document
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                }}
              >
                Upload a PDF and let SmartStudy AI analyze it.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              border: "2px dashed #CBD5E1",
              borderRadius: 3,
              padding: { xs: 3, md: 5 },
              textAlign: "center",
              backgroundColor: "#F8FAFC",
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: 50,
                color: "#2563EB",
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
              Select your PDF
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
                mt: 1,
                mb: 3,
              }}
            >
              Only PDF files are supported.
            </Typography>

            <Button
              component="label"
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
              }}
            >
              Choose PDF

              <input
                hidden
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) =>
                  setSelectedFile(
                    e.target.files?.[0] || null
                  )
                }
              />
            </Button>

            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={<PictureAsPdfIcon />}
                  label={selectedFile.name}
                  sx={{
                    maxWidth: "100%",
                    backgroundColor: "#EFF6FF",
                    color: "#1D4ED8",
                  }}
                />
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={
                  loadingUpload ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <CloudUploadIcon />
                  )
                }
                disabled={!selectedFile || loadingUpload}
                onClick={handleUpload}
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
                {loadingUpload
                  ? "Uploading..."
                  : "Upload Document"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* DOCUMENT LIST */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#111827",
            mb: 2,
          }}
        >
          Uploaded Documents
        </Typography>

        {documents.length === 0 ? (
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
              <DescriptionIcon
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
                No documents yet
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  mt: 1,
                }}
              >
                Upload your first PDF to start studying.
              </Typography>
            </CardContent>
          </Card>
        ) : (
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
            {documents.map((doc: any) => (
              <Card
                key={doc.id}
                sx={{
                  borderRadius: 3,
                  border:
                    selectedDocumentId === doc.id
                      ? "2px solid #2563EB"
                      : "1px solid #E5E7EB",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.04)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.08)",
                  },
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          minWidth: 48,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#FEF2F2",
                          color: "#EF4444",
                        }}
                      >
                        <PictureAsPdfIcon />
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: "#111827",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doc.fileName}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#6B7280",
                            mt: 0.5,
                          }}
                        >
                          PDF Document
                        </Typography>
                      </Box>
                    </Box>

                    <IconButton
                      color="error"
                      disabled={deletingId === doc.id}
                      onClick={() => handleDelete(doc.id)}
                    >
                      {deletingId === doc.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DeleteOutlineIcon />
                      )}
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2.5 }} />

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      mb: 2,
                    }}
                  >
                    AI Study Tools
                  </Typography>

                  {/* BUTTONS */}

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<SummarizeIcon />}
                      onClick={() => handleSummarize(doc.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      Summary
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<StyleIcon />}
                      onClick={() =>
                        handleGenerateFlashcards(doc.id)
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      Flashcards
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<QuizIcon />}
                      onClick={() => handleGenerateQuiz(doc.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                      }}
                    >
                      Quiz
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* AI RESULTS */}

      {(summary ||
        flashcards.length > 0 ||
        quiz.length > 0 ||
        loadingSummary ||
        loadingQuiz) && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
            }}
          >
            <AutoAwesomeIcon
              sx={{
                color: "#4F46E5",
                fontSize: 30,
              }}
            />

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                AI Study Results
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                }}
              >
                Your AI-generated learning materials.
              </Typography>
            </Box>
          </Box>

          {/* SUMMARY */}

          {(loadingSummary || summary) && (
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                mb: 3,
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <SummarizeIcon sx={{ color: "#2563EB" }} />

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    AI Summary
                  </Typography>
                </Box>

                {loadingSummary ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 3,
                    }}
                  >
                    <CircularProgress size={25} />

                    <Typography sx={{ color: "#6B7280" }}>
                      Generating your summary...
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      color: "#374151",
                      lineHeight: 1.8,
                      "& h1": {
                        color: "#2563EB",
                        fontSize: "28px",
                      },
                      "& h2": {
                        color: "#1E3A8A",
                        marginTop: "24px",
                      },
                      "& h3": {
                        color: "#374151",
                      },
                      "& p": {
                        lineHeight: 1.8,
                      },
                      "& li": {
                        marginBottom: "6px",
                      },
                      "& table": {
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "15px",
                        marginBottom: "15px",
                      },
                      "& th": {
                        border: "1px solid #D1D5DB",
                        padding: "10px",
                        backgroundColor: "#2563EB",
                        color: "white",
                      },
                      "& td": {
                        border: "1px solid #D1D5DB",
                        padding: "10px",
                      },
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {summary}
                    </ReactMarkdown>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* FLASHCARDS */}

          {flashcards.length > 0 && (
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                mb: 3,
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <StyleIcon sx={{ color: "#7C3AED" }} />

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    AI Flashcards
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {flashcards.map(
                    (card: any, index: number) => (
                      <Card
                        key={index}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          backgroundColor: "#FAFAFF",
                        }}
                      >
                        <CardContent>
                          <Chip
                            label={`Card ${index + 1}`}
                            size="small"
                            sx={{
                              mb: 2,
                              backgroundColor: "#EDE9FE",
                              color: "#6D28D9",
                              fontWeight: 600,
                            }}
                          />

                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: "#111827",
                              mb: 1,
                            }}
                          >
                            {card.question}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#4B5563",
                              lineHeight: 1.7,
                            }}
                          >
                            <strong>Answer:</strong>{" "}
                            {card.answer}
                          </Typography>
                        </CardContent>
                      </Card>
                    )
                  )}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* QUIZ */}

          {(loadingQuiz || quiz.length > 0) && (
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                mb: 3,
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  <QuizIcon sx={{ color: "#F59E0B" }} />

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    AI Quiz
                  </Typography>
                </Box>

                {loadingQuiz ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 3,
                    }}
                  >
                    <CircularProgress size={25} />

                    <Typography sx={{ color: "#6B7280" }}>
                      Generating your quiz...
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {quiz.map(
                      (q: any, index: number) => (
                        <Card
                          key={index}
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                          }}
                        >
                          <CardContent>
                            <Chip
                              label={`Question ${index + 1}`}
                              size="small"
                              sx={{
                                mb: 2,
                                backgroundColor: "#FEF3C7",
                                color: "#92400E",
                                fontWeight: 600,
                              }}
                            />

                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: "#111827",
                              }}
                            >
                              {q.question}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                              }}
                            >
                              {q.options?.map(
                                (
                                  option: string,
                                  i: number
                                ) => (
                                  <Box
                                    key={i}
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 2,
                                      backgroundColor: "#F8FAFC",
                                      border:
                                        "1px solid #E5E7EB",
                                    }}
                                  >
                                    <Typography variant="body2">
                                      {String.fromCharCode(65 + i)}.{" "}
                                      {option}
                                    </Typography>
                                  </Box>
                                )
                              )}
                            </Box>

                            <Box
                              sx={{
                                mt: 2,
                                p: 1.5,
                                borderRadius: 2,
                                backgroundColor: "#ECFDF5",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#047857",
                                  fontWeight: 600,
                                }}
                              >
                                Correct answer: {q.answer}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
}

export default Documents;