import { prisma } from '@/lib/prisma'

export async function detectSelfStreaming(artistId: string): Promise<{
  isSuspicious: boolean
  reason: string | null
  suspiciousDeviceIds: string[]
}> {
  // Get artist's login deviceIds and IPs (from their studio sessions)
  const artistSessions = await prisma.deviceSession.findMany({
    where: { userId: artistId },
    select: { deviceId: true, ipAddress: true },
    distinct: ['deviceId']
  })
  
  const artistDeviceIds = artistSessions.map(s => s.deviceId).filter(Boolean) as string[]
  const artistIPs = artistSessions.map(s => s.ipAddress).filter(Boolean) as string[]
  
  // Check if any of those deviceIds appear in streams of this artist's music
  const matchingStreams = await prisma.streamPlay.findMany({
    where: {
      artistId,
      deviceId: { in: artistDeviceIds }
    }
  })
  
  if (matchingStreams.length > 10) {
    // Artist's device has streamed their own music >10 times
    return {
      isSuspicious: true,
      reason: 'Artist device detected in own stream plays',
      suspiciousDeviceIds: artistDeviceIds
    }
  }
  
  // Check for IP overlap
  const streamsFromArtistIPs = await prisma.streamPlay.count({
    where: {
      artistId,
      ipAddress: { in: artistIPs }
    }
  })
  
  if (streamsFromArtistIPs > 50) {
    return {
      isSuspicious: true,
      reason: 'High volume of streams from artist IP addresses',
      suspiciousDeviceIds: []
    }
  }
  
  return { isSuspicious: false, reason: null, suspiciousDeviceIds: [] }
}


