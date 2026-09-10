import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  createDocument,
  getDocumentsByUserId,
} from "../services/documentService";
import fs from "fs";
import pdfParse from "pdf-parse";
import { summarizeDocument } from "../services/aiService";
import { getDocumentById } from "../services/documentService";
import { generateFlashcardsAI } from "../services/aiService";
import { generateQuizAI } from "../services/aiService";
import { getQuizByDocument, saveQuiz } from "../services/quizService";
import { getSummaryByDocument, saveSummary } from "../services/summaryService";
import { generateNotesAI } from "../services/aiService";
import { createNote } from "../services/noteService";


export const generateFlashcardsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const buffer = fs.readFileSync(document.filePath);

    const pdf = await pdfParse(buffer);

    const flashcards = await generateFlashcardsAI(pdf.text);

    res.status(200).json({
      success: true,
      flashcards,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const generateQuizController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const existingQuiz = await getQuizByDocument(id);

    if (existingQuiz.length > 0) {
      return res.status(200).json({
        success: true,
        quiz: existingQuiz,
        source: "database",
      });
    }

    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const buffer = fs.readFileSync(document.filePath);
    const pdf = await pdfParse(buffer);

    const generatedQuiz = await generateQuizAI(pdf.text);

    const savedQuiz = await saveQuiz(
      userId,
      id,
      generatedQuiz
    );

    res.status(200).json({
      success: true,
      quiz: savedQuiz,
      source: "ai",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const summarize = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const existingSummary = await getSummaryByDocument(id);

    if (existingSummary) {
      return res.status(200).json({
        success: true,
        summary: existingSummary.content,
        source: "database",
      });
    }

    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const buffer = fs.readFileSync(document.filePath);
    const pdf = await pdfParse(buffer);

    const summary = await summarizeDocument(pdf.text);

    await saveSummary(userId, id, summary || "");

    res.status(200).json({
      success: true,
      summary,
      source: "ai",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const uploadDocument = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const userId = req.user!.id;

    const document = await createDocument(
      req.file.originalname,
      req.file.path,
      userId
    );

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getDocuments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const documents = await getDocumentsByUserId(userId);

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const generateNotesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;

    const document = await getDocumentById(id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const buffer = fs.readFileSync(document.filePath);
    const pdf = await pdfParse(buffer);

    const notesContent = await generateNotesAI(pdf.text);

    const note = await createNote(
      document.fileName,
      notesContent,
      userId,
      id
    );

    res.status(200).json({
      success: true,
      message: "AI notes generated successfully",
      note,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI notes",
    });
  }
};