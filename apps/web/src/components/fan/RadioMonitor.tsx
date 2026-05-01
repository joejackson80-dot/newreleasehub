'use client';
import React, { useState, useEffect } from 'react';
import { Radio, Users, Play, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RadioMonitor() {
  const [liveStations, setLiveStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/network/live');
        const data = await res.json();
        if (data.success) setLiveStations(data.stations);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLive();
  }, []);

  if (loading) return (
    <div className="py-20 text-center animate-pulse text-[10px] font-bold text-gray-700 uppercase tracking-widest">
       Scanning Network Frequencies...
    </div>
  );

  return (
    <div className="space-y-10">
       <div className="flex items-center justify-between">
          <div className="space-y-1">
             <h3 className="text-xl font-bold italic uppercase tracking-tight text-white">Network Pulse</h3>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time Global Broadcasts</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{liveStations.length} ACTIVE STATIONS</span>
          </div>
       </div>

       {liveStations.length === 0 ? (
          <div className="bg-[#111] border border-white/5 rounded-[3.5rem] p-20 text-center space-y-8">
             <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-700">
                <Radio className="w-8 h-8" />
             </div>
             <div className="space-y-2">
                <p className="text-lg font-bold uppercase italic tracking-tighter">Silence on the Wire.</p>
                <p className="text-xs text-gray-500 font-medium max-w-xs mx-auto leading-relaxed">
                   No artists are currently broadcasting. Check back soon for live sets and master release sessions.
                </p>
             </div>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {liveStations.map(station => (
                <div key={station.id} className="group relative">
                   <div className="absolute inset-0 bg-red-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 hover:border-red-500/30 transition-all relative z-10 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                               <img src={station.profileImageUrl} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <h4 className="text-lg font-bold italic uppercase tracking-tighter text-white">{station.name}</h4>
                               <div className="flex items-center gap-2">
                                  <Users className="w-3 h-3 text-[#A855F7]" />
                                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{station.liveListenerCount} Tuning In</span>
                               </div>
                            </div>
                         </div>
                         <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                      </div>

                      <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-1">
                         <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Active Broadcast</p>
                         <p className="text-sm font-bold text-white truncate italic">"Live Network Session"</p>
                      </div>

                      <Link href={`/${station.slug}/live`} className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-xl">
                         <Play className="w-3 h-3 fill-current" /> Join Hub <ArrowRight className="w-3 h-3" />
                      </Link>
                   </div>
                </div>
             ))}
          </div>
       )}

       <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 flex items-center gap-6">
          <ShieldCheck className="w-6 h-6 text-[#A855F7]" />
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
             NRH Radio utilizes institutional-grade low-latency streaming. Listeners earn 2x Yield XP during verified live sessions.
          </p>
       </div>
    </div>
  );
}
