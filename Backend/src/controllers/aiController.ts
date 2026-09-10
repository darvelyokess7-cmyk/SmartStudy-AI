import { Request, Response } from "express";
import fs from "fs";
import pdfParse from "pdf-parse";

import {
  askAI,
  summarizeDocument,
  generateFlashcardsAI,
  generateQuizAI,
} from "../services/aiService";

import { getDocumentById } from "../services/documentService";


export const chatWithAI = async (
  req: Request,
  res: Response
) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await askAI(message);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat AI error:", error);

    return res.status(500).json({
      success: false,
      message: "AI request failed",
    });
  }
};


export const summarizeDocumentController = async (
  req: Request,
  res: Response
) => {
  try {
    const documentId = Number(req.params.id);

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const pdfBuffer = fs.readFileSync(
      document.filePath
    );

    const data = await pdfParse(pdfBuffer);

    const summary = await summarizeDocument(
      data.text
    );

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to summarize document",
    });
  }
};



export const generateFlashcards = async (
  req: Request,
  res: Response
) => {
  try {
    const documentId = Number(req.params.id);

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const pdfBuffer = fs.readFileSync(
      document.filePath
    );

    const data = await pdfParse(pdfBuffer);

    const flashcards =
      await generateFlashcardsAI(data.text);

    return res.status(200).json({
      success: true,
      flashcards,
    });
  } catch (error) {
    console.error("Flashcards error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate flashcards",
    });
  }
};


export const generateQuiz = async (
  req: Request,
  res: Response
) => {
  try {
    const documentId = Number(req.params.id);

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const pdfBuffer = fs.readFileSync(
      document.filePath
    );

    const data = await pdfParse(pdfBuffer);

    const quiz = await generateQuizAI(
      data.text
    );

    return res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz",
    });
  }
};