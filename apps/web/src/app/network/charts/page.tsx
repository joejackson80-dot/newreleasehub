import React from 'react';
import { prisma } from '@/lib/prisma';
import ChartsClient from './ChartsClient';

export default async function ChartsPage() {
  const topArtists = await prisma.organization.findMany({
    orderBy: { patronCount: 'desc' },
    take: 50,
    include: { _count: { select: { PatronSubscriptions: true } } }
  });

  const topTracks = await prisma.musicAsset.findMany({
    orderBy: { playCount: 'desc' },
    take: 50,
    include: { Organization: true }
  });

  const risingArtists = await prisma.organization.findMany({
    where: { artistTier: 'rising' },
    orderBy: { monthlyListeners: 'desc' },
    take: 50
  });

  return (
    <ChartsClient 
      topArtists={topArtists} 
      topTracks={topTracks} 
      risingArtists={risingArtists} 
    />
  );
}
