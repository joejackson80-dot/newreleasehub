'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, Disc, Filter, Search, Grid, List as ListIcon } from 'lucide-react';
import Link from 'next/link';
import ArtistReleasesClient from '../ArtistReleasesClient';

// Mock data for the discography
const MOCK_RELEASES = [
  { id: 'rel-1', title: 'Silicon Soul', type: 'ALBUM', releaseDate: '2026-10-24', coverArtUrl: '/images/default-cover.png', isSupporterOnly: true },
  { id: 'rel-2', title: 'Deep Logic', type: 'SINGLE', releaseDate: '2026-09-12', coverArtUrl: '/images/default-cover.png' },
  { id: 'rel-3', title: 'Binary Sunset', type: 'EP', releaseDate: '2026-07-05', coverArtUrl: '/images/default-cover.png' },
  { id: 'rel-4', title: 'Ghost in the Machine', type: 'SINGLE', releaseDate: '2026-05-20', coverArtUrl: '/images/default-cover.png' },
  { id: 'rel-5', title: 'System Error', type: 'SINGLE', releaseDate: '2026-03-15', coverArtUrl: '/images/default-cover.png' },
  { id: 'rel-6', title: 'The Architect', type: 'ALBUM', releaseDate: '2025-11-30', coverArtUrl: '/images/default-cover.png' },
];

export default function DiscographyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const artistName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white pt-32 pb-32 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-16">
         
         {/* HEADER */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6">
               <Link href={`/${slug}`} className="inline-flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Back to Profile</span>
               </Link>
               <div className="space-y-2">
                  <h1 className="text-5xl md:text-[clamp(2.25rem,8vw,4.5rem)] font-black tracking-tighter italic uppercase leading-[0.8]">Full<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Discography.</span></h1>
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Total of {MOCK_RELEASES.length} Verified Assets on the Network</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
               <div className="relative w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    className="w-full bg-[#111] border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-[#00D2FF66] transition-all"
                  />
               </div>
               <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-3.5 bg-[#111] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-white/20 transition-all flex items-center justify-center gap-2">
                     <Filter className="w-4 h-4" />
                     Filter
                  </button>
                  <div className="flex bg-[#111] border border-white/5 rounded-2xl p-1">
                     <button className="p-2.5 rounded-xl bg-white/10 text-white shadow-xl"><Grid className="w-4 h-4" /></button>
                     <button className="p-2.5 rounded-xl text-zinc-600 hover:text-zinc-300 transition-colors"><ListIcon className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>
         </div>

         {/* RELEASES GRID */}
         <div className="pt-8 border-t border-white/5">
            <ArtistReleasesClient 
              releases={MOCK_RELEASES} 
              slug={slug} 
              artistName={artistName} 
            />
         </div>

         {/* EMPTY STATE (IF ANY) */}
         {MOCK_RELEASES.length === 0 && (
           <div className="py-40 text-center space-y-6">
              <Disc className="w-16 h-16 text-zinc-800 mx-auto animate-spin-slow" />
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No assets found in this catalog.</p>
           </div>
         )}

      </div>
    </div>
  );
}
