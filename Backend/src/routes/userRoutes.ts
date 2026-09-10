import { Router } from "express";
import { registerUser, login } from "../controllers/userController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "user profile accessed successfully",
  });
});

export default router;