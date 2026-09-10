import api from "./api";

export interface ProgressData {
  percentage: number;
  completed: boolean;
  documentId: number;
}

export const getProgress = async () => {
  const response = await api.get("/progress");
  return response.data;
};

export const createProgress = async (data: ProgressData) => {
  const response = await api.post("/progress", data);
  return response.data;
};

export const updateProgress = async (
  id: number,
  percentage: number,
  completed: boolean
) => {
  const response = await api.put(`/progress/${id}`, {
    percentage,
    completed,
  });

  return response.data;
};

export const deleteProgress = async (id: number) => {
  const response = await api.delete(`/progress/${id}`);
  return response.data;
};