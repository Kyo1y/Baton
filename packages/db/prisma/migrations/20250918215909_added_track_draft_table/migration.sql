/*
  Warnings:

  - Made the column `altKey` on table `CanonicalTrack` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."CanonicalTrack" ALTER COLUMN "altKey" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."TransferDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "dest" TEXT NOT NULL,
    "selectedSrc" TEXT NOT NULL,
    "selectedDest" TEXT NOT NULL,
    "destDraft" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransferDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransferDraft_userId_idx" ON "public"."TransferDraft"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TransferDraft_userId_source_dest_key" ON "public"."TransferDraft"("userId", "source", "dest");
