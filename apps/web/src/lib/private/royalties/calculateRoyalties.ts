/**
 * NRH ROYALTY CALCULATION ENGINE (Supabase-Only)
 * ==============================================
 * Dual-pool streaming income system — Model A + C
 * 
 * Model A: Paid subscriber streams → 70% of subscription revenue
 * Model C: Free listener streams  → 60% of ad revenue
 *
 * Run this on the 1st of every month via cron job.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
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

function getMonthBounds(month: number, year: number): { start: string; end: string } {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0).toISOString();
  const end   = new Date(year, month, 1, 0, 0, 0, 0).toISOString();
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
  const supabase = createAdminClient();

  const { data: subscriptions } = await supabase
    .from('fan_subscriptions')
    .select('monthly_amount_cents')
    .eq('status', 'active')
    .lte('start_date', end)
    .or(`cancelled_at.is.null,cancelled_at.gte.${start}`);

  const poolAGross = (subscriptions || []).reduce(
    (sum, sub) => sum + sub.monthly_amount_cents,
    0
  )
  const premiumPoolTotal = roundCents(poolAGross * POOL_A_ARTIST_SHARE)

  const { data: adImpressions } = await supabase
    .from('ad_impressions')
    .select('estimated_revenue_cents')
    .gte('timestamp', start)
    .lt('timestamp', end)
    .eq('completed', true);

  const poolCGross = (adImpressions || []).reduce(
    (sum, ad) => sum + ad.estimated_revenue_cents,
    0
  )
  const networkPoolTotal = roundCents(poolCGross * POOL_C_ARTIST_SHARE)

  const { count: premiumStreamCount } = await supabase
    .from('stream_plays')
    .select('*', { count: 'exact', head: true })
    .gte('started_at', start)
    .lt('started_at', end)
    .eq('counted_as_stream', true)
    .eq('is_excluded_from_pool', false)
    .eq('pool_source', 'A');

  const { count: networkStreamCount } = await supabase
    .from('stream_plays')
    .select('*', { count: 'exact', head: true })
    .gte('started_at', start)
    .lt('started_at', end)
    .eq('counted_as_stream', true)
    .eq('is_excluded_from_pool', false)
    .eq('pool_source', 'C');

  return {
    premiumPoolTotal,
    networkPoolTotal,
    totalPremiumStreams: premiumStreamCount || 0,
    totalNetworkStreams: networkStreamCount || 0,
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
  const supabase = createAdminClient();

  // Supabase doesn't have a direct groupBy with count in the JS client like Prisma.
  // We'll fetch all counted plays for the month and aggregate in JS.
  // For a large production DB, this would be an RPC.
  const { data: streams } = await supabase
    .from('stream_plays')
    .select('artist_id, pool_source')
    .gte('started_at', start)
    .lt('started_at', end)
    .eq('counted_as_stream', true)
    .eq('is_excluded_from_pool', false);

  const artistIds = [...new Set((streams || []).map((s) => s.artist_id))];

  const { data: organizations } = await supabase
    .from('organizations')
    .select('id, supporter_count')
    .in('id', artistIds);

  const supporterCountMap = new Map(
    (organizations || []).map((o) => [o.id, o.supporter_count || 0])
  )

  const artistDataMap = new Map<string, ArtistStreamData>()

  for (const stream of (streams || [])) {
    const existing = artistDataMap.get(stream.artist_id) ?? {
      artistId:       stream.artist_id,
      premiumStreams:  0,
      networkStreams:  0,
      supporterCount:    supporterCountMap.get(stream.artist_id) ?? 0,
    }

    if (stream.pool_source === 'A') {
      existing.premiumStreams += 1
    } else if (stream.pool_source === 'C') {
      existing.networkStreams += 1
    }

    artistDataMap.set(stream.artist_id, existing)
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
  const supabase = createAdminClient();

  for (const artist of artistEarnings) {
    if (artist.totalEarnings === 0) {
      artistNetPayouts.set(artist.artistId, { distributed: 0, net: 0 })
      continue
    }

    const { data: supports } = await supabase
      .from('supporter_subscriptions')
      .select('id, fan_id, revenue_share_percent')
      .eq('artist_id', artist.artistId)
      .eq('status', 'ACTIVE');

    let totalDistributed = 0

    for (const support of (supports || [])) {
      const shareDecimal = support.revenue_share_percent / 100
      const amountEarned = roundCents(artist.totalEarnings * shareDecimal)

      if (amountEarned > 0) {
        SUPPORTERShares.push({
          fanId:               support.fan_id,
          artistId:            artist.artistId,
          supportId:           support.id,
          revenueSharePercent: support.revenue_share_percent,
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
  const supabase = createAdminClient();

  // Handle pool upsert
  await supabase
    .from('monthly_pools')
    .upsert({
      month,
      year,
      pool_a_total:          pools.premiumPoolTotal,
      pool_c_total:          pools.networkPoolTotal,
      total_paid_streams:    pools.totalPremiumStreams,
      total_free_streams:    pools.totalNetworkStreams,
      status:                'CALCULATED',
      calculated_at:        new Date().toISOString(),
    }, { onConflict: 'month,year' });

  for (const earnings of fullArtistEarnings) {
    await supabase.from('artist_royalties').insert({
      artist_id:               earnings.artistId,
      month,
      year,
      pool_a_streams:            earnings.premiumStreams,
      pool_a_earnings:           earnings.premiumEarnings,
      pool_c_streams:            earnings.networkStreams,
      pool_c_earnings:           earnings.networkEarnings,
      supporter_multiplier:        earnings.supporterMultiplier,
      total_earnings:           earnings.totalEarnings,
      supporter_share_distributed:  earnings.supporterShareDistributed,
      net_payout:               earnings.netPayout,
      status:                  'PAID',
    });

    if (earnings.netPayout > 0) {
      // Update artist balance
      const { data: org } = await supabase.from('organizations').select('balance_cents').eq('id', earnings.artistId).single();
      if (org) {
        await supabase.from('organizations').update({
          balance_cents: (org.balance_cents || 0) + earnings.netPayout
        }).eq('id', earnings.artistId);
      }
      await checkAndAwardMilestones(earnings.artistId, 'earnings');
    }
  }

  for (const share of SUPPORTERShares) {
    await supabase.from('fan_royalty_shares').insert({
      fan_id:               share.fanId,
      artist_id:            share.artistId,
      support_id:           share.supportId,
      month,
      year,
      revenue_share_percent: share.revenueSharePercent,
      amount_earned:        share.amountEarned,
      status:              'CREDITED',
    });

    if (share.amountEarned > 0) {
      // Update fan balance
      const { data: user } = await supabase.from('users').select('balance_cents').eq('id', share.fanId).single();
      if (user) {
        await supabase.from('users').update({
          balance_cents: (user.balance_cents || 0) + share.amountEarned
        }).eq('id', share.fanId);
      }
    }
  }
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
  const supabase = createAdminClient();
  const monthName = new Date(year, month - 1, 1)
    .toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const artistNotifications = fullArtistEarnings
    .filter((e) => e.netPayout > 0)
    .map((earnings) => ({
      user_id:    earnings.artistId,
      user_type:  'artist',
      type:      'new_royalty',
      title:     `Your streaming earnings for ${monthName} are ready`,
      body:      `You earned $${(earnings.netPayout / 100).toFixed(2)} from ${
                   (earnings.premiumStreams + earnings.networkStreams).toLocaleString()
                 } streams this month.`,
      link:      '/studio/earnings',
      is_read:    false,
      created_at: new Date().toISOString(),
    }))

  const fanEarnings = new Map<string, number>()
  for (const share of SUPPORTERShares) {
    fanEarnings.set(share.fanId, (fanEarnings.get(share.fanId) ?? 0) + share.amountEarned)
  }

  const fanNotifications = Array.from(fanEarnings.entries())
    .filter(([, amount]) => amount > 0)
    .map(([fanId, totalEarned]) => ({
      user_id:    fanId,
      user_type:  'fan',
      type:      'revenue_share_credited',
      title:     `You earned money from music you support`,
      body:      `$${(totalEarned / 100).toFixed(2)} from your SUPPORTER revenue shares in ${monthName} has been credited to your balance.`,
      link:      '/fan/me',
      is_read:    false,
      created_at: new Date().toISOString(),
    }))

  if (artistNotifications.length > 0 || fanNotifications.length > 0) {
    await supabase.from('notifications').insert([...artistNotifications, ...fanNotifications]);

    // Also send actual emails to artists
    for (const earnings of fullArtistEarnings.filter((e) => e.netPayout > 0)) {
      try {
        const { data: org } = await supabase
          .from('organizations')
          .select('email, name')
          .eq('id', earnings.artistId)
          .single();
        
        if (org?.email) {
          await sendEmail({
            to: org.email,
            subject: `Your streaming earnings for ${monthName} are ready`,
            html: `
              <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                <h2>NRH Royalty Settlement</h2>
                <p>Hello ${org.name},</p>
                <p>Your streaming earnings for ${monthName} have been processed and credited to your ledger.</p>
                <p><strong>Total Earnings:</strong> $${(earnings.netPayout / 100).toFixed(2)}</p>
                <p><strong>Total Streams:</strong> ${(earnings.premiumStreams + earnings.networkStreams).toLocaleString()}</p>
                <br/>
                <a href="https://newreleasehub.vercel.app/studio" style="background-color: #A855F7; color: black; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">View Full Breakdown</a>
              </div>
            `
          })
        }
      } catch (err) {
        console.error('Failed to send email notification to artist:', earnings.artistId, err)
      }
    }
    
    // Also send emails to fans who earned revenue share
    for (const [fanId, totalEarned] of Array.from(fanEarnings.entries()).filter(([, amount]) => amount > 0)) {
      try {
        const { data: fan } = await supabase
          .from('users')
          .select('email, display_name')
          .eq('id', fanId)
          .single();
        
        if (fan?.email) {
          await sendEmail({
            to: fan.email,
            subject: `You earned money from music you support`,
            html: `
              <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
                <h2>NRH Supporter Yield</h2>
                <p>Hello ${fan.display_name},</p>
                <p>Your Supporter revenue shares for ${monthName} have generated yield!</p>
                <p><strong>Yield Added to Balance:</strong> $${(totalEarned / 100).toFixed(2)}</p>
                <br/>
                <a href="https://newreleasehub.vercel.app/fan/me" style="background-color: #A855F7; color: black; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">View Your Dashboard</a>
              </div>
            `
          })
        }
      } catch (err) {
        console.error('Failed to send email notification to fan:', fanId, err)
      }
    }
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

  // Build-time safety guard
  if (process.env.NEXT_PHASE === 'phase-production-build' || (process.env.NODE_ENV === 'production' && !process.env.CRON_SECRET)) {
    console.log('[NRH Royalties] Skipping calculation during build/unauthorized phase');
    return {
      month, year,
      premiumPoolTotal: 0,
      networkPoolTotal: 0,
      totalPremiumStreams: 0,
      totalNetworkStreams: 0,
      artistCount: 0,
      totalArtistPayout: 0,
      totalSUPPORTERDistribution: 0,
      totalNRHRevenue: 0,
      artists: [],
      SUPPORTERShares: [],
      errors: []
    };
  }

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
  const supabase = createAdminClient();
  const poolSource = (fan?.type === 'subscriber' || fan?.type === 'SUPPORTER') ? 'A' : 'C'
  
  // Anti-fraud checks
  const userAgent = metadata?.userAgent || '';
  const ipAddress = metadata?.ip || '';
  const deviceId = metadata?.deviceId || '';
  
  const isBot = /bot|spider|crawler|headless|selenium|puppeteer/i.test(userAgent);
  
  // Basic stream farm check: Check streams from this IP today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: streamsFromIpToday } = await supabase
    .from('stream_plays')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ipAddress)
    .gte('started_at', today.toISOString());
  
  const isStreamFarm = (streamsFromIpToday || 0) >= 50;
  const isExcluded = isBot || isStreamFarm;
  const flagReason = isBot ? 'BOT_DETECTED' : isStreamFarm ? 'STREAM_FARM_DETECTED' : null;

  const { data: play, error } = await supabase
    .from('stream_plays')
    .insert({
      track_id:         trackId,
      artist_id:        artistId,
      listener_id:      fan?.id ?? null,
      listener_type:    (fan?.type?.toUpperCase() || 'GUEST') as any,
      started_at:       new Date().toISOString(),
      play_duration_seconds: 0,
      counted_as_stream:  false,
      pool_source:       poolSource as any,
      ip_address:        ipAddress,
      user_agent:        userAgent,
      device_id:         deviceId,
      is_excluded_from_pool: isExcluded,
      flag_reason:      flagReason,
      fraud_score:      isExcluded ? 0 : 1
    })
    .select('id')
    .single();

  if (error || !play) throw new Error('Failed to start stream play');

  return play.id
}

export async function markStreamCounted(streamPlayId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('stream_plays')
    .update({
      play_duration_seconds: MIN_STREAM_SECONDS,
      counted_as_stream: true,
    })
    .eq('id', streamPlayId);
}

export async function finalizeStreamPlay(
  streamPlayId:    string,
  durationSeconds: number
): Promise<void> {
  const supabase = createAdminClient();
  await supabase
    .from('stream_plays')
    .update({ play_duration_seconds: durationSeconds })
    .eq('id', streamPlayId);
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
  const supabase = createAdminClient();
  const now   = new Date()
  const month = now.getMonth() + 1
  const year  = now.getFullYear()
  const { start } = getMonthBounds(month, year)

  const { data: streams } = await supabase
    .from('stream_plays')
    .select('pool_source')
    .eq('artist_id', artistId)
    .gte('started_at', start)
    .lt('started_at', now.toISOString())
    .eq('counted_as_stream', true);

  const premiumStreams = (streams || []).filter((s) => s.pool_source === 'A').length
  const networkStreams = (streams || []).filter((s) => s.pool_source === 'C').length

  const { count: supporterCount } = await supabase
    .from('supporter_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('artist_id', artistId)
    .eq('status', 'ACTIVE');

  const supporterMultiplier = getsupporterMultiplier(supporterCount || 0)

  const { count: subscriberCount } = await supabase
    .from('fan_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .lte('start_date', now.toISOString());

  const estimatedPoolA = (subscriberCount || 0) * 999 * POOL_A_ARTIST_SHARE

  const { count: totalPremiumStreamsThisMonth } = await supabase
    .from('stream_plays')
    .select('*', { count: 'exact', head: true })
    .gte('started_at', start)
    .lt('started_at', now.toISOString())
    .eq('counted_as_stream', true)
    .eq('pool_source', 'A');

  const premiumPoolRate = (totalPremiumStreamsThisMonth || 0) > 0
    ? safeDivide(estimatedPoolA, totalPremiumStreamsThisMonth || 0)
    : 0

  const networkPoolRate = 8 * 0.60 / 10 

  const premiumEarnings = roundCents(premiumStreams * premiumPoolRate)
  const networkEarnings = roundCents(networkStreams * networkPoolRate)
  const estimatedEarnings = roundCents((premiumEarnings + networkEarnings) * supporterMultiplier)

  const spotifyRatePerStream = 0.4
  const nrhRatePerStream = (totalPremiumStreamsThisMonth || 0) > 0
    ? (premiumPoolRate + networkPoolRate) / 2
    : networkPoolRate
  const vsSpotifyRate = nrhRatePerStream / spotifyRatePerStream

  return {
    estimatedEarnings,
    premiumStreams,
    networkStreams,
    supporterMultiplier,
    premiumPoolRate,
    networkPoolRate,
    vsSpotifyRate,
  }
}
