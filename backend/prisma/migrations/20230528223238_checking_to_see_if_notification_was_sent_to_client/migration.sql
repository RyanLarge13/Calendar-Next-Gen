/*
  Warnings:

  - Added the required column `sentNotification` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "sentNotification" BOOLEAN NOT NULL;
