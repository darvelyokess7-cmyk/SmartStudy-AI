import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import documentRoutes from "./routes/documentRoutes";
import path from "path";
import noteRoutes from "./routes/noteRoutes";
import quizRoutes from "./routes/quizRoutes";
import progressRoutes from "./routes/progressRoutes";
import aiRoutes from "./routes/aiRoutes";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(morgan("dev"));

app.use("/api/auth", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: " Welcome to SmartStudy API",
    version: "1.0.0",
  });
});

export default app;