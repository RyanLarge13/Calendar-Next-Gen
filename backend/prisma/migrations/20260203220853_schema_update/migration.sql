-- DropIndex
DROP INDEX "public"."eventIdIndex";

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "eventUserId" TEXT;

-- CreateIndex
CREATE INDEX "Reminder_eventRefId_eventUserId_idx" ON "Reminder"("eventRefId", "eventUserId");
