'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Play, Pause, ChevronLeft, Share2, Heart, Download, MessageCircle, Info, Disc, User, Calendar, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAudio } from '@/context/AudioContext';

const MOCK_RELEASES = [
  { 
    id: 'rel-1', 
    title: 'Silicon Soul', 
    type: 'ALBUM', 
    releaseDate: '2026-10-24', 
    coverArtUrl: '/images/default-cover.png',
    description: 'Silicon Soul is a journey through the intersection of biological emotion and synthetic logic. Recorded over 6 months in a mobile studio across the Pacific Northwest, this album represents the next evolution of independent electronic production.',
    isSupporterOnly: true,
    tracks: [
      { id: 't1', title: 'Neural Pathway', duration: '4:22' },
      { id: 't2', title: 'Data Stream', duration: '3:58' },
      { id: 't3', title: 'Static Dreams', duration: '5:12' },
      { id: 't4', title: 'Binary Sunset', duration: '4:45' }
    ],
    credits: [
      { role: 'Produced by', name: 'Artist Name' },
      { role: 'Mixed by', name: 'Studio One' },
      { role: 'Mastered by', name: 'NRH Forensic Audio' }
    ]
  },
  { id: 'rel-2', title: 'Deep Logic', type: 'SINGLE', releaseDate: '2026-09-12', coverArtUrl: '/images/default-cover.png' }
];

export default function ReleaseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const id = params.id as string;
  const release = MOCK_RELEASES.find(r => r.id === id) || MOCK_RELEASES[0];
  const artistName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();
  const isThisPlaying = currentTrack?.id === release.id && isPlaying;

  const handlePlay = () => {
    if (currentTrack?.id === release.id) {
      togglePlay();
      return;
    }
    playTrack({
      id: release.id,
      title: release.title,
      artist: artistName,
      artistId: slug,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl: release.coverArtUrl
    });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#F1F5F9] selection:text-white pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 space-y-24">
         
         {/* ── RELEASE HERO ── */}
         <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT: ARTWORK */}
            <div className="lg:col-span-5 space-y-10">
               <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                  <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <button 
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                     <div className="w-24 h-24 rounded-full bg-[#F1F5F9] flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform shadow-2xl">
                        {isThisPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
                     </div>
                  </button>
               </div>

               <div className="flex items-center justify-center gap-6">
                  <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
                     <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-white/5">
                        <Heart className="w-6 h-6" />
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest">Favorite</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
                     <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-white/5">
                        <Share2 className="w-6 h-6" />
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest">Share</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
                     <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-white/5">
                        <Download className="w-6 h-6" />
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest">Buy Asset</span>
                  </button>
               </div>
            </div>

            {/* RIGHT: INFO */}
            <div className="lg:col-span-7 space-y-12">
               <div className="space-y-6">
                  <Link href={`/${slug}`} className="inline-flex items-center space-x-3 text-zinc-500 hover:text-[#F1F5F9] transition-colors group">
                     <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                     <span className="text-[11px] font-black uppercase tracking-[0.3em]">Back to Artist Hub</span>
                  </Link>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{release.type}</span>
                        {release.isSupporterOnly && <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/20 rounded-full text-[10px] font-bold text-purple-400 uppercase tracking-widest">Supporter Only</span>}
                     </div>
                     <h1 className="text-[clamp(3.5rem,10vw,6rem)] font-black italic uppercase tracking-tighter leading-[0.8]">{release.title}</h1>
                     <Link href={`/${slug}`} className="text-2xl font-bold text-zinc-500 hover:text-white transition-colors uppercase italic tracking-tighter">{artistName}</Link>
                  </div>
               </div>

               <div className="flex flex-wrap gap-10 items-center border-y border-white/5 py-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#F1F5F9]">
                        <Calendar className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Released</p>
                        <p className="text-xs font-bold uppercase">{new Date(release.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[#F1F5F9]">
                        <Disc className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Genre</p>
                        <p className="text-xs font-bold uppercase">Electronic / Experimental</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-emerald-500">
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Ownership</p>
                        <p className="text-xs font-bold uppercase">100% Verified Artist Owned</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Project Brief</h4>
                  <p className="text-lg text-zinc-400 font-medium leading-relaxed italic">"{release.description || 'A masterpiece of independent art.'}"</p>
               </div>

               <div className="pt-6">
                  <button 
                    onClick={handlePlay}
                    className="w-full sm:w-auto px-16 py-6 rounded-full bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-[#F1F5F9] hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 group"
                  >
                     {isThisPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                     <span>{isThisPlaying ? 'Stop Session' : 'Start Session'}</span>
                  </button>
               </div>
            </div>
         </section>

         {/* ── TRACKS & CREDITS ── */}
         <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 pt-24 border-t border-white/5">
            
            {/* TRACKLIST */}
            <div className="space-y-12">
               <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter">Protocol Catalog</h3>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{release.tracks?.length || 1} Tracks Found</span>
               </div>
               <div className="space-y-2">
                  {(release.tracks || [{ id: 't1', title: release.title, duration: '3:45' }]).map((track, i) => (
                    <div key={track.id} className="group flex items-center justify-between p-6 rounded-3xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                       <div className="flex items-center gap-6">
                          <span className="text-zinc-600 font-black text-sm w-4">{i + 1}</span>
                          <div>
                             <h5 className="font-bold uppercase tracking-tight group-hover:text-[#F1F5F9] transition-colors">{track.title}</h5>
                             <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Master ID: 0x{Math.random().toString(16).slice(2, 10)}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <span className="text-xs font-bold text-zinc-600 tabular-nums">{track.duration}</span>
                          <button className="text-zinc-700 hover:text-white transition-colors"><Play className="w-4 h-4 fill-current" /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* CREDITS & INFO */}
            <div className="space-y-12">
               <h3 className="text-3xl font-black italic uppercase tracking-tighter">Verified Credits</h3>
               <div className="bg-[#111] border border-white/5 rounded-[3rem] p-10 space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                     {(release.credits || []).map((credit, i) => (
                        <div key={i} className="space-y-2">
                           <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{credit.role}</p>
                           <p className="text-sm font-bold uppercase italic tracking-tight">{credit.name}</p>
                        </div>
                     ))}
                  </div>
                  
                  <div className="pt-10 border-t border-white/5 space-y-6">
                     <div className="flex items-center gap-4 text-zinc-500">
                        <Info className="w-5 h-5 shrink-0" />
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">This asset is registered on the NRH Independent Growth Protocol. All royalties are paid directly to the verified owners via Stripe Connect.</p>
                     </div>
                     <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Authenticity Verified by NRH</span>
                     </div>
                  </div>
               </div>
            </div>

         </section>

      </div>
    </div>
  );
}
