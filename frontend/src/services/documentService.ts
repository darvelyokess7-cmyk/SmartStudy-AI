import api from "./api";

export const summarizeDocument = async (id: number) => {
  const response = await api.post(`/documents/${id}/summarize`);
  return response.data;
}

export const getDocuments = async () => {
  const response = await api.get("/documents");
  return response.data;
};

export const uploadDocument = async (formData: FormData) => {
  const response = await api.post(
    "/documents/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteDocument = async (id: number) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

export const generateFlashcards = async (id: number) => {
  const response = await api.post(`/documents/${id}/flashcards`);
  return response.data;
}

export const generateQuiz = async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/api/documents/${id}/quiz`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return response.json();
}

export const generateNotes = async (id: number) => {
  const response = await api.post(`/documents/${id}/notes`);
  return response.data;
};
