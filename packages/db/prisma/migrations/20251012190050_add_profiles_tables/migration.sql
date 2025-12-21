-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('SPOTIFY', 'GITHUB', 'GOOGLE', 'YTMUSIC');

-- CreateTable
CREATE TABLE "public"."ProviderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "public"."Provider" NOT NULL,
    "providerId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProviderProfile_provider_providerId_idx" ON "public"."ProviderProfile"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_userId_provider_key" ON "public"."ProviderProfile"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_provider_providerId_key" ON "public"."ProviderProfile"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "public"."ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
