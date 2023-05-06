/*
  Warnings:

  - A unique constraint covering the columns `[username,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_username_email_key" ON "User"("username", "email");
