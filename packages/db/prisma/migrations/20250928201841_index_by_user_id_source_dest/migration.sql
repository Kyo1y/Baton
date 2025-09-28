-- DropIndex
DROP INDEX "public"."TransferDraft_userId_idx";

-- CreateIndex
CREATE INDEX "TransferDraft_userId_source_dest_idx" ON "public"."TransferDraft"("userId", "source", "dest");
