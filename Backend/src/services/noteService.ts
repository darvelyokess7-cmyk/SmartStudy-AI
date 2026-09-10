import prisma from "../config/prisma";

export const createNote = async (
  title: string,
  content: string,
  userId: number,
  documentId: number
) => {
  return await prisma.note.create({
    data: {
      title,
      content,
      userId,
      documentId,
    },
  });
};

export const getUserNotes = async (userId: number) => {
  return await prisma.note.findMany({
    where: {
      userId,
    },
    include: {
      document: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateNote = async (
  id: number,
  title: string,
  content: string
) => {
  return await prisma.note.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
  });
};

export const deleteNote = async (id: number) => {
  return await prisma.note.delete({
    where: {
      id,
    },
  });
};