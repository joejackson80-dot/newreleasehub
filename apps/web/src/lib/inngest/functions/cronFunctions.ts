import { inngest } from '../client'
import { createAdminClient } from '@/lib/supabase/admin'
import { computeWeeklyCharts as originalComputeCharts } from '@/lib/private/charts/computeCharts'

// ── Founding conversions (daily 9am Central) ─────────────────
export const foundingConversionsCron = inngest.createFunction(
  {
    id: 'founding-conversions-daily',
    name: 'Founding Conversions Daily Check',
    retries: 3,
    triggers: [{ cron: 'TZ=America/Chicago 0 9 * * *' }],
  },
  async () => {
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
  async ({ step }) => {
    await step.run('expire-collabs', async () => {
      const supabase = createAdminClient();
      await supabase
        .from('collab_requests')
        .update({ status: 'EXPIRED' })
        .eq('status', 'PENDING')
        .lte('expires_at', new Date().toISOString());
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
  async () => {
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
  async () => {
    // listener count update logic here
  }
)

export const computeWeeklyCharts = originalComputeCharts;

// ── Pre-save notifications (every hour) ───────────────────────
export const presaveNotificationsCron = inngest.createFunction(
  {
    id: 'presave-notifications-hourly',
    name: 'Send Pre-Save Release Notifications',
    retries: 2,
    triggers: [{ cron: '0 * * * *' }],
  },
  async () => {
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
  async ({ step }) => {
    const supabase = createAdminClient();
    await step.run('reset-7d-stats', async () => {
      await supabase
        .from('fan_artist_relations')
        .update({ stream_count_7d: 0 });
      
      await supabase
        .from('fan_listening_stats')
        .update({ total_streams_7d: 0 });
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
  async ({ step }) => {
    const supabase = createAdminClient();
    await step.run('reset-30d-stats', async () => {
      await supabase
        .from('fan_artist_relations')
        .update({ stream_count_30d: 0 });
      
      await supabase
        .from('fan_listening_stats')
        .update({ total_streams_30d: 0 });
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
  async ({ step }) => {
    const supabase = createAdminClient();
    await step.run('update-streaks', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      await supabase
        .from('fan_listening_stats')
        .update({ listening_streak: 0 })
        .lt('updated_at', yesterday.toISOString());
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
  async ({ step }) => {
    const supabase = createAdminClient();
    const artists = await step.run('get-artists', async () => {
      const { data } = await supabase.from('organizations').select('id');
      return data || [];
    });

    for (const artist of artists) {
      await step.run(`process-artist-${artist.id}`, async () => {
        const { data: topFans } = await supabase
          .from('fan_artist_relations')
          .select('*, fan:users(id, display_name, avatar_url)')
          .eq('artist_id', artist.id)
          .order('stream_count_30d', { ascending: false })
          .limit(10);

        await supabase
          .from('artist_supporter_leaderboards')
          .upsert({
            artist_id: artist.id,
            leaderboard_data: JSON.stringify(topFans),
            week: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'artist_id' });
      });
    }
  }
);
