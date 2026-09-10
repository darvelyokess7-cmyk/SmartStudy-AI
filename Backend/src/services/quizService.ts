import prisma from "../config/prisma";

export const getQuizByDocument = async (documentId: number) => {
  return await prisma.quiz.findMany({
    where: {
      documentId,
    },
    orderBy: {
      id: "asc",
    },
  });
};


export const saveQuiz = async (
  userId: number,
  documentId: number,
  quiz: any[]
) => {

  if (!Array.isArray(quiz)) {
    throw new Error("AI quiz result is not an array.");
  }

  if (quiz.length === 0) {
    throw new Error("AI generated an empty quiz.");
  }

  const validQuiz = quiz.filter((q) => {
    return (
      q &&
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length >= 4 &&
      typeof q.answer === "string"
    );
  });

  if (validQuiz.length === 0) {
    throw new Error(
      "AI quiz has an invalid format. Questions or options are missing."
    );
  }

  await prisma.quiz.deleteMany({
    where: {
      documentId,
    },
  });

  for (const q of validQuiz) {

    await prisma.quiz.create({
      data: {
        question: q.question.trim(),

        optionA: String(q.options[0]),
        optionB: String(q.options[1]),
        optionC: String(q.options[2]),
        optionD: String(q.options[3]),

        answer: String(q.answer).trim(),

        userId,
        documentId,
      },
    });
  }

  return await prisma.quiz.findMany({
    where: {
      documentId,
    },
    orderBy: {
      id: "asc",
    },
  });
};


export const createQuiz = async (
  question: string,
  answer: string,
  userId: number,
  documentId: number
) => {

  return await prisma.quiz.create({
    data: {
      question: question.trim(),

      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",

      answer: answer.trim(),

      userId,
      documentId,
    },
  });
};


export const getUserQuizzes = async (userId: number) => {

  return await prisma.quiz.findMany({
    where: {
      userId,
    },
    orderBy: {
      id: "desc",
    },
  });
};


export const updateQuiz = async (
  id: number,
  question: string,
  answer: string
) => {

  return await prisma.quiz.update({
    where: {
      id,
    },

    data: {
      question: question.trim(),
      answer: answer.trim(),
    },
  });
};


export const deleteQuiz = async (id: number) => {

  return await prisma.quiz.delete({
    where: {
      id,
    },
  });
};