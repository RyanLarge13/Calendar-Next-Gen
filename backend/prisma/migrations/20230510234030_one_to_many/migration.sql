/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uniqueId` on the `Event` table. All the data in the column will be lost.
  - The required column `id` was added to the `Event` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "User_username_email_key";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "uniqueId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");
