require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Demo Credentials...');

  const passwordHash = await bcrypt.hash('Password123', 10);

  // 1. Demo Artist
  const artist = await prisma.organization.upsert({
    where: { username: 'iamjoejack' },
    update: { passwordHash, role: 'admin' },
    create: {
      username: 'iamjoejack',
      email: 'joe@newreleasehub.com',
      name: 'Joe Jackson',
      slug: 'iamjoejack',
      passwordHash: passwordHash,
      role: 'admin',
      isPublic: true,
      planTier: 'ELITE'
    }
  });
  console.log('Demo Artist created:', artist.email, '/ Password123');

  // 2. Demo Fan
  const fan = await prisma.user.upsert({
    where: { username: 'johndoe' },
    update: { passwordHash },
    create: {
      username: 'johndoe',
      email: 'fan@newreleasehub.com',
      displayName: 'John Doe',
      passwordHash: passwordHash,
      role: 'fan'
    }
  });
  console.log('Demo Fan created:', fan.email, '/ Password123');

  console.log('Demo seeding complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
