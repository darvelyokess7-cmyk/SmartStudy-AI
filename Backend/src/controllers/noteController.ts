import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createNote,
  getUserNotes,
  updateNote,
  deleteNote,
} from "../services/noteService";

export const addNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, documentId } = req.body;

    const userId = req.user!.id;

    const note = await createNote(
      title,
      content,
      userId,
      Number(documentId)
    );

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const notes = await getUserNotes(userId);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const editNote = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const note = await updateNote(id, title, content);

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const removeNote = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await deleteNote(id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};