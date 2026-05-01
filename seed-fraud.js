const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedFraudData() {
    try {
        console.log('Seeding forensic fraud data...');

        const artist = await prisma.organization.findFirst({
            where: { username: 'iamjoejack' }
        });

        if (!artist) {
            console.error('Artist iamjoejack not found.');
            return;
        }

        // 1. Create a Pending Fraud Incident
        await prisma.fraudIncident.create({
            data: {
                artistId: artist.id,
                type: 'BOT_ATTACK',
                details: 'Massive stream spike detected from known datacenter IP range in Singapore. 14,000 streams in 2 hours.',
                month: new Date(),
                excludedStreamCount: 14200,
                status: 'PENDING'
            }
        });

        // 2. Create another incident for a mock artist
        const mockArtist = await prisma.organization.upsert({
            where: { slug: 'sus-artist' },
            update: {},
            create: {
                slug: 'sus-artist',
                name: 'Anomalous Records',
                username: 'susartist',
                bio: 'Demo suspicious account.',
                email: 'sus@example.com'
            }
        });

        await prisma.fraudIncident.create({
            data: {
                artistId: mockArtist.id,
                type: 'PLAYLIST_MANIPULATION',
                details: 'Artificial placement on "Global Top 50" via 3rd party black-market promotion service.',
                month: new Date(),
                excludedStreamCount: 8500,
                status: 'PENDING'
            }
        });

        // 3. Create high-volume stream clusters
        const mockIP = '192.168.1.100';
        const mockDevice = 'device-bot-1';

        // Add some dummy music asset if none exists
        const asset = await prisma.musicAsset.findFirst();
        if (asset) {
            for (let i = 0; i < 50; i++) {
                await prisma.streamPlay.create({
                    data: {
                        trackId: asset.id,
                        artistId: artist.id,
                        ipAddress: mockIP,
                        deviceId: mockDevice,
                        fraudScore: 0.12, // Very suspicious
                        isExcludedFromPool: true,
                        flagReason: 'IP_CLUSTER_LIMIT',
                        startedAt: new Date(Date.now() - Math.random() * 3600000)
                    }
                });
            }
        }

        console.log('Forensic fraud data seeded.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

seedFraudData();
