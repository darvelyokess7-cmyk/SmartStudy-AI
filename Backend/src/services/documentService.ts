import prisma from "../config/prisma";
export const createDocument = async (
    fileName: string,
    filePath: string,
    userId: number
) => {
    return await prisma.document.create({
        data: {
            fileName,
            filePath,
            userId,
        },
    });
};

export const getDocumentsByUserId = async (userId: number) => {
    return await prisma.document.findMany({
        where: { 
            userId
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getDocumentById = async (id: number) => {
    return await prisma.document.findUnique({
        where: { id },
    });
};
