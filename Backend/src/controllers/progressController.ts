import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createProgress,
  getUserProgress,
  updateProgress,
  deleteProgress,
} from "../services/progressService";

export const addProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { percentage, completed, documentId } = req.body;

    const userId = req.user!.id;

    const progress = await createProgress(
      Number(percentage),
      Boolean(completed),
      userId,
      Number(documentId)
    );

    res.status(201).json({
      success: true,
      message: "Progress created successfully",
      data: progress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const progress = await getUserProgress(userId);

    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const editProgress = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { percentage, completed } = req.body;

    const progress = await updateProgress(
      id,
      Number(percentage),
      Boolean(completed)
    );

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: progress,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const removeProgress = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await deleteProgress(id);

    res.status(200).json({
      success: true,
      message: "Progress deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};