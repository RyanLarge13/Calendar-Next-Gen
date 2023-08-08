/*
  Warnings:

  - You are about to drop the column `attatchments` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "attatchments";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "reminderRefId" TEXT;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "eventRefId" TEXT;

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "content" BYTEA NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "eventIdIndex" ON "Event"("id");

-- CreateIndex
CREATE INDEX "userIdRefIndex" ON "Event"("userId");

-- CreateIndex
CREATE INDEX "userIdIndex" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
