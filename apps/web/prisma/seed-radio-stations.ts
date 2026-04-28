import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local from the web app directory
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString = process.env.DATABASE_URL;

async function main() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in .env.local');
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🚀 Seeding NRH Radio Stations...');

  const stations = [
    {
      name: 'NRH Hip-Hop Radio',
      slug: 'hip-hop',
      description: 'The heartbeat of the streets. Pure independent hip-hop and rap, 24/7.',
      genres: ['Hip-Hop', 'Rap'],
    },
    {
      name: 'NRH R&B Radio',
      slug: 'r-and-b',
      description: 'Smooth rhythms and soulful voices from the next generation of R&B icons.',
      genres: ['R&B', 'Soul'],
    },
    {
      name: 'NRH Afrobeats Radio',
      slug: 'afrobeats',
      description: 'The global sound. Vibrations from Lagos to London and beyond.',
      genres: ['Afrobeats', 'Afropop'],
    },
    {
      name: 'NRH Electronic Radio',
      slug: 'electronic',
      description: 'Synthesized landscapes and heavy bass. House, Techno, and EDM.',
      genres: ['Electronic', 'EDM', 'House', 'Techno'],
    },
    {
      name: 'NRH Indie Radio',
      slug: 'indie',
      description: 'Raw, authentic, and independent. Alternative, Rock, and Indie picks.',
      genres: ['Indie', 'Alternative', 'Rock'],
    },
    {
      name: 'NRH Lo-Fi Radio',
      slug: 'lo-fi',
      description: 'Chill beats to study, work, or relax to. The ultimate vibestation.',
      genres: ['Lo-Fi', 'Chillhop'],
    },
  ];

  for (const station of stations) {
    const s = await prisma.station.upsert({
      where: { slug: station.slug },
      update: {
        name: station.name,
        description: station.description,
        genres: station.genres,
      },
      create: {
        name: station.name,
        slug: station.slug,
        description: station.description,
        genres: station.genres,
      },
    });
    console.log(`✅ Station ${s.name} created/updated.`);
  }

  console.log('✨ Radio station seeding complete.');
  await pool.end();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
