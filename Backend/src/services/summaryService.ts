import prisma from "../config/prisma";

export const getSummaryByDocument = async (documentId: number) => {
  return await prisma.summary.findUnique({
    where: {
      documentId,
    },
  });
};

export const saveSummary = async (
  userId: number,
  documentId: number,
  content: string
) => {
  return await prisma.summary.upsert({
    where: {
      documentId,
    },
    update: {
      content,
    },
    create: {
      content,
      userId,
      documentId,
    },
  });
};