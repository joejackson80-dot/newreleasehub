/**
 * NRH ROYALTY CALCULATION ENGINE
 * ================================
 * Dual-pool streaming income system — Model A + C
 * 
 * Model A: Paid subscriber streams → 70% of subscription revenue
 * Model C: Free listener streams  → 60% of ad revenue
 *
 * Run this on the 1st of every month via cron job.
 * Drop this file into: /src/lib/royalties/calculateRoyalties.ts
 */

import { prisma } from '@/lib/prisma';
import { checkAndAwardMilestones } from '@/lib/milestones/detectMilestone';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface PoolTotals {
  premiumPoolTotal: number     // cents — 70% of subscription revenue
  networkPoolTotal: number     // cents — 60% of ad revenue
  totalPremiumStreams: number  // counted streams from subscribers/SUPPORTERs
  totalNetworkStreams: number  // counted streams from free/guest users
  month: number                // 1–12
  year: number
}

interface ArtistStreamData {
  artistId: string
  premiumStreams: number
  networkStreams: number
  supporterCount: number
}

interface ArtistEarnings {
  artistId: string
  premiumStreams: number
  networkStreams: number
  premiumEarnings: number          // cents
  networkEarnings: number          // cents
  grossStreamingEarnings: number // cents — before multiplier
  supporterMultiplier: number       // 1.0 – 1.5
  totalEarnings: number          // cents — after multiplier
  supporterShareDistributed: number // cents — paid out to SUPPORTERs
  netPayout: number              // cents — what artist actually gets
}

interface SUPPORTERShareEntry {
  fanId: string
  artistId: string
  supportId: string
  revenueSharePercent: number
  amountEarned: number // cents
}

interface RoyaltyReport {
  month: number
  year: number
  premiumPoolTotal: number
  networkPoolTotal: number
  totalPremiumStreams: number
  totalNetworkStreams: number
  artistCount: number
  totalArtistPayout: number      // cents
  totalSUPPORTERDistribution: number // cents
  totalNRHRevenue: number        // cents
  artists: ArtistEarnings[]
  SUPPORTERShares: SUPPORTERShareEntry[]
  errors: string[]
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const POOL_A_ARTIST_SHARE    = 0.70  // 70% of subscription revenue to artists
const POOL_C_ARTIST_SHARE    = 0.60  // 60% of ad revenue to artists
const MIN_STREAM_SECONDS     = 30    // streams under 30s don't count
const MIN_PAYOUT_CENTS       = 1000  // $10 minimum payout
const FAN_MIN_WITHDRAW_CENTS = 500   // $5 minimum fan withdrawal

// SUPPORTER multiplier thresholds
const MULTIPLIER_TIERS = [
  { minSUPPORTERs: 2000, multiplier: 1.5 },
  { minSUPPORTERs: 500,  multiplier: 1.2 },
  { minSUPPORTERs: 100,  multiplier: 1.1 },
  { minSUPPORTERs: 0,    multiplier: 1.0 },
] as const

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function getsupporterMultiplier(supporterCount: number): number {
  for (const tier of MULTIPLIER_TIERS) {
    if (supporterCount >= tier.minSUPPORTERs) {
      return tier.multiplier
    }
  }
  return 1.0
}

function getMonthBounds(month: number, year: number): { start: Date; end: Date } {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0)
  const end   = new Date(year, month, 1, 0, 0, 0, 0) 
  return { start, end }
}

function getPreviousMonth(): { month: number; year: number } {
  const now   = new Date()
  const month = now.getMonth() === 0 ? 12 : now.getMonth()
  const year  = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()
  return { month, year }
}

function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return numerator / denominator
}

function roundCents(value: number): number {
  return Math.floor(value)
}

// ─────────────────────────────────────────────
// STEP 1 — CALCULATE POOL TOTALS
// ─────────────────────────────────────────────

