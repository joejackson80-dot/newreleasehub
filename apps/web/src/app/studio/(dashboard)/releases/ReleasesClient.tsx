'use client';
import React, { useState } from 'react';
import { Disc, Plus, MoreHorizontal, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import UploadReleaseModal from '@/components/studio/UploadReleaseModal';

export default function ReleasesClient({ org }: { org: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 md:p-12 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Releases</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage your discography and master rights.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F1F5F9] text-white px-6 py-3 rounded-xl flex items-center gap-2 w-full md:w-auto justify-center font-bold text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Release</span>
        </button>
      </header>

      <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-[#161616] border-b border-white/5">
            <tr>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Release</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Plays</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {org.Releases.map((release: any) => (
              <tr key={release.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6 flex items-center gap-5">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-inner relative group-hover:border-[#F1F5F9]/30 transition-colors">
                    {release.coverArtUrl ? (
                      <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F1F5F9]/5"><Disc className="w-6 h-6 text-[#F1F5F9]/50" /></div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-[#F1F5F9] transition-colors">{release.title}</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">ID: {release.id.slice(0, 8)}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md border border-white/5">{release.type}</span>
                </td>
                <td className="px-8 py-6 text-center">
                   <p className="text-sm font-bold text-white italic">{release.totalPlays?.toLocaleString() || 0}</p>
                </td>
                <td className="px-8 py-6">
                  {release.isScheduled ? (
                    <span className="px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[9px] font-bold uppercase tracking-widest border border-yellow-500/20">Scheduled</span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-bold uppercase tracking-widest border border-green-500/20 flex items-center w-fit gap-1.5">
                       <Zap className="w-3 h-3" />
                       Live
                    </span>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/5 hover:border-white/10">
                     <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {org.Releases.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-gray-600 text-sm italic">
                   No releases found in your discography.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* OWNERSHIP BADGE */}
      <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 flex items-center justify-between">
         <div className="flex items-center space-x-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 text-[#F1F5F9] flex items-center justify-center">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
               <p className="text-xs font-bold text-white uppercase tracking-widest">Network Integrity Verified</p>
               <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-widest">You retain 100% ownership of all uploaded master recordings.</p>
            </div>
         </div>
         <Link href="/press" className="text-[10px] font-bold text-gray-500 hover:text-[#F1F5F9] transition-colors uppercase tracking-widest">Learn about IP →</Link>
      </div>

      <UploadReleaseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isVerified={org.isVerified}
      />
    </div>
  );
}


