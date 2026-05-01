'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, Users, TrendingUp, Search, ChevronRight } from 'lucide-react';

const GENRES = [
  'Top Artists', 'Top Fans', 'Rising', 'Hip-Hop', 'R&B', 'Pop', 'Electronic', 
  'Afrobeats', 'Reggaeton', 'Indie', 'Rock', 'Country', 'Jazz', 'Classical',
  'Lo-Fi', 'Metal', 'Folk', 'Blues', 'World', 'Latin', 'Ambient'
];

export default function ChartsPage() {
  const [activeGenre, setActiveGenre] = useState('Top Artists');
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchCharts = async () => {
      try {
        const res = await fetch(`/api/charts?genre=${encodeURIComponent(activeGenre)}`);
        const data = await res.json();
        if (data.success && isMounted) {
          setArtists(data.ranking || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCharts();

    return () => {
      isMounted = false;
    };
  }, [activeGenre]);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#F1F5F9] selection:text-black">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F1F5F9]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 px-4 py-16 sm:p-16 max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[#F1F5F9]">
               <BarChart3 className="w-6 h-6" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Network Authority</span>
            </div>
            <div>
              <h1 className="text-[clamp(2.5rem,10vw,7.5rem)] font-black mb-4 uppercase italic tracking-tighter leading-none break-words max-w-full">
                The <span className="text-[#F1F5F9]">Charts.</span>
              </h1>
              <p className="text-zinc-500 text-[clamp(1rem,2.5vw,1.25rem)] font-medium max-w-2xl leading-relaxed">
                The definitive measurement of independent music equity. <br className="hidden sm:block" />
                Updated every Monday at <span className="text-white italic">6AM Central.</span>
              </p>
            </div>
          </div>
          
          <div className="relative group w-full md:min-w-[300px]">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#F1F5F9] transition-colors" />
             <input 
               type="text" 
               placeholder="SEARCH ARTISTS..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-base font-bold uppercase tracking-widest focus:outline-none focus:border-[#F1F5F9]/50 focus:ring-1 focus:ring-[#F1F5F9]/20 transition-all shadow-2xl"
             />
          </div>
        </header>

        {/* GENRE NAVIGATION - COVER ALL GENRES */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Filter By Genre</span>
              <span className="text-[9px] font-black text-[#F1F5F9] uppercase tracking-[0.3em]">{GENRES.length} Categories</span>
           </div>
            <nav className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
              {GENRES.map((genre) => (
                <button 
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeGenre === genre ? 'bg-[#F1F5F9] text-black shadow-[0_0_30px_rgba(241,245,249,0.2)]' : 'bg-[#0A0A0A] border border-white/5 text-zinc-500 hover:text-white hover:border-white/20'}`}
                >
                  {genre}
                </button>
              ))}
            </nav>
         </div>

         {/* FEATURED SPOTLIGHT */}
         {!isLoading && artists.length > 0 && (
           <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 bg-[#0A0A0A] shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-[#F1F5F9]/20 opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
              <div className="relative p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12">
                 <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-left">
                    <div className="relative">
                       <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-[2rem] bg-zinc-900 border-2 border-white/10 flex items-center justify-center relative z-10 shadow-2xl overflow-hidden">
                          {artists[0].profileImageUrl ? (
                            <img src={artists[0].profileImageUrl} alt={artists[0].name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-16 h-16 text-zinc-800" />
                          )}
                       </div>
                       <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 bg-white text-black font-black italic text-lg sm:text-xl flex items-center justify-center rounded-2xl z-20 shadow-xl">#1</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <span className="px-3 py-1 bg-[#F1F5F9]/10 text-[#F1F5F9] rounded-full text-[9px] font-black uppercase tracking-widest border border-[#F1F5F9]/20">Authority: {artists[0].verifiedScore || 85}</span>
                          <span className="text-zinc-600 font-black text-[9px] uppercase tracking-widest italic">Peak Momentum</span>
                      </div>
                      <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-black italic uppercase tracking-tighter leading-none truncate max-w-[280px] sm:max-w-lg">{artists[0].name}</h2>
                      <div className="flex items-center justify-center sm:justify-start gap-6 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                         <span>{artists[0].genres?.[0] || activeGenre}</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-zinc-800"></span>
                         <span>{artists[0].city || 'Global'}</span>
                      </div>
                    </div>
                 </div>
                 <div className="w-full md:w-auto">
                    <Link href={`/${artists[0].slug}`} className="inline-block group/btn relative w-full md:w-auto overflow-hidden rounded-2xl bg-white px-12 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-2xl text-center">
                       <span className="relative z-10 flex items-center justify-center gap-2">
                          View Profile
                          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                       </span>
                    </Link>
                 </div>
              </div>
           </div>
         )}

        {/* RANKING TABLE */}
        <div className="space-y-8">
           <div className="flex items-center justify-between px-8">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Full Rankings <span className="text-zinc-700 ml-2">/ {activeGenre}</span></h3>
              <div className="flex gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                 <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Rising</span>
                 <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Falling</span>
              </div>
           </div>

           <div className="bg-[#0A0A0A] rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl relative">
              
              {/* DESKTOP TABLE */}
              <table className="hidden md:table w-full text-left border-collapse">
                <thead className="bg-white/5 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
                  <tr>
                    <th className="p-10"># Rank</th>
                    <th className="p-10">Trend</th>
                    <th className="p-10">{activeGenre === 'Top Fans' ? 'Network Agent' : 'Authority Entity'}</th>
                    <th className="p-10">{activeGenre === 'Top Fans' ? 'Status' : 'Primary Discipline'}</th>
                    <th className="p-10">{activeGenre === 'Top Fans' ? 'Reputation Score' : 'Equity Score'}</th>
                    <th className="p-10 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-[#F1F5F9] animate-pulse">
                           <Activity className="w-8 h-8" />
                        </div>
                        <p className="mt-4 text-[10px] font-black text-[#F1F5F9] uppercase tracking-[0.4em] animate-pulse">Synchronizing Live Matrix</p>
                      </td>
                    </tr>
                  ) : artists.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center space-y-4 border-t border-white/5 bg-zinc-950/20">
                         <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-zinc-700">
                            <Users className="w-8 h-8" />
                         </div>
                         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">No Data Found for this Segment</p>
                      </td>
                    </tr>
                  ) : (
                    artists.map((artist, i) => (
                       <tr key={artist.id} className="hover:bg-white/[0.02] transition-all group relative">
                         <td className="p-10 text-5xl font-black italic text-zinc-900 group-hover:text-zinc-600 transition-all duration-500">{i + 1}</td>
                         <td className="p-10">
                            <div className="flex flex-col items-start gap-1">
                               <span className="flex items-center gap-1 text-[#F1F5F9] font-black text-[11px] uppercase tracking-widest italic">
                                  <TrendingUp className="w-3.5 h-3.5" />
                                  +{Math.floor(Math.random() * 5) + 1}
                               </span>
                               <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Growth</span>
                            </div>
                         </td>
                         <td className="p-10">
                            <div className="flex items-center gap-6">
                               <div className="relative group/avatar">
                                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-800 group-hover:border-[#F1F5F966] transition-colors shadow-lg overflow-hidden">
                                     {activeGenre === 'Top Fans' ? (
                                       artist.avatarUrl ? <img src={artist.avatarUrl} alt={artist.displayName} className="w-full h-full object-cover" /> : <Users className="w-8 h-8" />
                                     ) : (
                                       artist.profileImageUrl ? <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover" /> : <Users className="w-8 h-8" />
                                     )}
                                  </div>
                                  <div className="absolute inset-0 bg-[#F1F5F90d] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                               </div>
                               <div className="space-y-1">
                                  <p className="font-black italic uppercase tracking-tight text-xl text-white group-hover:text-[#F1F5F9] transition-colors">
                                    {activeGenre === 'Top Fans' ? artist.displayName : artist.name}
                                  </p>
                                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">
                                    {activeGenre === 'Top Fans' ? `@${artist.username}` : (artist.city || 'Global Network')}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="p-10">
                            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-400">
                               {activeGenre === 'Top Fans' ? `LVL ${artist.fanLevel}` : (artist.genres?.[0] || activeGenre)}
                            </span>
                         </td>
                         <td className="p-10">
                            <div className="space-y-3">
                               <div className="flex justify-between items-end">
                                   <span className="text-white font-black italic text-lg">
                                     {activeGenre === 'Top Fans' ? artist.fanXP : (artist.verifiedScore || 0)}
                                   </span>
                                   <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                                     {activeGenre === 'Top Fans' ? 'XP' : 'Authority'}
                                   </span>
                               </div>
                               <div className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                  <div 
                                     className="h-full bg-gradient-to-r from-purple-600 to-[#F1F5F9] shadow-[0_0_15px_rgba(241,245,249,0.4)] transition-all duration-1000"                                     style={{ 
                                        width: activeGenre === 'Top Fans' 
                                          ? `${(artist.fanXP / (artist.fanLevel * 500)) * 100}%` 
                                          : `${artist.verifiedScore || 10}%` 
                                      }}
                                  ></div>
                               </div>
                            </div>
                         </td>
                         <td className="p-10 text-right">
                           <Link href={activeGenre === 'Top Fans' ? `/fan/${artist.username}` : `/${artist.slug}`} className="inline-block group/follow relative px-8 py-3 bg-white/5 border border-white/10 hover:border-[#F1F5F980] transition-all text-[9px] font-black uppercase tracking-widest rounded-xl overflow-hidden">
                             <span className="relative z-10 group-hover/follow:text-white">View Protocol</span>
                             <div className="absolute inset-0 bg-[#F1F5F9] translate-y-full group-hover/follow:translate-y-0 transition-transform duration-300 opacity-20"></div>
                           </Link>
                         </td>
                       </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* MOBILE LIST VIEW */}
              <div className="md:hidden divide-y divide-white/5">
                {isLoading ? (
                  <div className="p-20 text-center">
                    <Activity className="w-8 h-8 text-[#F1F5F9] animate-pulse mx-auto" />
                  </div>
                ) : artists.length === 0 ? (
                  <div className="p-20 text-center">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">No Data Found</p>
                  </div>
                ) : (
                  artists.map((artist, i) => (
                    <Link 
                      key={artist.id} 
                      href={activeGenre === 'Top Fans' ? `/fan/${artist.username}` : `/${artist.slug}`}
                      className="flex items-center gap-4 p-6 hover:bg-white/5 transition-colors"
                    >
                      <span className="w-6 text-2xl font-black italic text-zinc-800">{i + 1}</span>
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                        {activeGenre === 'Top Fans' ? (
                          artist.avatarUrl ? <img src={artist.avatarUrl} alt={artist.displayName} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 p-2 text-zinc-800" />
                        ) : (
                          artist.profileImageUrl ? <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 p-2 text-zinc-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black italic uppercase tracking-tighter text-white truncate">
                          {activeGenre === 'Top Fans' ? artist.displayName : artist.name}
                        </p>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic truncate">
                          {activeGenre === 'Top Fans' ? `@${artist.username}` : (artist.city || 'Global Network')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#F1F5F9] font-black italic text-sm">
                          {activeGenre === 'Top Fans' ? artist.fanXP : (artist.verifiedScore || 0)}
                        </p>
                        <p className="text-[7px] font-bold text-zinc-700 uppercase tracking-widest">Score</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              
              {/* EMPTY STATE MOCK */}
              <div className="p-12 sm:p-20 text-center space-y-4 border-t border-white/5 bg-zinc-950/20">
                 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-zinc-700 animate-pulse">
                    <Activity className="w-6 h-6 sm:w-8 sm:h-8" />
                 </div>
                 <p className="text-[9px] sm:text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Awaiting Final Network Synchronization</p>
              </div>
           </div>
        </div>

        {/* FOOTER CALLOUT */}
        <footer className="pt-20 border-t border-white/5 flex flex-col items-center text-center space-y-8">
           <div className="max-w-xl space-y-4">
              <h4 className="text-3xl font-black italic uppercase tracking-tighter">Scale Your Network Equity.</h4>
              <p className="text-zinc-500 font-medium text-sm leading-relaxed uppercase tracking-widest">
                 The NRH Authority score is calculated using 12 Verified data points. <br />
                 Release music, grow your SUPPORTERs, and dominate the charts.
              </p>
           </div>
           <Link href="/studio" className="px-12 py-5 bg-[#F1F5F9] text-black font-black uppercase tracking-widest text-[11px] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(241,245,249,0.2)]">
              Join the Network
           </Link>
        </footer>
      </div>
    </div>
  );
}

// Reuse some icons
import { Activity } from 'lucide-react';


