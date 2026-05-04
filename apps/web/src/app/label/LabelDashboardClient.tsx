'use client';
import React from 'react';
import { 
  Building2, Users, Disc, TrendingUp, DollarSign, 
  ShieldCheck, Briefcase, Search, Plus, 
  ChevronRight, ArrowUpRight, BarChart3, Globe 
} from 'lucide-react';
import Link from 'next/link';

export default function LabelDashboardClient({ labelOrg, roster = [], kpis }: { labelOrg: any, roster?: any[], kpis?: any }) {
  const displayRoster = roster;
  const displayKpis = kpis || {
    capacity: displayRoster.length,
    streams: '0',
    valuation: '$0',
    assets: 0
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
      
      <header className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Institutional Portal</span>
            <span className="px-2 py-0.5 bg-white/5 text-gray-500 rounded text-[9px] font-black uppercase tracking-widest border border-white/10 italic">L-SEC Verified</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
            {labelOrg.name}<span className="text-emerald-500">.</span>
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-3 opacity-60">Executive Command & Roster Governance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            Audit Ledger
          </button>
          <button className="px-6 py-4 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2 shadow-2xl shadow-emerald-500/20">
            <Plus className="w-4 h-4" />
            Acquire Artist
          </button>
        </div>
      </header>

      {/* INSTITUTIONAL KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Roster Capacity', val: displayKpis.capacity, sub: 'Active Artists', icon: Users, color: 'text-emerald-400' },
          { label: 'Aggregate Streams', val: displayKpis.streams, sub: 'Total Portfolio Streams', icon: Globe, color: 'text-emerald-400' },
          { label: 'Catalog Valuation', val: displayKpis.valuation, sub: 'Projected Annual Revenue', icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Managed Assets', val: displayKpis.assets, sub: 'Verified Masters', icon: Disc, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] p-8 relative group hover:border-emerald-500/30 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-12 h-12" />
            </div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black italic tracking-tighter mb-1">{stat.val}</h3>
            <p className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ROSTER TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase italic tracking-widest text-emerald-500/80">Active Portfolio</h2>
            <Link href="/label/roster" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-1">
              View Full Index <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Identity</th>
                  <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">Status</th>
                  <th className="px-8 py-6 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] text-right">Performance</th>
                </tr>
              </thead>
              <tbody>
                {displayRoster.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-16 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                      No artists registered to this label.
                    </td>
                  </tr>
                ) : (
                  displayRoster.map((artist: any) => (
                    <tr key={artist.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 cursor-pointer">
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-xs text-emerald-500/40">
                            {artist.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-sm uppercase italic group-hover:text-emerald-400 transition-colors">{artist.name}</p>
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">UID: #{artist.id}0xNRH</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-center">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">
                          {artist.status}
                        </span>
                      </td>
                      <td className="px-8 py-7 text-right">
                        <p className="text-sm font-black italic">{artist.earnings}</p>
                        <p className="text-[9px] font-bold text-emerald-500 flex items-center justify-end gap-1 uppercase">
                          {artist.growth} <TrendingUp className="w-2.5 h-2.5" />
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDEBAR: REVENUE ANALYTICS */}
        <div className="space-y-8">
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden">
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">Revenue Distribution</h2>
              <div className="space-y-4">
                {[
                  { label: 'Roster Royalties', val: '72%', color: 'bg-emerald-500' },
                  { label: 'Label Commission', val: '20%', color: 'bg-white' },
                  { label: 'NRH Infrastructure', val: '8%', color: 'bg-gray-700' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-400">{item.label}</span>
                      <span>{item.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">Market Trends</h2>
              <div className="space-y-4">
                {[
                  { tag: 'Hyperpop', trend: '+42%', color: 'text-emerald-400' },
                  { tag: 'Phonk', trend: '+18%', color: 'text-emerald-400' },
                  { tag: 'Liquid D&B', trend: '-4%', color: 'text-red-400' },
                ].map((trend, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest">{trend.tag}</span>
                    <span className={`text-[10px] font-black ${trend.color}`}>{trend.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">© 2026 NRH Institutional Group — Secured by IPHub Forensic Anti-Fraud</p>
        <Link href="/studio" className="text-[9px] font-black text-emerald-500 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center gap-2">
          Switch to Artist Studio Mode <ArrowUpRight className="w-3 h-3" />
        </Link>
      </footer>
    </div>
  );
}

