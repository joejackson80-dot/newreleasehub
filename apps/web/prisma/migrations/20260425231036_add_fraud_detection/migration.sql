/*
  Warnings:

  - You are about to drop the column `durationSeconds` on the `StreamPlay` table. All the data in the column will be lost.
  - You are about to drop the column `fanId` on the `StreamPlay` table. All the data in the column will be lost.
  - You are about to drop the column `fanType` on the `StreamPlay` table. All the data in the column will be lost.
  - You are about to drop the column `playedAt` on the `StreamPlay` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StreamPlay" DROP CONSTRAINT "StreamPlay_fanId_fkey";

-- AlterTable
ALTER TABLE "StreamPlay" DROP COLUMN "durationSeconds",
DROP COLUMN "fanId",
DROP COLUMN "fanType",
DROP COLUMN "playedAt",
ADD COLUMN     "deviceId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "flagReason" TEXT,
ADD COLUMN     "fraudScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
ADD COLUMN     "hadKeyboardInput" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hadMouseMovement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ipAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ipCountry" TEXT,
ADD COLUMN     "ipIsDatacenter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isExcludedFromPool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listenerId" TEXT,
ADD COLUMN     "listenerType" TEXT,
ADD COLUMN     "playDurationSeconds" INTEGER,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userAgent" VARCHAR(500) NOT NULL DEFAULT '',
ADD COLUMN     "wasAudioMuted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wasTabVisible" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "StreamPlay_deviceId_startedAt_idx" ON "StreamPlay"("deviceId", "startedAt");

-- CreateIndex
CREATE INDEX "StreamPlay_ipAddress_startedAt_idx" ON "StreamPlay"("ipAddress", "startedAt");

-- CreateIndex
CREATE INDEX "StreamPlay_artistId_isExcludedFromPool_idx" ON "StreamPlay"("artistId", "isExcludedFromPool");

-- CreateIndex
CREATE INDEX "StreamPlay_fraudScore_idx" ON "StreamPlay"("fraudScore");

-- AddForeignKey
ALTER TABLE "StreamPlay" ADD CONSTRAINT "StreamPlay_listenerId_fkey" FOREIGN KEY ("listenerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
