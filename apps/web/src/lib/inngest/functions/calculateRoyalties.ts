import { inngest } from '../client'
import { prisma } from '@/lib/prisma'

// Stub helper
const chunk = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
const processArtistRoyalties = async (id: string, tier: any) => {};

export const calculateMonthlyRoyalties = inngest.createFunction(
  {
    id: 'calculate-monthly-royalties',
    name: 'Calculate Monthly Royalties',
    retries: 3,
    triggers: [
      { event: 'royalties/calculate.requested' },
      { cron: '0 2 1 * *' },  // 2am on the 1st of each month
    ],
  },
  async ({ event, step }: { event: any, step: any }) => {
    const artists = await step.run('get-all-artists', async () => {
      return prisma.organization.findMany({
        where: { isActive: true },
        select: { id: true, subscriptionTier: true }
      })
    })

    const batches = chunk(artists, 50)

    for (const [i, batch] of batches.entries()) {
      await step.run(`process-batch-${i}`, async () => {
        for (const artist of (batch as any[])) {
          await processArtistRoyalties(artist.id, artist.subscriptionTier)
        }
      })
    }

    await step.sendEvent('send-earnings-emails', {
      name: 'emails/monthly-earnings.send',
      data: { month: new Date().toISOString() }
    })

    return { processed: artists.length }
  }
)
