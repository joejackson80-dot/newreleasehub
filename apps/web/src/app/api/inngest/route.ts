import { serve } from 'inngest/next'
import { inngest } from '@/lib/inngest/client'

// Import all functions
import { calculateMonthlyRoyalties }  from '@/lib/inngest/functions/calculateRoyalties'
import { processStreamFraudScore }    from '@/lib/inngest/functions/processStreamFraud'
import { sendEmailNotification }      from '@/lib/inngest/functions/sendEmail'
import { generateAICard }             from '@/lib/inngest/functions/generateAICard'
import {
  foundingConversionsCron,
  expireCollabsCron,
  generateRadioPlaylistsCron,
  djListenerCountCron,
  computeWeeklyCharts,
  presaveNotificationsCron,
} from '@/lib/inngest/functions/cronFunctions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    calculateMonthlyRoyalties,
    processStreamFraudScore,
    sendEmailNotification,
    generateAICard,
    foundingConversionsCron,
    expireCollabsCron,
    generateRadioPlaylistsCron,
    djListenerCountCron,
    computeWeeklyCharts,
    presaveNotificationsCron,
  ],
})


