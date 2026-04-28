import { prisma } from '@/lib/prisma'
import { MilestoneType } from '@prisma/client'
import { generateMilestoneCard } from './generateCard'
import { notifyArtistMilestone } from '../notifications'

export async function checkAndAwardMilestones(
  artistId: string,
  trigger: 'stream' | 'patron' | 'earnings' | 'chart' | 'upload',
  tx?: any
) {
  const db = tx || prisma
  const artist = await db.organization.findUnique({
    where: { id: artistId },
    select: {
      patronCount: true,
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
    { type: 'FIRST_PATRON',       condition: artist.patronCount >= 1 },
    { type: 'PATRONS_10',         condition: artist.patronCount >= 10 },
    { type: 'PATRONS_50',         condition: artist.patronCount >= 50 },
    { type: 'PATRONS_100',        condition: artist.patronCount >= 100 },
    { type: 'PATRONS_250',        condition: artist.patronCount >= 250 },
    { type: 'PATRONS_500',        condition: artist.patronCount >= 500 },
    { type: 'PATRONS_1000',       condition: artist.patronCount >= 1000 },
    { type: 'PATRONS_5000',       condition: artist.patronCount >= 5000 },
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
