'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, ShieldCheck, Lock, 
  DollarSign, Loader2, Search,
  Zap, Star, Filter, ArrowRight, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function MerchStorefrontClient() {
  const [merch, setMerch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Fetching all merch for the network (we might want a specific API for this later)
    // For now, let's fetch some placeholders or use a mock if the global API isn't ready
    const fetchAllMerch = async () => {
      try {
        // In a real app, this would be a global endpoint
        // For this demo, let's assume we're showing products from a few top artists
        const res = await fetch('/api/merch?orgId=global'); // Assuming we handle this
        const data = await res.json();
        setMerch(data);
      } catch (e) {
        // Mock data if API fails
        setMerch([
          { id: '1', title: 'Institutional Hoodie v1', priceCents: 6500, description: 'Commemorative high-fidelity drop.', imageUrl: '/images/default-cover.png', isLocked: true, lockReason: 'FAN LEVEL 10 REQUIRED', isSupporterOnly: false, minFanLevel: 10, Organization: { name: 'Marcus Webb' } },
          { id: '2', title: 'Vault Access Key (Physical)', priceCents: 2500, description: 'Limited edition support asset.', imageUrl: '/images/default-cover.png', isLocked: true, lockReason: 'SUPPORTER ONLY', isSupporterOnly: true, minFanLevel: 1, Organization: { name: 'Lena Khari' } },
          { id: '3', title: 'Network Cap', priceCents: 3500, description: 'Official NRH Professional Network apparel.', imageUrl: '/images/default-cover.png', isLocked: false, lockReason: '', isSupporterOnly: false, minFanLevel: 1, Organization: { name: 'Institutional' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMerch();
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-48 pb-40 px-10">
      <div className="max-w-7xl mx-auto space-y-20">
         
         {/* HEADER */}
         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-6">
               <div className="flex items-center space-x-3 text-amber-500">
                  <Package className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Logistics & Drops</span>
               </div>
               <h1 className="text-[clamp(2.5rem,9vw,5.5rem)] font-black tracking-tighter uppercase italic leading-[0.8]">
                  Network<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Assets.</span>
               </h1>
               <p className="text-gray-500 max-w-xl font-medium italic">
                 Acquire institutional merchandise, limited drops, and reputation-gated assets from the NRH Professional Network.
               </p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="bg-[#111] border border-white/5 p-6 rounded-3xl space-y-1">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-right">Active Drops</p>
                  <p className="text-2xl font-black italic text-amber-500">24 Active</p>
               </div>
            </div>
         </header>

         {/* SEARCH BAR */}
         <div className="relative group max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-amber-500 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH ASSET CATALOG..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-3xl py-6 pl-16 pr-8 text-xs font-bold uppercase tracking-[0.2em] focus:outline-none focus:border-amber-500/30 transition-all shadow-2xl"
            />
         </div>

         {/* STOREFRONT GRID */}
         {loading ? (
           <div className="py-40 flex flex-col items-center justify-center space-y-6">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em] animate-pulse">Syncing Network Logistics...</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {merch.map((item, i) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-10 hover:border-amber-500/30 transition-all shadow-2xl relative overflow-hidden"
                >
                   <div className="aspect-square bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 relative">
                      {item.imageUrl && <img src={item.imageUrl} className={`w-full h-full object-cover transition-all duration-700 ${item.isLocked ? 'blur-md opacity-30 grayscale' : 'group-hover:scale-110'}`} />}
                      
                      {item.isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                           <div className="w-16 h-16 rounded-3xl bg-black/60 border border-white/10 flex items-center justify-center backdrop-blur-md">
                              <Lock className="w-8 h-8 text-amber-500" />
                           </div>
                           <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] bg-black/60 px-4 py-2 rounded-full border border-amber-500/20 backdrop-blur-md">
                              {item.lockReason}
                           </p>
                        </div>
                      )}

                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                         {item.isSupporterOnly && (
                           <div className="bg-purple-500/80 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
                              <ShieldCheck className="w-3.5 h-3.5" /> Supporter Drop
                           </div>
                         )}
                         {item.minFanLevel > 1 && (
                           <div className="bg-amber-500/80 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md">
                              <Star className="w-3.5 h-3.5" /> Elite Access
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                            <Zap className="w-3 h-3" /> {item.Organization?.name}
                         </div>
                         <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-amber-500 transition-colors">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-500 font-medium italic leading-relaxed line-clamp-2">"{item.description}"</p>
                   </div>

                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="space-y-1">
                         <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Protocol Value</p>
                         <p className="text-2xl font-black italic text-white">${(item.priceCents / 100).toFixed(2)}</p>
                      </div>
                      <button 
                        disabled={item.isLocked}
                        className={`px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${item.isLocked ? 'bg-white/5 border border-white/5 text-gray-700 cursor-not-allowed' : 'bg-white text-black hover:bg-amber-500 hover:text-white shadow-2xl'}`}
                      >
                         {item.isLocked ? 'Access Revoked' : <><ShoppingBag className="w-4 h-4" /> Acquire Asset</>}
                      </button>
                   </div>
                </motion.div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
}
