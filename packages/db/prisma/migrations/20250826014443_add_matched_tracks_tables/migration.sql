-- CreateTable
CREATE TABLE "public"."TrackExternalId" (
    "id" TEXT NOT NULL,
    "canonicalId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,

    CONSTRAINT "TrackExternalId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CanonicalTrack" (
    "id" TEXT NOT NULL,
    "isrc" TEXT,
    "title" TEXT NOT NULL,
    "artists" TEXT[],
    "durationMs" INTEGER NOT NULL,
    "altKey" TEXT,

    CONSTRAINT "CanonicalTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackExternalId_provider_externalId_key" ON "public"."TrackExternalId"("provider", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "TrackExternalId_canonicalId_provider_key" ON "public"."TrackExternalId"("canonicalId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "CanonicalTrack_isrc_key" ON "public"."CanonicalTrack"("isrc");

-- CreateIndex
CREATE UNIQUE INDEX "CanonicalTrack_altKey_key" ON "public"."CanonicalTrack"("altKey");

-- AddForeignKey
ALTER TABLE "public"."TrackExternalId" ADD CONSTRAINT "TrackExternalId_canonicalId_fkey" FOREIGN KEY ("canonicalId") REFERENCES "public"."CanonicalTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
