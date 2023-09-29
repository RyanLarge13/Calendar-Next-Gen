-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "nextDate" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "eventId" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "eventId" TEXT;

-- CreateTable
CREATE TABLE "RepeatEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "date" TEXT,
    "reminders" JSONB,
    "nextDate" TEXT,
    "start" JSONB,
    "end" JSONB,

    CONSTRAINT "RepeatEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RepeatEvent_id_key" ON "RepeatEvent"("id");

-- CreateIndex
CREATE INDEX "eventRepeatIdIndex" ON "RepeatEvent"("eventId");

-- CreateIndex
CREATE INDEX "userNotificationIndex" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "userReminderIndex" ON "Reminder"("userId");

-- CreateIndex
CREATE INDEX "userTaskIndex" ON "Task"("userId");

-- AddForeignKey
ALTER TABLE "RepeatEvent" ADD CONSTRAINT "RepeatEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_eventRefId_fkey" FOREIGN KEY ("eventRefId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reminderRefId_fkey" FOREIGN KEY ("reminderRefId") REFERENCES "Reminder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
