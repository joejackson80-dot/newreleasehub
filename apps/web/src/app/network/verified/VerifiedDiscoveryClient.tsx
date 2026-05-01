'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, BarChart3, TrendingUp, 
  ShieldCheck, ArrowUpRight, Loader2, Users,
  Music, Globe, Zap, SlidersHorizontal, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const GENRES = ['All', 'Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Afrobeats', 'Rock', 'Indie', 'Jazz'];
const SORT_OPTIONS = [
  { id: 'relevance', label: 'Network Relevance' },
  { id: 'growth', label: 'Momentum Growth' },
  { id: 'equity', label: 'Equity Score' },
  { id: 'streams', label: 'Global Streams' }
];

export default function VerifiedDiscoveryClient() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          genre,
          sortBy
        });
        const res = await fetch(`/api/search/verified?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setArtists(data.artists);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchArtists, 300);
    return () => clearTimeout(timer);
  }, [query, genre, sortBy]);

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-32 pb-40 px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
           <div className="space-y-6">
              <div className="flex items-center space-x-3 text-[#A855F7]">
                 <BarChart3 className="w-5 h-5" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Verified Intelligence Terminal</span>
              </div>
              <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] font-black tracking-tighter uppercase italic leading-[0.8]">
                 Verified<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Discovery.</span>
              </h1>
              <p className="text-gray-500 max-w-xl font-medium italic">
                Analyze network equity, track artist momentum, and identify high-growth talent using Verified metrics.
              </p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-1">
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-right">Network Accuracy</p>
                 <p className="text-2xl font-black italic text-emerald-500">99.9%</p>
              </div>
           </div>
        </header>

        {/* SEARCH & FILTERS PANEL */}
        <section className="space-y-8">
           <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1 group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#A855F7] transition-colors" />
                 <input 
                   type="text" 
                   placeholder="SEARCH THE NETWORK MATRIX..."
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   className="w-full bg-[#0A0A0A] border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-xs font-bold uppercase tracking-[0.2em] focus:outline-none focus:border-[#A855F7]/30 transition-all shadow-2xl"
                 />
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-8 py-6 rounded-3xl border transition-all flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest ${showFilters ? 'bg-[#A855F7] border-[#A855F7] text-white' : 'bg-[#0A0A0A] border-white/5 text-gray-400 hover:border-white/20'}`}
              >
                 <SlidersHorizontal className="w-4 h-4" />
                 Verified Filters
                 <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
           </div>

           <AnimatePresence>
             {showFilters && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                  <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 shadow-2xl">
                     <div className="space-y-6">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Discipline Cluster</span>
                        <div className="flex flex-wrap gap-2">
                           {GENRES.map(g => (
                             <button 
                               key={g} 
                               onClick={() => setGenre(g)}
                               className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${genre === g ? 'bg-white text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                             >
                               {g}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Sort Metric</span>
                        <div className="grid grid-cols-2 gap-3">
                           {SORT_OPTIONS.map(opt => (
                             <button 
                               key={opt.id} 
                               onClick={() => setSortBy(opt.id)}
                               className={`px-4 py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest text-left transition-all border ${sortBy === opt.id ? 'bg-[#A855F7]/10 border-[#A855F7]/40 text-[#A855F7]' : 'bg-white/5 border-transparent text-gray-500 hover:border-white/10'}`}
                             >
                               {opt.label}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Network Thresholds</span>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Minimum SUPPORTERs</span>
                              <span className="text-[9px] font-bold text-white uppercase">100+</span>
                           </div>
                           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#A855F7]" style={{ width: '40%' }}></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </section>

        {/* RESULTS GRID */}
        <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-6">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Consolidated Analysis <span className="text-gray-700 ml-3">/ {artists.length} Entities Found</span></h3>
              <div className="flex items-center gap-6">
                 <div className="flex bg-[#111] p-1 rounded-xl border border-white/5">
                    <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>Grid View</button>
                    <button onClick={() => setViewMode('matrix')} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${viewMode === 'matrix' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>Matrix View</button>
                 </div>
                 <div className="hidden sm:flex items-center gap-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> HIGH GROWTH</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#A855F7]"></div> VERIFIED EQUITY</div>
                 </div>
              </div>
            </div>

           {loading ? (
             <div className="py-40 flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-12 h-12 text-[#A855F7] animate-spin" />
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em] animate-pulse">Running Verified Diagnostics...</p>
             </div>
           ) : viewMode === 'grid' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {artists.map((artist, i) => (
                  <motion.div 
                    key={artist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-10 hover:border-[#A855F7]/30 transition-all shadow-2xl relative overflow-hidden"
                  >
                     <div className="flex justify-between items-start relative z-10">
                        <div className="relative">
                           <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-white/10 overflow-hidden group-hover:border-[#A855F7]/40 transition-colors">
                              {artist.profileImageUrl && <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />}
                           </div>
                           {artist.isVerified && (
                             <div className="absolute -bottom-2 -right-2 bg-[#A855F7] text-white p-2 rounded-xl shadow-xl">
                                <ShieldCheck className="w-4 h-4" />
                             </div>
                           )}
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Verified Score</p>
                           <p className="text-4xl font-black italic text-white tracking-tighter">{artist.verifiedScore}</p>
                        </div>
                     </div>

                     <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-2">
                           <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-bold text-gray-500 uppercase tracking-widest">{artist.genres?.[0] || 'Independent'}</span>
                           <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> +12% MoM
                           </span>
                        </div>
                        <h4 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-[#A855F7] transition-colors">{artist.name}</h4>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">{artist.city || 'Global Network'}</p>
                     </div>

                     <div className="grid grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-1">
                           <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Equity Holders</p>
                           <p className="text-xl font-black italic text-white tracking-tight">{artist.supporterCount}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Retention</p>
                           <p className="text-xl font-black italic text-white tracking-tight">{artist.retentionRate}%</p>
                        </div>
                     </div>

                     <Link 
                       href={`/fan/${artist.slug}`}
                       className="block w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-widest text-center hover:bg-white hover:text-black transition-all"
                     >
                        Analyze Protocol
                     </Link>

                     {/* BG GLOW */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/5 blur-3xl rounded-full group-hover:bg-[#A855F7]/10 transition-all"></div>
                  </motion.div>
                ))}
             </div>
           ) : (
             <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="border-b border-white/5 bg-[#111]/50">
                            <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Entity Matrix</th>
                            <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Cluster</th>
                            <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Equity Base</th>
                            <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Retention</th>
                            <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Score</th>
                            <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] text-right">Protocol</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                         {artists.map((artist) => (
                           <tr key={artist.id} className="group hover:bg-white/[0.02] transition-colors">
                              <td className="p-8">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                                       {artist.profileImageUrl && <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />}
                                    </div>
                                    <div>
                                       <p className="font-bold text-white text-base tracking-tight uppercase italic">{artist.name}</p>
                                       <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{artist.city || 'Global Network'}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-8">
                                 <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest">{artist.genres?.[0] || 'Independent'}</span>
                              </td>
                              <td className="p-8">
                                 <p className="text-lg font-black italic text-white tracking-tighter">{artist.supporterCount}</p>
                              </td>
                              <td className="p-8">
                                 <p className="text-lg font-black italic text-emerald-500 tracking-tighter">{artist.retentionRate}%</p>
                              </td>
                              <td className="p-8">
                                 <div className="flex items-center gap-3">
                                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                       <div className="h-full bg-[#A855F7]" style={{ width: `${artist.verifiedScore}%` }}></div>
                                    </div>
                                    <span className="text-sm font-black italic text-white">{artist.verifiedScore}</span>
                                 </div>
                              </td>
                              <td className="p-8 text-right">
                                 <Link href={`/fan/${artist.slug}`} className="inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-[#A855F7] transition-colors">
                                    Analyze <ArrowUpRight className="w-3 h-3" />
                                 </Link>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
           )}


           {!loading && artists.length === 0 && (
              <div className="py-40 text-center space-y-6 bg-[#0A0A0A] border border-dashed border-white/5 rounded-[3.5rem]">
                 <Zap className="w-16 h-16 text-white/5 mx-auto" />
                 <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">Zero Entities Matched Your Filter Cluster</p>
                    <p className="text-xs text-gray-700 font-medium italic">Adjust your network thresholds and try again.</p>
                 </div>
              </div>
           )}
        </section>

      </div>
    </div>
  );
}
