import { createAdminClient } from '@/lib/supabase/admin'

export async function detectStreamingRings(
  period: { start: Date, end: Date }
): Promise<{
  suspectedRings: Array<{
    artistIds: string[]
    mutualStreamCount: number
    confidence: number
  }>
}> {
  const supabase = createAdminClient();

  // Build adjacency matrix: Artist A → Artist B stream count
  const { data: allStreams, error } = await supabase
    .from('stream_plays')
    .select('listener_id, artist_id')
    .gte('started_at', period.start.toISOString())
    .lt('started_at', period.end.toISOString())
    .eq('listener_type', 'artist') // Only streams from artist accounts
    .eq('is_excluded_from_pool', false);

  if (error) {
    console.error('Failed to fetch streams for fraud analysis:', error);
    return { suspectedRings: [] };
  }
  
  // Count edges: [listener artist, target artist] → count
  const edges = new Map<string, number>()
  
  for (const stream of (allStreams || [])) {
    if (!stream.listener_id || stream.listener_id === stream.artist_id) continue 
    const key = `${stream.listener_id}->${stream.artist_id}`
    edges.set(key, (edges.get(key) || 0) + 1)
  }
  
  // Find bidirectional high-volume edges (streaming ring signature)
  const suspectedRings: Array<{
    artistIds: string[]
    mutualStreamCount: number
    confidence: number
  }> = []
  const processed = new Set<string>()
  
  for (const [key, count] of edges.entries()) {
    if (count < 50) continue // Too low volume to be suspicious
    
    const [artistA, artistB] = key.split('->')
    const reverseKey = `${artistB}->${artistA}`
    const reverseCount = edges.get(reverseKey) || 0
    
    if (reverseCount > 50 && !processed.has(artistA) && !processed.has(artistB)) {
      // Bidirectional high volume = suspicious
      suspectedRings.push({
        artistIds: [artistA, artistB],
        mutualStreamCount: count + reverseCount,
        confidence: Math.min(count, reverseCount) / 50 // >1.0 = very confident
      })
      
      processed.add(artistA)
      processed.add(artistB)
    }
  }
  
  return { suspectedRings }
}
