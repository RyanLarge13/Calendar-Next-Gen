-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_reminderRefId_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_eventRefId_fkey";

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_eventRefId_fkey" FOREIGN KEY ("eventRefId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reminderRefId_fkey" FOREIGN KEY ("reminderRefId") REFERENCES "Reminder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
