import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Creating test accounts...')
  
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env.local')
  }

  // Hash password
  const passwordHash = await bcrypt.hash('Password123', 10)

  // ============================================================
  // ARTIST: I Am Joe Jack (Mapped to Organization)
  // ============================================================
  const artist = await prisma.organization.upsert({
    where: { slug: 'i-am-joe-jack' },
    update: {},
    create: {
      username:         'iamjoejack',
      email:            'joejack@gamespittinent.com',
      passwordHash,
      name:             'I Am Joe Jack',
      slug:             'i-am-joe-jack',
      subscriptionTier: 'PRO',
      genres:           ['Hip-Hop', 'Soul', 'R&B'],
      city:             'Omaha',
      country:          'US',
      bio:              'Independent Hip-Hop artist from Omaha, Nebraska. Owner of Game Spittin Entertainment. Making real music for real people.',
      isVerified:       true,
      isActive:         true,
      patronCount:      2140,
      totalStreams:     1820000,
    }
  })

  console.log(`✓ Artist created: ${artist.name} (ID: ${artist.id})`)

  // Grant Founding Artist #1 slot
  await prisma.foundingCounter.upsert({
    where: { id: 'singleton' },
    update: { count: 1 },
    create: { id: 'singleton', count: 1, maxSlots: 1000, isOpen: true }
  })

  await prisma.foundingArtistSlot.upsert({
    where: { artistId: artist.id },
    update: {},
    create: {
      artistId:       artist.id,
      slotNumber:     1,
      freeYearEndsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status:         'ACTIVE_FREE',
    }
  })

  console.log(`✓ Founding Artist #1 slot granted`)

  // Create releases
  const album = await prisma.release.upsert({
    where: { id: 'test-album-1' },
    update: {},
    create: {
      id:          'test-album-1',
      organizationId: artist.id,
      title:       'Midnight in Atlanta',
      type:        'ALBUM',
      releaseDate: new Date('2023-06-15'),
      trackCount:  10,
    }
  })

  const single = await prisma.release.upsert({
    where: { id: 'test-single-1' },
    update: {},
    create: {
      id:          'test-single-1',
      organizationId: artist.id,
      title:       'Worth It (feat. Nova Rae)',
      type:        'SINGLE',
      releaseDate: new Date('2024-01-20'),
      trackCount:  1,
    }
  })

  const ep = await prisma.release.upsert({
    where: { id: 'test-ep-1' },
    update: {},
    create: {
      id:          'test-ep-1',
      organizationId: artist.id,
      title:       'The Comeback EP',
      type:        'EP',
      releaseDate: new Date('2023-11-01'),
      trackCount:  5,
    }
  })

  console.log(`✓ Releases created: ${album.title}, ${single.title}, ${ep.title}`)

  // Create patron tiers
  const tier1 = await prisma.patronTier.create({
    data: {
      organizationId:       artist.id,
      name:                 'Day One',
      priceCents:           500,
      description:          'Access to exclusive posts and early previews',
      revenueSharePercent:  0.1,
      isActive:             true,
      sortOrder:            1,
    }
  })

  const tier2 = await prisma.patronTier.create({
    data: {
      organizationId:       artist.id,
      name:                 'Inner Circle',
      priceCents:           1500,
      description:          'Direct message access, patron-only content, and revenue sharing from streams',
      revenueSharePercent:  0.5,
      maxSlots:             100,
      isActive:             true,
      sortOrder:            2,
    }
  })

  console.log(`✓ Patron tiers created: ${tier1.name}, ${tier2.name}`)

  // ============================================================
  // FAN: John Doe (Mapped to User)
  // ============================================================
  const fan = await prisma.user.upsert({
    where: { email: 'johndoe@testmail.com' },
    update: {},
    create: {
      username:    'johndoe',
      email:       'johndoe@testmail.com',
      passwordHash,
      displayName: 'John Doe',
      role:        'fan',
      tier:        'LISTENER',
      isActive:    true,
    }
  })

  console.log(`✓ Fan created: ${fan.displayName} (ID: ${fan.id})`)

  // John Doe follows I Am Joe Jack
  await prisma.follow.upsert({
    where: {
      followerId_followerType_followingId_followingType: {
        followerId:    fan.id,
        followerType:  'FAN',
        followingId:   artist.id,
        followingType: 'ARTIST',
      }
    },
    update: {},
    create: {
      followerId:    fan.id,
      followerType:  'FAN',
      followingId:   artist.id,
      followingType: 'ARTIST',
    }
  })

  console.log(`✓ John Doe is now following I Am Joe Jack`)

  // John Doe patrons I Am Joe Jack — Day One tier
  await prisma.patronSubscription.create({
    data: {
      fanId:        fan.id,
      artistId:     artist.id,
      tierId:       tier1.id,
      patronNumber: 1,
      priceCents:   500,
      status:       'ACTIVE',
      startedAt:    new Date(),
    }
  })

  console.log(`✓ John Doe is Patron #1 of I Am Joe Jack (Day One tier)`)

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n====================================================')
  console.log('TEST ACCOUNTS READY')
  console.log('====================================================')
  console.log('\n🎵 ARTIST ACCOUNT — I Am Joe Jack')
  console.log('   Username:    iamjoejack')
  console.log('   Email:       joejack@gamespittinent.com')
  console.log('   Password:    Password123')
  console.log('\n👤 FAN ACCOUNT — John Doe')
  console.log('   Username:    johndoe')
  console.log('   Email:       johndoe@testmail.com')
  console.log('   Password:    Password123')
  console.log('====================================================\n')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
