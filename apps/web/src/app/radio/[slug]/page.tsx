import React from 'react';
import { prisma } from '@/lib/prisma';
import RadioClient from './RadioClient';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const org = await prisma.organization.findUnique({
    where: { slug }
  });

  if (!org) return { title: 'Station Not Found | NRH' };

  const name = org.name || slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const title = `NRH ${name} Radio | Institutional Grade Audio`;
  const description = `Live from the New Release Hub network. Supporting independent ${name} artists with 100% master rights retention.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [org.profileImageUrl || '/images/og-station.jpg'],
      type: 'music.radio_station',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [org.profileImageUrl || '/images/og-station.jpg'],
    }
  };
}

export default async function RadioStationPage({ params }: Props) {
  const { slug } = await params;
  return <RadioClient slug={slug} />;
}
