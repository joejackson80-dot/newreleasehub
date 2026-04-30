import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArtistReleasesClient from './ArtistReleasesClient';
import type { Metadata } from 'next';
import {
  Play, MapPin, Users, Disc, ShieldCheck, CheckCircle2, ArrowRight,
  Heart, Radio, Camera, MessageCircle, MonitorPlay, Globe, Star,
  ExternalLink, Music, Zap
} from 'lucide-react';

export const revalidate = 3600;

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const org = await prisma.organization.findUnique({
    where: { slug: params.slug },
    select: { name: true, bio: true, genres: true, city: true, country: true, profileImageUrl: true, supporterCount: true, isVerified: true }
  });
  if (!org) return { title: 'Artist Not Found' };

  const genreStr = org.genres.slice(0, 2).join(' & ');
  const location = org.city ? `${org.city}, ${org.country}` : '';
  const desc = org.bio
    ? org.bio.slice(0, 155)
    : `${org.name} is an independent ${genreStr} artist${location ? ` from ${location}` : ''}. ${org.supporterCount.toLocaleString()} supporters. Stream on New Release Hub.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: org.name,
    genre: org.genres,
    url: `https://www.newreleasehub.com/${params.slug}`,
    image: org.profileImageUrl,
    description: desc,
  };

  return {
    title: `${org.name} — Independent ${genreStr} Artist`,
    description: desc,
    openGraph: {
      type: 'profile',
      title: `${org.name} | New Release Hub`,
      description: desc,
      images: org.profileImageUrl ? [{ url: org.profileImageUrl, width: 800, height: 800 }] : [],
      url: `https://www.newreleasehub.com/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${org.name} | New Release Hub`,
      description: desc,
      images: org.profileImageUrl ? [org.profileImageUrl] : [],
    },
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  };
}


