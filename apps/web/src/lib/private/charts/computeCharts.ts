/**
 * ============================================================
 * CONFIDENTIAL — NEW RELEASE HUB TRADE SECRET
 * NRH Equity Score computation algorithm
 * ============================================================
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { inngest } from '@/lib/inngest/client'

interface ArtistScoreComponent {
  streamMomentum: number;
  supporterDepth: number;
  fanVelocity: number;
  engagement: number;
  consistency: number;
  profile: number;
}

interface ScoredArtist {
  artistId: string;
  score: number;
  components: ArtistScoreComponent;
  globalRank?: number;
  risingRank?: number;
}

interface ArtistBase {
  id: string;
  slug: string;
  genres: string[];
  city: string | null;
  country: string | null;
  created_at: Date | string;
  supporter_count: number;
  total_streams: number;
  nrh_equity_score: number;
  follower_count: number;
  bio?: string | null;
  profile_image_url?: string | null;
  header_image_url?: string | null;
  equity_score_history?: any;
}

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

const appendToHistory = (history: any[], entry: { date: string; score: number }) => {
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
  async ({ step }) => {
    const weekStart = getWeekStart(new Date());
    const supabase = createAdminClient();

    // Step 1: Get all public artists
    const artists = await step.run('get-artists', async () => {
      const { data: orgs, error } = await supabase
        .from('organizations')
        .select('*, followers(count)')
        .eq('is_public', true);
      
      if (error) throw error;

      return (orgs || []).map(org => ({
        ...org,
        follower_count: org.followers?.[0]?.count || 0
      })) as ArtistBase[];
    });

    // Step 2: Compute scores in batches
    const batches = chunk(artists, 100);
    const scores: ScoredArtist[] = [];

    for (const [i, batch] of batches.entries()) {
      const batchScores = await step.run(`score-batch-${i}`, async () => {
        return Promise.all(batch.map((artist) => computeArtistScore(artist)));
      });
      scores.push(...(batchScores as ScoredArtist[]));
    }

    // Step 3: Rank globally
    const globalRanked = scores
      .sort((a, b) => b.score - a.score)
      .map((s, i) => ({ ...s, globalRank: i + 1 }));

    // Step 4: Rank by genre
    const allGenres = Array.from(new Set(artists.flatMap((a) => a.genres || ['Other'])));
    const genreRanks: Record<string, number> = {};
    
    for (const genre of allGenres) {
      const genreArtists = artists.filter((a) => a.genres?.includes(genre));
      if (genreArtists.length === 0) continue;

      const genreScores = scores
        .filter((s) => genreArtists.some((a) => a.id === s.artistId))
        .sort((a, b) => b.score - a.score);
      
      genreScores.forEach((s, i) => {
        const artist = artists.find((a) => a.id === s.artistId);
        const primaryGenre = artist?.genres?.[0];
        if (primaryGenre === genre) {
          genreRanks[s.artistId] = i + 1;
        }
      });
    }

    // Step 5: Rank by city
    const cityGroups = groupBy(artists, (a) => a.city ?? 'Unknown');
    const cityRanks: Record<string, number> = {};
    for (const [, cityArtists] of Object.entries(cityGroups)) {
      if (cityArtists.length < 3) continue;
      const cityScores = scores
        .filter((s) => cityArtists.find((a) => a.id === s.artistId))
        .sort((a, b) => b.score - a.score);
      cityScores.forEach((s, i) => { cityRanks[s.artistId] = i + 1 });
    }

    // Step 6: Rising artists
    const risingScores = scores
      .filter((s) => {
        const artist = artists.find((a) => a.id === s.artistId)!;
        const ageMonths = monthsSince(new Date(artist.created_at));
        return ageMonths <= 12 || s.components.fanVelocity > 20;
      })
      .sort((a, b) => b.components.fanVelocity - a.components.fanVelocity)
      .slice(0, 50)
      .map((s, i) => ({ ...s, risingRank: i + 1 }));

    // Step 7: Save all scores and ranks
    await step.run('save-ranks', async () => {
      for (const scored of globalRanked) {
        const artist = artists.find(a => a.id === scored.artistId);
        const prevScore = artist?.nrh_equity_score || 0;
        const history = Array.isArray(artist?.equity_score_history) 
          ? artist.equity_score_history 
          : [];

        const risingEntry = risingScores.find(r => r.artistId === scored.artistId);

        await supabase
          .from('organizations')
          .update({
            previous_equity_score: prevScore,
            nrh_equity_score: scored.score,
            equity_score_delta: scored.score - prevScore,
            chart_position_global: scored.globalRank,
            chart_position_genre: genreRanks[scored.artistId] ?? null,
            chart_position_city: cityRanks[scored.artistId] ?? null,
            chart_position_rising: risingEntry?.risingRank ?? null,
            equity_score_history: appendToHistory(history, {
              date: weekStart.toISOString(),
              score: scored.score
            })
          })
          .eq('id', scored.artistId);

        // Save snapshot
        await supabase
          .from('chart_snapshots')
          .upsert({
            artist_id: scored.artistId,
            week: weekStart.toISOString(),
            global_rank: scored.globalRank,
            genre_rank: genreRanks[scored.artistId] ?? null,
            city_rank: cityRanks[scored.artistId] ?? null,
            rising_rank: risingEntry?.risingRank ?? null,
            equity_score: scored.score,
            stream_count: artist?.total_streams || 0,
            supporter_count: artist?.supporter_count || 0,
            follower_count: artist?.follower_count || 0,
          }, { onConflict: 'artist_id,week' });
      }
    });

    return { computed: artists.length, weekStart };
  }
);

async function computeArtistScore(artist: ArtistBase) {
  const supabase = createAdminClient();
  const weights = {
    streamMomentum: 0.30,
    supporterDepth: 0.25,
    fanVelocity: 0.20,
    engagement: 0.15,
    consistency: 0.07,
    profile: 0.03,
  };

  const now = new Date();
  const day7  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000).toISOString();
  const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const day90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();

  // Stream counts
  const [
    { count: streams7d },
    { count: streams30d }
  ] = await Promise.all([
    supabase.from('stream_plays').select('*', { count: 'exact', head: true })
      .eq('artist_id', artist.id).gte('started_at', day7).eq('counted_as_stream', true).eq('is_excluded_from_pool', false),
    supabase.from('stream_plays').select('*', { count: 'exact', head: true })
      .eq('artist_id', artist.id).gte('started_at', day30).eq('counted_as_stream', true).eq('is_excluded_from_pool', false)
  ]);

  // Supporter data
  const { data: subs } = await supabase.from('supporter_subscriptions')
    .select('price_cents, status, created_at')
    .eq('artist_id', artist.id);

  const activeSubs = (subs || []).filter(s => s.status === 'ACTIVE');
  const churnedSubs = (subs || []).filter(s => ['CANCELLED', 'EXPIRED'].includes(s.status) && s.created_at >= day30);
  
  const avgPrice = activeSubs.length > 0 
    ? activeSubs.reduce((sum, s) => sum + s.price_cents, 0) / activeSubs.length 
    : 0;

  // Fan velocity
  const { data: snapshot30d } = await supabase.from('chart_snapshots')
    .select('follower_count')
    .eq('artist_id', artist.id)
    .gte('week', day30)
    .order('week', { ascending: true })
    .limit(1)
    .maybeSingle();

  const followersNow = artist.follower_count;
  const followers30dAgo = snapshot30d?.follower_count ?? followersNow;
  const fanVelocity = Math.min(
    ((followersNow - followers30dAgo) / Math.max(followers30dAgo, 1)) * 100,
    500
  );

  // Engagement & Consistency
  const [
    { count: collabCount },
    { count: recentReleases }
  ] = await Promise.all([
    supabase.from('collab_requests').select('*', { count: 'exact', head: true })
      .eq('receiver_id', artist.id).gte('created_at', day30),
    supabase.from('releases').select('*', { count: 'exact', head: true })
      .eq('organization_id', artist.id).gte('release_date', day90)
  ]);

  // Profile completeness
  const profileScore = [
    !!artist.bio, !!artist.profile_image_url, !!artist.header_image_url,
    !!artist.genres?.length, !!artist.city,
    artist.total_streams > 0,
    artist.supporter_count > 0,
    true
  ].filter(Boolean).length;

  const normalize = (val: number, max: number) => Math.min((val / max) * 100, 100);

  const components = {
    streamMomentum: normalize((Number(streams7d || 0) * 4) + (Number(streams30d || 0) * 2) + (artist.total_streams * 0.001), 10000),
    supporterDepth: normalize((artist.supporter_count * 10) + (avgPrice * 0.5) - (churnedSubs.length * 3), 5000),
    fanVelocity: normalize(Math.max(fanVelocity, 0), 100),
    engagement:  normalize((collabCount || 0) * 8, 1000), // tips/comments mocked as 0
    consistency: normalize(Math.min(recentReleases || 0, 5) * 20, 100),
    profile:     normalize(profileScore, 10) * 100,
  };

  const score =
    (components.streamMomentum * weights.streamMomentum) +
    (components.supporterDepth * weights.supporterDepth) +
    (components.fanVelocity    * weights.fanVelocity) +
    (components.engagement     * weights.engagement) +
    (components.consistency    * weights.consistency) +
    (components.profile        * weights.profile);

  return { artistId: artist.id, score: Math.round(score * 100) / 100, components };
}
