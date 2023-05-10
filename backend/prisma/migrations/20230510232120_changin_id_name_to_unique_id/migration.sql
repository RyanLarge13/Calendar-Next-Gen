/*
  Warnings:

  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.
  - The required column `uniqueId` was added to the `Event` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "id",
ADD COLUMN     "uniqueId" TEXT NOT NULL;
