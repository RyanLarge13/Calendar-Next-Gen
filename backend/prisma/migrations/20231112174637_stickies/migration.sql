-- CreateTable
CREATE TABLE "Sticky" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "pin" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Sticky_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sticky_id_key" ON "Sticky"("id");

-- AddForeignKey
ALTER TABLE "Sticky" ADD CONSTRAINT "Sticky_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
