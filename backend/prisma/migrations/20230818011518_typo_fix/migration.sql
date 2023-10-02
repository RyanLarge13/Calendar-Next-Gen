/*
  Warnings:

  - You are about to drop the column `attatchmentLength` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "attatchmentLength",
ADD COLUMN     "attachmentLength" INTEGER NOT NULL DEFAULT 0;
