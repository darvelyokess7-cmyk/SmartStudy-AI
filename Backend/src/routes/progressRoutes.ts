import { Router } from "express";
import {
  addProgress,
  getProgress,
  editProgress,
  removeProgress,
} from "../controllers/progressController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, addProgress);

router.get("/", verifyToken, getProgress);

router.put("/:id", verifyToken, editProgress);

router.delete("/:id", verifyToken, removeProgress);

export default router;