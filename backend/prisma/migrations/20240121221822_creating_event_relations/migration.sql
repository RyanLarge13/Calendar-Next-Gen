-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
