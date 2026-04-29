import { inngest } from '../client'
import { prisma } from '@/lib/prisma'
import { generateMilestoneCard } from '@/lib/milestones/generateCard'

export const generateAICard = inngest.createFunction(
  {
    id: 'generate-ai-card',
    name: 'Generate AI Milestone Card',
    retries: 2,
    concurrency: { limit: 5 },
    triggers: [{ event: 'ai/card.generate.requested' }],
  },
  async ({ event, step }: { event: any, step: any }) => {
    const { artistId, milestoneType } = event.data

    const imageUrl = await step.run('generate-image', async () => {
      return generateMilestoneCard(artistId, milestoneType)
    })

    await step.run('save-milestone', async () => {
      await prisma.artistMilestone.create({
        data: { artistId, type: milestoneType, cardImageUrl: imageUrl }
      })
    })

    await step.sendEvent('notify-artist', {
      name: 'email/notification.send',
      data: {
        type:          'MILESTONE',
        artistId,
        milestoneType,
        cardImageUrl:  imageUrl,
      }
    })

    return { artistId, milestoneType, imageUrl }
  }
)


