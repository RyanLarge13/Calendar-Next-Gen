/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `reminder` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `repeat` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updateaAt` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
DROP COLUMN "reminder",
DROP COLUMN "repeat",
DROP COLUMN "time",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateaAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("event", "userId");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
