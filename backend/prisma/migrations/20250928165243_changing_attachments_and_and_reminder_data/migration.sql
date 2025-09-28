-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "title" TEXT,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
