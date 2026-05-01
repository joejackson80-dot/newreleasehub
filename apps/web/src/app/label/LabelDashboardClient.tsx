'use client';
import React from 'react';
import { Building2, Users, Disc, TrendingUp, DollarSign, ShieldCheck, Briefcase, Search, Plus } from 'lucide-react';
import Link from 'next/link';

export default function LabelDashboardClient({ labelOrg }: { labelOrg: any }) {
  const managedArtists = [
    { id: '1', name: 'Marcus Webb', status: 'Active', streams: '2.4M', earnings: '$14,200', equity: '84.2' },
    { id: '2', name: 'Lena Khari', status: 'Active', streams: '1.8M', earnings: '$9,400', equity: '79.5' },
    { id: '3', name: 'DJ Solarize', status: 'Review', streams: '840K', earnings: '$3,100', equity: '62.1' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 md:p-12 space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center space-x-3 mb-2">
              <div className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-[8px] font-bold uppercase tracking-widest border border-purple-500/30">Institutional Portal</div>
           </div>
           <h1 className="text-4xl font-bold tracking-tighter italic uppercase text-white">{labelOrg.name} Dashboard.</h1>
           <p className="text-sm text-gray-500 font-medium mt-1">Multi-artist portfolio management and institutional distribution.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button className="flex-1 md:flex-none px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Briefcase className="w-4 h-4" />
              Manage Grants
           </button>
           <button className="flex-1 md:flex-none px-6 py-3 bg-purple-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20">
              <Plus className="w-4 h-4" />
              Onboard Artist
           </button>
        </div>
      </header>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Managed Artists', val: '12', icon: Users, color: 'text-purple-400' },
           { label: 'Portfolio Streams', val: '14.8M', icon: Disc, color: 'text-blue-400' },
           { label: 'Active Catalog', val: '242 Masters', icon: ShieldCheck, color: 'text-green-400' },
           { label: 'Institutional Balance', val: '$42,500', icon: DollarSign, color: 'text-amber-400' },
         ].map((stat, i) => (
           <div key={i} className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-4">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                 <stat.icon className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
                 <p className="text-2xl font-black italic mt-1 text-white">{stat.val}</p>
              </div>
           </div>
         ))}
      </div>

      {/* ARTIST PORTFOLIO */}
      <section className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white uppercase italic tracking-tight">Artist Portfolio</h2>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
               <input 
                 type="text" 
                 placeholder="Search Artists..." 
                 className="bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-purple-500/50 w-48 transition-all"
               />
            </div>
         </div>

         <div className="bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-[#161616] border-b border-white/5">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Artist</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Equity Score</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Earnings (MTD)</th>
                     <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {managedArtists.map(artist => (
                    <tr key={artist.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center font-bold text-xs text-gray-500 uppercase">
                                {artist.name.charAt(0)}
                             </div>
                             <div>
                                <p className="font-bold text-white group-hover:text-purple-400 transition-colors">{artist.name}</p>
                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Global ID: #{artist.id}429</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${artist.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                             {artist.status}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <p className="text-sm font-bold text-white italic">{artist.equity}</p>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <p className="text-sm font-bold text-[#A855F7] italic">{artist.earnings}</p>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/10 transition-all">
                             Manage Studio
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>

      {/* FOOTER ACTION */}
      <div className="pt-12 text-center">
         <Link href="/studio" className="text-[10px] font-bold text-gray-700 hover:text-white transition-colors uppercase tracking-[0.3em]">
            Switch to Individual Studio Access
         </Link>
      </div>
    </div>
  );
}
