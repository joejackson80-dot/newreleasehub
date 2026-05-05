import { inngest } from '../client'
import { createAdminClient } from '@/lib/supabase/admin'

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
      const supabase = createAdminClient();
      let score = 1.0
      if (ipIsDatacenter)                              score *= 0.3
      if (!hadMouseMovement && !hadKeyboardInput)      score *= 0.2
      else if (!hadMouseMovement || !hadKeyboardInput) score *= 0.6
      if (wasAudioMuted)                               score *= 0.5

      const { count: recentCount } = await supabase
        .from('stream_plays')
        .select('*', { count: 'exact', head: true })
        .eq('device_id', deviceId)
        .gte('started_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

      if (recentCount && recentCount > 30) score *= 0.1

      return score
    })

    await step.run('update-stream', async () => {
      const supabase = createAdminClient();
      await supabase
        .from('stream_plays')
        .update({
          fraud_score: fraudScore,
          is_excluded_from_pool: fraudScore < 0.3,
          flag_reason: fraudScore < 0.3 ? 'Low fraud score' : null,
        })
        .eq('id', streamPlayId);
    })

    return { streamPlayId, fraudScore }
  }
)
