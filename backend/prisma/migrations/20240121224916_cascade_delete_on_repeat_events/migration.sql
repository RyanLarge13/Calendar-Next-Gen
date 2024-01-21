-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
