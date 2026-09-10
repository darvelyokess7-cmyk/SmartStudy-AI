import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Change uniquement cette ligne si le modèle gratuit devient indisponible
const MODEL = "openrouter/free";

export const askAI = async (message: string) => {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are SmartStudy AI, an intelligent study assistant. Help students answer questions, explain concepts and generate study materials.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.choices[0].message.content;
};

export const summarizeDocument = async (text: string) => {
  const prompt = `
Read the following study document and generate a clean, professional study summary.

Rules:
- Use Markdown formatting.
- Do NOT use HTML tags like <br>.
- Use headings (#, ##).
- Use bullet points.
- Highlight important keywords in **bold**.
- Keep the summary concise and easy to study.
- End with 5 key takeaways.

Document:

${text}
`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are SmartStudy AI, an expert educational assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content;
};

export const generateFlashcardsAI = async (text: string) => {
  const prompt = `
Generate 10 study flashcards.

Return ONLY valid JSON.

Example:

[
  {
    "question":"What is a Binary Tree?",
    "answer":"A hierarchical data structure where each node has at most two children."
  }
]

Document:

${text}
`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You generate educational flashcards in JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content || "[]");
};

export const generateQuizAI = async (text: string) => {
  const prompt = `
You are SmartStudy AI.

Read the following study document and generate exactly 10 multiple-choice questions.

IMPORTANT RULES:

1. Generate exactly 10 questions.
2. Each question MUST have exactly 4 options.
3. Each option must be different.
4. There must be exactly ONE correct answer.
5. The "answer" must be exactly equal to one of the four options.
6. Questions must be based ONLY on the document.
7. Do not invent information.
8. Return ONLY valid JSON.
9. Do not use Markdown.
10. Do not add explanations.

The JSON format MUST be:

[
  {
    "question": "What is a Binary Search Tree?",
    "options": [
      "A graph",
      "A queue",
      "A tree structure",
      "A database"
    ],
    "answer": "A tree structure"
  }
]

Document:

${text}
`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an educational AI that generates strict JSON multiple-choice quizzes.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content =
    response.choices[0].message.content || "[]";

  console.log("AI QUIZ RAW RESPONSE:");
  console.log(content);

  try {
    const quiz = JSON.parse(content);

    if (!Array.isArray(quiz)) {
      throw new Error("Quiz is not an array.");
    }

    const validQuiz = quiz.filter((q: any) => {
      return (
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.answer === "string" &&
        q.options.includes(q.answer)
      );
    });

    if (validQuiz.length === 0) {
      throw new Error(
        "AI did not generate a valid multiple-choice quiz."
      );
    }

    return validQuiz.slice(0, 10);

  } catch (error) {
    console.error("Quiz JSON parsing/validation error:", error);

    throw new Error(
      "AI generated an invalid quiz format."
    );
  }
};

export const generateNotesAI = async (text: string) => {
  const prompt = `
You are SmartStudy AI.

Read the following study document and generate organized study notes.

Rules:
- Create clear and useful study notes.
- Use Markdown formatting.
- Use headings with # and ##.
- Use bullet points.
- Highlight important concepts with **bold**.
- Include definitions, important concepts, formulas or examples when present.
- Do not invent information that is not in the document.
- Make the notes easy for a student to revise.
- Return ONLY the notes.
- Do not add explanations about the generation process.

Document:

${text}
`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are SmartStudy AI, an expert educational assistant that creates structured study notes.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content || "";
};