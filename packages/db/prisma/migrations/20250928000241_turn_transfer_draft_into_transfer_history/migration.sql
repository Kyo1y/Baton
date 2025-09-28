-- CreateEnum
CREATE TYPE "public"."TransferStatus" AS ENUM ('RUNNING', 'SUCCESS', 'PARTIAL', 'FAILED', 'CANCELED');

-- DropIndex
DROP INDEX "public"."TransferDraft_userId_source_dest_key";

-- AlterTable
ALTER TABLE "public"."TransferDraft" ADD COLUMN     "added" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "failed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "public"."TransferStatus" NOT NULL DEFAULT 'RUNNING';

-- CreateIndex
CREATE INDEX "TransferDraft_userId_status_createdAt_idx" ON "public"."TransferDraft"("userId", "status", "createdAt");
