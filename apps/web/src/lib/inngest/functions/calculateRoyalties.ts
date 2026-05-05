import { inngest } from '../client'
import { createAdminClient } from '@/lib/supabase/admin'

// Stub helper
const chunk = <T>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const processArtistRoyalties = async (id: string, tier: string) => {
  // Logic to be implemented or called here
  console.log(`Processing royalties for artist ${id} on tier ${tier}`);
};

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
  async ({ step }) => {
    const artists = await step.run('get-all-artists', async () => {
      const supabase = createAdminClient();
      const { data: orgs, error } = await supabase
        .from('organizations')
        .select('id, plan_tier')
        .eq('is_active', true);
      
      if (error) throw error;
      return orgs || [];
    })

    const batches = chunk(artists, 50)

    for (const [i, batch] of batches.entries()) {
      await step.run(`process-batch-${i}`, async () => {
        for (const artist of batch) {
          await processArtistRoyalties(artist.id, artist.plan_tier || 'standard')
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
