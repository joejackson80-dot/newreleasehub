'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, Play, Music, Users, BarChart3, Disc } from 'lucide-react';

export default function ChartsClient({ topArtists, topTracks, risingArtists }: any) {
  const [activeTab, setActiveTab] = useState('Top Artists');

  const tabs = ['Top Artists', 'Top Tracks', 'Rising Artists', 'Top Genres'];

  const renderMovement = (index: number) => {
    // Fake movement for visual effect
    if (index === 0) return <span className="flex items-center text-green-500 font-bold text-[10px]"><TrendingUp className="w-3 h-3 mr-1" /> 1</span>;
    if (index === 2) return <span className="flex items-center text-red-500 font-bold text-[10px]"><TrendingDown className="w-3 h-3 mr-1" /> 2</span>;
    if (index === 4) return <span className="flex items-center text-[#00D2FF] font-bold text-[10px]">NEW</span>;
    return <span className="flex items-center text-gray-500 font-bold text-[10px]"><Minus className="w-3 h-3 mr-1" /></span>;
  };

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white font-sans pt-12 pb-32">
      
      {/* PAGE HEADER */}
      <header className="pt-12 pb-24 px-4 md:px-10 max-w-7xl mx-auto space-y-12">
         
         {/* LOGO */}
         <div className="flex">
            <Link href="/" className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</Link>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-6">
               <div className="flex items-center space-x-3 text-[#00D2FF]">
                  <BarChart3 className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Live Trending Analytics</span>
               </div>
               <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.8] italic">
                  Top<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Artists.</span>
               </h1>
               <p className="text-gray-500 max-w-xl font-medium leading-relaxed italic">
                  "Real-time trending charts for the NRH community — tracking streams, fan growth, and listener engagement across the network."
               </p>
            </div>
         </div>
      </header>

      {/* FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mb-12">
         <div className="bg-[#111] border border-white/5 rounded-3xl p-4 flex items-center gap-6 overflow-x-auto">
            {tabs.map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
               >
                 {tab}
               </button>
            ))}
         </div>
      </section>

      {/* CHART CONTENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-10">
         <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
               <div className="col-span-1 text-center">Rank</div>
               <div className="col-span-5">{activeTab.includes('Tracks') ? 'Track' : 'Artist'}</div>
               <div className="col-span-3 text-right">Monthly Listeners</div>
               <div className="col-span-3 text-right">Growth %</div>
            </div>

            <div className="divide-y divide-white/5">
               {activeTab === 'Top Artists' && topArtists.map((artist: any, index: number) => {
                  const growth = (index * 7 + 12) % 25 + 2;
                  return (
                     <div key={artist.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors group">
                        <div className="col-span-2 md:col-span-1 text-center text-xl font-bold text-gray-400 group-hover:text-white transition-colors">{index + 1}</div>
                        <div className="col-span-10 md:col-span-5 flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                              {artist.profileImageUrl && <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover" />}
                           </div>
                           <div className="min-w-0">
                              <Link href={`/${artist.slug}`} className="font-bold text-lg hover:text-[#00D2FF] transition-colors truncate block">
                                 {artist.name}
                              </Link>
                              <div className="flex items-center gap-2">
                                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{artist.genres?.[0] || 'Independent'}</p>
                                 <span className="text-[9px] font-bold text-[#00D2FF] uppercase tracking-widest bg-[#00D2FF]/10 px-1.5 py-0.5 rounded">{artist.patronCount} Patrons</span>
                              </div>
                           </div>
                        </div>
                        <div className="col-span-6 md:col-span-3 text-left md:text-right mt-4 md:mt-0">
                           <p className="font-bold">{formatNumber(artist.monthlyListeners || artist.totalStreams / 12)}</p>
                           <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Listeners</p>
                        </div>
                        <div className="col-span-6 md:col-span-3 flex flex-col items-end mt-4 md:mt-0">
                           <span className="flex items-center text-green-500 font-bold text-sm">+{growth}%</span>
                           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">This Week</span>
                        </div>
                     </div>
                  );
               })}

               {activeTab === 'Top Tracks' && topTracks.map((track: any, index: number) => {
                  const growth = (index * 3 + 8) % 15 + 1;
                  return (
                     <div key={track.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors group">
                        <div className="col-span-2 md:col-span-1 text-center text-xl font-bold text-gray-400 group-hover:text-white transition-colors">{index + 1}</div>
                        <div className="col-span-10 md:col-span-5 flex items-center gap-4">
                           <div className="w-12 h-12 rounded-md bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/20 transition-colors cursor-pointer relative overflow-hidden">
                              <Music className="w-5 h-5 text-gray-600 group-hover:opacity-0 transition-opacity" />
                              <div className="absolute inset-0 bg-[#00D2FF] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <Play className="w-5 h-5 text-white fill-current ml-1" />
                              </div>
                           </div>
                           <div className="min-w-0">
                              <p className="font-bold text-lg truncate">{track.title}</p>
                              <Link href={`/${track.Organization.slug}`} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors truncate block">
                                 {track.Organization.name}
                              </Link>
                           </div>
                        </div>
                        <div className="col-span-6 md:col-span-3 text-left md:text-right mt-4 md:mt-0">
                           <p className="font-bold text-[#00D2FF]">{formatNumber(track.playCount)}</p>
                           <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Plays</p>
                        </div>
                        <div className="col-span-6 md:col-span-3 flex flex-col items-end mt-4 md:mt-0">
                           <span className="flex items-center text-green-500 font-bold text-sm">+{growth}%</span>
                           <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Viral Velocity</span>
                        </div>
                     </div>
                  );
               })}

               {activeTab === 'Rising Artists' && risingArtists.map((artist: any, index: number) => (
                  <div key={artist.id} className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-colors group">
                     <div className="col-span-2 md:col-span-1 text-center text-xl font-bold text-gray-400 group-hover:text-white transition-colors">{index + 1}</div>
                     <div className="col-span-10 md:col-span-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden shrink-0 border border-purple-500/30">
                           {artist.profileImageUrl && <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                           <Link href={`/${artist.slug}`} className="font-bold text-lg hover:text-purple-400 transition-colors truncate block">
                              {artist.name}
                           </Link>
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{artist.city || 'Global'}</p>
                        </div>
                     </div>
                     <div className="col-span-6 md:col-span-3 text-left md:text-right mt-4 md:mt-0">
                        <p className="font-bold text-purple-400">{formatNumber(artist.monthlyListeners)}</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Monthly</p>
                     </div>
                     <div className="col-span-6 md:col-span-3 flex justify-end mt-4 md:mt-0">
                        <span className="flex items-center text-green-500 font-bold text-[10px]"><TrendingUp className="w-3 h-3 mr-1" /> HOT</span>
                     </div>
                  </div>
               ))}

               {activeTab === 'Top Genres' && (
                  <div className="py-20 text-center">
                     <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Disc className="w-8 h-8 text-[#00D2FF]" />
                     </div>
                     <h3 className="text-xl font-bold uppercase mb-2">Hip-Hop & R&B</h3>
                     <p className="text-gray-500 font-medium text-sm">2.4M Total Streams this week</p>
                     <div className="mt-8 space-x-4">
                        <Link href="/discover/hip-hop" className="btn-outline border-white text-white hover:bg-white hover:text-black">
                           Explore Genre
                        </Link>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </section>

    </div>
  );
}
