/*
  Warnings:

  - Changed the type of `provider` on the `ProviderProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."ProviderProfile" DROP COLUMN "provider",
ADD COLUMN     "provider" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Provider";

-- CreateIndex
CREATE INDEX "ProviderProfile_provider_providerId_idx" ON "public"."ProviderProfile"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_userId_provider_key" ON "public"."ProviderProfile"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_provider_providerId_key" ON "public"."ProviderProfile"("provider", "providerId");
