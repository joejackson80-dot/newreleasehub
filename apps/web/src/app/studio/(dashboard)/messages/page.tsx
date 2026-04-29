import React from 'react';
import { getSessionArtist } from '@/lib/session';
import { getMessages } from '@/app/actions/fan';
import MessagesClient from './MessagesClient';

export default async function ArtistMessagesPage() {
  const org = await getSessionArtist();
  const res = await getMessages({ orgId: org.id });

  return <MessagesClient initialMessages={(res.success && res.messages) ? (res.messages as any[]) : []} org={org} />;
}
