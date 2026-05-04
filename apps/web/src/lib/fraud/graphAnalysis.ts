import { prisma } from '@/lib/prisma'

export async function detectStreamingRings(
  period: { start: Date, end: Date }
): Promise<{
  suspectedRings: Array<{
    artistIds: string[]
    mutualStreamCount: number
    confidence: number
  }>
}> {
  // Build adjacency matrix: Artist A → Artist B stream count
  const allStreams = await prisma.streamPlay.findMany({
    where: {
      startedAt: { gte: period.start, lt: period.end },
      listenerType: 'artist', // Only streams from artist accounts
      isExcludedFromPool: false
    },
    select: {
      listenerId: true,  // The artist doing the listening
      artistId: true,     // The artist being listened to
    }
  })
  
  // Count edges: [listener artist, target artist] → count
  const edges = new Map<string, number>()
  
  for (const stream of allStreams) {
    if (!stream.listenerId || stream.listenerId === stream.artistId) continue 
    const key = `${stream.listenerId}->${stream.artistId}`
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


