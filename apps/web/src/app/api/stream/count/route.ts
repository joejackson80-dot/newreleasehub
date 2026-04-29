import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { safeError } from '@/lib/api/errors'

export async function POST(req: NextRequest) {
  try {
    const { streamPlayId, interactionSignals } = await req.json()
    
    const streamPlay = await prisma.streamPlay.findUnique({
      where: { id: streamPlayId }
    })
    
    if (!streamPlay) {
      return NextResponse.json(safeError('Stream play not found', 404), { status: 404 })
    }
    
    // Calculate fraud score based on signals
    let fraudScore = 1.0
    let flagReason: string | null = null
    let isExcluded = false
    
    // Rule 1: If IP is datacenter, reduce score
    if (streamPlay.ipIsDatacenter) {
      fraudScore *= 0.3
      flagReason = 'Datacenter IP detected'
    }
    
    // Rule 2: If no interaction signals, reduce score
    const interactionCount = [
      interactionSignals.hadMouseMovement,
      interactionSignals.hadKeyboardInput,
      interactionSignals.wasTabVisible,
    ].filter(Boolean).length
    
    if (interactionCount === 0) {
      fraudScore *= 0.2
      flagReason = (flagReason ? flagReason + ' + ' : '') + 'No user interaction detected'
    } else if (interactionCount === 1) {
      fraudScore *= 0.6
    }
    
    // Rule 3: If audio was muted, reduce score
    if (interactionSignals.wasAudioMuted) {
      fraudScore *= 0.5
      flagReason = (flagReason ? flagReason + ' + ' : '') + 'Audio muted'
    }
    
    // Rule 4: Check device volume this hour
    const oneHourAgo = new Date(Date.now() - 3600000)
    const recentStreamsFromDevice = await prisma.streamPlay.count({
      where: {
        deviceId: streamPlay.deviceId,
        startedAt: { gte: oneHourAgo }
      }
    })
    
    if (recentStreamsFromDevice > 30) {
      fraudScore *= 0.1
      flagReason = (flagReason ? flagReason + ' + ' : '') + 'Device rate limit exceeded'
    }
    
    // Rule 5: Exclude if fraud score too low
    if (fraudScore < 0.3) {
      isExcluded = true
    }
    
    // Update stream play record
    const updated = await prisma.streamPlay.update({
      where: { id: streamPlayId },
      data: {
        countedAsStream: !isExcluded,
        fraudScore,
        isExcludedFromPool: isExcluded,
        flagReason,
        hadMouseMovement: interactionSignals.hadMouseMovement,
        hadKeyboardInput: interactionSignals.hadKeyboardInput,
        wasTabVisible: interactionSignals.wasTabVisible,
        wasAudioMuted: interactionSignals.wasAudioMuted,
      },
      include: {
        MusicAsset: true,
      }
    })

    // --- FAN CHART TRACKING SYSTEM ---
    if (!isExcluded && streamPlay.listenerId) {
      const fanId = streamPlay.listenerId;
      const artistId = streamPlay.artistId;
      const trackDurationSecs = updated.MusicAsset?.duration || 0;

      // 1. Update FanArtistRelation
      await prisma.fanArtistRelation.upsert({
        where: { fanId_artistId: { fanId, artistId } },
        update: {
          streamCount:   { increment: 1 },
          streamCount7d: { increment: 1 },
          streamCount30d: { increment: 1 },
          lastStreamAt:   new Date(),
        },
        create: {
          fanId,
          artistId,
          streamCount:   1,
          streamCount7d: 1,
          streamCount30d: 1,
          firstStreamAt: new Date(),
          lastStreamAt:  new Date(),
        }
      });

      // 2. Update FanListeningStats
      await prisma.fanListeningStats.upsert({
        where: { fanId },
        update: {
          totalStreamsAllTime: { increment: 1 },
          totalStreams7d:      { increment: 1 },
          totalStreams30d:     { increment: 1 },
          totalListeningHrs:   { increment: trackDurationSecs / 3600 },
          updatedAt:           new Date(),
        },
        create: {
          fanId,
          totalStreamsAllTime: 1,
          totalStreams7d:      1,
          totalStreams30d:     1,
          totalListeningHrs:   trackDurationSecs / 3600,
        }
      });

      // 3. First Discovery Tracking
      const artist = await prisma.organization.findUnique({
        where: { id: artistId },
        select: { chartPositionGenre: true, chartPositionGlobal: true }
      });

      if (artist && !artist.chartPositionGenre && !artist.chartPositionGlobal) {
        await prisma.fanListeningStats.update({
          where: { fanId },
          data: { firstDiscoveries: { increment: 1 } }
        });
      }
    }
    
    return NextResponse.json({ counted: !isExcluded, fraudScore })
  } catch (error) {
    console.error('[STREAM_COUNT_ERROR]', error);
    return NextResponse.json(safeError(error), { status: 500 })
  }
}


