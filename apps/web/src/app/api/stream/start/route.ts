import { NextRequest, NextResponse } from 'next/server'
import { checkIPReputation } from '@/lib/fraud/ipCheck'
import { prisma } from '@/lib/prisma'
import { sanitizeResponse } from '@/lib/private/sanitize'
import { safeError } from '@/lib/api/errors'

export async function POST(req: NextRequest) {
  try {
    const { trackId, artistId, deviceId, userAgent } = await req.json()
    
    const ip = (req as any).ip ?? req.headers.get('x-forwarded-for') ?? 'unknown'
    
    // Check IP reputation
    const ipData = await checkIPReputation(ip)
    
    // Create StreamPlay record
    const streamPlay = await prisma.streamPlay.create({
      data: {
        trackId,
        artistId,
        deviceId: deviceId || 'unknown',
        ipAddress: ip,
        ipCountry: ipData.country,
        ipIsDatacenter: ipData.isDatacenter,
        userAgent: userAgent || 'unknown',
        poolSource: 'C', // Default to free pool, logic for A (paid) would go here
        countedAsStream: false,
        fraudScore: 1.0,
      }
    })
    
    return NextResponse.json({ streamPlayId: streamPlay.id })
  } catch (error) {
    return NextResponse.json(safeError(error), { status: 500 })
  }
}


