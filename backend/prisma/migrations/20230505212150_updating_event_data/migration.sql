/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `event` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `updateaAt` on the `Event` table. All the data in the column will be lost.
  - Added the required column `end` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "event",
DROP COLUMN "updateaAt",
ADD COLUMN     "attatchments" JSONB,
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "end" JSONB NOT NULL,
ADD COLUMN     "kind" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "reminders" JSONB,
ADD COLUMN     "repeats" JSONB,
ADD COLUMN     "start" JSONB NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("userId");
