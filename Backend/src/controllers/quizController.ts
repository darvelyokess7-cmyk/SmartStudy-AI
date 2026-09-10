import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createQuiz,
  getUserQuizzes,
  updateQuiz,
  deleteQuiz,
} from "../services/quizService";

export const addQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { question, answer, documentId } = req.body;

    const userId = req.user!.id;

    const quiz = await createQuiz(
      question,
      answer,
      userId,
      Number(documentId)
    );

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const quizzes = await getUserQuizzes(userId);

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const editQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { question, answer } = req.body;

    const quiz = await updateQuiz(id, question, answer);

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const removeQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await deleteQuiz(id);

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};