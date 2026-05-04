import { inngest } from '../client'
import { prisma } from '@/lib/prisma'

export const processStreamFraudScore = inngest.createFunction(
  {
    id: 'process-stream-fraud',
    name: 'Process Stream Fraud Score',
    retries: 2,
    idempotency: 'event.data.streamPlayId',
    triggers: [{ event: 'stream/fraud.check.requested' }],
  },
  async ({ event, step }) => {
    const {
      streamPlayId, deviceId,
      hadMouseMovement, hadKeyboardInput,
      wasAudioMuted, ipIsDatacenter
    } = event.data

    const fraudScore = await step.run('calculate-score', async () => {
      let score = 1.0
      if (ipIsDatacenter)                              score *= 0.3
      if (!hadMouseMovement && !hadKeyboardInput)      score *= 0.2
      else if (!hadMouseMovement || !hadKeyboardInput) score *= 0.6
      if (wasAudioMuted)                               score *= 0.5

      const recentCount = await prisma.streamPlay.count({
        where: {
          deviceId,
          startedAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }
        }
      })
      if (recentCount > 30) score *= 0.1

      return score
    })

    await step.run('update-stream', async () => {
      await prisma.streamPlay.update({
        where: { id: streamPlayId },
        data: {
          fraudScore,
          isExcludedFromPool: fraudScore < 0.3,
          flagReason: fraudScore < 0.3 ? 'Low fraud score' : null,
        }
      })
    })

    return { streamPlayId, fraudScore }
  }
)


