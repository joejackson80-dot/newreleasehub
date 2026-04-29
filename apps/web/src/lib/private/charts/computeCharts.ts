/**
 * ============================================================
 * CONFIDENTIAL — NEW RELEASE HUB TRADE SECRET
 * NRH Equity Score computation algorithm
 * ============================================================
 */

import { prisma } from '@/lib/prisma'
import { inngest } from '@/lib/inngest/client'

// Helper to chunk arrays
const chunk = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

// Helper to group by
const groupBy = <T>(arr: T[], keyFn: (item: T) => string) => {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

const monthsSince = (date: Date) => {
  const diff = Date.now() - date.getTime();
  return diff / (1000 * 60 * 60 * 24 * 30);
};

const appendToHistory = (history: any[], entry: any) => {
  const newHistory = [...(Array.isArray(history) ? history : []), entry];
  return newHistory.slice(-52);
};

// Called by Inngest every Monday at 6am Central
export const computeWeeklyCharts = inngest.createFunction(
  {
    id: 'compute-weekly-charts',
    name: 'Compute Weekly NRH Charts',
    retries: 3,
    triggers: [{ cron: 'TZ=America/Chicago 0 6 * * MON' }],
  },
  async ({ step }: { step: any }) => {

    const weekStart = getWeekStart(new Date())

    // Step 1: Get all public artists
    const artists = await step.run('get-artists', async () => {
      const orgs = await prisma.organization.findMany({
        where: { isPublic: true },
        select: {
          id: true, slug: true, genres: true, city: true,
          country: true, createdAt: true,
          patronCount: true, totalStreams: true,
          nrhEquityScore: true,
          _count: {
            select: { Followers: true }
          }
        }
      })
      return orgs.map(org => ({
        ...org,
        genre: org.genres,
        followerCount: org._count.Followers,
        streamCount: org.totalStreams
      }))
    })

    // Step 2: Compute scores in batches
    const batches = chunk(artists, 100)
    const scores: { artistId: string, score: number, components: any }[] = []

    for (const [i, batch] of batches.entries()) {
      const batchScores = await step.run(`score-batch-${i}`, async () => {
        return Promise.all(batch.map((artist: any) => computeArtistScore(artist)))
      })
      scores.push(...batchScores)
    }

    // Step 3: Rank globally
    const globalRanked = scores
      .sort((a, b) => b.score - a.score)
      .map((s, i) => ({ ...s, globalRank: i + 1 }))

    // Step 4: Rank by genre (inclusive of all genres tagged)
    const allGenres = Array.from(new Set(artists.flatMap(a => Array.isArray(a.genre) ? a.genre : [a.genre ?? 'Other'])))
    const genreRanks: Record<string, number> = {} // Only stores the "primary" genre rank for the Org model
    const genreChartData: Record<string, { artistId: string, rank: number }[]> = {}

    for (const genre of allGenres) {
      const genreArtists = artists.filter(a => 
        (Array.isArray(a.genre) && a.genre.includes(genre)) || a.genre === genre
      )
      if (genreArtists.length === 0) continue

      const genreScores = scores
        .filter(s => genreArtists.some(a => a.id === s.artistId))
        .sort((a, b) => b.score - a.score)
      
      genreChartData[genre] = genreScores.map((s, i) => ({ artistId: s.artistId, rank: i + 1 }))
      
      // For the Organization model, we store the rank of their FIRST genre as primary
      genreScores.forEach((s, i) => {
        const artist = artists.find(a => a.id === s.artistId)
        const primaryGenre = Array.isArray(artist?.genre) ? artist.genre[0] : artist?.genre
        if (primaryGenre === genre) {
          genreRanks[s.artistId] = i + 1
        }
      })
    }

    // Step 5: Rank by city
    const cityGroups = groupBy(artists, (a: any) => a.city ?? 'Unknown')
    const cityRanks: Record<string, number> = {}
    for (const [city, cityArtists] of Object.entries(cityGroups)) {
      if (cityArtists.length < 3) continue // need at least 3 for a city chart
      const cityScores = scores
        .filter(s => (cityArtists as any[]).find((a: any) => a.id === s.artistId))
        .sort((a, b) => b.score - a.score)
      cityScores.forEach((s, i) => { cityRanks[s.artistId] = i + 1 })
    }

    // Step 6: Rising artists (fastest growing in last 30 days)
    const risingScores = scores
      .filter(s => {
        const artist = artists.find((a: any) => a.id === s.artistId)!
        const ageMonths = monthsSince((artist as any).createdAt)
        return ageMonths <= 12 || s.components.fanVelocity > 20
      })
      .sort((a, b) => b.components.fanVelocity - a.components.fanVelocity)
      .slice(0, 50)
      .map((s, i) => ({ ...s, risingRank: i + 1 }))

    // Step 7: Save all scores and ranks
    await step.run('save-ranks', async () => {
      for (const scored of globalRanked) {
        const artistRecord = await prisma.organization.findUnique({ where: { id: scored.artistId } });
        const prevScore = artistRecord?.nrhEquityScore ?? 0;
        const historyJson = typeof artistRecord?.equityScoreHistory === 'string' 
          ? JSON.parse(artistRecord.equityScoreHistory) 
          : (Array.isArray(artistRecord?.equityScoreHistory) ? artistRecord?.equityScoreHistory : []);

        const risingEntry = risingScores.find(r => r.artistId === scored.artistId)

        // Update artist record
        await prisma.organization.update({
          where: { id: scored.artistId },
          data: {
            previousEquityScore:  prevScore,
            nrhEquityScore:       scored.score,
            equityScoreDelta:     scored.score - prevScore,
            chartPositionGlobal:  scored.globalRank,
            chartPositionGenre:   genreRanks[scored.artistId] ?? null,
            chartPositionCity:    cityRanks[scored.artistId] ?? null,
            chartPositionRising:  risingEntry?.risingRank ?? null,
            equityScoreHistory: appendToHistory(historyJson, {
              date: weekStart.toISOString(),
              score: scored.score
            })
          }
        })

        // Save snapshot
        await prisma.chartSnapshot.upsert({
          where: { artistId_week: { artistId: scored.artistId, week: weekStart } },
          update: {},
          create: {
            artistId:     scored.artistId,
            week:         weekStart,
            globalRank:   scored.globalRank,
            genreRank:    genreRanks[scored.artistId] ?? null,
            cityRank:     cityRanks[scored.artistId] ?? null,
            risingRank:   risingEntry?.risingRank ?? null,
            equityScore:  scored.score,
            streamCount:  artists.find((a: any) => a.id === scored.artistId)?.streamCount ?? 0,
            patronCount:  artists.find((a: any) => a.id === scored.artistId)?.patronCount ?? 0,
            followerCount: artists.find((a: any) => a.id === scored.artistId)?.followerCount ?? 0,
          }
        })
      }
    })

    // Step 8: Notify artists of their chart positions
    await step.sendEvent('notify-chart-positions', {
      name: 'charts/positions.updated',
      data: { weekStart: weekStart.toISOString() }
    })

    // Step 9: Generate NRH Official chart post
    await step.sendEvent('generate-chart-post', {
      name: 'nrhofficial/charts.post',
      data: { weekStart: weekStart.toISOString() }
    })

    return { computed: artists.length, weekStart }
  }
)

async function computeArtistScore(artist: any) {
  const weights = {
    streamMomentum: Number(process.env.CHART_W_STREAM_MOMENTUM ?? '0.30'),
    patronDepth:    Number(process.env.CHART_W_PATRON_DEPTH    ?? '0.25'),
    fanVelocity:    Number(process.env.CHART_W_FAN_VELOCITY    ?? '0.20'),
    engagement:     Number(process.env.CHART_W_ENGAGEMENT      ?? '0.15'),
    consistency:    Number(process.env.CHART_W_CONSISTENCY     ?? '0.07'),
    profile:        Number(process.env.CHART_W_PROFILE         ?? '0.03'),
  }

  const now = new Date()
  const day7  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000)
  const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const day90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Stream counts (fraud-filtered)
  const [streams7d, streams30d] = await Promise.all([
    prisma.streamPlay.count({
      where: { artistId: artist.id, startedAt: { gte: day7 },
               countedAsStream: true, isExcludedFromPool: false }
    }),
    prisma.streamPlay.count({
      where: { artistId: artist.id, startedAt: { gte: day30 },
               countedAsStream: true, isExcludedFromPool: false }
    }),
  ])

  // Patron data
  const [patronData, patronChurn] = await Promise.all([
    prisma.patronSubscription.aggregate({
      where: { artistId: artist.id, status: 'ACTIVE' },
      _count: true,
      _avg: { priceCents: true }
    }),
    prisma.patronSubscription.count({
      where: { artistId: artist.id,
               status: { in: ['CANCELLED', 'EXPIRED'] },
               createdAt: { gte: day30 } } // Note: using createdAt instead of updatedAt due to schema limitations
    }),
  ])

  // Fan growth
  const followersNow = artist.followerCount
  const snapshot30d = await prisma.chartSnapshot.findFirst({
    where: { artistId: artist.id, week: { gte: day30 } },
    orderBy: { week: 'asc' },
    select: { followerCount: true }
  })
  const followers30dAgo = snapshot30d?.followerCount ?? followersNow
  const fanVelocity = Math.min(
    ((followersNow - followers30dAgo) / Math.max(followers30dAgo, 1)) * 100,
    500 // cap growth at 500%
  )

  // Engagement signals
  // We'll calculate mock ones for missing tables like trackComment
  const [collabCount, presaveCount] =
    await Promise.all([
      prisma.collabRequest.count({
        where: { receiverId: artist.id, createdAt: { gte: day30 } }
      }),
      Promise.resolve(0) // No presave or tip tables, mock them
    ])
    
  const tipCount = 0;
  const commentCount = 0;
  const syncCount = 0;

  // Release consistency
  const recentReleases = await prisma.release.count({
    where: { organizationId: artist.id,
             releaseDate: { gte: day90 } }
  })

  // Profile completeness (0-10)
  const profileScore = [
    !!artist.bio, !!artist.profileImageUrl, !!artist.headerImageUrl,
    !!artist.genre, !!artist.city,
    artist.streamCount > 0,
    artist.patronCount > 0,
    true, // proAffiliation mock
  ].filter(Boolean).length

  // Normalize each component to 0-100
  const normalize = (val: number, max: number) =>
    Math.min((val / max) * 100, 100)

  const components = {
    streamMomentum: normalize(
      (streams7d * 4) + (streams30d * 2) + (artist.streamCount * 0.001),
      10000
    ),
    patronDepth: normalize(
      (artist.patronCount * 10) +
      ((patronData._avg.priceCents ?? 0) * 0.5) -
      (patronChurn * 3),
      5000
    ),
    fanVelocity: normalize(Math.max(fanVelocity, 0), 100),
    engagement:  normalize(
      (tipCount * 20) + (commentCount * 5) +
      (collabCount * 8) + (syncCount * 15) + (presaveCount * 3),
      1000
    ),
    consistency: normalize(Math.min(recentReleases, 5) * 20, 100),
    profile:     normalize(profileScore, 10) * 100,
  }

  const score =
    (components.streamMomentum * weights.streamMomentum) +
    (components.patronDepth    * weights.patronDepth) +
    (components.fanVelocity    * weights.fanVelocity) +
    (components.engagement     * weights.engagement) +
    (components.consistency    * weights.consistency) +
    (components.profile        * weights.profile)

  return { artistId: artist.id, score: Math.round(score * 100) / 100, components }
}
