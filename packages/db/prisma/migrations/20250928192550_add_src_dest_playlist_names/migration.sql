/*
  Warnings:

  - Added the required column `srcPlaylistName` to the `TransferDraft` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TransferDraft" ADD COLUMN     "destPlaylistName" TEXT,
ADD COLUMN     "srcPlaylistName" TEXT NOT NULL;
