export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { checkIPReputation } from '@/lib/fraud/ipCheck'
import { prisma } from '@/lib/prisma'
import { sanitizeResponse } from '@/lib/private/sanitize'
import { safeError } from '@/lib/api/errors'

export async function POST(req: NextRequest) {
  try {
    const { trackId, artistId, deviceId, userAgent, listenerId, listenerType } = await req.json()
    
    const ip = (req as any).ip ?? req.headers.get('x-forwarded-for') ?? 'unknown'
    
    // Check IP reputation
    const ipData = await checkIPReputation(ip)
    
    // Determine pool source based on listener's subscription status
    let poolSource: 'A' | 'C' = 'C' // Default: free/ad-supported pool
    
    if (listenerId && listenerType === 'fan') {
      // Check if this fan has an active paid subscription
      const activeSub = await prisma.fanSubscription.findFirst({
        where: {
          fanId: listenerId,
          status: 'active',
        },
        select: { id: true }
      })
      
      if (activeSub) {
        poolSource = 'A' // Paid subscriber → premium pool
      }
    }
    
    // Create StreamPlay record
    const streamPlay = await prisma.streamPlay.create({
      data: {
        trackId,
        artistId,
        listenerId: listenerId || null,
        listenerType: listenerType?.toUpperCase() || 'GUEST',
        deviceId: deviceId || 'unknown',
        ipAddress: ip,
        ipCountry: ipData.country,
        ipIsDatacenter: ipData.isDatacenter,
        userAgent: userAgent || 'unknown',
        poolSource,
        countedAsStream: false,
        fraudScore: 1.0,
      }
    })
    
    return NextResponse.json({ streamPlayId: streamPlay.id })
  } catch (error) {
    return NextResponse.json(safeError(error), { status: 500 })
  }
}



