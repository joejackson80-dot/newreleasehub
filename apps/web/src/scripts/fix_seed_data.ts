import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from apps/web root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const DB_URL = process.env.DATABASE_URL ?? "postgresql://postgres.vrqhvndemhajrggcaudm:7TPZTS68BJAF2P2y@aws-1-us-east-2.pooler.supabase.com:5432/postgres";
const pool = new Pool({ connectionString: DB_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- STARTING FORENSIC DATA CORRECTION ---');

  // 2.1 — Marcus Webb Profile
  console.log('Updating Marcus Webb...');
  const marcus = await prisma.organization.update({
    where: { slug: 'marcus-webb' },
    data: {
      supporterCount: 2140,
    }
  });

  const marcusReleases = await prisma.release.findMany({
    where: { organizationId: marcus.id },
    orderBy: { createdAt: 'asc' }
  });

  if (marcusReleases[0]) {
    await prisma.release.update({ where: { id: marcusReleases[0].id }, data: { title: 'Midnight in Atlanta', type: 'album' } });
  }
  if (marcusReleases[1]) {
    await prisma.release.update({ where: { id: marcusReleases[1].id }, data: { title: 'Worth It (feat. Nova Rae)', type: 'single' } });
  }
  if (marcusReleases[2]) {
    await prisma.release.update({ where: { id: marcusReleases[2].id }, data: { title: 'The Comeback EP', type: 'ep' } });
  }
  console.log('✓ Marcus Webb updated');

  // 2.2 — Joe Jack Profile
  console.log('Updating Joe Jack...');
  const joejack = await prisma.organization.update({
    where: { slug: 'iamjoejack' },
    data: {
      name: 'I Am Joe Jack',
      genres: ['Hip-Hop', 'Soul'],
      city: 'Omaha',
      country: 'US',
      bio: `Independent Hip-Hop artist from Omaha, Nebraska.\nOwner of Game Spittin Entertainment.\nMaking real music for real people.`
    }
  });

  const joeReleases = await prisma.release.findMany({ where: { organizationId: joejack.id } });

  for (const r of joeReleases) {
    if (r.title.toLowerCase().includes('demo') || r.title.toLowerCase().includes('demo set')) {
      await prisma.release.update({ where: { id: r.id }, data: { title: 'Game Spittin Vol. 1', type: 'ep' } });
    }
  }

  if (joeReleases.length < 3) {
    await prisma.release.create({
      data: {
        organizationId: joejack.id,
        title: 'Worth It (feat. Nova Rae)',
        type: 'single',
        coverArtUrl: '/images/default-cover.png',
      }
    });
    await prisma.release.create({
      data: {
        organizationId: joejack.id,
        title: 'The Comeback EP',
        type: 'ep',
        coverArtUrl: '/images/default-cover.png',
      }
    });
  }
  console.log('✓ Joe Jack updated');

  // 2.3 — Hellz Flame Profile
  console.log('Updating Hellz Flame...');
  await prisma.organization.update({
    where: { slug: 'hellz-flame' },
    data: { city: 'Omaha', country: 'US' }
  });
  console.log('✓ Hellz Flame updated');

  // 2.4 — Hide placeholder artists
  console.log('Hiding placeholder artists...');
  const result = await prisma.organization.updateMany({
    where: { name: { startsWith: 'Founding Artist' } },
    data: { isPublic: false }
  });
  console.log(`✓ Hid ${result.count} placeholder artists`);

  // Group 3 — Opportunity Board Poster Names
  console.log('Updating Opportunity Board posters...');
  await prisma.opportunity.updateMany({ where: { title: { contains: 'Commercial Spot' } }, data: { posterName: 'Meridian Films' } });
  await prisma.opportunity.updateMany({ where: { title: { contains: 'R&B Vocalist' } }, data: { posterName: 'DJ Solarize' } });
  await prisma.opportunity.updateMany({ where: { title: { contains: 'Creator Fund' } }, data: { posterName: 'Black Music Foundation' } });
  await prisma.opportunity.updateMany({ where: { title: { contains: 'Opening Act' } }, data: { posterName: 'The Hollow Venue' } });
  await prisma.opportunity.updateMany({ where: { title: { contains: 'Netflix' } }, data: { posterName: 'Resonance Gaming Studios' } });
  console.log('✓ Opportunity board updated');

  console.log('--- FORENSIC DATA CORRECTION COMPLETE ---');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });


