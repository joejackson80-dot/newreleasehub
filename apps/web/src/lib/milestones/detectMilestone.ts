import { createAdminClient } from '../supabase/admin'
import { generateMilestoneCard } from './generateCard'
import { notifyArtistMilestone } from '../notifications'

export type MilestoneType = 
  | 'FIRST_SUPPORTER' | 'SUPPORTERS_10' | 'SUPPORTERS_50' | 'SUPPORTERS_100' | 'SUPPORTERS_250' | 'SUPPORTERS_500' | 'SUPPORTERS_1000' | 'SUPPORTERS_5000'
  | 'STREAMS_1000' | 'STREAMS_10000' | 'STREAMS_50000' | 'STREAMS_100000' | 'STREAMS_500000' | 'STREAMS_1000000'
  | 'EARNINGS_100' | 'EARNINGS_500' | 'EARNINGS_1000' | 'EARNINGS_5000' | 'EARNINGS_10000';

export async function checkAndAwardMilestones(
  artistId: string,
  trigger: 'stream' | 'SUPPORTER' | 'earnings' | 'chart' | 'upload'
) {
  const supabase = createAdminClient()
  
  const { data: artist, error: artistError } = await supabase
    .from('organizations')
    .select('supporter_count, total_streams, balance_cents, created_at')
    .eq('id', artistId)
    .maybeSingle()

  if (artistError || !artist) return

  const { data: existing, error: existingError } = await supabase
    .from('artist_milestones')
    .select('type')
    .eq('artist_id', artistId)

  if (existingError) return
  
  const earned = new Set((existing || []).map((m: any) => m.type))

  const toCheck: { type: MilestoneType, condition: boolean }[] = [
    { type: 'FIRST_SUPPORTER',       condition: (artist.supporter_count || 0) >= 1 },
    { type: 'SUPPORTERS_10',         condition: (artist.supporter_count || 0) >= 10 },
    { type: 'SUPPORTERS_50',         condition: (artist.supporter_count || 0) >= 50 },
    { type: 'SUPPORTERS_100',        condition: (artist.supporter_count || 0) >= 100 },
    { type: 'SUPPORTERS_250',        condition: (artist.supporter_count || 0) >= 250 },
    { type: 'SUPPORTERS_500',        condition: (artist.supporter_count || 0) >= 500 },
    { type: 'SUPPORTERS_1000',       condition: (artist.supporter_count || 0) >= 1000 },
    { type: 'SUPPORTERS_5000',       condition: (artist.supporter_count || 0) >= 5000 },
    { type: 'STREAMS_1000',       condition: (artist.total_streams || 0) >= 1000 },
    { type: 'STREAMS_10000',      condition: (artist.total_streams || 0) >= 10000 },
    { type: 'STREAMS_50000',      condition: (artist.total_streams || 0) >= 50000 },
    { type: 'STREAMS_100000',     condition: (artist.total_streams || 0) >= 100000 },
    { type: 'STREAMS_500000',     condition: (artist.total_streams || 0) >= 500000 },
    { type: 'STREAMS_1000000',    condition: (artist.total_streams || 0) >= 1000000 },
    { type: 'EARNINGS_100',       condition: (artist.balance_cents || 0) >= 10000 },
    { type: 'EARNINGS_500',       condition: (artist.balance_cents || 0) >= 50000 },
    { type: 'EARNINGS_1000',      condition: (artist.balance_cents || 0) >= 100000 },
    { type: 'EARNINGS_5000',      condition: (artist.balance_cents || 0) >= 500000 },
    { type: 'EARNINGS_10000',     condition: (artist.balance_cents || 0) >= 1000000 },
  ]

  for (const check of toCheck) {
    if (check.condition && !earned.has(check.type)) {
      // Generate card image
      const cardImageUrl = await generateMilestoneCard(artistId, check.type)

      // Save milestone
      const { error: createError } = await supabase
        .from('artist_milestones')
        .insert({
          artist_id: artistId,
          type: check.type,
          card_image_url: cardImageUrl,
        })

      if (createError) {
        console.error('Error creating milestone:', createError)
        continue
      }

      // Notify artist
      await notifyArtistMilestone(artistId, check.type, cardImageUrl)
    }
  }
}
