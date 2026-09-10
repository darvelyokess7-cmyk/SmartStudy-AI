/*
  Warnings:

  - Added the required column `optionA` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionB` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionC` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionD` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "optionA" TEXT NOT NULL,
ADD COLUMN     "optionB" TEXT NOT NULL,
ADD COLUMN     "optionC" TEXT NOT NULL,
ADD COLUMN     "optionD" TEXT NOT NULL;
