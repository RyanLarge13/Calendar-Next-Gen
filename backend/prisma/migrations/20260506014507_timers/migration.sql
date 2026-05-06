-- CreateTable
CREATE TABLE "Timer" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "howLongMS" INTEGER NOT NULL,
    "pauseCount" INTEGER NOT NULL DEFAULT 0,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "lastPausedAt" TEXT NOT NULL DEFAULT '',
    "pinned" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Timer_pkey" PRIMARY KEY ("id")
);
