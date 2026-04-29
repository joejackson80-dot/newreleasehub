import { prisma } from '@/lib/prisma'
import { MilestoneType } from '@prisma/client'
import { generateMilestoneCard } from './generateCard'
import { notifyArtistMilestone } from '../notifications'

export async function checkAndAwardMilestones(
  artistId: string,
  trigger: 'stream' | 'SUPPORTER' | 'earnings' | 'chart' | 'upload',
  tx?: any
) {
  const db = tx || prisma
  const artist = await db.organization.findUnique({
    where: { id: artistId },
    select: {
      SUPPORTERCount: true,
      totalStreams: true,
      balanceCents: true,
      createdAt: true,
    }
  })
  if (!artist) return

  const existing = await db.artistMilestone.findMany({
    where: { artistId },
    select: { type: true }
  })
  const earned = new Set(existing.map((m: any) => m.type))

  const toCheck: { type: MilestoneType, condition: boolean }[] = [
    { type: 'FIRST_SUPPORTER',       condition: artist.SUPPORTERCount >= 1 },
    { type: 'SUPPORTERS_10',         condition: artist.SUPPORTERCount >= 10 },
    { type: 'SUPPORTERS_50',         condition: artist.SUPPORTERCount >= 50 },
    { type: 'SUPPORTERS_100',        condition: artist.SUPPORTERCount >= 100 },
    { type: 'SUPPORTERS_250',        condition: artist.SUPPORTERCount >= 250 },
    { type: 'SUPPORTERS_500',        condition: artist.SUPPORTERCount >= 500 },
    { type: 'SUPPORTERS_1000',       condition: artist.SUPPORTERCount >= 1000 },
    { type: 'SUPPORTERS_5000',       condition: artist.SUPPORTERCount >= 5000 },
    { type: 'STREAMS_1000',       condition: artist.totalStreams >= 1000 },
    { type: 'STREAMS_10000',      condition: artist.totalStreams >= 10000 },
    { type: 'STREAMS_50000',      condition: artist.totalStreams >= 50000 },
    { type: 'STREAMS_100000',     condition: artist.totalStreams >= 100000 },
    { type: 'STREAMS_500000',     condition: artist.totalStreams >= 500000 },
    { type: 'STREAMS_1000000',    condition: artist.totalStreams >= 1000000 },
    { type: 'EARNINGS_100',       condition: artist.balanceCents >= 10000 },
    { type: 'EARNINGS_500',       condition: artist.balanceCents >= 50000 },
    { type: 'EARNINGS_1000',      condition: artist.balanceCents >= 100000 },
    { type: 'EARNINGS_5000',      condition: artist.balanceCents >= 500000 },
    { type: 'EARNINGS_10000',     condition: artist.balanceCents >= 1000000 },
  ]

  for (const check of toCheck) {
    if (check.condition && !earned.has(check.type)) {
      // Generate card image
      const cardImageUrl = await generateMilestoneCard(artistId, check.type)

      // Save milestone
      await db.artistMilestone.create({
        data: {
          artistId,
          type: check.type,
          cardImageUrl,
        }
      })

      // Notify artist
      await notifyArtistMilestone(artistId, check.type, cardImageUrl)
    }
  }
}


