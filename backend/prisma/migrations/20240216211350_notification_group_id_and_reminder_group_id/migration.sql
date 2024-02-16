-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "eventRefId" TEXT,
ADD COLUMN     "groupId" TEXT;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "groupId" TEXT;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_eventRefId_fkey" FOREIGN KEY ("eventRefId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
