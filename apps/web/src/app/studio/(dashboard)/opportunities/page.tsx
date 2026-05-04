import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSessionArtist } from '@/lib/session';
import { redirect } from 'next/navigation';
import OpportunitiesManagerClient from './OpportunitiesManagerClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Manage Opportunities | Artist Studio',
  description: 'Manage your sync calls, grants, and collaboration requests.',
};

export default async function OpportunitiesPage() {
  const artist = await getSessionArtist();
  if (!artist) redirect('/studio/login');

  const opportunities = await prisma.opportunity.findMany({
    where: { posterId: artist.id },
    include: {
      Applications: {
        include: {
          Artist: {
            select: { name: true, profileImageUrl: true, slug: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 sm:p-12 space-y-12">
       <OpportunitiesManagerClient initialOpportunities={opportunities} />
    </div>
  );
}
