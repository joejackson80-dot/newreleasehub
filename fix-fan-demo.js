const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixFanDemo() {
    try {
        const fan = await prisma.user.findFirst({ where: { username: 'johndoe' } });
        const artist = await prisma.organization.findFirst({ where: { username: 'iamjoejack' } });

        if (!fan || !artist) {
            console.log('Fan or Artist missing');
            return;
        }

        // Add Follower
        await prisma.follower.upsert({
            where: { organizationId_userId: { organizationId: artist.id, userId: fan.id } },
            update: {},
            create: { organizationId: artist.id, userId: fan.id }
        });

        // Add some releases for the artist so the feed isn't empty
        const release = await prisma.release.findFirst({ where: { organizationId: artist.id } });
        if (!release) {
            await prisma.release.create({
                data: {
                    organizationId: artist.id,
                    title: 'Institutional Masters',
                    type: 'album',
                    coverArtUrl: '/images/default-avatar.png',
                    releaseDate: new Date()
                }
            });
        }

        console.log('Fan demo data fixed.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fixFanDemo();
