import { Router } from "express";

import {
  chatWithAI,
  summarizeDocumentController,
  generateFlashcards,
  generateQuiz,
} from "../controllers/aiController";

const router = Router();

router.post("/chat", chatWithAI);

router.post(
  "/documents/:id/summarize",
  summarizeDocumentController
);

router.post(
  "/documents/:id/flashcards",
  generateFlashcards
);

router.post(
  "/documents/:id/quiz",
  generateQuiz
);

export default router;