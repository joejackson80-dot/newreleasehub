'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Database, ShieldCheck, Zap, ArrowUpRight, Search, Filter, Download, LayoutDashboard, BarChart3, Radio } from 'lucide-react';
import Link from 'next/link';

const MOCK_DATA_FEED: any[] = [];

export default function EnterpriseFeedClient() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => p + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#A855F7] selection:text-white font-sans pt-12 pb-32">
      
      {/* ENTERPRISE HEADER */}
      <header className="px-4 md:px-10 max-w-7xl mx-auto space-y-8 pt-12">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-[#A855F7]">
                  <Database className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Enterprise Data Hub</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none italic uppercase">
                  Institutional<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Data Feed.</span>
               </h1>
            </div>
            <div className="flex items-center space-x-4">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Feed Status</p>
                  <p className="text-xs font-bold text-green-500 flex items-center justify-end">
                     <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                     LIVE / ENCRYPTED
                  </p>
               </div>
               <button className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors">
                  <Download className="w-5 h-5 text-gray-500" />
               </button>
            </div>
         </div>
      </header>

      {/* METRICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mt-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
               { label: 'Global Network TPS', value: '2.4k', icon: Zap },
               { label: 'Verified IP Assets', value: '1.2M', icon: ShieldCheck },
               { label: 'Institutional Liquidity', value: '$42M', icon: Activity },
               { label: 'Active Roster Yield', value: '18.4%', icon: ArrowUpRight },
            ].map((stat, i) => (
               <div key={i} className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-2 hover:border-white/20 transition-all group">
                  <div className="flex justify-between items-center">
                     <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{stat.label}</p>
                     <stat.icon className="w-3.5 h-3.5 text-gray-700 group-hover:text-[#A855F7] transition-colors" />
                  </div>
                  <p className="text-3xl font-bold italic group-hover:translate-x-1 transition-transform">{stat.value}</p>
               </div>
            ))}
         </div>
      </section>

      {/* FEED CONTENT */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* REAL-TIME FEED */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
               <div className="px-8 py-5 bg-[#1a1a1a] border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Global Activity Terminal</h3>
                  <div className="flex space-x-2">
                     <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/30" />
                     <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                     <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/30" />
                  </div>
               </div>
               <div className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                     {MOCK_DATA_FEED.length > 0 ? MOCK_DATA_FEED.map((item, i) => (
                        <motion.div 
                           key={item.id + pulse}
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           className="p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
                        >
                           <div className="flex items-center space-x-6">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 bg-[#050505]`}>
                                 {item.type === 'IP' && <ShieldCheck className="w-5 h-5 text-purple-400" />}
                                 {item.type === 'SYNC' && <Globe className="w-5 h-5 text-purple-400" />}
                                 {item.type === 'VELOCITY' && <Zap className="w-5 h-5 text-amber-400" />}
                                 {item.type === 'YIELD' && <Activity className="w-5 h-5 text-green-400" />}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white uppercase tracking-tight">{item.artist}</p>
                                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{item.event}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xs font-bold text-white">{item.value}</p>
                              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">{item.time}</p>
                           </div>
                        </motion.div>
                     )) : (
                        <motion.div 
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="p-20 text-center space-y-4"
                        >
                           <Activity className="w-12 h-12 text-zinc-800 mx-auto" />
                           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Awaiting Live Feed Sync</p>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         </div>

         {/* SIDEBAR TOOLS */}
         <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#A855F7]/20 to-purple-500/20 border border-white/10 rounded-3xl p-10 space-y-6">
               <h3 className="text-xl font-bold uppercase tracking-tighter italic">Label Intelligence</h3>
               <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  Use our institutional data models to predict roster success and optimize revenue share allocations across your entire enterprise.
               </p>
               <button className="w-full py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#A855F7] hover:text-white transition-all shadow-xl">
                  Run Roster Audit
               </button>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-6">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Trending Metadata</h3>
               <div className="space-y-4">
                  {[
                     { label: '#InstitutionalGrade', count: '4.2k matches' },
                     { label: '#YieldOptimization', count: '1.8k assets' },
                     { label: '#SyncVerified', count: '900 matches' },
                  ].map((tag, i) => (
                     <div key={i} className="flex justify-between items-center">
                        <p className="text-xs font-bold text-white italic">{tag.label}</p>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{tag.count}</p>
                     </div>
                  ))}
               </div>
            </div>

            <Link href="/studio/login" className="flex items-center justify-between p-6 bg-[#020202] border border-white/10 rounded-2xl group hover:border-[#A855F7] transition-all">
               <div className="flex items-center space-x-4">
                  <LayoutDashboard className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">Management Portal</span>
               </div>
               <ArrowUpRight className="w-4 h-4 text-gray-800 group-hover:text-[#A855F7] transition-all" />
            </Link>
         </div>

      </section>

    </div>
  );
}


