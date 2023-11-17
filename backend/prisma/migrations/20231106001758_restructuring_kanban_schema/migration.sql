/*
  Warnings:

  - You are about to drop the column `projectId` on the `Board` table. All the data in the column will be lost.
  - You are about to drop the `BoardItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `color` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderId` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `friendEmail` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Board" DROP CONSTRAINT "Board_projectId_fkey";

-- DropForeignKey
ALTER TABLE "BoardItems" DROP CONSTRAINT "BoardItems_boardId_fkey";

-- AlterTable
ALTER TABLE "Board" DROP COLUMN "projectId",
ADD COLUMN     "categories" JSONB,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "folderId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "friendEmail" TEXT NOT NULL;

-- DropTable
DROP TABLE "BoardItems";

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "private" BOOLEAN NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoardItem" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "categories" JSONB,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "checkLists" JSONB,
    "complete" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messages" JSONB,
    "tasks" JSONB,
    "comments" JSONB,
    "discussions" JSONB,
    "attachments" JSONB,
    "boardId" TEXT NOT NULL,

    CONSTRAINT "BoardItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_id_key" ON "Folder"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BoardItem_id_key" ON "BoardItem"("id");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Kanban"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardItem" ADD CONSTRAINT "BoardItem_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
