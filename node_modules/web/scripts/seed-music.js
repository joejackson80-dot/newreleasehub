const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.findUnique({
    where: { slug: 'hellz-flame' }
  });

  if (!org) {
    console.log('Org not found');
    return;
  }

  const musicFiles = [
    { title: 'Beauty In The Dirt (Remix)', url: '/music/beauty-in-the-dirt-remix.mp3' },
    { title: 'Get Right (Remix)', url: '/music/get-right-remix.mp3' },
    { title: 'Gimmie Back My Lighter', url: '/music/gimmie-back-my-lighter.mp3' },
    { title: 'Her Man', url: '/music/her-man.mp3' },
    { title: 'Its Not Your Fault', url: '/music/its-not-your-fault.mp3' },
    { title: 'Paparazzi On The Move', url: '/music/paparazzi-on-the-move.mp3' }
  ];

  for (const file of musicFiles) {
    await prisma.musicAsset.upsert({
      where: { id: `test-${file.title}` }, // Dummy ID for upsert
      update: {},
      create: {
        id: `test-${file.title}`,
        organizationId: org.id,
        title: file.title,
        audioUrl: file.url,
      }
    });
  }

  console.log('Seeded music assets for Hellz Flame');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
