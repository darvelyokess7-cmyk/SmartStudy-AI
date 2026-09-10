import { Request, Response } from "express";
import { summarizeText } from "./aiService";

export const summarize = async (
  req: Request,
  res: Response
) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const summary = await summarizeText(text);

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI failed to generate summary",
    });
  }
};