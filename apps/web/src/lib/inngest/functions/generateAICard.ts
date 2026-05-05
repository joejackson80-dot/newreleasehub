import { inngest } from '../client'
import { createAdminClient } from '@/lib/supabase/admin'

export const generateAICard = inngest.createFunction(
  {
    id: 'generate-ai-card',
    name: 'Generate AI Milestone Card',
    retries: 2,
    concurrency: { limit: 5 },
    triggers: [{ event: 'ai/card.generate.requested' }],
  },
  async ({ event, step }) => {
    const { artistId, milestoneType } = event.data

    const imageUrl = await step.run('generate-image', async () => {
      const { generateMilestoneCard } = await import('@/lib/milestones/generateCard')
      return generateMilestoneCard(artistId, milestoneType)
    })

    await step.run('save-milestone', async () => {
      const supabase = createAdminClient();
      await supabase
        .from('artist_milestones')
        .insert({ 
          artist_id: artistId, 
          type: milestoneType, 
          card_image_url: imageUrl 
        });
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
