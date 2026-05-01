'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Radio, Users, Heart, Disc, Play, Pause, 
  Volume2, Share2, ArrowLeft, Zap, Info, ShieldCheck, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reactToRadio } from '@/app/actions/fan';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import LiveAudioPlayer from '@/components/radio/LiveAudioPlayer';

export default function StationPage({ slug }: { slug: string }) {
  const [station, setStation] = useState<any>(null);
  const [nowPlaying, setNowPlaying] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        const res = await fetch(`/api/radio/now-playing/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        setStation(data);
        if (data.nowPlaying && (!nowPlaying || data.nowPlaying.id !== nowPlaying.id)) {
          setNowPlaying(data.nowPlaying);
        }
        if (data.recentlyPlayed) {
          setRecentlyPlayed(data.recentlyPlayed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStationData();

    // Supabase Realtime Subscription
    const channel = supabase.channel(`radio:${slug}`, {
      config: { broadcast: { self: true } }
    })
    .on('broadcast', { event: 'track_update' }, ({ payload }) => {
       if (payload.nowPlaying) setNowPlaying(payload.nowPlaying);
       if (payload.recentlyPlayed) setRecentlyPlayed(payload.recentlyPlayed);
    })
    .on('broadcast', { event: 'reaction' }, ({ payload }) => {
       // Optional: show small floating emoji for others' reactions
    })
    .subscribe();

    const interval = setInterval(fetchStationData, 15000); // Slower poll as backup
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#010A14] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#F1F5F9]/20 border-t-[#F1F5F9] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010A14] text-white">
      {/* ── TOP NAV ── */}
      <div className="max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">
        <Link href="/discover" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group font-bold text-[10px] uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Network
        </Link>
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <div className="px-4 py-2 rounded-xl bg-[#F1F5F9]/10 border border-[#F1F5F9]/20 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#F1F5F9]" />
            <span className="text-xs font-bold text-[#F1F5F9]">1,420 listening</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-32">
        
        {/* ── LEFT: PLAYER ── */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* STATION INFO */}
          <div className="space-y-4">
             <div className="flex items-center gap-3">
               <div className={`w-3 h-3 rounded-full ${station?.isLive ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-gray-600'}`} />
               <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${station?.isLive ? 'text-red-500' : 'text-gray-500'}`}>
                 {station?.isLive ? 'Live Stream Active' : 'Station Offline'}
               </span>
             </div>
             <h1 className="text-6xl font-bold uppercase tracking-tighter leading-none italic">
               NRH {slug?.toString().replace('-', ' ')} <span className="text-[#F1F5F9]">Radio.</span>
             </h1>
             <p className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed">
               Broadcasting the finest independent {slug} artists from the NRH network directly to your ears. 100% master rights retained by artists.
             </p>
          </div>

          {/* NOW PLAYING CARD */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#F1F5F9]/10 blur-3xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
            <div className="bg-[#021220] border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
              
              {/* Cover Art */}
              <div className="w-64 h-64 rounded-[2rem] overflow-hidden shadow-2xl relative shrink-0">
                {nowPlaying?.imageUrl ? (
                  <img src={nowPlaying.imageUrl} alt={nowPlaying.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#031B2E] flex items-center justify-center">
                    <Disc className="w-20 h-20 text-[#F1F5F9]/20" />
                  </div>
                )}
                {isPlaying && (
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-2xl flex items-center gap-1.5 h-12">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: ['20%', '100%', '40%', '90%', '20%'] }}
                        transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1), ease: 'easeInOut' }}
                        className="w-1 bg-[#F1F5F9] rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="flex-1 space-y-8 text-center md:text-left">
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    {nowPlaying?.title || 'Waiting for signal...'}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <Link href={`/${nowPlaying?.artistSlug}`} className="text-[#F1F5F9] text-xl font-bold hover:underline">
                      {nowPlaying?.artist || 'Unknown Artist'}
                    </Link>
                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                    <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">NRH Verified</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                  >
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                  </button>
                  <button className="px-8 py-4 rounded-full bg-[#F1F5F9] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#F1F5F9]/80 transition-all shadow-[0_0_20px_rgba(241,245,249,0.3)]">
                    Become a Supporter
                  </button>
                  <button className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                    Follow
                  </button>
                </div>

                {/* LIVE REACTIONS */}
                <div className="pt-4 flex flex-col items-center md:items-start gap-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Live Reactions</p>
                  <div className="flex items-center gap-3">
                    {[
                      { key: 'fire', emoji: '🔥' },
                      { key: 'heart', emoji: '❤️' },
                      { key: 'crown', emoji: '👑' },
                      { key: 'bolt', emoji: '⚡' },
                      { key: 'rocket', emoji: '🚀' }
                    ].map(r => (
                      <button 
                        key={r.key}
                        onClick={async () => {
                          const res = await reactToRadio(slug, r.key);
                          if (res.success) {
                             toast.success(`${r.emoji} Sent!`, { icon: r.emoji, style: { background: '#021220', color: '#fff', border: '1px solid #F1F5F9' } });
                          }
                        }}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-[#F1F5F9]/10 hover:border-[#F1F5F9]/30 transition-all hover:-translate-y-1 active:scale-90"
                      >
                        {r.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PLAYER CONTROLS MINI */}
          <div className="bg-[#031B2E]/50 border border-white/5 rounded-3xl p-6 flex items-center justify-between gap-8">
             <div className="flex items-center gap-4 flex-1">
                <Volume2 className="w-5 h-5 text-gray-500" />
                <div className="h-1 bg-white/5 rounded-full flex-1 relative overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    setVolume(Math.min(Math.max(x / rect.width, 0), 1));
                  }}
                >
                   <div className="absolute inset-0 bg-[#F1F5F9]" style={{ width: `${volume * 100}%` }} />
                </div>
             </div>
             <div className="flex items-center gap-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                   Streaming: <span className="text-white">HQ 320kbps</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                   <Zap className="w-4 h-4" />
                </div>
             </div>
          </div>

        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* RECENTLY PLAYED */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500 border-b border-white/5 pb-4">Recently Played</h3>
            <div className="space-y-4">
              {recentlyPlayed.length > 0 ? (
                recentlyPlayed.map((track, i) => (
                  <div key={`${track.id}-${i}`} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                       <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{track.title}</p>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{track.artist}</p>
                    </div>
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#F1F5F9] hover:text-white">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl">
                   <Disc className="w-8 h-8 text-white/5 mx-auto mb-2" />
                   <p className="text-xs text-gray-600 font-medium italic">Signal starting...</p>
                </div>
              )}
            </div>
          </section>

          {/* STATION PERKS */}
          <section className="bg-gradient-to-br from-[#021220] to-[#010A14] border border-[#F1F5F9]/20 rounded-[2.5rem] p-8 space-y-6">
             <div className="flex items-center gap-3">
               <ShieldCheck className="w-6 h-6 text-[#F1F5F9]" />
               <h4 className="text-sm font-bold uppercase tracking-widest text-white">Radio Governance</h4>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed font-medium">
               This station is governed by the NRH Network protocol. 100% of the tracks you hear are authorized directly by the artists. Support them instantly by becoming a supporter or following their journey.
             </p>
             <ul className="space-y-4">
               {[
                 { label: 'Zero Middleman Royalties', icon: Star },
                 { label: 'High Fidelity Stream', icon: Zap },
                 { label: 'Network Integrity Verified', icon: Info }
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                   <item.icon className="w-3.5 h-3.5 text-[#F1F5F9]" />
                   {item.label}
                 </li>
               ))}
             </ul>
          </section>

        </div>

      </div>
      <LiveAudioPlayer 
        playbackId={station?.playbackId} 
        isPlaying={isPlaying} 
        volume={volume} 
      />
    </div>
  );
}
