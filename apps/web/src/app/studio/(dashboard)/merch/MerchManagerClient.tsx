'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Package, ShieldCheck, Lock, 
  Trash2, Edit, Loader2, DollarSign, 
  Tag, AlertCircle, Image as ImageIcon,
  Zap, Users, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MerchManagerClient({ org }: { org: any }) {
  const [merch, setMerch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCents: 2500,
    imageUrl: '',
    stockCount: 100,
    isLiveDrop: false,
    isSupporterOnly: false,
    minFanLevel: 1
  });

  useEffect(() => {
    fetchMerch();
  }, []);

  const fetchMerch = async () => {
    try {
      const res = await fetch(`/api/merch?orgId=${org.id}`);
      const data = await res.json();
      setMerch(data);
    } catch (e) {
      toast.error('Failed to sync inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/merch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, organizationId: org.id })
      });
      if (res.ok) {
        toast.success('Asset Secured');
        setShowAddModal(false);
        fetchMerch();
      }
    } catch (e) {
      toast.error('Network Settlement Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-16 max-w-6xl">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-8">
            <div className="flex items-center space-x-3 text-[#F1F5F9]">
               <Package className="w-5 h-5" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Asset Logistics Terminal</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">Merch<br />Inventory.</h1>
         </div>
         <button 
           onClick={() => setShowAddModal(true)}
           className="px-8 py-4 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#F1F5F9] hover:text-white transition-all shadow-2xl flex items-center gap-2"
         >
            <Plus className="w-4 h-4" /> Initialize New Drop
         </button>
      </header>

      {/* INVENTORY GRID */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="w-12 h-12 text-[#F1F5F9] animate-spin" />
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">Syncing Network Inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {merch.map((item) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 space-y-8 group hover:border-white/20 transition-all relative overflow-hidden"
             >
                <div className="aspect-square bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 relative">
                   {item.imageUrl ? (
                     <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <ImageIcon className="w-12 h-12" />
                     </div>
                   )}
                   
                   {/* GATING BADGES */}
                   <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.isSupporterOnly && (
                        <div className="bg-purple-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                           <ShieldCheck className="w-3 h-3" /> Supporter Only
                        </div>
                      )}
                      {item.minFanLevel > 1 && (
                        <div className="bg-[#F1F5F9] text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                           <Star className="w-3 h-3" /> LVL {item.minFanLevel}+
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{item.title}</h3>
                         <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">${(item.priceCents / 100).toFixed(2)} — {item.stockCount} Units</p>
                      </div>
                      <div className="flex gap-2">
                         <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <Edit className="w-3.5 h-3.5 text-gray-500" />
                         </button>
                      </div>
                   </div>
                   <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed italic">"{item.description}"</p>
                </div>
             </motion.div>
           ))}

           {merch.length === 0 && (
             <div className="col-span-full py-32 border border-dashed border-white/5 rounded-[3rem] text-center space-y-6">
                <Package className="w-16 h-16 text-white/5 mx-auto" />
                <div className="space-y-2">
                   <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">Zero Institutional Assets Detected</p>
                   <button onClick={() => setShowAddModal(true)} className="text-[#F1F5F9] text-[10px] font-bold uppercase tracking-widest hover:underline">Initialize First Product</button>
                </div>
             </div>
           )}
        </div>
      )}

      {/* ADD MODAL */}
      <AnimatePresence>
         {showAddModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] w-full max-w-2xl p-12 relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto"
              >
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Initialize Asset.</h2>
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol-Gated Merchandise Drop</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="md:col-span-2 space-y-3">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Asset Title</label>
                          <input 
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-medium focus:border-[#F1F5F9]/40 focus:outline-none transition-all"
                            placeholder="Institutional Hoodie v1"
                          />
                       </div>

                       <div className="md:col-span-2 space-y-3">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Description</label>
                          <textarea 
                            required
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-medium focus:border-[#F1F5F9]/40 focus:outline-none transition-all h-24"
                            placeholder="High-fidelity master recording commemorative apparel."
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Price (Cents)</label>
                          <input 
                            type="number"
                            value={formData.priceCents}
                            onChange={e => setFormData({...formData, priceCents: parseInt(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-medium focus:border-[#F1F5F9]/40 focus:outline-none transition-all"
                          />
                       </div>

                       <div className="space-y-3">
                          <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-1">Initial Stock</label>
                          <input 
                            type="number"
                            value={formData.stockCount}
                            onChange={e => setFormData({...formData, stockCount: parseInt(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-medium focus:border-[#F1F5F9]/40 focus:outline-none transition-all"
                          />
                       </div>

                       <div className="md:col-span-2 space-y-6 pt-4">
                          <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest border-b border-white/5 pb-2">Reputation Gating</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <label className="flex items-center gap-4 cursor-pointer group">
                                <input 
                                  type="checkbox"
                                  checked={formData.isSupporterOnly}
                                  onChange={e => setFormData({...formData, isSupporterOnly: e.target.checked})}
                                  className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 checked:bg-[#F1F5F9] transition-all"
                                />
                                <div className="space-y-1">
                                   <p className="text-xs font-bold text-white uppercase italic">Supporter Only</p>
                                   <p className="text-[9px] text-gray-600 uppercase font-medium">Requires active Support Share</p>
                                </div>
                             </label>

                             <div className="space-y-3">
                                <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Min Fan Level</label>
                                <select 
                                  value={formData.minFanLevel}
                                  onChange={e => setFormData({...formData, minFanLevel: parseInt(e.target.value)})}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-xs font-bold focus:border-[#F1F5F9]/40 focus:outline-none transition-all"
                                >
                                   {[1, 5, 10, 20, 50].map(lvl => (
                                     <option key={lvl} value={lvl} className="bg-[#0A0A0A]">Level {lvl}+</option>
                                   ))}
                                </select>
                             </div>
                          </div>
                       </div>

                       <button 
                         type="submit"
                         disabled={isSubmitting}
                         className="md:col-span-2 py-6 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.3em] hover:bg-[#F1F5F9] hover:text-white transition-all shadow-2xl mt-4 flex items-center justify-center gap-3"
                       >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                          Finalize Drop Protocol
                       </button>
                    </form>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
}