async function calculatePoolTotals(
  month: number,
  year: number
): Promise<PoolTotals> {
  const { start, end } = getMonthBounds(month, year)

  const subscriptions = await prisma.fanSubscription.findMany({
    where: {
      status: 'active',
      startDate: { lte: end },
      OR: [
        { cancelledAt: null },
        { cancelledAt: { gte: start } },
      ],
    },
    select: { monthlyAmountCents: true },
  })

  const poolAGross = subscriptions.reduce(
    (sum, sub) => sum + sub.monthlyAmountCents,
    0
  )
  const premiumPoolTotal = roundCents(poolAGross * POOL_A_ARTIST_SHARE)

  const adImpressions = await prisma.adImpression.findMany({
    where: {
      timestamp: { gte: start, lt: end },
      completed: true,
    },
    select: { estimatedRevenueCents: true },
  })

  const poolCGross = adImpressions.reduce(
    (sum, ad) => sum + ad.estimatedRevenueCents,
    0
  )
  const networkPoolTotal = roundCents(poolCGross * POOL_C_ARTIST_SHARE)

  const premiumStreamCount = await prisma.streamPlay.count({
    where: {
      startedAt: { gte: start, lt: end },
      countedAsStream: true,
      isExcludedFromPool: false,
      poolSource: 'A',
    },
  })

  const networkStreamCount = await prisma.streamPlay.count({
    where: {
      startedAt: { gte: start, lt: end },
      countedAsStream: true,
      isExcludedFromPool: false,
      poolSource: 'C',
    },
  })

  return {
    premiumPoolTotal,
    networkPoolTotal,
    totalPremiumStreams: premiumStreamCount,
    totalNetworkStreams: networkStreamCount,
    month,
    year,
  }
}

// ─────────────────────────────────────────────
// STEP 2 — GET ARTIST STREAM DATA
// ─────────────────────────────────────────────

async function getArtistStreamData(
  month: number,
  year: number
): Promise<ArtistStreamData[]> {
  const { start, end } = getMonthBounds(month, year)

  const streamGroups = await prisma.streamPlay.groupBy({
    by: ['artistId', 'poolSource'],
    where: {
      startedAt: { gte: start, lt: end },
      countedAsStream: true,
      isExcludedFromPool: false,
    },
    _count: { id: true },
  })

  const artistIds = [...new Set(streamGroups.map((g) => g.artistId))]

  const organizations = await prisma.organization.findMany({
    where: { id: { in: artistIds } },
    select: {
      id: true,
      _count: {
        select: {
          SupporterSubscriptions: {
            where: { status: 'ACTIVE' },
          },
        },
      },
    },
  })

  const supporterCountMap = new Map(
    organizations.map((o) => [o.id, o._count.SupporterSubscriptions])
  )

  const artistDataMap = new Map<string, ArtistStreamData>()

  for (const group of streamGroups) {
    const existing = artistDataMap.get(group.artistId) ?? {
      artistId:       group.artistId,
      premiumStreams:  0,
      networkStreams:  0,
      supporterCount:    supporterCountMap.get(group.artistId) ?? 0,
    }

    if (group.poolSource === 'A') {
      existing.premiumStreams += group._count.id
    } else if (group.poolSource === 'C') {
      existing.networkStreams += group._count.id
    }

    artistDataMap.set(group.artistId, existing)
  }

  return Array.from(artistDataMap.values())
}

// ─────────────────────────────────────────────
// STEP 3 — CALCULATE ARTIST EARNINGS
// ─────────────────────────────────────────────

