import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArtistReleasesClient from './ArtistReleasesClient';
import type { Metadata } from 'next';
import {
  Play, MapPin, Users, Disc, ShieldCheck, CheckCircle2, ArrowRight,
  Heart, Radio, Camera, MessageCircle, MonitorPlay, Globe, Star,
  ExternalLink, Music, Zap, Activity, Clock
} from 'lucide-react';
import ArtistProfileHeader from '@/components/artist/ArtistProfileHeader';

export const revalidate = 3600;

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  
  const { data: org, error } = await supabase
    .from('organizations')
    .select('name, bio, genres, city, country, profile_image_url, supporter_count, is_verified')
    .eq('slug', params.slug)
    .maybeSingle();

  if (error || !org) return { title: 'Artist Not Found' };

  const genresArray = Array.isArray(org.genres) ? org.genres : [];
  const genreStr = genresArray.slice(0, 2).join(' & ');
  const location = org.city ? `${org.city}, ${org.country}` : '';
  const desc = org.bio
    ? org.bio.slice(0, 155)
    : `${org.name} is an independent ${genreStr} artist${location ? ` from ${location}` : ''}. ${(org.supporter_count || 0).toLocaleString()} supporters. Stream on New Release Hub.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: org.name,
    genre: org.genres,
    url: `https://www.newreleasehub.com/${params.slug}`,
    image: org.profile_image_url,
    description: desc,
  };

  return {
    title: `${org.name} — Independent ${genreStr} Artist`,
    description: desc,
    openGraph: {
      type: 'profile',
      title: `${org.name} | New Release Hub`,
      description: desc,
      images: org.profile_image_url ? [{ url: org.profile_image_url, width: 800, height: 800 }] : [],
      url: `https://www.newreleasehub.com/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${org.name} | New Release Hub`,
      description: desc,
      images: org.profile_image_url ? [org.profile_image_url] : [],
    },
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  };
}


