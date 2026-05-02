'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, PieChart, TrendingUp, Calendar, ArrowRight, Download, CheckCircle2, ShieldCheck, Banknote, Briefcase } from 'lucide-react';

export default function RoyaltiesDashboardClient({ initialPools }: any) {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 space-y-12">
      
      {/* TREASURY HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-green-500">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Protocol: Treasury Governance</span>
           </div>
           <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Institutional<br />Ledger.</h1>
           <p className="text-gray-500 text-sm font-medium italic">Auditing network liquidity and facilitating global artist distributions.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-green-500/10 border border-green-500/20 px-6 py-4 rounded-2xl flex items-center gap-4">
              <Banknote className="w-6 h-6 text-green-500" />
              <div>
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Pooled Assets</p>
                 <p className="text-xl font-bold text-green-400 italic">$1,248,500.00</p>
              </div>
           </div>
        </div>
      </header>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Avg Payout/Artist', value: '$842.10', icon: TrendingUp, color: 'text-blue-400' },
           { label: 'Network Fee (2.5%)', value: '$31,212.50', icon: Briefcase, color: 'text-purple-400' },
           { label: 'Active Support Stakes', value: '14,200', icon: PieChart, color: 'text-amber-400' },
           { label: 'Next Cycle', value: 'June 1st', icon: Calendar, color: 'text-white' },
         ].map((stat, i) => (
           <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all group">
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                 </div>
                 <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest group-hover:text-gray-500 transition-colors">Verified</span>
              </div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white italic">{stat.value}</p>
           </div>
         ))}
      </div>

      {/* RECENT POOLS */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden">
         <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold italic uppercase tracking-tighter">Historical Distribution Cycles</h3>
            <button className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
               <Download className="w-4 h-4" /> Export Ledger
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Period</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Total Revenue</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Distributed</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Audit</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {initialPools.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">No historical data in ledger.</td>
                     </tr>
                  ) : (
                     initialPools.map((pool: any) => (
                        <tr key={pool.id} className="hover:bg-white/[0.01] transition-colors">
                           <td className="px-8 py-6 font-bold text-white italic">{pool.month}/{pool.year}</td>
                           <td className="px-8 py-6 font-bold text-white">${(pool.totalAmountCents / 100).toLocaleString()}</td>
                           <td className="px-8 py-6 text-green-400 font-bold">${(pool.totalAmountCents / 100 * 0.975).toLocaleString()}</td>
                           <td className="px-8 py-6">
                              <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-widest italic">Finalized</span>
                           </td>
                           <td className="px-8 py-6">
                              <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2">
                                 View Report <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </section>

      {/* FORENSIC LINK */}
      <div className="p-12 rounded-[3rem] border border-dashed border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-red-500/20 transition-all">
         <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-red-500/5 flex items-center justify-center text-red-500/40 group-hover:text-red-500 transition-colors">
               <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-2">
               <h4 className="text-xl font-bold italic uppercase tracking-tighter">Anti-Fraud Reconciliation</h4>
               <p className="text-sm text-gray-500 font-medium leading-relaxed italic max-w-md">
                  Verify that all distributions match the forensic exclusion list. $14,200 in bot-related assets currently held in escrow.
               </p>
            </div>
         </div>
         <Link href="/admin/fraud" className="px-10 py-5 bg-white text-black rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-2xl">
            Open Integrity Audit
         </Link>
      </div>

    </div>
  );
}
