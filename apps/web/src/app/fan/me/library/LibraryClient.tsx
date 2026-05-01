'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Disc, Play, BarChart3, Download, Share2, Award, History, TrendingUp, Music, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';

const MOCK_LIBRARY = [
  {
    id: '1',
    title: 'Worth It (feat. Nova Rae)',
    artist: 'Marcus Webb',
    tier: 'True Fan',
    participation: 0.5, // 0.5%
    yieldToDate: 42.50,
    velocity: 'High',
    img: '/images/default-avatar.png',
    type: 'Single'
  },
  {
    id: '2',
    title: 'Midnight Echoes',
    artist: 'Marcus Webb',
    tier: 'Day One',
    participation: 0.1,
    yieldToDate: 12.10,
    velocity: 'Stable',
    img: '/images/default-cover.png',
    type: 'EP'
  },
  {
    id: '3',
    title: 'Solar Frequencies',
    artist: 'DJ Solarize',
    tier: 'Inner Circle',
    participation: 1.0,
    yieldToDate: 85.00,
    velocity: 'Rising',
    img: '/images/default-avatar.png',
    type: 'Album'
  }
];

export default function FanLibraryClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('Active');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#A855F7] pt-12 pb-32">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-4 md:px-10 space-y-12 pt-12">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-[#A855F7]">
                  <Disc className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Digital Asset Library</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none italic uppercase">
                  My Master<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Stakes.</span>
               </h1>
            </div>
            <div className="flex items-center bg-[#111] p-1.5 rounded-2xl border border-white/5">
               <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#A855F7] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                  <LayoutGrid className="w-4 h-4" />
               </button>
               <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#A855F7] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                  <List className="w-4 h-4" />
               </button>
            </div>
         </div>
      </header>

      {/* ASSETS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mt-20">
         {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {MOCK_LIBRARY.map((asset) => (
                  <div key={asset.id} className="bg-[#111] border border-white/5 rounded-[3rem] p-10 space-y-10 hover:border-white/20 transition-all group relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Award className="w-24 h-24 text-[#A855F7]" />
                     </div>
                     <div className="space-y-6 relative z-10">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                           <img src={asset.img} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                              <Play className="w-8 h-8 text-white fill-white" />
                           </div>
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-2xl font-bold italic tracking-tighter uppercase truncate">{asset.title}</h3>
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{asset.artist} • {asset.type}</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6 relative z-10 border-t border-white/5 pt-10">
                        <div className="space-y-1">
                           <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Your Participation</p>
                           <p className="text-xl font-bold italic tracking-tighter text-[#A855F7]">{asset.participation}%</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Yield to Date</p>
                           <p className="text-xl font-bold italic tracking-tighter text-green-500">${asset.yieldToDate.toFixed(2)}</p>
                        </div>
                     </div>

                     <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                           <span className="text-gray-500">Network Velocity</span>
                           <span className={asset.velocity === 'High' ? 'text-green-500' : 'text-amber-500'}>{asset.velocity}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: asset.velocity === 'High' ? '90%' : '60%' }}
                              className="h-full bg-gradient-to-r from-[#A855F7] to-purple-500 rounded-full"
                           />
                        </div>
                     </div>

                     <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all relative z-10">
                        View License Details
                     </button>
                  </div>
               ))}
            </div>
         ) : (
            <div className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
               <div className="divide-y divide-white/5">
                  {MOCK_LIBRARY.map((asset) => (
                     <div key={asset.id} className="p-8 flex flex-col md:flex-row items-center justify-between hover:bg-white/[0.02] transition-colors gap-8">
                        <div className="flex items-center space-x-6 flex-1">
                           <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0">
                              <img src={asset.img} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <h3 className="text-lg font-bold italic uppercase tracking-tight">{asset.title}</h3>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{asset.artist} • {asset.type}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-12">
                           <div className="text-right">
                              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Participation</p>
                              <p className="text-lg font-bold italic text-[#A855F7]">{asset.participation}%</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Earnings</p>
                              <p className="text-lg font-bold italic text-green-500">${asset.yieldToDate.toFixed(2)}</p>
                           </div>
                           <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
                              <Download className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </section>

      {/* FOOTER INFO */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mt-20">
         <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <div className="flex items-center space-x-3 text-green-500">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Asset Security Guaranteed</span>
               </div>
               <h2 className="text-4xl font-bold uppercase tracking-tighter italic leading-tight">These are not just plays.<br />They are proof of ownership.</h2>
               <p className="text-gray-400 leading-relaxed font-medium text-lg">
                  Every asset in your library represents a legally binding Revenue Participation License. You are entitled to a direct share of all platform earnings generated by these tracks.
               </p>
               <div className="flex items-center space-x-6 pt-4">
                  <Link href="/privacy" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Legal Framework</Link>
                  <Link href="/contact" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Audit Support</Link>
               </div>
            </div>
            <div className="relative group">
               <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-[#A855F7]/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="relative bg-[#111] p-12 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">Asset Performance</div>
                  <div className="space-y-6">
                     <div className="flex justify-between items-end">
                        <p className="text-5xl font-bold italic text-white tracking-tighter">+$139.60</p>
                        <p className="text-green-500 text-xs font-bold flex items-center mb-1"><TrendingUp className="w-3 h-3 mr-1" /> +12.4%</p>
                     </div>
                     <p className="text-xs text-gray-500 font-medium">Total platform yield across 3 master stakes.</p>
                  </div>
                  <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Last Payout</p>
                        <p className="text-sm font-bold text-white">Oct 15, 2026</p>
                     </div>
                     <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Next Settlement</p>
                        <p className="text-sm font-bold text-[#A855F7]">Nov 01, 2026</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
}


