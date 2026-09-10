import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const summarizeText = async (text: string) => {
  try {

    console.log("Gemini API Key:", process.env.GEMINI_API_KEY); // Debugging line
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
You are SmartStudy AI, an intelligent study assistant.

Your task is to analyze academic documents and generate a high-quality summary.

Instructions:
- Write the summary in clear English.
- Highlight the main ideas.
- List the important keywords.
- Finish with a short conclusion.

Document:

${text}
      `,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate summary.");
  }
};