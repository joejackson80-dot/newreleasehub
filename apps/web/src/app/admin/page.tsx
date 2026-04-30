import React from 'react';
import { Gavel, ShieldAlert, DollarSign, Users, BarChart3, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminOverviewPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 md:p-20 space-y-16">
      <header className="space-y-4">
         <div className="flex items-center space-x-3">
            <Gavel className="w-6 h-6 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500/80">Network Governance</span>
         </div>
         <h1 className="text-5xl font-bold tracking-tighter italic uppercase text-white">NRH Central Command.</h1>
         <p className="text-gray-500 text-sm font-medium">Internal tools for network integrity, royalty auditing, and global ecosystem health.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         
         {/* FRAUD DETECTION */}
         <Link href="/admin/fraud" className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] space-y-8 hover:border-red-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
               <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-4">
               <h2 className="text-2xl font-bold uppercase italic tracking-tight text-white">Fraud & Integrity</h2>
               <p className="text-gray-500 text-xs font-medium leading-relaxed">
                  Monitor anomalous stream patterns, detect bot activity, and manage DMCA takedown requests.
               </p>
            </div>
            <div className="flex items-center space-x-3 text-red-400 font-bold text-[10px] uppercase tracking-widest">
               <span>Audit Dashboard</span>
               <ArrowRight className="w-4 h-4" />
            </div>
         </Link>

         {/* ROYALTIES */}
         <Link href="/admin/royalties" className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] space-y-8 hover:border-green-500/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
               <DollarSign className="w-7 h-7" />
            </div>
            <div className="space-y-4">
               <h2 className="text-2xl font-bold uppercase italic tracking-tight text-white">Royalty Ledger</h2>
               <p className="text-gray-500 text-xs font-medium leading-relaxed">
                  Oversee the global network treasury, process mass payouts, and audit institutional distributions.
               </p>
            </div>
            <div className="flex items-center space-x-3 text-green-400 font-bold text-[10px] uppercase tracking-widest">
               <span>Open Ledger</span>
               <ArrowRight className="w-4 h-4" />
            </div>
         </Link>

         {/* USER MANAGEMENT */}
         <div className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] space-y-8 hover:border-blue-500/40 transition-all cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
               <Users className="w-7 h-7" />
            </div>
            <div className="space-y-4">
               <h2 className="text-2xl font-bold uppercase italic tracking-tight text-white">Ecosystem Base</h2>
               <p className="text-gray-500 text-xs font-medium leading-relaxed">
                  Manage all network accounts, verify artist credentials, and oversee label institutional access.
               </p>
            </div>
            <div className="flex items-center space-x-3 text-blue-400 font-bold text-[10px] uppercase tracking-widest">
               <span>Account Matrix</span>
               <ArrowRight className="w-4 h-4" />
            </div>
         </div>

      </div>

      {/* GLOBAL STATS */}
      <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12">
         <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-bold uppercase italic tracking-tight">Global Network Pulse</h3>
            <div className="flex items-center space-x-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em]">Live Status</span>
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Verified Artists</p>
               <p className="text-3xl font-black italic">1,429</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Active Listeners</p>
               <p className="text-3xl font-black italic">84.2K</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Masters Protected</p>
               <p className="text-3xl font-black italic">24,500</p>
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Ledger Velocity</p>
               <p className="text-3xl font-black italic text-[#00D2FF]">$1.2M</p>
            </div>
         </div>
      </section>
    </div>
  );
}
