import { Router } from "express";
import {
  addQuiz,
  getQuizzes,
  editQuiz,
  removeQuiz,
} from "../controllers/quizController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, addQuiz);

router.get("/", verifyToken, getQuizzes);

router.put("/:id", verifyToken, editQuiz);

router.delete("/:id", verifyToken, removeQuiz);

export default router;