function calculateArtistEarnings(
  artistData: ArtistStreamData[],
  pools: PoolTotals
): Omit<ArtistEarnings, 'supporterShareDistributed' | 'netPayout'>[] {
  return artistData.map((artist) => {
    const premiumShare    = safeDivide(artist.premiumStreams, pools.totalPremiumStreams)
    const premiumEarnings = roundCents(premiumShare * pools.premiumPoolTotal)

    const networkShare    = safeDivide(artist.networkStreams, pools.totalNetworkStreams)
    const networkEarnings = roundCents(networkShare * pools.networkPoolTotal)

    const grossStreamingEarnings = premiumEarnings + networkEarnings
    const supporterMultiplier = getsupporterMultiplier(artist.supporterCount)
    const totalEarnings = roundCents(grossStreamingEarnings * supporterMultiplier)

    return {
      artistId:             artist.artistId,
      premiumStreams:       artist.premiumStreams,
      networkStreams:       artist.networkStreams,
      premiumEarnings,
      networkEarnings,
      grossStreamingEarnings,
      supporterMultiplier,
      totalEarnings,
    }
  })
}

// ─────────────────────────────────────────────
// STEP 4 — CALCULATE SUPPORTER REVENUE SHARES
// ─────────────────────────────────────────────

async function calculateSUPPORTERShares(
  artistEarnings: Omit<ArtistEarnings, 'supporterShareDistributed' | 'netPayout'>[]
): Promise<{
  SUPPORTERShares: SUPPORTERShareEntry[]
  artistNetPayouts: Map<string, { distributed: number; net: number }>
}> {
  const SUPPORTERShares: SUPPORTERShareEntry[]  = []
  const artistNetPayouts = new Map<string, { distributed: number; net: number }>()

  for (const artist of artistEarnings) {
    if (artist.totalEarnings === 0) {
      artistNetPayouts.set(artist.artistId, { distributed: 0, net: 0 })
      continue
    }

    const Support = await prisma.supporterSubscription.findMany({
      where: {
        artistId: artist.artistId,
        status:   'ACTIVE',
      },
      select: {
        id:                   true,
        fanId:                true,
        revenueSharePercent:  true,
      },
    })

    let totalDistributed = 0

    for (const support of Support) {
      const shareDecimal = support.revenueSharePercent / 100
      const amountEarned = roundCents(artist.totalEarnings * shareDecimal)

      if (amountEarned > 0) {
        SUPPORTERShares.push({
          fanId:               support.fanId,
          artistId:            artist.artistId,
          supportId:         support.id,
          revenueSharePercent: support.revenueSharePercent,
          amountEarned,
        })
        totalDistributed += amountEarned
      }
    }

    const netPayout = Math.max(0, artist.totalEarnings - totalDistributed)

    artistNetPayouts.set(artist.artistId, {
      distributed: totalDistributed,
      net:         netPayout,
    })
  }

  return { SUPPORTERShares, artistNetPayouts }
}

// ─────────────────────────────────────────────
// STEP 5 — WRITE TO DATABASE
// ─────────────────────────────────────────────

