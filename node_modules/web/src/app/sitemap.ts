import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://www.newreleasehub.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all public artist profiles
  const artists = await prisma.organization.findMany({
    select: { slug: true, createdAt: true },
    where: { slug: { not: 'newreleasehub' } },
  });

  // Fetch all public releases
  const releases = await prisma.release.findMany({
    where: { isScheduled: false },
    include: { Organization: { select: { slug: true } } },
  });


  // Static core pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/discover`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/network/board`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/network/charts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/newreleasehub`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/press`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/subscribe`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/how-it-works/revenue-sharing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/network/whitepaper`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/dmca`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Artist profile pages
  const artistPages: MetadataRoute.Sitemap = artists.map(artist => ({
    url: `${BASE_URL}/${artist.slug}`,
    lastModified: artist.createdAt,
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }));

  // Artist EPK pages
  const epkPages: MetadataRoute.Sitemap = artists.map(artist => ({
    url: `${BASE_URL}/${artist.slug}/epk`,
    lastModified: artist.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Release pages
  const releasePages: MetadataRoute.Sitemap = (releases as any[]).map(release => ({
    url: `${BASE_URL}/${release.Organization.slug}/${release.id}`,
    lastModified: release.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...artistPages, ...epkPages, ...releasePages];
}


