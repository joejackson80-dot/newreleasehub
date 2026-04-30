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

// ── Weekly Fan Stats Reset (Monday midnight) ────────────────
export const weeklyFanStatsResetCron = inngest.createFunction(
  {
    id: 'weekly-fan-stats-reset',
    name: 'Weekly Fan Stats Reset',
    triggers: [{ cron: '0 0 * * 1' }],
  },
  async ({ step }: { step: any }) => {
    await step.run('reset-7d-stats', async () => {
      await prisma.fanArtistRelation.updateMany({
        data: { streamCount7d: 0 }
      });
      await prisma.fanListeningStats.updateMany({
        data: { totalStreams7d: 0 }
      });
    });
  }
);

// ── Monthly Fan Stats Reset (1st of month midnight) ──────────
export const monthlyFanStatsResetCron = inngest.createFunction(
  {
    id: 'monthly-fan-stats-reset',
    name: 'Monthly Fan Stats Reset',
    triggers: [{ cron: '0 0 1 * *' }],
  },
  async ({ step }: { step: any }) => {
    await step.run('reset-30d-stats', async () => {
      await prisma.fanArtistRelation.updateMany({
        data: { streamCount30d: 0 }
      });
      await prisma.fanListeningStats.updateMany({
        data: { totalStreams30d: 0 }
      });
    });
  }
);

// ── Daily Fan Streak Maintenance (Midnight) ──────────────────
export const dailyFanStreakCron = inngest.createFunction(
  {
    id: 'daily-fan-streak-maintenance',
    name: 'Daily Fan Streak Maintenance',
    triggers: [{ cron: '0 0 * * *' }],
  },
  async ({ step }: { step: any }) => {
    await step.run('update-streaks', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Reset streaks for those who didn't listen yesterday
      await prisma.fanListeningStats.updateMany({
        where: { updatedAt: { lt: yesterday } },
        data: { listeningStreak: 0 }
      });
    });
  }
);

// ── Weekly Fan Leaderboard Generation (Monday 3am) ───────────
export const generateFanLeaderboardsCron = inngest.createFunction(
  {
    id: 'generate-fan-leaderboards',
    name: 'Generate Fan Leaderboards',
    triggers: [{ cron: '0 3 * * 1' }],
  },
  async ({ step }: { step: any }) => {
    const artists = await step.run('get-artists', async () => {
      return prisma.organization.findMany({
        select: { id: true }
      });
    });

    for (const artist of artists) {
      await step.run(`process-artist-${artist.id}`, async () => {
        const topFans = await prisma.fanArtistRelation.findMany({
          where: { artistId: artist.id },
          orderBy: { streamCount30d: 'desc' },
          take: 10,
          include: { fan: { select: { id: true, displayName: true, avatarUrl: true } } }
        });

        await prisma.artistSupporterLeaderboard.upsert({
          where: { artistId: artist.id },
          update: {
            leaderboardData: JSON.stringify(topFans),
            week: new Date(),
            updatedAt: new Date()
          },
          create: {
            artistId: artist.id,
            leaderboardData: JSON.stringify(topFans),
            week: new Date()
          }
        });
      });
    }
  }
);


