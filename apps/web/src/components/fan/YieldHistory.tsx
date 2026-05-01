'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, DollarSign, Calendar, Music, ShieldCheck, Loader2 } from 'lucide-react';

export default function YieldHistory() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/fan/yield/history');
        const json = await res.json();
        if (json.success) setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <Loader2 className="w-8 h-8 text-[#F1F5F9] animate-spin" />
      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Compiling Yield Ledger...</p>
    </div>
  );

  if (!data || data.history.length === 0) return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-6">
       <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-zinc-700">
          <TrendingUp className="w-8 h-8" />
       </div>
       <div className="space-y-2">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Zero Yield Detected</p>
          <p className="text-sm text-gray-400">Support your first artist to start earning a share of their streaming revenue.</p>
       </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 space-y-2">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Cumulative Yield</p>
            <div className="flex items-end gap-2">
               <span className="text-4xl font-black italic text-white">${(data.stats.totalEarned / 100).toFixed(2)}</span>
               <span className="text-[10px] font-bold text-emerald-500 mb-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +12%
               </span>
            </div>
         </div>
         <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 space-y-2">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Active Positions</p>
            <p className="text-4xl font-black italic text-[#F1F5F9]">{data.stats.activePositions}</p>
         </div>
         <div className="bg-[#111] border border-white/5 rounded-[2rem] p-8 space-y-2">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Next Distribution</p>
            <div className="flex items-center gap-2">
               <Calendar className="w-5 h-5 text-zinc-600" />
               <p className="text-xl font-black italic text-white uppercase tracking-tighter">May 15</p>
            </div>
         </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black italic uppercase tracking-widest text-white">Consolidated Revenue Ledger</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
               <ShieldCheck className="w-4 h-4" /> Protocol Verified
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-white/5">
                     <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Asset Manager</th>
                     <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Share %</th>
                     <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Protocol Status</th>
                     <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] text-right">Yield Accrued</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {data.history.map((share: any) => (
                    <motion.tr 
                      key={share.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                       <td className="p-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden">
                                {share.Organization.profileImageUrl && <img src={share.Organization.profileImageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />}
                             </div>
                             <div>
                                <p className="font-bold text-white text-sm tracking-tight">{share.Organization.name}</p>
                                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Established {new Date(share.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-8">
                          <span className="text-xs font-black text-[#F1F5F9] italic">{(share.revenueSharePercent * 100).toFixed(1)}%</span>
                       </td>
                       <td className="p-8">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${share.status === 'CREDITED' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-600'}`}></div>
                             <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{share.status}</span>
                          </div>
                       </td>
                       <td className="p-8 text-right">
                          <span className="text-sm font-black text-white italic tracking-tighter">${(share.amountEarned / 100).toFixed(2)}</span>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
