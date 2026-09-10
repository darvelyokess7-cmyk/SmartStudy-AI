import { Router } from "express";
import {
  addNote,
  getNotes,
  editNote,
  removeNote,
} from "../controllers/noteController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();
router.post("/", verifyToken, addNote);
router.get("/", verifyToken, getNotes);
router.put("/:id", verifyToken, editNote);
router.delete("/:id", verifyToken, removeNote);

export default router;