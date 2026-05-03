'use client';
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Globe, ShieldAlert, 
  Activity, Users, Zap, Clock, Info, ChevronRight,
  ArrowUpRight, ArrowDownRight, Map as MapIcon, 
  Search, Filter, Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AnalyticsClient({ artist }: { artist: any }) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/studio/analytics');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      toast.error('Verified data sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 sm:p-8 md:p-12 space-y-12 selection:bg-[#A855F7] selection:text-black">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
         <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#A855F7]">
               <Activity className="w-5 h-5" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Verified Analytics Engine</span>
            </div>
            <h1 className="text-[clamp(3.5rem,12vw,6rem)] font-black italic uppercase tracking-tighter leading-none">Insights.</h1>
            <p className="text-zinc-500 font-medium italic max-w-xl text-sm sm:text-base">
               Monitor live listener behavior, Verified stream auditing, and global network equity in high-fidelity.
            </p>
         </div>

         <div className="flex items-center gap-4">
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all">
               <Download className="w-5 h-5" />
            </button>

         </div>
      </header>

      {/* CORE METRICS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
         {[
           { label: 'Total Streams', value: stats?.totalStreams?.toLocaleString() || '0', sub: 'Verified & Suspicious', icon: Activity, color: 'text-white' },
           { label: 'Verified Plays', value: stats?.verifiedStreams?.toLocaleString() || '0', sub: 'Protocol Authorized', icon: ShieldAlert, color: 'text-[#A855F7]' },
           { label: 'Unique Listeners', value: artist?.supporterCount?.toLocaleString() || '0', sub: 'Network Equity', icon: Users, color: 'text-white' },
           { label: 'Avg Playtime', value: Math.round(stats?.avgDuration || 0) + 's', sub: 'Verified Measurement', icon: Zap, color: 'text-purple-400' }
         ].map((stat, i) => (
           <div key={i} className="bg-[#0A0A0A] border border-white/10 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] space-y-4 relative group hover:border-[#A855F766] transition-all cursor-default overflow-hidden">
              <div className="flex items-center justify-between">
                 <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                 <span className="text-[8px] sm:text-[9px] font-black text-zinc-700 uppercase tracking-widest">NRH-V1.4</span>
              </div>
              <div className="space-y-1">
                 <h3 className={`text-2xl sm:text-4xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
                 <p className="text-[8px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              </div>
              <p className="hidden sm:block text-[9px] font-black text-zinc-700 uppercase tracking-widest absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                {stat.sub}
              </p>
           </div>
         ))}
      </section>

      {/* MAIN DATA GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* PLAYBACK VELOCITY */}
         <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[3.5rem] p-10 space-y-8 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
               <div className="space-y-1">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Playback Velocity</h3>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Verified 14-Day View</p>
               </div>
               <div className="flex gap-2">
                  {['7D', '14D', '30D', '90D'].map(t => (
                    <button key={t} className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${t === '14D' ? 'bg-[#A855F7] text-black shadow-lg' : 'bg-white/5 text-zinc-500 hover:text-white'}`}>
                       {t}
                    </button>
                  ))}
               </div>
            </div>

            <div className="h-64 flex items-end gap-2 relative z-10">
               {stats?.dailyStreams?.map((s: any, i: number) => (
                 <div key={i} className="flex-1 group relative">
                    <div 
                      className="w-full bg-gradient-to-t from-[#A855F766] to-[#A855F7] rounded-t-lg transition-all group-hover:scale-y-105" 
                      style={{ height: `${Math.max(10, (s.count / (Math.max(...stats.dailyStreams.map((x:any)=>x.count)) || 1)) * 100)}%` }}
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                       {s.count}
                    </div>
                 </div>
               ))}
            </div>

            <div className="flex justify-between text-[9px] font-bold text-zinc-700 uppercase tracking-widest pt-4 border-t border-white/5">
               <span>Initiated Phase</span>
               <span>Consensus Phase</span>
               <span>Terminal Phase</span>
            </div>

            {/* DECOR */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#A855F7]/5 blur-[100px] rounded-full pointer-events-none" />
         </div>

         {/* GLOBAL DENSITY */}
         <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-10 space-y-8 relative overflow-hidden">
            <div className="space-y-1">
               <h3 className="text-xl font-black italic uppercase tracking-tighter">Global Density</h3>
               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Listener Distribution</p>
            </div>

            <div className="space-y-4">
               {stats?.countryDistribution && Object.entries(stats.countryDistribution).slice(0, 5).map(([country, count]: [string, any], i) => (
                 <div key={country} className="space-y-2 group">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="text-white flex items-center gap-2 group-hover:text-[#A855F7] transition-colors">
                          <Globe className="w-3 h-3 text-zinc-600" />
                          {country}
                       </span>
                       <span className="text-zinc-500">{(count as number).toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-[#A855F7] transition-all duration-1000 shadow-[0_0_10px_rgba(168, 85, 247,16)]" 
                         style={{ width: `${((count as number) / stats.totalStreams) * 100}%` }}
                       />
                    </div>
                 </div>
               ))}
            </div>

            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2">
               Full Verified Map <MapIcon className="w-3 h-3" />
            </button>
         </div>
      </div>

      {/* FRAUD & AUDIT SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* FRAUD AUDIT */}
         <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 flex flex-col sm:flex-row gap-8 sm:gap-12 items-center">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 shrink-0">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="#A855F7" strokeWidth="8" 
                    strokeDasharray="282.7" 
                    strokeDashoffset={282.7 - (282.7 * (stats?.fraudMetrics?.clean / (stats?.totalStreams || 1)))}
                    className="transition-all duration-1000"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
                  <span className="text-2xl sm:text-3xl font-black italic text-white tracking-tighter">
                    {Math.round((stats?.fraudMetrics?.clean / (stats?.totalStreams || 1)) * 100)}%
                  </span>
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Clean Score</span>
               </div>
            </div>

            <div className="space-y-6 flex-1 w-full text-center sm:text-left">
               <div className="space-y-1">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Verified Audit</h3>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Real-time Fraud Detection</p>
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Authorized Plays', count: stats?.fraudMetrics?.clean, color: 'bg-emerald-500' },
                    { label: 'Suspicious Activity', count: stats?.fraudMetrics?.suspicious, color: 'bg-amber-500' },
                    { label: 'Protocol Rejected', count: stats?.fraudMetrics?.rejected, color: 'bg-rose-500' }
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-3 text-zinc-400">
                          <div className={`w-2 h-2 rounded-full ${m.color}`} />
                          {m.label}
                       </span>
                       <span className="text-white">{m.count?.toLocaleString() || '0'}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* REVENUE FORECAST - EMPTY STATE */}
         <div className="bg-gradient-to-br from-zinc-900 to-[#020202] border border-dashed border-white/10 rounded-[3.5rem] p-12 flex flex-col items-center justify-center text-center space-y-4">
            <TrendingUp className="w-12 h-12 text-zinc-700 mb-2" />
            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">Yield Forecast</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest max-w-sm">
               Your projected earnings data will appear here once you have active supporters and streaming history.
            </p>
         </div>
      </section>

      {/* FOOTER CALLOUT */}
      <footer className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-start gap-4 max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
               <Info className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[9px] font-bold text-zinc-500 uppercase leading-relaxed tracking-widest italic">
               Institutional data is processed every 15 minutes. Verified scores are calculated using a proprietary 12-point authentication matrix. Malicious streaming activity is automatically excluded from revenue pools.
            </p>
         </div>
         <button className="px-12 py-5 bg-[#A855F7] text-black font-black uppercase tracking-widest text-[11px] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(168, 85, 247,0.2)]">
            Upgrade Data Protocol
         </button>
      </footer>

    </div>
  );
}
