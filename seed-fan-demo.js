const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedFanData() {
    try {
        console.log('Seeding demo fan data...');

        const fan = await prisma.user.findUnique({
            where: { username: 'johndoe' }
        });

        const artist = await prisma.organization.findUnique({
            where: { username: 'iamjoejack' }
        });

        if (!fan || !artist) {
            console.error('Fan or Artist not found. Make sure base seed has run.');
            return;
        }

        // 1. Ensure a Supporter Tier exists for the artist
        let tier = await prisma.supporterTier.findFirst({
            where: { organizationId: artist.id }
        });

        if (!tier) {
            tier = await prisma.supporterTier.create({
                data: {
                    organizationId: artist.id,
                    name: 'True Fan',
                    priceCents: 1500,
                    revenueSharePercent: 0.05,
                    description: 'Get exclusive access and support my journey.'
                }
            });
            console.log('Created Supporter Tier for artist.');
        }

        // 2. Create an active subscription for the fan
        const sub = await prisma.supporterSubscription.upsert({
            where: {
                id: `demo-sub-${fan.id}-${artist.id}`
            },
            update: { status: 'ACTIVE' },
            create: {
                id: `demo-sub-${fan.id}-${artist.id}`,
                fanId: fan.id,
                artistId: artist.id,
                tierId: tier.id,
                priceCents: 1500,
                revenueSharePercent: 0.05,
                status: 'ACTIVE',
                supporterNumber: 1
            }
        });
        console.log('Created active subscription for fan.');

        // 3. Add some yield history
        await prisma.fanListeningStats.upsert({
            where: { fanId: fan.id },
            update: {
                totalStreamsAllTime: 1240,
                totalListeningHrs: 42.5,
                listeningStreak: 5,
                totalEarnedCents: 2480
            },
            create: {
                fanId: fan.id,
                totalStreamsAllTime: 1240,
                totalListeningHrs: 42.5,
                listeningStreak: 5,
                totalEarnedCents: 2480
            }
        });
        console.log('Updated fan stats.');

        console.log('Demo fan data seeded successfully!');
    } catch (error) {
        console.error('Error seeding fan data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedFanData();
