'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, Play, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DiscoveryFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscovery = async () => {
      try {
        const res = await fetch('/api/network/discovery');
        const data = await res.json();
        if (data.success) setItems(data.items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscovery();
  }, []);

  if (loading) return (
    <div className="py-20 text-center animate-pulse text-[10px] font-bold text-gray-700 uppercase tracking-widest">
       Calculating Network Velocity...
    </div>
  );

  return (
    <div className="space-y-12">
       <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <div className="flex items-center space-x-3 text-purple-400">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Network Intelligence</span>
             </div>
             <h3 className="text-3xl font-black italic tracking-tighter uppercase">Global Discovery.</h3>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             Trending Phase 4 Protocol Active
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* TRENDING ARTISTS */}
          <div className="lg:col-span-4 space-y-8">
             <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] border-b border-white/5 pb-4">Rising Trajectory</h4>
             <div className="space-y-4">
                {items.filter(i => i.type === 'artist').map((artist, idx) => (
                   <Link 
                     key={artist.id}
                     href={`/${artist.slug}`}
                     className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-[#A855F7]/30 transition-all group"
                   >
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                         <img src={artist.profileImageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="font-bold text-white text-sm truncate">{artist.name}</p>
                         <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">+{artist.growth}% Velocity</p>
                      </div>
                      <div className="text-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity">
                         <ArrowRight className="w-4 h-4" />
                      </div>
                   </Link>
                ))}
             </div>
          </div>

          {/* ACTIVE INITIATIVES */}
          <div className="lg:col-span-8 space-y-8">
             <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] border-b border-white/5 pb-4">Network Initiatives</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.filter(i => i.type === 'opportunity').map((opp) => (
                   <div key={opp.id} className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-6 hover:border-white/10 transition-all relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                         <Zap className="w-20 h-20" />
                      </div>
                      <div className="flex justify-between items-start">
                         <span className="px-2 py-1 rounded bg-[#A855F71a] text-[#A855F7] text-[8px] font-black uppercase tracking-widest border border-[#A855F71a]">{opp.category}</span>
                         <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{opp.deadline}</span>
                      </div>
                      <div className="space-y-2">
                         <h5 className="text-xl font-bold italic uppercase tracking-tighter text-white leading-none">{opp.title}</h5>
                         <p className="text-xs text-zinc-500 line-clamp-2 italic">"{opp.description}"</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                         <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{opp.reward}</p>
                         <Link href="/network/board" className="text-[9px] font-bold text-white uppercase tracking-widest hover:text-[#A855F7] transition-colors">View Initiative →</Link>
                      </div>
                   </div>
                ))}
             </div>
          </div>

       </div>
    </div>
  );
}
