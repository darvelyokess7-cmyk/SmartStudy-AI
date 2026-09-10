import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";
import { uploadDocument,
   getDocuments, summarize,
    generateFlashcardsController, 
    generateQuizController, 
    generateNotesController } from "../controllers/documentController";

const router = Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("document"),
  uploadDocument
);

router.get(
  "/",
  verifyToken,
  getDocuments
);

router.post(
  "/:id/summarize",
  verifyToken,
  summarize
);

router.post(
  "/:id/flashcards",
  verifyToken,
  generateFlashcardsController
);

router.post(
  "/:id/quiz",
  verifyToken,
  generateQuizController
);

router.post(
  "/:id/notes",
  verifyToken,
  generateNotesController
);

export default router;