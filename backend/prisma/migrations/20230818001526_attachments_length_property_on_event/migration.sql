-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "attatchmentLength" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "updated" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
