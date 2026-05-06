import { createAdminClient } from '@/lib/supabase/admin'

export async function analyzeListeningPattern(
  listenerId: string,
  period: { start: Date, end: Date }
): Promise<{
  humanScore: number  // 0.0 = bot, 1.0 = human
  flags: string[]
}> {
  const supabase = createAdminClient();

  const { data: streams } = await supabase
    .from('stream_plays')
    .select('*')
    .eq('fan_id', listenerId)
    .gte('started_at', period.start.toISOString())
    .lt('started_at', period.end.toISOString())
    .order('started_at', { ascending: true });
  
  if (!streams || streams.length === 0) return { humanScore: 1.0, flags: [] }
  
  let humanScore = 1.0
  const flags: string[] = []
  
  // Check 1: Same track on loop
  const trackCounts = (streams || []).reduce((acc, s) => {
    acc[s.track_id] = (acc[s.track_id] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const maxSingleTrackPlays = Math.max(...(Object.values(trackCounts) as number[]))
  if (maxSingleTrackPlays > 20) {
    humanScore *= 0.3
    flags.push('Looped single track >20 times')
  }
  
  // Check 2: Completion rate (bots never skip)
  const completedStreams = streams.filter(s => 
    s.duration_seconds && s.duration_seconds >= 30
  ).length
  const completionRate = completedStreams / streams.length
  
  if (completionRate > 0.95 && streams.length > 50) {
    humanScore *= 0.5
    flags.push('Suspiciously high completion rate (>95%)')
  }
  
  // Check 3: Perfect timing intervals (bot signature)
  if (streams.length > 20) {
    const intervals: number[] = []
    for (let i = 1; i < streams.length; i++) {
      const diff = new Date(streams[i].started_at).getTime() - new Date(streams[i-1].started_at).getTime()
      intervals.push(diff)
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0
    ) / intervals.length
    
    const stdDev = Math.sqrt(variance)
    
    // If intervals are too consistent (low variance), likely a bot
    if (stdDev < 5000) {
      humanScore *= 0.2
      flags.push('Robotic timing pattern detected')
    }
  }
  
  // Check 4: 24/7 streaming (humans sleep)
  const hours = new Set(streams.map(s => new Date(s.started_at).getHours()))
  if (hours.size > 20 && streams.length > 100) {
    humanScore *= 0.4
    flags.push('Streams at all hours (24/7 pattern)')
  }
  
  // Check 5: Zero pause events (tracked via gap analysis)
  let pauseCount = 0
  for (let i = 1; i < streams.length; i++) {
    const gap = new Date(streams[i].started_at).getTime() - 
                (new Date(streams[i-1].started_at).getTime() + (streams[i-1].duration_seconds || 0) * 1000)
    if (gap > 60000) pauseCount++ // Gap >1 min = pause
  }
  
  if (pauseCount === 0 && streams.length > 50) {
    humanScore *= 0.3
    flags.push('Zero pause events across 50+ streams')
  }
  
  return { humanScore, flags }
}