export default async function ArtistProfilePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const supabase = await createClient();
  
  const { data: org, error } = await supabase
    .from('organizations')
    .select(`
      *,
      releases:releases(*, tracks:tracks(*)),
      supporter_tiers:supporter_tiers(*, subscriptions:supporter_subscriptions(*)),
      supporter_subscriptions:supporter_subscriptions(*),
      followers:followers(*),
      session_decks:session_decks(*),
      founding_slots:founding_slots(*),
      fan_artist_relations:fan_artist_relations(*, fan:users(*))
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (error || !org) notFound();

  // Normalize data to match previous Prisma structure for UI compatibility
  const normalizedOrg = {
    ...org,
    Releases: (org.releases || []).sort((a: any, b: any) => 
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    ).map((r: any) => ({
      ...r,
      Tracks: r.tracks || [],
      isScheduled: r.is_scheduled,
      audioUrl: r.audio_url,
      coverArtUrl: r.cover_art_url,
      isSupporterOnly: r.is_supporter_only,
      releaseDate: r.release_date
    })),
    SupporterTiers: (org.supporter_tiers || []).sort((a: any, b: any) => a.price_cents - b.price_cents).map((t: any) => ({
      ...t,
      Subscriptions: t.subscriptions || [],
      priceCents: t.price_cents,
      maxSlots: t.max_slots,
      description: t.description,
      revenueSharePercent: t.revenue_share_percent,
      sortOrder: t.sort_order
    })),
    FanArtistRelations: (org.fan_artist_relations || []).map((rel: any) => ({
      ...rel,
      totalPaidCents: rel.total_paid_cents,
      streamCount: rel.stream_count,
      supporterNumber: rel.supporter_number,
      fan: rel.fan
    })),
    isLive: org.is_live,
    liveListenerCount: org.live_listener_count || 0,
    supporterCount: org.supporter_count || 0,
    totalStreams: org.total_streams || 0,
    profileImageUrl: org.profile_image_url,
    headerImageUrl: org.header_image_url,
    isVerified: org.is_verified,
    artistTier: org.artist_tier || 'standard',
    socialLinksJson: org.social_links_json
  };

  const isLive = normalizedOrg.isLive && normalizedOrg.liveListenerCount > 0;
  const supporterCount = normalizedOrg.supporterCount;
  const socialLinks = normalizedOrg.socialLinksJson ? JSON.parse(normalizedOrg.socialLinksJson) : {};
  const liveReleases = normalizedOrg.Releases.filter((r: any) => !r.isScheduled);
  const scheduledReleases = normalizedOrg.Releases.filter((r: any) => r.isScheduled);
  const tierCapitalized = normalizedOrg.artistTier.charAt(0).toUpperCase() + normalizedOrg.artistTier.slice(1);

  const tierBadgeColor =
    normalizedOrg.artistTier === 'legend' ? 'border-[#f59e0b33] text-amber-400 bg-[#f59e0b1a]' :
    normalizedOrg.artistTier === 'established' ? 'border-[#A855F74d] text-[#A855F7] bg-[#A855F71a]' :
    'border-white/20 text-gray-400 bg-white/5';

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-32">
      
      <ArtistProfileHeader org={normalizedOrg} />

      {/* ── NETWORK ACTIVITY OVERLAY (SOCIAL PROOF) ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-12 mb-20">
         <div className="bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 flex flex-wrap items-center justify-between gap-8 shadow-2xl">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7]">
                  <Activity className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Network Intelligence</p>
                  <p className="text-sm font-bold text-white italic">Artist performing at 98.4% efficiency vs industry average.</p>
               </div>
            </div>
            <div className="flex gap-12">
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Weekly Growth</p>
                  <p className="text-xl font-black italic text-emerald-500">+12.4%</p>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Fan Retention</p>
                  <p className="text-xl font-black italic text-white">94%</p>
               </div>
            </div>
         </div>
      </div>

      {/* ── LIVE BANNER ── */}
      {isLive && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
          <div className="bg-[#f43f5e1a] border border-[#f43f5e4d] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center animate-pulse">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-rose-400 font-bold text-sm uppercase tracking-widest">Live Now</p>
                <p className="text-rose-200 text-sm">{normalizedOrg.liveListenerCount.toLocaleString()} listeners tuned in right now</p>
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
          {normalizedOrg.bio && (
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">About</h3>
              <p className="text-gray-300 text-lg leading-relaxed font-medium">{normalizedOrg.bio}</p>
            </section>
          )}

          {/* LATEST RELEASES */}
          <section>
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tighter">Latest Releases</h3>
              {liveReleases.length > 3 && (
                <Link href={`/${slug}/discography`} className="text-[10px] font-bold text-[#A855F7] uppercase tracking-widest hover:text-white flex items-center gap-2">
                  All <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <ArtistReleasesClient 
              releases={liveReleases} 
              slug={slug} 
              artistName={normalizedOrg.name} 
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
            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-1">Support {normalizedOrg.name}</h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Fund future releases, get exclusive access, and earn a real share of streaming revenue.
            </p>
          </div>

          <div className="space-y-6">
            {normalizedOrg.SupporterTiers.map((tier: any) => {
              const currentSlots = tier.Subscriptions.length;
              const isFull = tier.maxSlots !== null && currentSlots >= tier.maxSlots;
              const slotsRemaining = tier.maxSlots ? tier.maxSlots - currentSlots : null;
              const isAlmostFull = slotsRemaining !== null && slotsRemaining <= 10;
              const isPopular = tier.sortOrder === 2;

              return (
                 <div key={tier.id}
                  className={`rounded-[2.5rem] p-10 relative overflow-hidden border transition-all ${
                    isPopular
                      ? 'bg-white/5 border-[#A855F7]/50 shadow-[0_20px_80px_rgba(168, 85, 247,0.15)]'
                      : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                       <h4 className="font-black italic uppercase tracking-tighter text-2xl text-white">{tier.name}</h4>
                       {isPopular && <Star className="w-5 h-5 text-amber-500 fill-current" />}
                    </div>
                    <p className="text-[#A855F7] font-black italic text-4xl tracking-tighter">
                      ${(tier.priceCents / 100).toFixed(2)}
                      <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest ml-2">Monthly Subscription</span>
                    </p>
                  </div>

                  <p className="text-xs text-zinc-500 mb-10 leading-relaxed font-medium uppercase tracking-widest italic">
                    {tier.description}
                  </p>

                  <ul className="space-y-4 mb-10">
                    {tier.revenueSharePercent > 0 && (
                      <li className="flex items-center gap-4 bg-[#A855F7]/5 border border-[#A855F7]/10 p-4 rounded-2xl">
                        <Zap className="w-5 h-5 text-[#A855F7]" />
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest">{tier.revenueSharePercent}% Royalty Stake</p>
                           <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Calculated on gross platform revenue</p>
                        </div>
                      </li>
                    )}
                    <li className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                       <CheckCircle2 className="w-3.5 h-3.5 text-[#A855F7]" />
                       Institutional Asset Verification
                    </li>
                    <li className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">
                       <CheckCircle2 className="w-3.5 h-3.5 text-[#A855F7]" />
                       48-Hour Network Early Access
                    </li>
                  </ul>

                  {tier.maxSlots && (
                    <div className="mb-8 space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="text-zinc-600">Institutional Capacity</span>
                        <span className={isFull ? 'text-rose-500' : 'text-white'}>{currentSlots} / {tier.maxSlots}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${isFull ? 'bg-rose-500' : 'bg-[#A855F7]'}`}
                          style={{ width: `${Math.min((currentSlots / tier.maxSlots) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                   {isFull ? (
                    <button className="w-full py-6 rounded-2xl bg-white/5 text-zinc-700 font-black uppercase tracking-widest text-xs cursor-not-allowed border border-white/5">
                      Capacity Reached
                    </button>
                  ) : (
                    <Link href={`/checkout?tier=${tier.id}`}
                      className={`block w-full py-6 rounded-2xl text-center font-black uppercase tracking-widest text-xs transition-all ${
                        isPopular
                          ? 'bg-[#A855F7] text-white hover:bg-white hover:text-black shadow-[0_10px_40px_rgba(168, 85, 247,0.3)]'
                          : 'bg-white text-black hover:bg-[#A855F7] hover:text-white'
                      }`}>
                      Authorize Access
                    </Link>
                  )}
                </div>
              );
            })}

            {normalizedOrg.SupporterTiers.length === 0 && (
              <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/10">
                <p className="text-xs text-gray-500 font-medium">No active supporter tiers.</p>
              </div>
            )}
          </div>

          {/* SUPPORTER LEADERBOARD */}
          {normalizedOrg.FanArtistRelations && normalizedOrg.FanArtistRelations.length > 0 && (
            <div className="space-y-6 pt-10 border-t border-white/5">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black italic uppercase tracking-tighter">Top Supporters</h3>
                  <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">All-Time</span>
               </div>
               <div className="space-y-3">
                  {normalizedOrg.FanArtistRelations.filter((r: any) => r.totalPaidCents > 0).map((rel: any, i: number) => {
                    const rankColors = ['text-amber-400', 'text-gray-300', 'text-amber-700'];
                    return (
                      <div key={rel.id} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/[0.03] transition-all">
                         <span className={`text-sm font-black italic w-6 text-center ${rankColors[i] || 'text-zinc-700'}`}>
                           {i + 1}
                         </span>
                         <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white uppercase">
                           {rel.fan?.display_name?.charAt(0) || rel.fan?.displayName?.charAt(0) || '?'}
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest truncate group-hover:text-[#A855F7] transition-colors">
                              {rel.fan?.display_name || rel.fan?.displayName || 'Anonymous'}
                            </p>
                            <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">
                              {rel.streamCount.toLocaleString()} streams · Supporter #{rel.supporterNumber || '—'}
                            </p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-emerald-500 italic">${(rel.totalPaidCents / 100).toFixed(0)}</p>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}

          {/* NETWORK SIGNAL FEED (SIDEBAR) */}
          <div className="space-y-8 pt-12 border-t border-white/5 mb-12">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-black italic uppercase tracking-tighter">Network Signal</h3>
                <div className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse"></div>
             </div>
             <div className="space-y-6">
                {[
                  { user: 'fan_293', action: 'Authorized Supporter Stake', time: '2m ago' },
                  { user: 'Treasury', action: 'Yield Settlement Processed', time: '14m ago' },
                  { user: 'Artist', action: 'New Master Authenticated', time: '1h ago' }
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-start group cursor-pointer">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-[#A855F7] transition-colors">{log.user}</p>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{log.action}</p>
                     </div>
                     <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">{log.time}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* EPK LINK */}
          <Link href={`/${slug}/epk`}
            className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all group">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-white">Electronic Press Kit</p>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Industry & Media Portal</p>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-700 group-hover:text-white group-hover:translate-x-2 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