async function persistRoyalties(
  month: number,
  year: number,
  pools: PoolTotals,
  fullArtistEarnings: ArtistEarnings[],
  SUPPORTERShares: SUPPORTERShareEntry[]
): Promise<void> {
  await prisma.$transaction(async (tx) => {

    await tx.monthlyPool.upsert({
      where:  { month_year: { month, year } },
      create: {
        month,
        year,
        poolATotal:          pools.premiumPoolTotal,
        poolCTotal:          pools.networkPoolTotal,
        totalPaidStreams:    pools.totalPremiumStreams,
        totalFreeStreams:    pools.totalNetworkStreams,
        status:              'CALCULATED',
        calculatedAt:        new Date(),
      },
      update: {
        poolATotal:          pools.premiumPoolTotal,
        poolCTotal:          pools.networkPoolTotal,
        totalPaidStreams:    pools.totalPremiumStreams,
        totalFreeStreams:    pools.totalNetworkStreams,
        status:              'CALCULATED',
        calculatedAt:        new Date(),
      },
    })

    for (const earnings of fullArtistEarnings) {
      await tx.artistRoyalty.create({
        data: {
          artistId:               earnings.artistId,
          month,
          year,
          poolAStreams:            earnings.premiumStreams,
          poolAEarnings:           earnings.premiumEarnings,
          poolCStreams:            earnings.networkStreams,
          poolCEarnings:           earnings.networkEarnings,
          supporterMultiplier:        earnings.supporterMultiplier,
          totalEarnings:           earnings.totalEarnings,
          supporterShareDistributed:  earnings.supporterShareDistributed,
          netPayout:               earnings.netPayout,
          status:                  'PAID',
        },
      })

      if (earnings.netPayout > 0) {
        await tx.organization.update({
          where: { id: earnings.artistId },
          data: {
            balanceCents: {
              increment: earnings.netPayout,
            },
          },
        })
        await checkAndAwardMilestones(earnings.artistId, 'earnings', tx)
      }
    }

    for (const share of SUPPORTERShares) {
      await tx.fanRoyaltyShare.create({
        data: {
          fanId:               share.fanId,
          artistId:            share.artistId,
          supportId:         share.supportId,
          month,
          year,
          revenueSharePercent: share.revenueSharePercent,
          amountEarned:        share.amountEarned,
          status:              'CREDITED',
        },
      })

      if (share.amountEarned > 0) {
        await tx.user.update({
          where: { id: share.fanId },
          data: {
            balanceCents: {
              increment: share.amountEarned,
            },
          },
        })
      }
    }
  })
}

// ─────────────────────────────────────────────
// STEP 6 — SEND NOTIFICATIONS
// ─────────────────────────────────────────────

async function sendRoyaltyNotifications(
  month: number,
  year: number,
  fullArtistEarnings: ArtistEarnings[],
  SUPPORTERShares: SUPPORTERShareEntry[]
): Promise<void> {
  const monthName = new Date(year, month - 1, 1)
    .toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const artistNotifications = fullArtistEarnings
    .filter((e) => e.netPayout > 0)
    .map((earnings) => ({
      userId:    earnings.artistId,
      userType:  'artist',
      type:      'new_royalty',
      title:     `Your streaming earnings for ${monthName} are ready`,
      body:      `You earned $${(earnings.netPayout / 100).toFixed(2)} from ${
                   (earnings.premiumStreams + earnings.networkStreams).toLocaleString()
                 } streams this month.`,
      link:      '/studio/earnings',
      isRead:    false,
      createdAt: new Date(),
    }))

  const fanEarnings = new Map<string, number>()
  for (const share of SUPPORTERShares) {
    fanEarnings.set(share.fanId, (fanEarnings.get(share.fanId) ?? 0) + share.amountEarned)
  }

  const fanNotifications = Array.from(fanEarnings.entries())
    .filter(([, amount]) => amount > 0)
    .map(([fanId, totalEarned]) => ({
      userId:    fanId,
      userType:  'fan',
      type:      'revenue_share_credited',
      title:     `You earned money from music you support`,
      body:      `$${(totalEarned / 100).toFixed(2)} from your SUPPORTER revenue shares in ${monthName} has been credited to your balance.`,
      link:      '/fan/me',
      isRead:    false,
      createdAt: new Date(),
    }))

  if (artistNotifications.length > 0 || fanNotifications.length > 0) {
    await prisma.notification.createMany({
      data: [...artistNotifications, ...fanNotifications] as any,
    })
  }
}

// ─────────────────────────────────────────────
// MAIN FUNCTION — ORCHESTRATOR
// ─────────────────────────────────────────────

