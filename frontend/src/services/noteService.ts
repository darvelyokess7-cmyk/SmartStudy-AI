import api from "./api";

export interface NoteData {
  title: string;
  content: string;
  documentId: number;
}

export const getNotes = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/notes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createNote = async (data: NoteData) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/notes", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateNote = async (
  id: number,
  title: string,
  content: string
) => {
  const token = localStorage.getItem("token");

  const response = await api.put(
    `/notes/${id}`,
    {
      title,
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteNote = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await api.delete(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};