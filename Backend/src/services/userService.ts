import prisma from "../config/prisma";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const createUser = async (
    fullName : string,
    email : string,
    password : string
) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
        },
    });
    return user;
};
export const loginUser = async (
    email: string,
    password: string
) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET as string,
        { 
            expiresIn: "1d",
        }
    );
    return {
         user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
         },
         token,
        };
};