export async function calculateMonthlyRoyalties(
  targetMonth?: number,
  targetYear?: number
): Promise<RoyaltyReport> {
  const errors: string[] = []

  const { month, year } = targetMonth && targetYear
    ? { month: targetMonth, year: targetYear }
    : getPreviousMonth()

  console.log(`[NRH Royalties] Starting calculation for ${month}/${year}`)

  try {
    console.log('[NRH Royalties] Step 1: Calculating pool totals...')
    const pools = await calculatePoolTotals(month, year)
    
    console.log('[NRH Royalties] Step 2: Fetching artist stream data...')
    const artistStreamData = await getArtistStreamData(month, year)

    if (artistStreamData.length === 0) {
      return {
        month, year,
        premiumPoolTotal:        pools.premiumPoolTotal,
        networkPoolTotal:        pools.networkPoolTotal,
        totalPremiumStreams:     pools.totalPremiumStreams,
        totalNetworkStreams:     pools.totalNetworkStreams,
        artistCount:             0,
        totalArtistPayout:       0,
        totalSUPPORTERDistribution: 0,
        totalNRHRevenue:         0,
        artists:                 [],
        SUPPORTERShares:            [],
        errors,
      }
    }

    console.log('[NRH Royalties] Step 3: Calculating artist earnings...')
    const partialEarnings = calculateArtistEarnings(artistStreamData, pools)

    console.log('[NRH Royalties] Step 4: Calculating SUPPORTER revenue shares...')
    const { SUPPORTERShares, artistNetPayouts } = await calculateSUPPORTERShares(partialEarnings)

    const fullArtistEarnings: ArtistEarnings[] = partialEarnings.map((e) => {
      const payoutData = artistNetPayouts.get(e.artistId) ?? { distributed: 0, net: 0 }
      return {
        ...e,
        supporterShareDistributed: payoutData.distributed,
        netPayout:              payoutData.net,
      }
    })

    console.log('[NRH Royalties] Step 5: Persisting to database...')
    await persistRoyalties(month, year, pools, fullArtistEarnings, SUPPORTERShares)

    console.log('[NRH Royalties] Step 6: Sending notifications...')
    await sendRoyaltyNotifications(month, year, fullArtistEarnings, SUPPORTERShares)

    const totalArtistPayout       = fullArtistEarnings.reduce((s, e) => s + e.netPayout, 0)
    const totalSUPPORTERDistribution = SUPPORTERShares.reduce((s, p) => s + p.amountEarned, 0)
    const totalNRHRevenue         = (pools.premiumPoolTotal + pools.networkPoolTotal) 
                                    - totalArtistPayout 
                                    - totalSUPPORTERDistribution

    return {
      month,
      year,
      premiumPoolTotal:        pools.premiumPoolTotal,
      networkPoolTotal:        pools.networkPoolTotal,
      totalPremiumStreams:     pools.totalPremiumStreams,
      totalNetworkStreams:     pools.totalNetworkStreams,
      artistCount:             fullArtistEarnings.length,
      totalArtistPayout,
      totalSUPPORTERDistribution,
      totalNRHRevenue,
      artists:                 fullArtistEarnings,
      SUPPORTERShares,
      errors,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(message)
    throw error
  }
}

// ─────────────────────────────────────────────
// STREAM PLAY TRACKER — Audio Player Side
// ─────────────────────────────────────────────

export async function startStreamPlay(
  trackId:  string,
  artistId: string,
  fan: { id?: string; type: string } | null,
  metadata?: { ip: string; userAgent: string; deviceId: string }
): Promise<string> {
  const poolSource = (fan?.type === 'subscriber' || fan?.type === 'SUPPORTER') ? 'A' : 'C'
  
  // Anti-fraud checks
  const userAgent = metadata?.userAgent || '';
  const ipAddress = metadata?.ip || '';
  const deviceId = metadata?.deviceId || '';
  
  const isBot = /bot|spider|crawler|headless|selenium|puppeteer/i.test(userAgent);
  
  // Basic stream farm check: Check streams from this IP today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const streamsFromIpToday = await prisma.streamPlay.count({
    where: {
      ipAddress,
      startedAt: { gte: today }
    }
  });
  
  const isStreamFarm = streamsFromIpToday >= 50;
  const isExcluded = isBot || isStreamFarm;
  const flagReason = isBot ? 'BOT_DETECTED' : isStreamFarm ? 'STREAM_FARM_DETECTED' : null;

  const play = await prisma.streamPlay.create({
    data: {
      trackId,
      artistId,
      listenerId:       fan?.id ?? null,
      listenerType:     (fan?.type?.toUpperCase() || 'GUEST') as any,
      startedAt:        new Date(),
      playDurationSeconds: 0,
      countedAsStream:  false,
      poolSource:       poolSource as any,
      ipAddress,
      userAgent,
      deviceId,
      isExcludedFromPool: isExcluded,
      flagReason,
      fraudScore: isExcluded ? 0 : 1
    },
  })

  return play.id
}