export default async function ArtistProfilePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      Releases: {
        include: { Tracks: { take: 3 } },
        orderBy: { releaseDate: 'desc' }
      },
      SupporterTiers: { 
        include: { Subscriptions: true },
        orderBy: { priceCents: 'asc' } 
      },
      SupporterSubscriptions: true,
      Followers: true,
      SessionDeck: true,
      FoundingSlot: true,
    }
  });

  if (!org) notFound();

  const isLive = org.isLive && org.liveListenerCount > 0;
  const supporterCount = org.supporterCount;
  const socialLinks = org.socialLinksJson ? JSON.parse(org.socialLinksJson) : {};
  const liveReleases = org.Releases.filter(r => !r.isScheduled);
  const scheduledReleases = org.Releases.filter(r => r.isScheduled);
  const tierCapitalized = org.artistTier.charAt(0).toUpperCase() + org.artistTier.slice(1);

  const tierBadgeColor =
    org.artistTier === 'legend' ? 'border-amber-50033 text-amber-400 bg-amber-5001a' :
    org.artistTier === 'established' ? 'border-[#00D2FF4d] text-[#00D2FF] bg-[#00D2FF1a]' :
    'border-white/20 text-gray-400 bg-white/5';

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-32">

      {/* ── HEADER PHOTO ── */}
      <div className="relative">
        <div className="h-[200px] sm:h-[280px] w-full bg-zinc-900 overflow-hidden relative">
           {org.headerImageUrl ? (
            <img src={org.headerImageUrl} alt={`${org.name} header`} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D2FF1a] to-[#9333ea1a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#02020266] to-transparent" />
        </div>

        {/* ── PROFILE IDENTITY ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative -mt-16 sm:-mt-20 z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8">

            {/* AVATAR — smaller on mobile */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[#020202] overflow-hidden bg-zinc-800 shadow-2xl shrink-0">
              {org.profileImageUrl && (
                <img src={org.profileImageUrl} alt={org.name} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex-1 space-y-4 pb-2 text-center md:text-left w-full">
              {/* NAME + VERIFIED + TIER */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-bold uppercase tracking-tighter break-words">
                  {org.name}
                </h1>
                <div className="flex items-center gap-4">
                  {org.isVerified && (
                    <CheckCircle2 className="w-6 h-6 text-[#00D2FF] shrink-0" />
                  )}
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${tierBadgeColor}`}>
                    {tierCapitalized}
                  </span>
                </div>
                 {org.FoundingSlot && (
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border border-[#00D2FF66] text-[#00D2FF] bg-[#00D2FF33] flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-current" />
                    Founding Artist #{org.FoundingSlot.slotNumber}
                  </span>
                )}
              </div>

              {/* GENRES + CITY */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                {org.genres.map(g => (
                  <span key={g} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-300">{g}</span>
                ))}
                {org.city && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {org.city}{org.country ? `, ${org.country}` : ''}
                  </span>
                )}
              </div>

              {/* STATS ROW */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00D2FF]" />
                  <span className="font-bold text-white">{supporterCount.toLocaleString()}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Supporters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-[#00D2FF]" />
                  <span className="font-bold text-white">{org.totalStreams.toLocaleString()}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Streams</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#00D2FF]" />
                  <span className="font-bold text-white">{liveReleases.length}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Releases</span>
                </div>
              </div>

              {/* SOCIAL LINKS */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                {socialLinks.instagram && (
                  <Link href={`https://instagram.com/${socialLinks.instagram}`} target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    <Camera className="w-4 h-4" />
                  </Link>
                )}
                {socialLinks.twitter && (
                  <Link href={`https://twitter.com/${socialLinks.twitter}`} target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                )}
                {socialLinks.youtube && (
                  <Link href={`https://youtube.com/@${socialLinks.youtube}`} target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    <MonitorPlay className="w-4 h-4" />
                  </Link>
                )}
                {socialLinks.tiktok && (
                  <Link href={`https://tiktok.com/@${socialLinks.tiktok}`} target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    <Zap className="w-4 h-4" />
                  </Link>
                )}
                {socialLinks.website && (
                  <Link href={socialLinks.website} target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all">
                    <Globe className="w-4 h-4" />
                  </Link>
                )}
                 {socialLinks.spotify && (
                  <Link href={`https://open.spotify.com/search/${encodeURIComponent(org.name)}`} target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/05 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIVE BANNER ── */}
      {isLive && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
          <div className="bg-rose-5001a border border-rose-5004d rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center animate-pulse">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-rose-400 font-bold text-sm uppercase tracking-widest">Live Now</p>
                <p className="text-rose-200 text-sm">{org.liveListenerCount.toLocaleString()} listeners tuned in right now</p>
              </div>
            </div>
            <Link href={`/${slug}/live`}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-rose-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-rose-600 transition-all text-center">
              Join the Stream
            </Link>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">

        {/* LEFT: RELEASES + BIO */}
        <div className="lg:col-span-2 space-y-20">

          {/* BIO */}
          {org.bio && (
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">About</h3>
              <p className="text-gray-300 text-lg leading-relaxed font-medium">{org.bio}</p>
            </section>
          )}

          {/* LATEST RELEASES */}
          <section>
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter">Latest Releases</h3>
              {liveReleases.length > 3 && (
                <Link href={`/${slug}/discography`} className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest hover:text-white flex items-center gap-2">
                  All <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <ArtistReleasesClient 
              releases={liveReleases} 
              slug={slug} 
              artistName={org.name} 
            />
            {liveReleases.length === 0 && (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                <Music className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">No releases yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: SUPPORTER TIERS */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-1">Support {org.name}</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Fund future releases, get exclusive access, and earn a real share of streaming revenue.
            </p>
          </div>

          <div className="space-y-5">
            {org.SupporterTiers.map(tier => {
              const currentSlots = tier.Subscriptions.length;
              const isFull = tier.maxSlots !== null && currentSlots >= tier.maxSlots;
              const slotsRemaining = tier.maxSlots ? tier.maxSlots - currentSlots : null;
              const isAlmostFull = slotsRemaining !== null && slotsRemaining <= 10;
              const isPopular = tier.sortOrder === 2;

              return (
                 <div key={tier.id}
                  className={`rounded-2xl p-6 relative overflow-hidden border transition-all ${
                    isPopular
                      ? 'bg-[#00D2FF1a] border-[#00D2FF66] shadow-lg shadow-[#00D2FF1a]'
                      : 'bg-[#111] border-white/05 hover:border-white/20'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#00D2FF] text-white text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-5">
                    <h4 className="font-bold text-lg text-white">{tier.name}</h4>
                    <p className="text-[#00D2FF] font-bold text-2xl mt-1">
                      ${(tier.priceCents / 100).toFixed(2)}
                      <span className="text-xs text-gray-500 font-medium">/mo</span>
                    </p>
                  </div>

                  <div className="text-xs text-gray-400 mb-6 leading-relaxed">
                    {tier.description}
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {tier.revenueSharePercent > 0 && (
                      <li className="flex items-start gap-2 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-purple-400 font-semibold">{tier.revenueSharePercent * 100}% revenue share</span>
                      </li>
                    )}
                  </ul>

                  {tier.maxSlots && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                        <span className="text-gray-500">{currentSlots} / {tier.maxSlots} filled</span>
                        {isAlmostFull && !isFull && (
                          <span className="text-amber-400">{slotsRemaining} slots remaining!</span>
                        )}
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00D2FF] rounded-full"
                          style={{ width: `${Math.min((currentSlots / tier.maxSlots) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                   {isFull ? (
                    <button className="w-full py-3 rounded-xl bg-white/05 text-zinc-500 font-bold text-xs uppercase tracking-widest cursor-not-allowed">
                      Full — Join Waitlist
                    </button>
                  ) : (
                    <Link href={`/checkout?tier=${tier.id}`}
                      className={`block w-full py-3 rounded-xl text-center font-bold text-xs uppercase tracking-widest transition-all ${
                        isPopular
                          ? 'bg-[#00D2FF] text-white hover:bg-[#00B8E0] shadow-lg shadow-[#00D2FF4d]'
                          : 'bg-white/10 text-white hover:bg-white hover:text-black'
                      }`}>
                      Join {tier.name}
                    </Link>
                  )}
                </div>
              );
            })}

            {org.SupporterTiers.length === 0 && (
              <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/10">
                <p className="text-xs text-gray-500 font-medium">No active supporter tiers.</p>
              </div>
            )}
          </div>

          {/* EPK LINK */}
          <Link href={`/${slug}/epk`}
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">Electronic Press Kit</p>
              <p className="text-[10px] text-gray-500 mt-0.5">For sync buyers & booking agents</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
