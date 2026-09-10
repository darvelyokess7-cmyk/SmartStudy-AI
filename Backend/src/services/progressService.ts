import prisma from "../config/prisma";
export const createProgress = async (
  percentage: number,
  completed: boolean,
  userId: number,
  documentId: number
) => {
  return await prisma.progress.upsert({
    where: {
      userId_documentId: {
        userId,
        documentId,
      },
    },
    update: {
      percentage,
      completed,
    },
    create: {
      percentage,
      completed,
      userId,
      documentId,
    },
  });
};
export const getUserProgress = async (userId: number) => {
  return await prisma.progress.findMany({
    where: {
      userId,
    },
    include: {
      document: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
};

export const updateProgress = async (
  id: number,
  percentage: number,
  completed: boolean
) => {
  return await prisma.progress.update({
    where: {
      id,
    },
    data: {
      percentage,
      completed,
    },
  });
};

export const deleteProgress = async (id: number) => {
  return await prisma.progress.delete({
    where: {
      id,
    },
  });
};