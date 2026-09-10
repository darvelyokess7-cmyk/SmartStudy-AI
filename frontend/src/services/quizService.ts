import api from "./api";

export interface QuizData {
  question: string;
  answer: string;
  documentId: number;
}

export const getQuizzes = async () => {
  const response = await api.get("/quizzes");
  return response.data;
};

export const createQuiz = async (data: QuizData) => {
  const response = await api.post("/quizzes", data);
  return response.data;
};

export const updateQuiz = async (
  id: number,
  question: string,
  answer: string
) => {
  const response = await api.put(`/quizzes/${id}`, {
    question,
    answer,
  });

  return response.data;
};

export const deleteQuiz = async (id: number) => {
  const response = await api.delete(`/quizzes/${id}`);
  return response.data;
};