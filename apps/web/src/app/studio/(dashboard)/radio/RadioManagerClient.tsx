'use client';
import React, { useState } from 'react';
import { 
  Radio, Zap, BarChart3, ShieldCheck, 
  CheckCircle2, XCircle, MoreHorizontal, Disc 
} from 'lucide-react';

export default function RadioManagerClient({ org }: { org: any }) {
  const [releases, setReleases] = useState(org.Releases);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const toggleAuth = async (releaseId: string, currentState: boolean) => {
    setIsUpdating(releaseId);
    try {
      // In a real app, this would be a server action
      // For this demo, we'll simulate the update
      // await updateReleaseRadioAuth(releaseId, !currentState);
      
      setReleases((prev: any) => 
        prev.map((r: any) => 
          r.id === releaseId ? { ...r, authorizedForRadio: !currentState } : r
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  const totalPlays = releases.reduce((acc: number, r: any) => acc + (r.radioPlays || 0), 0);
  const estimatedEarnings = (totalPlays * 0.005).toFixed(2); // $0.005 per radio play

  return (
    <div className="p-8 md:p-12 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white uppercase italic">NRH Radio <span className="text-[#00D2FF]">Manager.</span></h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Control your airplay, track performance, and earn from every rotation.</p>
        </div>
        <div className="flex items-center gap-4">
           <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
             Authorize All
           </button>
           <button className="px-6 py-3 rounded-xl bg-[#00D2FF] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-[#00B8E0] transition-all shadow-lg">
             Radio Guidelines
           </button>
        </div>
      </header>

      {/* RADIO STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Radio Plays', value: totalPlays.toLocaleString(), icon: Radio, color: 'text-[#00D2FF]' },
          { label: 'Est. Radio Earnings', value: `$${estimatedEarnings}`, icon: Zap, color: 'text-yellow-500' },
          { label: 'Active in Rotation', value: releases.filter((r: any) => r.authorizedForRadio).length, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Network Reach', value: '142 Countries', icon: BarChart3, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111] border border-white/5 p-8 rounded-[2rem] space-y-4">
             <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
               <stat.icon className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* RELEASE TABLE */}
      <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#161616] border-b border-white/5">
            <tr>
              <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Release</th>
              <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Radio Plays</th>
              <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-10 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Radio Auth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {releases.map((release: any) => (
              <tr key={release.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-10 py-8 flex items-center gap-6">
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl overflow-hidden border border-white/5 shrink-0">
                    {release.coverArtUrl ? (
                      <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Disc className="w-6 h-6 text-gray-700" /></div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{release.title}</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">{release.type} &middot; {new Date(release.releaseDate).getFullYear()}</p>
                  </div>
                </td>
                <td className="px-10 py-8 text-center">
                   <p className="text-xl font-bold text-white italic">{release.radioPlays || 0}</p>
                   <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mt-1">Total Plays</p>
                </td>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                     {release.authorizedForRadio ? (
                       <span className="text-green-500 bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-2 border border-green-500/20">
                         <CheckCircle2 className="w-3.5 h-3.5" />
                         In Rotation
                       </span>
                     ) : (
                       <span className="text-gray-500 bg-white/5 px-3 py-1 rounded-full flex items-center gap-2 border border-white/5">
                         <XCircle className="w-3.5 h-3.5" />
                         Standby
                       </span>
                     )}
                   </div>
                </td>
                <td className="px-10 py-8 text-right">
                  <button 
                    onClick={() => toggleAuth(release.id, release.authorizedForRadio)}
                    disabled={isUpdating === release.id}
                    className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                      release.authorizedForRadio 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'
                        : 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white'
                    } disabled:opacity-50`}
                  >
                    {isUpdating === release.id ? 'Updating...' : release.authorizedForRadio ? 'Deauthorize' : 'Authorize'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMPLIANCE FOOTER */}
      <div className="bg-[#021220] border border-[#00D2FF]/20 rounded-[2.5rem] p-10 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center">
               <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
               <p className="text-sm font-bold text-white uppercase tracking-widest">Compliant Royalty Distribution</p>
               <p className="text-xs text-gray-500 font-medium mt-1">NRH Radio strictly follows Performance Complement rules for statutory licensing.</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Rate</p>
            <p className="text-2xl font-bold text-[#00D2FF] mt-1">$0.005 <span className="text-xs text-gray-600">/ play</span></p>
         </div>
      </div>
    </div>
  );
}


