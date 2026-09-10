import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
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
} from "@mui/material";

import NoteIcon from "@mui/icons-material/Note";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
  getNotes,
  createNote,
  deleteNote,
} from "../services/noteService";

function Notes() {
  const [notes, setNotes] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [documentId, setDocumentId] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [openDialog, setOpenDialog] = useState(false);


  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getNotes();

      setNotes(response.data || []);
    } catch (error) {
      console.error("Failed to load notes:", error);
      setError("Unable to load your notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);


  const handleAddNote = async () => {
    setError("");

    if (!title.trim() || !content.trim() || !documentId.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const parsedDocumentId = Number(documentId);

    if (Number.isNaN(parsedDocumentId) || parsedDocumentId <= 0) {
      setError("Please enter a valid Document ID.");
      return;
    }

    try {
      setCreating(true);

      await createNote({
        title: title.trim(),
        content: content.trim(),
        documentId: parsedDocumentId,
      });

      setTitle("");
      setContent("");
      setDocumentId("");

      setOpenDialog(false);

      await loadNotes();
    } catch (error) {
      console.error("Create note error:", error);
      setError("Failed to create note.");
    } finally {
      setCreating(false);
    }
  };


  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await deleteNote(id);

      await loadNotes();
    } catch (error) {
      console.error("Delete note error:", error);
      setError("Failed to delete note.");
    } finally {
      setDeletingId(null);
    }
  };


  const handleCloseDialog = () => {
    if (creating) {
      return;
    }

    setOpenDialog(false);

    setTitle("");
    setContent("");
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
                backgroundColor: "#ECFDF5",
                color: "#10B981",
              }}
            >
              <NoteIcon />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              My Notes
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              mt: 1,
            }}
          >
            Create and organize your study notes in one place.
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
              "linear-gradient(135deg, #10B981, #059669)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #059669, #047857)",
            },
          }}
        >
          Create Note
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
          NOTE COUNT
      ========================= */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: "#6B7280",
          }}
        >
          {notes.length}{" "}
          {notes.length === 1 ? "note" : "notes"} available
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
              Loading your notes...
            </Typography>
          </CardContent>
        </Card>
      ) : notes.length === 0 ? (
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
                backgroundColor: "#ECFDF5",
                color: "#10B981",
                mb: 2,
              }}
            >
              <NoteIcon sx={{ fontSize: 35 }} />
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#374151",
              }}
            >
              No notes yet
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#6B7280",
                mt: 1,
                mb: 3,
              }}
            >
              Create your first study note to keep your
              learning materials organized.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#10B981",
                "&:hover": {
                  backgroundColor: "#059669",
                },
              }}
            >
              Create Your First Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* =========================
           NOTES GRID
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
          {notes.map((note: any) => (
            <Card
              key={note.id}
              sx={{
                borderRadius: 3,
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.08)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Note header */}

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
                      minWidth: 0,
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
                        backgroundColor: "#ECFDF5",
                        color: "#10B981",
                      }}
                    >
                      <NoteIcon />
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#111827",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {note.title}
                    </Typography>
                  </Box>

                  <IconButton
                    color="error"
                    disabled={deletingId === note.id}
                    onClick={() => handleDelete(note.id)}
                  >
                    {deletingId === note.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DeleteOutlineIcon />
                    )}
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Note content */}

                <Typography
                  variant="body2"
                  sx={{
                    color: "#4B5563",
                    lineHeight: 1.8,
                    minHeight: 70,
                    whiteSpace: "pre-wrap",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {note.content}
                </Typography>

                {/* Metadata */}

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, flexWrap: "wrap", }}
                >
                  {note.document?.fileName && (
                    <Chip
                      size="small"
                      icon={<DescriptionIcon />}
                      label={note.document.fileName}
                      sx={{
                        maxWidth: "100%",
                        backgroundColor: "#EFF6FF",
                        color: "#1D4ED8",
                      }}
                    />
                  )}

                  {note.createdAt && (
                    <Chip
                      size="small"
                      icon={<AccessTimeIcon />}
                      label={new Date(
                        note.createdAt
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
          CREATE NOTE DIALOG
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
          Create a New Note

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
            Add a title, your study content and the
            document associated with this note.
          </Typography>

          <TextField
            fullWidth
            label="Note Title"
            placeholder="Example: Chapter 1 - Introduction"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Note Content"
            placeholder="Write your study notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            helperText="Enter the ID of the document associated with this note."
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
            onClick={handleAddNote}
            disabled={creating}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #10B981, #059669)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #059669, #047857)",
              },
            }}
          >
            {creating ? "Creating..." : "Create Note"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Notes;