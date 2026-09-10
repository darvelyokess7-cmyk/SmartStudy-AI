import { useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Chip,
  Stack,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  LinearProgress,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SummarizeIcon from "@mui/icons-material/Summarize";
import QuizIcon from "@mui/icons-material/Quiz";
import StyleIcon from "@mui/icons-material/Style";
import NoteIcon from "@mui/icons-material/Note";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  uploadDocument,
  summarizeDocument,
  generateFlashcards,
  generateQuiz,
  generateNotes,
} from "../services/documentService";

import { askAI } from "../services/aiService";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}


function AI() {


  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [documentId, setDocumentId] =
    useState<number | null>(null);

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  const [resultType, setResultType] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [action, setAction] =
    useState("");

  const [error, setError] =
    useState("");


  const [quiz, setQuiz] =
    useState<QuizQuestion[]>([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<number, string>>({});

  const [quizFinished, setQuizFinished] =
    useState(false);

  const [quizScore, setQuizScore] =
    useState(0);


  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {

      setError(
        "Only PDF files are supported."
      );

      return;
    }

    setSelectedFile(file);

    setDocumentId(null);

    setResult(null);

    setError("");

    // Reset quiz
    setQuiz([]);

    setCurrentQuestion(0);

    setSelectedAnswers({});

    setQuizFinished(false);

    setQuizScore(0);
  };


  const handleUpload = async () => {

    if (!selectedFile) {

      setError(
        "Please select a PDF file first."
      );

      return;
    }

    try {

      setLoading(true);

      setAction("Uploading PDF...");

      setError("");

      const formData =
        new FormData();

      formData.append(
        "document",
        selectedFile
      );

      const response =
        await uploadDocument(formData);

      console.log(
        "Upload response:",
        response
      );

      const id =
        response?.id ??
        response?.document?.id ??
        response?.data?.id ??
        response?.document?.data?.id;

      if (!id) {

        setError(
          "PDF uploaded, but the document ID was not returned."
        );

        return;
      }

      setDocumentId(
        Number(id)
      );

      setResult(null);

    } catch (error: any) {

      console.error(
        "Upload error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to upload PDF."
      );

    } finally {

      setLoading(false);

      setAction("");
    }
  };


  const handleSummary = async () => {

    if (!documentId) {

      setError(
        "Please upload a PDF first."
      );

      return;
    }

    try {

      setLoading(true);

      setAction(
        "Generating AI summary..."
      );

      setError("");

      const response =
        await summarizeDocument(
          documentId
        );

      setResult(
        response?.summary ??
        response?.data?.summary ??
        response
      );

      setResultType(
        "summary"
      );

    } catch (error: any) {

      console.error(
        "Summary error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to generate summary."
      );

    } finally {

      setLoading(false);

      setAction("");
    }
  };


  const handleFlashcards = async () => {

    if (!documentId) {

      setError(
        "Please upload a PDF first."
      );

      return;
    }

    try {

      setLoading(true);

      setAction(
        "Generating AI flashcards..."
      );

      setError("");

      const response =
        await generateFlashcards(
          documentId
        );

      setResult(
        response?.flashcards ??
        response?.data?.flashcards ??
        response
      );

      setResultType(
        "flashcards"
      );

    } catch (error: any) {

      console.error(
        "Flashcards error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to generate flashcards."
      );

    } finally {

      setLoading(false);

      setAction("");
    }
  };


const handleQuiz = async () => {
  if (!documentId) {
    setError("Please upload a PDF first.");
    return;
  }

  try {
    setLoading(true);
    setAction("Generating AI quiz...");
    setError("");

    const response = await generateQuiz(documentId);

    console.log("QUIZ RESPONSE FROM BACKEND:", response);

    const rawQuiz =
      response?.quiz ??
      response?.data?.quiz ??
      response;

    console.log("RAW QUIZ:", rawQuiz);

    if (!Array.isArray(rawQuiz)) {
      throw new Error("Quiz data is not an array.");
    }

    /*
      Backend / Prisma format:

      {
        question: "...",
        optionA: "...",
        optionB: "...",
        optionC: "...",
        optionD: "...",
        answer: "..."
      }

      React format:

      {
        question: "...",
        options: ["...", "...", "...", "..."],
        correctAnswer: "..."
      }
    */

    const formattedQuiz: QuizQuestion[] = rawQuiz.map(
      (item: any) => ({
        question: item.question,

        options: [
          item.optionA,
          item.optionB,
          item.optionC,
          item.optionD,
        ].filter(Boolean),

        correctAnswer:
          item.correctAnswer ??
          item.answer,
      })
    );

    console.log(
      "FORMATTED QUIZ:",
      formattedQuiz
    );

    const invalidQuestion = formattedQuiz.find(
      (item) =>
        !item.question ||
        !Array.isArray(item.options) ||
        item.options.length < 3 ||
        !item.correctAnswer
    );

    if (invalidQuestion) {
      console.error(
        "Invalid quiz question:",
        invalidQuestion
      );

      throw new Error(
        "The quiz contains invalid question data."
      );
    }

    setQuiz(formattedQuiz);

    setCurrentQuestion(0);

    setSelectedAnswers({});

    setQuizFinished(false);

    setQuizScore(0);

    setResult(null);

    setResultType("quiz");

  } catch (error: any) {
    console.error(
      "Quiz error:",
      error
    );

    setError(
      error?.response?.data?.message ||
      error?.message ||
      "Failed to generate quiz."
    );

  } finally {
    setLoading(false);
    setAction("");
  }
};

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: event.target.value
    }));

    setError("");
  };


  const handleNextQuestion = () => {

    if (
      !selectedAnswers[
        currentQuestion
      ]
    ) {

      setError(
        "Please select an answer before continuing."
      );

      return;
    }

    setError("");

    if (
      currentQuestion <
      quiz.length - 1
    ) {

      setCurrentQuestion(
        currentQuestion + 1
      );

    } else {

      handleSubmitQuiz();
    }
  };


  const handlePreviousQuestion = () => {

    if (
      currentQuestion > 0
    ) {

      setCurrentQuestion(
        currentQuestion - 1
      );

      setError("");
    }
  };


  const handleSubmitQuiz = () => {

    let score = 0;

    quiz.forEach(
      (item, index) => {

        const userAnswer =
          selectedAnswers[index];

        if (
          userAnswer ===
          item.correctAnswer
        ) {

          score++;
        }
      }
    );

    setQuizScore(
      score
    );

    setQuizFinished(
      true
    );

    setError("");
  };


  const handleRestartQuiz = () => {

    setCurrentQuestion(0);

    setSelectedAnswers({});

    setQuizFinished(false);

    setQuizScore(0);

    setError("");
  };


  const handleNotes = async () => {

    if (!documentId) {

      setError(
        "Please upload a PDF first."
      );

      return;
    }

    try {

      setLoading(true);

      setAction(
        "Generating AI notes..."
      );

      setError("");

      const response =
        await generateNotes(
          documentId
        );

      setResult(
        response?.note ??
        response?.data?.note ??
        response?.notes ??
        response
      );

      setResultType(
        "notes"
      );

    } catch (error: any) {

      console.error(
        "Notes error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to generate notes."
      );

    } finally {

      setLoading(false);

      setAction("");
    }
  };


  const handleAsk = async () => {

    if (!question.trim()) {

      setError(
        "Please enter a question."
      );

      return;
    }

    try {

      setLoading(true);

      setAction(
        "SmartStudy AI is thinking..."
      );

      setError("");

      const response =
        await askAI(question);

      setAnswer(
        response?.reply ??
        response?.data?.reply ??
        "No answer received."
      );

    } catch (error: any) {

      console.error(
        "AI error:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "AI request failed."
      );

    } finally {

      setLoading(false);

      setAction("");
    }
  };


  const renderQuiz = () => {

    if (!quiz.length) {

      return (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: "#94A3B8",
          }}
        >
          <QuizIcon
            sx={{
              fontSize: 50,
              mb: 1,
              opacity: 0.5,
            }}
          />

          <Typography>
            Click "AI Quiz" to generate
            your quiz.
          </Typography>
        </Box>
      );
    }


    if (quizFinished) {

      const percentage =
        Math.round(
          (quizScore /
            quiz.length) *
          100
        );

      return (
        <Box>

          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color:
                  percentage >= 50
                    ? "#059669"
                    : "#DC2626",
              }}
            >
              {percentage >= 50
                ? " Quiz Completed!"
                : " Keep Practicing!"}
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mt: 2,
              }}
            >
              {quizScore} /{" "}
              {quiz.length}
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
                fontSize: 18,
              }}
            >
              Your Score:{" "}
              {percentage}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                mt: 3,
                height: 10,
                borderRadius: 5,
              }}
            />

          </Box>


          <Divider
            sx={{ mb: 3 }}
          />


          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            Quiz Review
          </Typography>


          <Stack spacing={2}>

            {quiz.map(
              (item, index) => {

                const userAnswer =
                  selectedAnswers[
                    index
                  ];

                const correct =
                  userAnswer ===
                  item.correctAnswer;

                return (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      borderColor:
                        correct
                          ? "#A7F3D0"
                          : "#FECACA",
                      backgroundColor:
                        correct
                          ? "#ECFDF5"
                          : "#FEF2F2",
                    }}
                  >

                    <CardContent>

                      <Box
                        sx={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >

                        {correct ? (
                          <CheckCircleIcon
                            sx={{
                              color:
                                "#059669",
                            }}
                          />
                        ) : (
                          <CancelIcon
                            sx={{
                              color:
                                "#DC2626",
                            }}
                          />
                        )}

                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          Question{" "}
                          {index + 1}
                        </Typography>

                        <Chip
                          label={
                            correct
                              ? "Correct"
                              : "Incorrect"
                          }
                          size="small"
                          color={
                            correct
                              ? "success"
                              : "error"
                          }
                        />

                      </Box>


                      <Typography
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                        }}
                      >
                        {item.question}
                      </Typography>


                      <Typography
                        sx={{
                          color:
                            correct
                              ? "#047857"
                              : "#DC2626",
                          fontWeight: 600,
                        }}
                      >
                        Your answer:
                      </Typography>

                      <Typography
                        sx={{
                          mb: 1.5,
                        }}
                      >
                        {userAnswer ||
                          "No answer"}
                      </Typography>


                      {!correct && (
                        <>
                          <Typography
                            sx={{
                              color:
                                "#047857",
                              fontWeight:
                                600,
                            }}
                          >
                            Correct answer:
                          </Typography>

                          <Typography>
                            {
                              item.correctAnswer
                            }
                          </Typography>
                        </>
                      )}

                    </CardContent>

                  </Card>
                );
              }
            )}

          </Stack>


          <Box
            sx={{
              display: "flex",
              justifyContent:
                "center",
              mt: 4,
            }}
          >

            <Button
              variant="contained"
              onClick={
                handleRestartQuiz
              }
              sx={{
                borderRadius: 2,
                textTransform:
                  "none",
                px: 4,
              }}
            >
               Retake Quiz
            </Button>

          </Box>

        </Box>
      );
    }

    const current =
      quiz[currentQuestion];

    const progress =
      ((currentQuestion + 1) /
        quiz.length) *
      100;


    return (
      <Box>

        <Box sx={{ mb: 3 }}>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              mb: 1,
            }}
          >

            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              Question{" "}
              {currentQuestion + 1}{" "}
              of {quiz.length}
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
              }}
            >
              {Math.round(progress)}%
            </Typography>

          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
            }}
          />

        </Box>


        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            backgroundColor:
              "#F8FAFC",
          }}
        >

          <CardContent
            sx={{ p: 3 }}
          >

            <Chip
              label={`Question ${
                currentQuestion + 1
              }`}
              sx={{
                mb: 2,
                fontWeight: 600,
              }}
            />


            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              {current.question}
            </Typography>


            <FormControl
              fullWidth
            >

              <RadioGroup
                value={
                  selectedAnswers[
                    currentQuestion
                  ] || ""
                }
                onChange={
                  handleAnswerChange
                }
              >

                <Stack spacing={1.5}>

                  {current.options.map(
                    (
                      option,
                      index
                    ) => {

                      const letter =
                        String.fromCharCode(
                          65 + index
                        );

                      return (
                        <Box
                          key={index}
                          sx={{
                            border:
                              "1px solid #E2E8F0",
                            borderRadius: 2,
                            backgroundColor:
                              "white",
                            transition:
                              "0.2s",
                            "&:hover": {
                              borderColor:
                                "#4F46E5",
                              backgroundColor:
                                "#EEF2FF",
                            },
                          }}
                        >

                          <FormControlLabel
                            value={
                              option
                            }
                            control={
                              <Radio />
                            }
                            label={
                              <Typography>
                                <strong>
                                  {letter}.
                                </strong>{" "}
                                {option}
                              </Typography>
                            }
                            sx={{
                              width:
                                "100%",
                              m: 0,
                              p: 1,
                            }}
                          />

                        </Box>
                      );
                    }
                  )}

                </Stack>

              </RadioGroup>

            </FormControl>

          </CardContent>

        </Card>


        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            mt: 3,
          }}
        >

          <Button
            variant="outlined"
            disabled={
              currentQuestion === 0
            }
            onClick={
              handlePreviousQuestion
            }
            sx={{
              borderRadius: 2,
              textTransform:
                "none",
            }}
          >
            ← Previous
          </Button>


          <Button
            variant="contained"
            onClick={
              handleNextQuestion
            }
            sx={{
              borderRadius: 2,
              textTransform:
                "none",
              px: 4,
            }}
          >
            {currentQuestion ===
            quiz.length - 1
              ? "Submit Quiz"
              : "Next Question →"}
          </Button>

        </Box>

      </Box>
    );
  };


  const renderResult = () => {

    if (!result) {

      return (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            color: "#94A3B8",
          }}
        >

          <AutoAwesomeIcon
            sx={{
              fontSize: 50,
              mb: 1,
              opacity: 0.5,
            }}
          />

          <Typography>
            Your AI-generated result
            will appear here.
          </Typography>

        </Box>
      );
    }


    if (Array.isArray(result)) {

      return (
        <Stack spacing={2}>

          {result.map(
            (
              item: any,
              index: number
            ) => (

              <Card
                key={index}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  backgroundColor:
                    "#F8FAFC",
                }}
              >

                <CardContent>

                  <Chip
                    label={
                      resultType ===
                      "flashcards"
                        ? `Card ${
                            index + 1
                          }`
                        : `Item ${
                            index + 1
                          }`
                    }
                    size="small"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color:
                        "#111827",
                      mb: 2,
                    }}
                  >
                    {item.question ||
                      item.title ||
                      "Study Question"}
                  </Typography>


                  {item.options && (

                    <Stack spacing={1}>

                      {item.options.map(
                        (
                          option: string,
                          optionIndex: number
                        ) => (

                          <Box
                            key={
                              optionIndex
                            }
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              border:
                                "1px solid #E5E7EB",
                              backgroundColor:
                                "white",
                            }}
                          >

                            <Typography>

                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}
                              .{" "}
                              {option}

                            </Typography>

                          </Box>

                        )
                      )}

                    </Stack>
                  )}

                  {item.answer && (

                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor:
                          "#ECFDF5",
                      }}
                    >

                      <Typography
                        sx={{
                          color:
                            "#047857",
                          fontWeight:
                            600,
                        }}
                      >
                        Answer:{" "}
                        {item.answer}
                      </Typography>

                    </Box>
                  )}

                </CardContent>

              </Card>

            )
          )}

        </Stack>
      );
    }


    return (
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
            borderCollapse:
              "collapse",
            marginTop: "15px",
          },

          "& th": {
            border:
              "1px solid #D1D5DB",
            padding: "10px",
            backgroundColor:
              "#2563EB",
            color: "white",
          },

          "& td": {
            border:
              "1px solid #D1D5DB",
            padding: "10px",
          },
        }}
      >

        <ReactMarkdown
          remarkPlugins={[
            remarkGfm,
          ]}
        >
          {typeof result ===
          "string"
            ? result
            : JSON.stringify(
                result,
                null,
                2
              )}
        </ReactMarkdown>

      </Box>
    );
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
          SmartStudy AI
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "#6B7280",
          }}
        >
          Your intelligent learning
          assistant.
        </Typography>

      </Box>


      {/* ERROR */}

      {error && (

        <Alert
          severity="error"
          onClose={() =>
            setError("")
          }
          sx={{
            mb: 3,
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>

      )}


      {/* UPLOAD */}

      <Card
        sx={{
          borderRadius: 3,
          border:
            "1px solid #E5E7EB",
          mb: 3,
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.04)",
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 2,
              mb: 3,
            }}
          >

            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                backgroundColor:
                  "#EEF2FF",
                color:
                  "#4F46E5",
              }}
            >
              <SmartToyIcon />
            </Box>

            <Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Study with AI
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color:
                    "#6B7280",
                }}
              >
                Upload a PDF and
                let AI transform it
                into useful study
                materials.
              </Typography>

            </Box>

          </Box>


          <Box
            sx={{
              border:
                "2px dashed #CBD5E1",
              borderRadius: 3,
              p: {
                xs: 3,
                md: 5,
              },
              textAlign:
                "center",
              backgroundColor:
                "#F8FAFC",
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
              }}
            >
              Upload your study PDF
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color:
                  "#6B7280",
                mt: 1,
                mb: 3,
              }}
            >
              Only PDF files are
              supported.
            </Typography>


            <Button
              component="label"
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform:
                  "none",
                fontWeight: 600,
              }}
            >

              Choose PDF

              <input
                hidden
                type="file"
                accept=".pdf,application/pdf"
                onChange={
                  handleFileChange
                }
              />

            </Button>


            {selectedFile && (

              <Box sx={{ mt: 2 }}>

                <Chip
                  icon={
                    <PictureAsPdfIcon />
                  }
                  label={
                    selectedFile.name
                  }
                  sx={{
                    maxWidth:
                      "100%",
                    backgroundColor:
                      "#EFF6FF",
                    color:
                      "#1D4ED8",
                  }}
                />

              </Box>

            )}


            <Box sx={{ mt: 3 }}>

              <Button
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <CloudUploadIcon />
                  )
                }
                disabled={
                  !selectedFile ||
                  loading
                }
                onClick={
                  handleUpload
                }
                sx={{
                  borderRadius: 2,
                  textTransform:
                    "none",
                  fontWeight: 600,
                  px: 4,
                  py: 1.2,
                  background:
                    "linear-gradient(135deg, #2563EB, #4F46E5)",
                }}
              >

                {loading &&
                action ===
                  "Uploading PDF..."
                  ? "Uploading..."
                  : "Upload Document"}

              </Button>

            </Box>


            {documentId && (

              <Typography
                sx={{
                  mt: 2,
                  color: "#059669",
                  fontWeight: 600,
                }}
              >
                ✓ PDF ready for AI
                processing
              </Typography>

            )}

          </Box>

        </CardContent>

      </Card>


      {/* AI ACTIONS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
          gap: 2,
          mb: 3,
        }}
      >

        <Button
          variant="contained"
          startIcon={
            <SummarizeIcon />
          }
          disabled={
            loading ||
            !documentId
          }
          onClick={
            handleSummary
          }
          sx={actionButton(
            "#4F46E5"
          )}
        >
          Summary
        </Button>


        <Button
          variant="contained"
          startIcon={
            <NoteIcon />
          }
          disabled={
            loading ||
            !documentId
          }
          onClick={
            handleNotes
          }
          sx={actionButton(
            "#10B981"
          )}
        >
          AI Notes
        </Button>


        <Button
          variant="contained"
          startIcon={
            <QuizIcon />
          }
          disabled={
            loading ||
            !documentId
          }
          onClick={
            handleQuiz
          }
          sx={actionButton(
            "#F59E0B"
          )}
        >
          AI Quiz
        </Button>


        <Button
          variant="contained"
          startIcon={
            <StyleIcon />
          }
          disabled={
            loading ||
            !documentId
          }
          onClick={
            handleFlashcards
          }
          sx={actionButton(
            "#7C3AED"
          )}
        >
          Flashcards
        </Button>

      </Box>


      {/* AI RESULT */}

      <Card
        sx={{
          borderRadius: 3,
          border:
            "1px solid #E5E7EB",
          mb: 3,
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.04)",
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1.5,
              mb: 3,
            }}
          >

            <AutoAwesomeIcon
              sx={{
                color:
                  "#4F46E5",
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              {resultType === "quiz"
                ? " SmartStudy Quiz"
                : "AI Result"}
            </Typography>

          </Box>


          {loading && (

            <Box
              sx={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 2,
                mb: 3,
              }}
            >

              <CircularProgress
                size={22}
              />

              <Typography
                sx={{
                  color:
                    "#6B7280",
                }}
              >
                {action}
              </Typography>

            </Box>

          )}


          {resultType ===
          "quiz"
            ? renderQuiz()
            : renderResult()}

        </CardContent>

      </Card>


      {/* ASK AI */}

      <Card
        sx={{
          borderRadius: 3,
          border:
            "1px solid #C7D2FE",
          backgroundColor:
            "#EEF2FF",
          boxShadow: "none",
        }}
      >

        <CardContent
          sx={{
            p: {
              xs: 3,
              md: 4,
            },
          }}
        >

          <Box
            sx={{
              display:
                "flex",
              alignItems:
                "center",
              gap: 1.5,
              mb: 1,
            }}
          >

            <SmartToyIcon
              sx={{
                color:
                  "#4F46E5",
                fontSize: 30,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color:
                  "#1E1B4B",
              }}
            >
              Ask SmartStudy AI
            </Typography>

          </Box>


          <Typography
            variant="body2"
            sx={{
              color:
                "#4B5563",
              mb: 3,
            }}
          >
            Ask questions about your
            studies and get help from
            your AI assistant.
          </Typography>


          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Ask anything about your studies..."
            value={question}
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
            sx={{
              backgroundColor:
                "white",

              "& .MuiOutlinedInput-root":
                {
                  borderRadius: 2,
                },
            }}
          />


          <Button
            variant="contained"
            endIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <SendIcon />
              )
            }
            disabled={loading}
            onClick={
              handleAsk
            }
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform:
                "none",
              fontWeight: 600,
              px: 3,
              backgroundColor:
                "#4F46E5",

              "&:hover": {
                backgroundColor:
                  "#4338CA",
              },
            }}
          >

            {loading &&
            action ===
              "SmartStudy AI is thinking..."
              ? "Thinking..."
              : "Ask AI"}

          </Button>


          {answer && (

            <Box
              sx={{
                mt: 3,
                p: 3,
                backgroundColor:
                  "white",
                borderRadius: 3,
                border:
                  "1px solid #E5E7EB",
              }}
            >

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                 AI Answer
              </Typography>

              <Typography
                sx={{
                  color:
                    "#374151",
                  lineHeight:
                    1.8,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {answer}
              </Typography>

            </Box>

          )}

        </CardContent>

      </Card>

    </Box>
  );
}


const actionButton = (
  background: string
) => ({

  py: 1.5,

  borderRadius: 2,

  textTransform:
    "none" as const,

  fontWeight: 600,

  backgroundColor:
    background,

  "&:hover": {

    backgroundColor:
      background,

    filter:
      "brightness(0.9)",
  },

});


export default AI;