/*
  Warnings:

  - Added the required column `color` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "color" TEXT NOT NULL;
