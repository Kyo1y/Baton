/*
  Warnings:

  - Made the column `refresh_token` on table `IntegrationToken` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expires_at` on table `IntegrationToken` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."IntegrationToken" ALTER COLUMN "refresh_token" SET NOT NULL,
ALTER COLUMN "expires_at" SET NOT NULL;
