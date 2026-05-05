import React from 'react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import { Radio, Play, Users, Zap, Disc, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export const metadata = {
  title: 'NRH Radio Network | 24/7 Independent Music',
  description: 'Discover the heartbeat of the independent music network. 24/7 curated stations featuring NRH verified artists with 100% master rights retention.',
};

export default async function RadioDiscoveryPage() {
  const supabase = await createClient();
  const { data: stations, error } = await supabase
    .from('stations')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching stations:', error);
  }

  const safeStations = stations || [];

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-32 pb-40 px-8">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* HEADER */}
        <section className="space-y-8 max-w-3xl">
           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-[#A855F7]">
                 <Radio className="w-5 h-5 animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em]">NRH Global Broadcast Network</span>
              </div>
              <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black tracking-tighter leading-[0.8] uppercase italic">
                 Live<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Stations.</span>
              </h1>
           </div>
           <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
              "24/7 high-fidelity streams from the world's largest independent master rights network. No labels. No algorithms. Just pure talent."
           </p>
        </section>

        {/* FEATURED / MAIN STATION */}
        {safeStations.find(s => s.slug === 'nrh-radio') && (
          <section>
             {safeStations.filter(s => s.slug === 'nrh-radio').map(main => (
               <Link 
                 key={main.id} 
                 href={`/radio/${main.slug}`}
                 className="group relative block bg-gradient-to-br from-[#050505] to-[#111] border border-white/5 rounded-[4rem] p-12 lg:p-20 overflow-hidden hover:border-[#A855F7]/30 transition-all duration-700 shadow-2xl"
               >
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div className="space-y-10">
                        <div className="space-y-6">
                           <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Global Broadcast Active</span>
                           </div>
                           <h2 className="text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white group-hover:text-[#A855F7] transition-colors">{main.name}</h2>
                           <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">{main.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-6">
                           <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                              <Users className="w-5 h-5 text-[#A855F7]" />
                              <span className="text-sm font-bold text-white">14.2k Listening</span>
                           </div>
                           <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                              <Zap className="w-5 h-5 text-emerald-500" />
                              <span className="text-sm font-bold text-white">320kbps HQ</span>
                           </div>
                        </div>
                        <button className="px-12 py-6 rounded-full bg-white text-black font-black text-sm uppercase tracking-[0.2em] group-hover:bg-[#A855F7] group-hover:text-white transition-all shadow-2xl flex items-center gap-3">
                           <span>Enter Global Stream</span>
                           <Play className="w-4 h-4 fill-current" />
                        </button>
                     </div>
                     <div className="relative aspect-square lg:aspect-video flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#A855F7]/5 blur-[120px] rounded-full group-hover:bg-[#A855F7]/10 transition-all"></div>
                        <Disc className="w-64 h-64 text-white/5 animate-spin-slow group-hover:text-[#A855F7]/20 transition-colors" />
                     </div>
                  </div>
                  
                  {/* DECORATIVE MESH */}
                  <div className="absolute top-0 right-0 p-20 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Globe className="w-96 h-96 text-white" />
                  </div>
               </Link>
             ))}
          </section>
        )}

        {/* GENRE STATIONS GRID */}
        <section className="space-y-12">
           <div className="flex items-end justify-between border-b border-white/5 pb-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Genre Clusters.</h3>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Institutional Grade Rotation</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeStations.filter(s => s.slug !== 'nrh-radio').map((station, i) => (
                <Link 
                  key={station.id} 
                  href={`/radio/${station.slug}`}
                  className="group bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-8 hover:border-[#A855F7]/30 transition-all shadow-2xl relative overflow-hidden"
                >
                   <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-start">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-[#A855F7] group-hover:bg-[#A855F7]/10 transition-all">
                            <Radio className="w-6 h-6" />
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Live Now</span>
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">2.4k listeners</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <h4 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-[#A855F7] transition-colors">{station.name}</h4>
                         <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">{station.description}</p>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                         {(station.genres || []).slice(0, 2).map((g: string) => (
                            <span key={g} className="text-[8px] font-bold text-gray-600 uppercase tracking-widest px-2 py-1 bg-white/5 rounded-lg">{g}</span>
                         ))}
                      </div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                         Tune In <ArrowRight className="w-3 h-3 text-[#A855F7]" />
                      </div>
                   </div>

                   {/* BG GRADIENT */}
                   <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#A855F7]/5 blur-3xl rounded-full group-hover:bg-[#A855F7]/10 transition-all"></div>
                </Link>
              ))}
           </div>
        </section>

        {/* FOOTER INFO */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 lg:p-20 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
           <div className="w-24 h-24 rounded-[2rem] bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7] shrink-0">
              <ShieldCheck className="w-12 h-12" />
           </div>
           <div className="space-y-4">
              <h4 className="text-2xl font-black italic uppercase tracking-tighter">Statutory Compliance Verified.</h4>
              <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                 NRH Radio operates under direct artist-to-platform licensing agreements. 100% of the music in rotation is verified for rights clearance, ensuring independent artists are paid fairly and retain full ownership of their masters.
              </p>
           </div>
           <div className="flex-1 flex justify-center md:justify-end">
              <Link href="/how-it-works/radio" className="text-[10px] font-bold text-[#A855F7] uppercase tracking-widest hover:underline whitespace-nowrap">Governance Protocol →</Link>
           </div>
        </section>

      </div>
    </div>
  );
}
