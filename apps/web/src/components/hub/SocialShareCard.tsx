'use client';
import React from 'react';
import { Award, Zap, Globe, Share2, Download, CheckCircle2 } from 'lucide-react';

interface Props {
  artistName: string;
  fanId: string;
  bps: number;
  trackTitle: string;
}

export default function SocialShareCard({ artistName, fanId, bps, trackTitle }: Props) {
  return (
    <div className="bg-[#050505] border border-white/10 rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden shadow-2xl w-full max-w-sm mx-auto">
      {/* Background stylized element */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 blur-[100px]"></div>
      
      <div className="flex justify-between items-start relative z-10">
         <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
         </div>
         <div className="flex flex-col items-end">
            <div className="bg-white/5 px-3 py-1 rounded-full border border-white/5 mb-1">
               <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Network Verified</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400">ID: NRH-{Math.floor(Math.random()*10000)}</p>
         </div>
      </div>

      <div className="space-y-4 relative z-10">
         <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">Official Patron</h3>
         <h2 className="text-4xl font-bold tracking-tighter italic leading-none">
            {fanId.toUpperCase()}<br />
            <span className="text-white/40">SECURED PATRONAGE.</span>
         </h2>
      </div>

      <div className="pt-10 border-t border-white/5 space-y-6 relative z-10">
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Artist</span>
            <span className="text-sm font-bold text-white">{artistName}</span>
         </div>
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Asset</span>
            <span className="text-sm font-bold text-white">"{trackTitle}"</span>
         </div>
         <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Revenue Participation</span>
            <span className="text-xl font-bold text-[var(--color-gold)]">{(bps / 100).toFixed(2)}%</span>
         </div>
      </div>

      <div className="pt-10 flex items-center justify-between text-gray-700 relative z-10">
         <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-widest">NewReleaseHub.com</span>
         </div>
         <CheckCircle2 className="w-5 h-5 text-green-500/20" />
      </div>

      <div className="flex space-x-4 mt-6">
         <button className="flex-1 py-4 rounded-2xl bg-white text-black font-bold text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2">
            <Download className="w-3.5 h-3.5" />
            <span>Download Card</span>
         </button>
         <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
            <Share2 className="w-5 h-5 text-gray-500" />
         </button>
      </div>
    </div>
  );
}
