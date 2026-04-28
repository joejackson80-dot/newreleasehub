-- CreateEnum
CREATE TYPE "OrganizationPlan" AS ENUM ('FREE', 'PRO', 'ELITE');

-- CreateEnum
CREATE TYPE "FanType" AS ENUM ('GUEST', 'FREE', 'SUBSCRIBER', 'PATRON');

-- CreateEnum
CREATE TYPE "PoolSource" AS ENUM ('A', 'C');

-- CreateEnum
CREATE TYPE "PoolStatus" AS ENUM ('PENDING', 'CALCULATED', 'PAID');

-- CreateEnum
CREATE TYPE "RoyaltyStatus" AS ENUM ('PENDING', 'PAID');

-- CreateEnum
CREATE TYPE "ShareStatus" AS ENUM ('PENDING', 'CREDITED');

-- CreateEnum
CREATE TYPE "CollabDealType" AS ENUM ('FREE', 'FIFTY_FIFTY', 'CUSTOM_SPLIT', 'PAID_FLAT', 'HYBRID');

-- CreateEnum
CREATE TYPE "CollabType" AS ENUM ('FEATURE', 'PRODUCTION', 'CO_WRITE', 'REMIX', 'OTHER');

-- CreateEnum
CREATE TYPE "CollabRequestStatus" AS ENUM ('PENDING', 'COUNTERED', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FeePaymentStatus" AS ENUM ('UNPAID', 'ESCROWED', 'RELEASED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CollabDealStatus" AS ENUM ('ACTIVE', 'RELEASED', 'DISPUTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "profileImageUrl" TEXT,
    "planTier" "OrganizationPlan" NOT NULL DEFAULT 'FREE',
    "stripeAccountId" TEXT,
    "officialBio" TEXT,
    "pressKitJson" TEXT,
    "youtubeStreamKey" TEXT,
    "twitterStreamKey" TEXT,
    "twitchStreamKey" TEXT,
    "printfulApiKey" TEXT,
    "kunakiUserId" TEXT,
    "headerImageUrl" TEXT,
    "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "city" TEXT,
    "country" TEXT,
    "socialLinksJson" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "liveListenerCount" INTEGER NOT NULL DEFAULT 0,
    "patronCount" INTEGER NOT NULL DEFAULT 0,
    "totalStreams" INTEGER NOT NULL DEFAULT 0,
    "monthlyListeners" INTEGER NOT NULL DEFAULT 0,
    "artistTier" TEXT NOT NULL DEFAULT 'rising',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balanceCents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionArchive" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "externalVodId" TEXT,
    "vodPlatform" TEXT,
    "chatLogJson" TEXT,
    "finalFireCount" INTEGER NOT NULL DEFAULT 0,
    "totalFundingCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionArchive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicAsset" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "allocatedLicenseBps" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releaseId" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "bpm" INTEGER,
    "key" TEXT,
    "mood" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lyrics" TEXT,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "isrc" TEXT,

    CONSTRAINT "MusicAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Release" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'single',
    "coverArtUrl" TEXT,
    "releaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isScheduled" BOOLEAN NOT NULL DEFAULT false,
    "totalPlays" INTEGER NOT NULL DEFAULT 0,
    "isPatronOnly" BOOLEAN NOT NULL DEFAULT false,
    "earlyAccessWindowHours" INTEGER NOT NULL DEFAULT 48,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "badges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "crate" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'free',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patronage" (
    "id" TEXT NOT NULL,
    "fanId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "monthlyAmountCents" INTEGER NOT NULL,
    "revenueSharePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patronage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatronTier" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceMonthlyCents" INTEGER NOT NULL,
    "perks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "revenueSharePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "maxSlots" INTEGER,
    "currentSlots" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatronTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionDeck" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "activeTrackId" TEXT,
    "activeTrackTitle" TEXT NOT NULL DEFAULT 'Untitled Track',
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "backgroundUrl" TEXT,
    "sceneType" TEXT NOT NULL DEFAULT 'NEON_DISTRICT',
    "fireCount" INTEGER NOT NULL DEFAULT 0,
    "coolCount" INTEGER NOT NULL DEFAULT 0,
    "trashCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SessionDeck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueItem" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "musicAssetId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "QueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'NRH',
    "platformIconUrl" TEXT,
    "badge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipationLicense" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "musicAssetId" TEXT,
    "userId" TEXT NOT NULL,
    "allocatedBps" INTEGER NOT NULL,
    "feeCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipationLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merch" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "stockCount" INTEGER,
    "isLiveDrop" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Merch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BidOffer" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "musicAssetId" TEXT,
    "userId" TEXT NOT NULL,
    "offerAmountCents" INTEGER NOT NULL,
    "requestedBps" INTEGER NOT NULL,
    "note" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BidOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiftEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "giftType" TEXT NOT NULL,
    "valueCents" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiftEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" TEXT,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "posterId" TEXT NOT NULL,
    "posterName" TEXT,
    "posterIsVerified" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rewardCents" INTEGER,
    "budget" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "deadline" TIMESTAMP(3),
    "genreTargets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applicantCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetOrgId" TEXT,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MusicReview" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MusicReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FanSubscription" (
    "id" TEXT NOT NULL,
    "fanId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "monthlyAmountCents" INTEGER NOT NULL DEFAULT 999,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextBillingDate" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FanSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamPlay" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "fanId" TEXT,
    "fanType" "FanType" NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "countedAsStream" BOOLEAN NOT NULL DEFAULT false,
    "poolSource" "PoolSource",

    CONSTRAINT "StreamPlay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyPool" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "poolATotal" INTEGER NOT NULL DEFAULT 0,
    "poolCTotal" INTEGER NOT NULL DEFAULT 0,
    "totalPaidStreams" INTEGER NOT NULL DEFAULT 0,
    "totalFreeStreams" INTEGER NOT NULL DEFAULT 0,
    "status" "PoolStatus" NOT NULL DEFAULT 'PENDING',
    "calculatedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyPool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistRoyalty" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "poolAStreams" INTEGER NOT NULL DEFAULT 0,
    "poolAEarnings" INTEGER NOT NULL DEFAULT 0,
    "poolCStreams" INTEGER NOT NULL DEFAULT 0,
    "poolCEarnings" INTEGER NOT NULL DEFAULT 0,
    "patronMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "totalEarnings" INTEGER NOT NULL DEFAULT 0,
    "patronShareDistributed" INTEGER NOT NULL DEFAULT 0,
    "netPayout" INTEGER NOT NULL DEFAULT 0,
    "status" "RoyaltyStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistRoyalty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FanRoyaltyShare" (
    "id" TEXT NOT NULL,
    "fanId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "patronageId" TEXT,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "artistStreamEarnings" INTEGER NOT NULL DEFAULT 0,
    "revenueSharePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "amountEarned" INTEGER NOT NULL DEFAULT 0,
    "status" "ShareStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FanRoyaltyShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdImpression" (
    "id" TEXT NOT NULL,
    "fanId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adDurationSeconds" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "estimatedRevenueCents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AdImpression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollabRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "dealType" "CollabDealType" NOT NULL,
    "requesterSplitPercent" DOUBLE PRECISION,
    "receiverSplitPercent" DOUBLE PRECISION,
    "splitCovers" TEXT[],
    "feeAmountCents" INTEGER,
    "feePaymentStatus" "FeePaymentStatus",
    "stripePaymentIntentId" TEXT,
    "collabType" "CollabType" NOT NULL,
    "projectTitle" TEXT,
    "message" VARCHAR(500) NOT NULL,
    "demoUrl" TEXT,
    "proposedDeadline" TIMESTAMP(3),
    "status" "CollabRequestStatus" NOT NULL DEFAULT 'PENDING',
    "counterCount" INTEGER NOT NULL DEFAULT 0,
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "CollabRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollabNegotiationHistory" (
    "id" TEXT NOT NULL,
    "collabRequestId" TEXT NOT NULL,
    "proposedById" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "dealType" "CollabDealType" NOT NULL,
    "requesterSplitPercent" DOUBLE PRECISION,
    "receiverSplitPercent" DOUBLE PRECISION,
    "feeAmountCents" INTEGER,
    "message" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollabNegotiationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollabDeal" (
    "id" TEXT NOT NULL,
    "collabRequestId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "dealType" "CollabDealType" NOT NULL,
    "requesterSplitPercent" DOUBLE PRECISION,
    "receiverSplitPercent" DOUBLE PRECISION,
    "feeAmountCents" INTEGER,
    "feePaidAt" TIMESTAMP(3),
    "agreedTermsSummary" VARCHAR(1000) NOT NULL,
    "releaseId" TEXT,
    "status" "CollabDealStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollabDeal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SessionDeck_organizationId_key" ON "SessionDeck"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Follower_organizationId_userId_key" ON "Follower"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_userId_type_organizationId_key" ON "Badge"("userId", "type", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyPool_month_year_key" ON "MonthlyPool"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "CollabDeal_collabRequestId_key" ON "CollabDeal"("collabRequestId");

-- AddForeignKey
ALTER TABLE "SessionArchive" ADD CONSTRAINT "SessionArchive_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicAsset" ADD CONSTRAINT "MusicAsset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicAsset" ADD CONSTRAINT "MusicAsset_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Release" ADD CONSTRAINT "Release_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patronage" ADD CONSTRAINT "Patronage_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patronage" ADD CONSTRAINT "Patronage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patronage" ADD CONSTRAINT "Patronage_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "PatronTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatronTier" ADD CONSTRAINT "PatronTier_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionDeck" ADD CONSTRAINT "SessionDeck_activeTrackId_fkey" FOREIGN KEY ("activeTrackId") REFERENCES "MusicAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionDeck" ADD CONSTRAINT "SessionDeck_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "SessionDeck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_musicAssetId_fkey" FOREIGN KEY ("musicAssetId") REFERENCES "MusicAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationLicense" ADD CONSTRAINT "ParticipationLicense_musicAssetId_fkey" FOREIGN KEY ("musicAssetId") REFERENCES "MusicAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationLicense" ADD CONSTRAINT "ParticipationLicense_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merch" ADD CONSTRAINT "Merch_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidOffer" ADD CONSTRAINT "BidOffer_musicAssetId_fkey" FOREIGN KEY ("musicAssetId") REFERENCES "MusicAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftEvent" ADD CONSTRAINT "GiftEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MusicReview" ADD CONSTRAINT "MusicReview_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FanSubscription" ADD CONSTRAINT "FanSubscription_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamPlay" ADD CONSTRAINT "StreamPlay_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamPlay" ADD CONSTRAINT "StreamPlay_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamPlay" ADD CONSTRAINT "StreamPlay_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "MusicAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistRoyalty" ADD CONSTRAINT "ArtistRoyalty_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FanRoyaltyShare" ADD CONSTRAINT "FanRoyaltyShare_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FanRoyaltyShare" ADD CONSTRAINT "FanRoyaltyShare_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdImpression" ADD CONSTRAINT "AdImpression_fanId_fkey" FOREIGN KEY ("fanId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabRequest" ADD CONSTRAINT "CollabRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabRequest" ADD CONSTRAINT "CollabRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabNegotiationHistory" ADD CONSTRAINT "CollabNegotiationHistory_collabRequestId_fkey" FOREIGN KEY ("collabRequestId") REFERENCES "CollabRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabDeal" ADD CONSTRAINT "CollabDeal_collabRequestId_fkey" FOREIGN KEY ("collabRequestId") REFERENCES "CollabRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabDeal" ADD CONSTRAINT "CollabDeal_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabDeal" ADD CONSTRAINT "CollabDeal_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollabDeal" ADD CONSTRAINT "CollabDeal_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE SET NULL ON UPDATE CASCADE;
