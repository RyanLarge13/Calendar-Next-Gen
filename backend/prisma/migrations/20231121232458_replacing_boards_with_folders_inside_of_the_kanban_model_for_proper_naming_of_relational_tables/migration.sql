-- CreateIndex
CREATE INDEX "userKanbanIndex" ON "Kanban"("userId");

-- CreateIndex
CREATE INDEX "userListIndex" ON "List"("userId");

-- CreateIndex
CREATE INDEX "userStickyindex" ON "Sticky"("userId");

-- CreateIndex
CREATE INDEX "userCategoryIndex" ON "UserCategory"("id");
