-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "sentWebPush" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "read" SET DEFAULT false,
ALTER COLUMN "sentNotification" SET DEFAULT false;
