import { inngest } from '../client'
import { prisma } from '@/lib/prisma'
import { computeWeeklyCharts as originalComputeCharts } from '@/lib/private/charts/computeCharts'

// ── Founding conversions (daily 9am Central) ─────────────────
export const foundingConversionsCron = inngest.createFunction(
  {
    id: 'founding-conversions-daily',
    name: 'Founding Conversions Daily Check',
    retries: 3,
    triggers: [{ cron: 'TZ=America/Chicago 0 9 * * *' }],
  },
  async ({ step }: { step: any }) => {
    // founding conversion logic here
  }
)

// ── Expire collab requests (daily midnight) ───────────────────
export const expireCollabsCron = inngest.createFunction(
  {
    id: 'expire-collabs-daily',
    name: 'Expire Collab Requests',
    retries: 2,
    triggers: [{ cron: '0 0 * * *' }],
  },
  async ({ step }: { step: any }) => {
    await step.run('expire-collabs', async () => {
      await prisma.collabRequest.updateMany({
        where: {
          status: 'PENDING',
          expiresAt: { lte: new Date() }
        },
        data: { status: 'EXPIRED' }
      })
    })
  }
)

// ── Generate radio playlists (daily 2am) ─────────────────────
export const generateRadioPlaylistsCron = inngest.createFunction(
  {
    id: 'generate-radio-playlists',
    name: 'Generate Radio Playlists',
    retries: 2,
    triggers: [{ cron: '0 2 * * *' }],
  },
  async ({ step }: { step: any }) => {
    // radio playlist generation logic here
  }
)

// ── Reset AI credits (1st of each month midnight) ─────────────
export const resetAICreditsCron = inngest.createFunction(
  {
    id: 'reset-ai-credits-monthly',
    name: 'Reset Monthly AI Credits',
    retries: 2,
    triggers: [{ cron: '0 0 1 * *' }],
  },
  async ({ step }: { step: any }) => {
    // AI credit reset logic here
  }
)

// ── DJ listener count update (every minute) ───────────────────
export const djListenerCountCron = inngest.createFunction(
  {
    id: 'dj-listener-count-update',
    name: 'Update DJ Live Listener Counts',
    retries: 1,
    triggers: [{ cron: '* * * * *' }],
  },
  async ({ step }: { step: any }) => {
    // listener count update logic here
  }
)

// We already export computeWeeklyCharts from computeCharts.ts. We'll just export it here as well
// or we can remove the one here and export from route.ts directly. The prompt has it inside cronFunctions.ts.
// Let's just create a wrapper or ignore it.
export const computeWeeklyCharts = originalComputeCharts;

// ── Pre-save notifications (every hour) ───────────────────────
export const presaveNotificationsCron = inngest.createFunction(
  {
    id: 'presave-notifications-hourly',
    name: 'Send Pre-Save Release Notifications',
    retries: 2,
    triggers: [{ cron: '0 * * * *' }],
  },
  async ({ step }: { step: any }) => {
    // pre-save notification logic here
  }
)
