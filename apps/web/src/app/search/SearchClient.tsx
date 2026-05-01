'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Disc, Users, Radio, ArrowRight, Zap, Play, Award, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchResults = async () => {
      if (!q) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${activeFilter}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q, activeFilter]);

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-12">
        
        {/* SEARCH HEADER */}
        <header className="space-y-8 pt-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
              <div className="space-y-4">
                 <div className="flex items-center space-x-3 text-[#F1F5F9]">
                    <Search className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Network Search</span>
                 </div>
                  <h1 className="text-[clamp(2.5rem,10vw,5rem)] font-black tracking-tighter leading-[0.9] italic uppercase">
                     Results for:<br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600 leading-none">"{q}"</span>
                  </h1>
              </div>
           </div>

           {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 border-b border-white/5 pb-8">
               {['All', 'Artists', 'Releases', 'Hubs', 'Opportunities'].map(filter => (
                 <button 
                   key={filter}
                   onClick={() => setActiveFilter(filter)}
                   className={`px-5 py-2.5 sm:px-6 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === filter ? 'bg-[#F1F5F9] text-white shadow-[0_0_20px_rgba(241,245,249,33)]' : 'text-zinc-500 hover:text-white bg-white/05 border border-white/10'}`}
                 >
                  {filter}
                </button>
              ))}
           </div>
        </header>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#F1F5F9] animate-spin" />
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em]">Scanning Network...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map(item => (
                <div key={item.id} className="bg-[#111] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-all group relative overflow-hidden">
                  
                  {item.type === 'artist' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                               <img src={item.img} className="w-full h-full object-cover" />
                             </div>
                             <div className="text-right">
                               <span className="bg-[#F1F5F91a] text-[#F1F5F9] border border-[#F1F5F933] px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest">{item.badge}</span>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Artist</p>
                             </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold italic tracking-tighter uppercase">{item.name}</h3>
                            <p className="text-xs text-gray-400 font-medium">{item.category}</p>
                        </div>
                        <Link href={`/${item.slug}`} className="flex items-center justify-between pt-6 border-t border-white/5 group/link">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover/link:text-white transition-colors">View Profile</span>
                            <ArrowRight className="w-4 h-4 text-gray-800 group-hover/link:text-[#F1F5F9] transition-all group-hover/link:translate-x-1" />
                        </Link>
                      </div>
                  )}

                  {item.type === 'release' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 relative shadow-2xl group">
                              <img src={item.img} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Play className="w-8 h-8 text-white fill-white" />
                              </div>
                            </div>
                             <div className="text-right">
                               <div className="flex items-center space-x-1 justify-end text-emerald-500">
                                   <Zap className="w-3 h-3" />
                                   <span className="text-[9px] font-bold uppercase tracking-widest">{item.status}</span>
                               </div>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Release</p>
                             </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold italic tracking-tighter uppercase line-clamp-1">{item.title}</h3>
                            <p className="text-xs text-gray-400 font-medium">by {item.artist}</p>
                        </div>
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between text-gray-600">
                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.category}</span>
                            <Link href={`/${item.artistSlug}/${item.id}`} className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Listen Now</Link>
                        </div>
                      </div>
                  )}

                  {item.type === 'hub' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F1F5F9] shadow-[0_0_20px_rgba(51,102,255,0.3)]">
                              <img src={item.img} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-right">
                               <div className="flex items-center space-x-1.5 justify-end">
                                   <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></div>
                                   <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest italic">Live Now</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Artist Hub</p>
                             </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold italic tracking-tighter uppercase">{item.name}</h3>
                            <p className="text-xs text-gray-400 font-medium">Stage Scene: {item.scene || 'Professional Studio'}</p>
                        </div>
                        <Link href={`/${item.slug}/live`} className="w-full py-4 rounded-2xl bg-[#F1F5F9] text-white text-center font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#2952CC] transition-all flex items-center justify-center gap-2">
                            Enter Hub <Radio className="w-3 h-3" />
                        </Link>
                      </div>
                  )}

                  {item.type === 'opportunity' && (
                      <div className="space-y-6 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                              <Award className="w-6 h-6" />
                            </div>
                             <div className="text-right">
                               <span className="text-xs font-bold text-amber-500">{item.deadline}</span>
                               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Opportunity</p>
                             </div>
                        </div>
                        <div className="space-y-2 flex-1">
                            <h3 className="text-2xl font-bold italic tracking-tighter uppercase line-clamp-2 leading-tight">{item.title}</h3>
                            <p className="text-xs text-[#F1F5F9] font-bold uppercase tracking-widest">{item.category}</p>
                        </div>
                        <Link href="/network/board" className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all mt-auto">
                            Apply Now
                        </Link>
                      </div>
                  )}

                </div>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && (
           <div className="py-32 text-center space-y-8">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-700">
                 <Search className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-bold text-white">No results found.</h3>
                 <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}


