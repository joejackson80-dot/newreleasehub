import { createAdminClient } from '@/lib/supabase/admin'

export async function detectSelfStreaming(artistId: string): Promise<{
  isSuspicious: boolean
  reason: string | null
  suspiciousDeviceIds: string[]
}> {
  const supabase = createAdminClient();

  // Get artist's login deviceIds and IPs (from their studio sessions)
  const { data: artistSessions } = await supabase
    .from('device_sessions')
    .select('device_id, ip_address')
    .eq('user_id', artistId);
  
  const artistDeviceIds = Array.from(new Set((artistSessions || []).map(s => s.device_id).filter(Boolean))) as string[];
  const artistIPs = Array.from(new Set((artistSessions || []).map(s => s.ip_address).filter(Boolean))) as string[];
  
  if (artistDeviceIds.length === 0 && artistIPs.length === 0) {
    return { isSuspicious: false, reason: null, suspiciousDeviceIds: [] };
  }

  // Check if any of those deviceIds appear in streams of this artist's music
  const { data: matchingStreams } = await supabase
    .from('stream_plays')
    .select('id')
    .eq('artist_id', artistId)
    .in('device_id', artistDeviceIds)
    .limit(11);
  
  if (matchingStreams && matchingStreams.length > 10) {
    // Artist's device has streamed their own music >10 times
    return {
      isSuspicious: true,
      reason: 'Artist device detected in own stream plays',
      suspiciousDeviceIds: artistDeviceIds
    }
  }
  
  // Check for IP overlap
  const { count: streamsFromArtistIPs } = await supabase
    .from('stream_plays')
    .select('*', { count: 'exact', head: true })
    .eq('artist_id', artistId)
    .in('ip_address', artistIPs);
  
  if (streamsFromArtistIPs && streamsFromArtistIPs > 50) {
    return {
      isSuspicious: true,
      reason: 'High volume of streams from artist IP addresses',
      suspiciousDeviceIds: []
    }
  }
  
  return { isSuspicious: false, reason: null, suspiciousDeviceIds: [] }
}