export async function markStreamCounted(streamPlayId: string): Promise<void> {
  await prisma.streamPlay.update({
    where: { id: streamPlayId },
    data: {
      playDurationSeconds: 30,
      countedAsStream: true,
    },
  })
}

export async function finalizeStreamPlay(
  streamPlayId:    string,
  durationSeconds: number
): Promise<void> {
  await prisma.streamPlay.update({
    where: { id: streamPlayId },
    data:  { playDurationSeconds: durationSeconds },
  })
}

// ─────────────────────────────────────────────
// ROYALTY PREVIEW — For Studio Dashboard
// ─────────────────────────────────────────────

export async function getArtistRoyaltyPreview(artistId: string): Promise<{
  estimatedEarnings:  number  // cents
  premiumStreams:     number
  networkStreams:     number
  supporterMultiplier:   number
  premiumPoolRate:    number  // cents per stream (estimated)
  networkPoolRate:    number  // cents per stream (estimated)
  vsSpotifyRate:      number  // how much more per stream vs Spotify avg
}> {
  const now   = new Date()
  const month = now.getMonth() + 1
  const year  = now.getFullYear()
  const { start } = getMonthBounds(month, year)

  const streams = await prisma.streamPlay.groupBy({
    by:    ['poolSource'],
    where: {
      artistId,
      startedAt:       { gte: start, lt: now },
      countedAsStream: true,
    },
    _count: { id: true },
  })

  const premiumStreams = streams.find((s) => s.poolSource === 'A')?._count.id ?? 0
  const networkStreams = streams.find((s) => s.poolSource === 'C')?._count.id ?? 0

  const supporterCount = await prisma.supporterSubscription.count({
    where: { artistId: artistId, status: 'ACTIVE' },
  })
  const supporterMultiplier = getsupporterMultiplier(supporterCount)

  const subscriberCount = await prisma.fanSubscription.count({
    where: { status: 'active', startDate: { lte: now } },
  })
  const estimatedPoolA = subscriberCount * 999 * POOL_A_ARTIST_SHARE

  const totalPremiumStreamsThisMonth = await prisma.streamPlay.count({
    where: { startedAt: { gte: start, lt: now }, countedAsStream: true, poolSource: 'A' },
  })

  const premiumPoolRate = totalPremiumStreamsThisMonth > 0
    ? safeDivide(estimatedPoolA, totalPremiumStreamsThisMonth)
    : 0

  const networkPoolRate = 8 * 0.60 / 10 

  const premiumEarnings = roundCents(premiumStreams * premiumPoolRate)
  const networkEarnings = roundCents(networkStreams * networkPoolRate)
  const estimatedEarnings = roundCents((premiumEarnings + networkEarnings) * supporterMultiplier)

  const spotifyRatePerStream = 0.4
  const nrhRatePerStream = totalPremiumStreamsThisMonth > 0
    ? (premiumPoolRate + networkPoolRate) / 2
    : networkPoolRate
  const vsSpotifyRate = nrhRatePerStream / spotifyRatePerStream

  return {
    estimatedEarnings,
    premiumStreams,
    networkStreams,
    supporterMultiplier,
    premiumPoolRate:  roundCents(premiumPoolRate),
    networkPoolRate:  roundCents(networkPoolRate),
    vsSpotifyRate: Math.round(vsSpotifyRate * 10) / 10,
  }
}


