/*
  Warnings:

  - Added the required column `tags` to the `BoardItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BoardItem" ADD COLUMN     "tags" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "repeat" JSONB;

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "requested" BOOLEAN NOT NULL,
    "availableSlots" JSONB NOT NULL,
    "duration" JSONB NOT NULL,
    "reminders" TEXT[],
    "confirmed" BOOLEAN NOT NULL,
    "rescheduled" BOOLEAN NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    "noShow" BOOLEAN NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "cancelled" BOOLEAN NOT NULL,
    "finalNotes" TEXT NOT NULL,
    "customerNotes" TEXT NOT NULL,
    "burnoutDays" TEXT[],
    "overbooking" TEXT[],

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
