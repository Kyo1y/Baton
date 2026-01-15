/*
  Warnings:

  - Changed the type of `source` on the `TransferDraft` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dest` on the `TransferDraft` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."TransferDraft" DROP COLUMN "source",
ADD COLUMN     "source" "public"."Provider" NOT NULL,
DROP COLUMN "dest",
ADD COLUMN     "dest" "public"."Provider" NOT NULL;

-- CreateIndex
CREATE INDEX "TransferDraft_userId_source_dest_idx" ON "public"."TransferDraft"("userId", "source", "dest");
