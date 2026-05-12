-- DropIndex
DROP INDEX "userNotificationIndex";

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "timeDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "timeDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Notification_userId_sentWebPush_timeDate_idx" ON "Notification"("userId", "sentWebPush", "timeDate");
