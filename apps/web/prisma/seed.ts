import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_ARTISTS = [
  {
    id: 'artist-001', slug: 'marcus-webb', name: 'Marcus Webb',
    bio: 'Marcus Webb is an Atlanta-born R&B and soul artist whose music sits at the intersection of vintage Motown and contemporary neo-soul. Known for his rich vocal texture and deeply personal songwriting, Marcus has built a fiercely loyal fanbase of over 2,000 supporters entirely independent of any label.',
    profilePhoto: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    genres: ['R&B', 'Soul', 'Neo-Soul'], city: 'Atlanta', country: 'US',
    socialLinks: { instagram: 'marcuswebb', twitter: 'marcuswebb', spotify: 'marcuswebb' },
    isVerified: true, isLive: true, liveListenerCount: 342, supporterCount: 2140, totalStreams: 1820000, monthlyListeners: 48200, tier: 'established',
    releases: [
      { title: 'Midnight in Atlanta', type: 'album', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80' },
      { title: 'Worth It (feat. Nova Rae)', type: 'single', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80' },
      { title: 'The Comeback EP', type: 'ep', cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' },
    ],
  },
  {
    id: 'artist-002', slug: 'dj-solarize', name: 'DJ Solarize',
    bio: 'London-based electronic producer and DJ. Solarize blends UK garage, house, and ambient electronica into immersive sonic landscapes. Her second album landed a Netflix sync deal after just 2 months on NRH.',
    profilePhoto: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    genres: ['Electronic', 'House', 'Ambient'], city: 'London', country: 'UK',
    socialLinks: { instagram: 'djsolarize', tiktok: 'djsolarize' },
    isVerified: true, isLive: false, liveListenerCount: 0, supporterCount: 1820, totalStreams: 980000, monthlyListeners: 31400, tier: 'established',
    releases: [
      { title: 'Solar Frequencies', type: 'album', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80' },
      { title: 'Midnight Protocol', type: 'single', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80' },
      { title: 'Phase Shift EP', type: 'ep', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80' },
    ],
  },
  {
    id: 'artist-003', slug: 'lena-khari', name: 'Lena Khari',
    bio: 'Afrobeats artist from Lagos with a sound that weaves together Yoruba rhythms, highlife, and contemporary pop production. Lena has performed in 14 countries and retained 100% of her masters since day one.',
    profilePhoto: 'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
    genres: ['Afrobeats', 'Highlife', 'Afropop'], city: 'Lagos', country: 'NG',
    socialLinks: { instagram: 'lenakhari', twitter: 'lenakhari', youtube: 'lenakhari' },
    isVerified: true, isLive: false, liveListenerCount: 0, supporterCount: 3420, totalStreams: 4200000, monthlyListeners: 112000, tier: 'legend',
    releases: [
      { title: 'Lagos to London', type: 'album', cover: 'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800&q=80' },
      { title: 'Afro Nation', type: 'single', cover: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80' },
      { title: 'Roots EP', type: 'ep', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80' },
    ],
  },
  {
    id: 'artist-004', slug: 'hellz-flame', name: 'Hellz Flame',
    bio: 'Chicago-bred lyricist and producer. Hellz Flame combines trap production with dense, literary lyricism. A student of the Golden Era, he runs his entire operation — management, touring — independently.',
    profilePhoto: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    genres: ['Hip-Hop', 'Trap', 'Conscious Rap'], city: 'Omaha', country: 'NE',
    socialLinks: { instagram: 'hellzflame', twitter: 'hellzflame', tiktok: 'hellzflame' },
    isVerified: true, isLive: false, liveListenerCount: 0, supporterCount: 980, totalStreams: 560000, monthlyListeners: 22000, tier: 'rising',
    releases: [
      { title: 'Fire & Ice', type: 'album', cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80' },
      { title: 'Chi Town Stand Up', type: 'single', cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' },
      { title: 'The Sermon EP', type: 'ep', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80' },
    ],
  },
  {
    id: 'artist-005', slug: 'nova-rae', name: 'Nova Rae',
    bio: 'Singer-songwriter from Nashville whose music defies easy genre labels — part indie pop, part folk, with a hint of country. Nova writes all her own songs and produces half of them in her home studio.',
    profilePhoto: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    genres: ['Indie Pop', 'Folk', 'Singer-Songwriter'], city: 'Nashville', country: 'US',
    socialLinks: { instagram: 'novarae', youtube: 'novarae', spotify: 'novarae' },
    isVerified: false, isLive: false, liveListenerCount: 0, supporterCount: 1240, totalStreams: 340000, monthlyListeners: 18600, tier: 'rising',
    releases: [
      { title: 'Wildflower', type: 'album', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80' },
      { title: 'Tennessee Rain', type: 'single', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80' },
      { title: 'Golden Hour EP', type: 'ep', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80' },
    ],
  },
  {
    id: 'artist-006', slug: 'vibe-master', name: 'Vibe Master',
    bio: 'Miami-based reggaeton and Latin trap artist. Vibe Master blends Afro-Caribbean rhythms with 808 bass and bilingual lyricism that connects with fans from Puerto Rico to Portugal.',
    profilePhoto: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    genres: ['Reggaeton', 'Latin Trap', 'Afro-Caribbean'], city: 'Miami', country: 'US',
    socialLinks: { instagram: 'vibemaster', tiktok: 'vibemaster' },
    isVerified: false, isLive: false, liveListenerCount: 0, supporterCount: 760, totalStreams: 290000, monthlyListeners: 15400, tier: 'rising',
    releases: [
      { title: 'Calor Eterno', type: 'album', cover: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80' },
      { title: 'Fuego Lento', type: 'single', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80' },
      { title: 'Noche Latina EP', type: 'ep', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80' },
    ],
  },
  {
    id: 'artist-007', slug: 'the-kessler-duo', name: 'The Kessler Duo',
    bio: 'Brooklyn-based jazz duo — piano and saxophone. The Kesslers perform original compositions that bridge classic bebop vocabulary with contemporary minimalist composition. Their live sessions on NRH regularly draw 500+ listeners.',
    profilePhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    genres: ['Jazz', 'Contemporary Classical', 'Instrumental'], city: 'Brooklyn', country: 'US',
    socialLinks: { instagram: 'kesslerduo', youtube: 'kesslerduo', website: 'kesslerduo.com' },
    isVerified: true, isLive: false, liveListenerCount: 0, supporterCount: 890, totalStreams: 180000, monthlyListeners: 12200, tier: 'rising',
    releases: [
      { title: 'Blue Standards', type: 'album', cover: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80' },
      { title: 'Late Night Sessions', type: 'single', cover: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80' },
      { title: 'The Duo Tapes EP', type: 'ep', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80' },
    ],
  },
  {
    id: 'artist-008', slug: 'solaris-bloom', name: 'Solaris Bloom',
    bio: 'Seoul-born, Los Angeles-based K-indie and dream pop artist. Solaris Bloom writes in both Korean and English, creating lush, reverb-drenched soundscapes that have attracted a devoted international fanbase.',
    profilePhoto: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
    genres: ['K-Indie', 'Dream Pop', 'Shoegaze'], city: 'Los Angeles', country: 'US',
    socialLinks: { instagram: 'solarisbloom', tiktok: 'solarisbloom', youtube: 'solarisbloom' },
    isVerified: false, isLive: false, liveListenerCount: 0, supporterCount: 1640, totalStreams: 720000, monthlyListeners: 34800, tier: 'established',
    releases: [
      { title: 'Petal Drift', type: 'album', cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80' },
      { title: 'Neon Haze', type: 'single', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80' },
      { title: 'Dreaming in Seoul EP', type: 'ep', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80' },
    ],
  },
  {
    id: 'artist-demo', slug: 'iamjoejack', name: 'Joe Jack',
    username: 'iamjoejack', email: 'joe@nrh.com',
    bio: 'Joe Jack is a Hip-Hop architect from Omaha, Nebraska. A pioneer in the local scene, Joe has used NRH to bypass traditional distribution and build a direct-to-fan powerhouse that keeps 100% of his master rights.',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    headerPhoto: 'https://images.unsplash.com/photo-1514525253361-bee87184919a?w=800&q=80',
    genres: ['Hip-Hop', 'Omaha Rap'], city: 'Omaha', country: 'NE',
    socialLinks: { twitter: 'iamjoejack' },
    isVerified: true, isLive: false, liveListenerCount: 0, supporterCount: 42, totalStreams: 15000, monthlyListeners: 1200, tier: 'rising',
    releases: [
      { title: 'Demo Set 01', type: 'ep', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80' },
    ],
  },
];

function getTiersForArtist(artistName: string) {
  return [
    {
      name: 'Day One', priceCents: 500,
      perks: ['48-hour early access to every new release', `Exclusive monthly update from ${artistName}`, 'Supporter badge on your fan profile'],
      revenueSharePercent: 0.1, maxSlots: null, currentSlots: 0, isPopular: false, sortOrder: 1,
    },
    {
      name: 'True Fan', priceCents: 1500,
      perks: ['Everything in Day One', 'Access to supporter-only tracks and demos', 'Monthly live Q&A session', 'Name in album liner notes', '20% merch discount'],
      revenueSharePercent: 0.5, maxSlots: null, currentSlots: 0, isPopular: true, sortOrder: 2,
    },
    {
      name: 'Inner Circle', priceCents: 5000,
      perks: ['Everything in True Fan', `Quarterly virtual meet & greet with ${artistName}`, 'Vote on future setlists and direction', 'Signed physical release every 6 months', 'First access to concert tickets'],
      revenueSharePercent: 1.5, maxSlots: 100, currentSlots: 0, isPopular: false, sortOrder: 3,
    },
  ];
}

const SEED_OPPORTUNITIES = [
  {
    id: 'opp-001', posterName: 'Meridian Films', posterIsVerified: true, type: 'SYNC',
    title: 'R&B / Soul track needed for Netflix documentary series',
    description: 'We are producing a 6-part documentary series about American music culture for Netflix. We need original R&B or soul tracks for 3 key emotional scenes. Non-exclusive license, retain all rights.',
    budget: '$2,000–$8,000 per track', deadline: new Date('2026-06-28'),
    genreTargets: ['R&B', 'Soul', 'Neo-Soul'], applicantCount: 23,
  },
  {
    id: 'opp-002', posterName: 'The Hollow Venue', posterIsVerified: true, type: 'GIG',
    title: 'Hip-Hop and rap artists wanted — monthly showcase series',
    description: 'The Hollow is launching a monthly independent artist showcase in Chicago. 4 artists per night, 20–30 minute sets. All ticket revenue split 70/30 with artists. No pay-to-play.',
    budget: '70% door split + $200 guarantee', deadline: new Date('2026-07-31'),
    genreTargets: ['Hip-Hop', 'Trap', 'Conscious Rap'], applicantCount: 41,
  },
  {
    id: 'opp-003', posterName: 'The Black Music Foundation', posterIsVerified: true, type: 'GRANT',
    title: 'Independent Artist Development Grant — $5,000',
    description: 'The Black Music Foundation\'s Independent Artist Grant funds recording, production, and release costs for emerging Black artists across all genres. Open to NRH artists with at least 500 streams.',
    budget: '$5,000 grant (no equity, no royalties owed)', deadline: new Date('2026-08-15'),
    genreTargets: ['All Genres'], applicantCount: 87,
  },
  {
    id: 'opp-004', posterName: 'DJ Solarize', posterIsVerified: true, type: 'COLLAB',
    title: 'Looking for a vocalist for ambient / electronic EP',
    description: 'I\'m DJ Solarize and I\'m building an EP that blends ambient house with live vocal performance. Looking for one featured vocalist for 2–3 tracks. Revenue split negotiated fairly.',
    budget: 'Revenue split (negotiable, approx. 30–40% per track)', deadline: new Date('2026-06-14'),
    genreTargets: ['Electronic', 'Ambient', 'House', 'R&B'], applicantCount: 18,
  },
  {
    id: 'opp-005', posterName: 'Resonance Gaming Studios', posterIsVerified: true, type: 'SYNC',
    title: 'Indie / electronic instrumentals for mobile game soundtrack',
    description: 'Resonance Gaming is developing an indie mobile game with a lo-fi aesthetic and needs 8–12 original instrumental tracks for the soundtrack. Full buyout with a bonus royalty on game revenue.',
    budget: '$800–$1,500 per track + 0.5% game revenue royalty', deadline: new Date('2026-07-01'),
    genreTargets: ['Electronic', 'Lo-Fi', 'Indie', 'Ambient'], applicantCount: 56,
  },
];

async function main() {
  console.log('Starting seed...');

  // Clean existing data in dependency order
  await prisma.follow.deleteMany({});
  await prisma.collabNegotiationHistory.deleteMany({});
  await prisma.collabDeal.deleteMany({});
  await prisma.collabRequest.deleteMany({});
  await prisma.serviceReview.deleteMany({});
  await prisma.serviceOrder.deleteMany({});
  await prisma.servicePackage.deleteMany({});
  await prisma.audioSample.deleteMany({});
  await prisma.serviceProvider.deleteMany({});
  await prisma.fraudIncident.deleteMany({});
  await prisma.fanRoyaltyShare.deleteMany({});
  await prisma.artistRoyalty.deleteMany({});
  await prisma.monthlyPool.deleteMany({});
  await prisma.adImpression.deleteMany({});
  await prisma.streamPlay.deleteMany({});
  await prisma.fanSubscription.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.queueItem.deleteMany({});
  await prisma.bidOffer.deleteMany({});
  await prisma.participationLicense.deleteMany({});
  await prisma.musicAsset.deleteMany({});
  await prisma.release.deleteMany({});
  await prisma.supporterSubscription.deleteMany({});
  await prisma.supporterTier.deleteMany({});
  await prisma.chatMessage.deleteMany({});
  await prisma.follower.deleteMany({});
  await prisma.sessionArchive.deleteMany({});
  await prisma.giftEvent.deleteMany({});
  await prisma.musicReview.deleteMany({});
  await prisma.sessionDeck.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.merch.deleteMany({});
  await prisma.foundingArtistSlot.deleteMany({});
  await prisma.station.deleteMany({});
  await prisma.playlist.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});

  // ── Create @newreleasehub official account ──
  await prisma.organization.create({
    data: {
      id: 'nrh-official', slug: 'newreleasehub', name: 'New Release Hub',
      bio: 'The Institutional Destination for Sovereign Music. Forensic streaming analysis, non-dilutive participation, and professional artist governance. Designed for the founding collective. newreleasehub.com',
      isVerified: true, genres: ['Institutional', 'Network'], city: 'Global', country: 'Global',
      profileImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    }
  });

  // ── Create artists ──
  for (const data of SEED_ARTISTS) {
    const passwordHash = await bcrypt.hash('Password123', 10);
    const org = await prisma.organization.create({
      data: {
        id: data.id, name: data.name, slug: data.slug, bio: data.bio,
        username: data.username || data.slug,
        email: data.email || `${data.slug}@example.com`,
        passwordHash: passwordHash,
        profileImageUrl: data.profilePhoto, headerImageUrl: data.headerPhoto,
        genres: data.genres, city: data.city, country: data.country,
        isVerified: data.isVerified, isLive: data.isLive,
        liveListenerCount: data.liveListenerCount, supporterCount: data.supporterCount,
        totalStreams: data.totalStreams, monthlyListeners: data.monthlyListeners,
        artistTier: data.tier, socialLinksJson: JSON.stringify(data.socialLinks),
      }
    });

    // Create 3 releases with REAL titles and DISTINCT cover art
    for (let r = 0; r < data.releases.length; r++) {
      const rel = data.releases[r];
      const release = await prisma.release.create({
        data: {
          organizationId: org.id, title: rel.title, type: rel.type,
          coverArtUrl: rel.cover, totalPlays: Math.floor(data.totalStreams / 4),
          isSupporterOnly: r === 2,
        }
      });
      const trackCount = rel.type === 'album' ? 5 : rel.type === 'ep' ? 4 : 1;
      const trackNames: Record<string, string[]> = {
        'Midnight in Atlanta': ['Midnight Drive', 'Peachtree Serenade', 'Georgia on My Mind', 'Southside Glow', 'After Hours'],
        'Solar Frequencies': ['UV Index', 'Orbital Decay', 'Spectrum Shift', 'Deep Field', 'Event Horizon'],
        'Lagos to London': ['Eko Rising', 'Japa Dreams', 'Victoria Island', 'Oxford Street', 'Roots & Wings'],
        'Fire & Ice': ['Cold Open', 'Southside Gospel', 'Inferno', 'Frozen Lake', 'Ashes'],
        'Wildflower': ['Petals', 'Morning Light', 'Tennessee Waltz', 'Open Road', 'Bloom'],
        'Calor Eterno': ['Fuego', 'Playa Vida', 'Ritmo Nocturno', 'Sol y Sombra', 'Eterno'],
        'Blue Standards': ['Blue Monday', 'Monk\'s Dream', 'Duo Waltz', 'Brooklyn After Dark', 'Standards'],
        'Petal Drift': ['Cherry Blossom', 'Han River', 'Neon Seoul', 'Daydream', 'Starfall'],
      };
      for (let t = 1; t <= trackCount; t++) {
        const names = trackNames[rel.title];
        const trackTitle = names && names[t-1] ? names[t-1] : `${rel.title} - Track ${t}`;
        await prisma.musicAsset.create({
          data: {
            organizationId: org.id, releaseId: release.id, title: trackTitle,
            duration: 180 + Math.floor(Math.random() * 120),
            playCount: Math.floor((release.totalPlays || 0) / trackCount),
          }
        });
      }
    }

    // Create 3 supporter tiers for each artist
    const tiers = getTiersForArtist(data.name);
    const slotDistribution = [
      Math.floor(data.supporterCount * 0.55),
      Math.floor(data.supporterCount * 0.35),
      Math.min(Math.floor(data.supporterCount * 0.10), 100),
    ];
    for (let i = 0; i < tiers.length; i++) {
      await prisma.supporterTier.create({
        data: {
          organizationId: org.id, name: tiers[i].name,
          priceCents: tiers[i].priceCents, description: tiers[i].perks.join(', '),
          revenueSharePercent: tiers[i].revenueSharePercent,
          maxSlots: tiers[i].maxSlots,
        }
      });
    }
  }

  // ── Create Fans ──
  for (let u = 1; u <= 5; u++) {
    await prisma.user.create({
      data: { displayName: `Fan ${u}`, email: `fan${u}@example.com` }
    });
  }

  // ── Create Opportunities ──
  for (const opp of SEED_OPPORTUNITIES) {
    await prisma.opportunity.create({
      data: {
        id: opp.id, posterId: 'artist-001', posterName: opp.posterName,
        posterIsVerified: opp.posterIsVerified, title: opp.title,
        description: opp.description, type: opp.type, budget: opp.budget,
        genreTargets: opp.genreTargets, deadline: opp.deadline,
        applicantCount: opp.applicantCount,
      }
    });
  }

  // ── Create Official NRH Radio ──
  const station = await prisma.station.create({
    data: {
      name: 'NRH Radio',
      slug: 'nrh-radio',
      description: 'The heartbeat of the independent network. 24/7 curated sounds from the New Release Hub community.',
      genres: ['Discovery', 'Independent', 'Multi-Genre'],
      isLive: true,
    }
  });

  const playlist = await prisma.playlist.create({
    data: {
      name: 'Official NRH Rotation',
      slug: 'nrh-rotation',
      description: 'The top trending tracks across the NRH network.',
      isLocked: true,
      authorizedOnly: false,
    }
  });

  await prisma.station.update({
    where: { id: station.id },
    data: { playlistId: playlist.id }
  });

  // ── Create additional "Founding 100" Placeholders (Artists 9-20 for now) ──
  for (let i = 9; i <= 20; i++) {
    const artistName = `Founding Artist ${i}`;
    const slug = `founding-artist-${i}`;
    await prisma.organization.create({
      data: {
        id: `artist-0${i < 10 ? '0' : ''}${i}`,
        name: artistName,
        slug: slug,
        username: slug,
        email: `${slug}@founding.nrh.com`,
        bio: `${artistName} is one of the first 100 artists to join the New Release Hub network. Stay tuned for their upcoming releases and exclusive support tiers.`,
        isVerified: true,
        artistTier: 'rising',
        balanceCents: 0,
        genres: ['Independent'],
        city: 'TBD',
        country: 'Global',
        isPublic: false,
      }
    });
  }

  console.log('Seed completed successfully — 20 artists, 24 releases, 40 supporter tiers, 5 opportunities, @newreleasehub account, and Official NRH Radio.');
}

main()
  .catch((e) => { console.error(e.message || e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

