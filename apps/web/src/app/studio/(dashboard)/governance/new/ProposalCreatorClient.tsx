'use client';
import React, { useState } from 'react';
import { 
  Gavel, ShieldCheck, Clock, FileText, 
  ArrowRight, CheckCircle2, AlertTriangle, X,
  Zap, Info, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProposalCreatorClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'NETWORK_EXPANSION',
    duration: '7'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(formData.duration));

      const res = await fetch('/api/governance/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expiresAt: expiresAt.toISOString()
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
      } else {
        toast.error(data.error || 'Failed to submit proposal');
      }
    } catch (e) {
      toast.error('Network error during protocol registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-16 text-center space-y-10"
         >
            <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
               <ShieldCheck className="w-12 h-12" />
            </div>
            <div className="space-y-4">
               <h3 className="text-4xl font-black italic uppercase tracking-tighter">Proposal Live.</h3>
               <p className="text-zinc-500 font-medium italic">
                  Your initiative has been registered in the protocol ledger. The network consensus phase has begun.
               </p>
            </div>
            <button 
              onClick={() => router.push('/governance')}
              className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-2xl hover:scale-105 transition-all"
            >
               View on Governance Board
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 md:p-16 space-y-16">
      
      {/* HEADER */}
      <header className="max-w-4xl space-y-6">
         <div className="flex items-center gap-3 text-[#A855F7]">
            <Gavel className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Protocol Expansion Suite</span>
         </div>
         <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] font-black italic uppercase tracking-tighter leading-none">
            New<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Initiative.</span>
         </h1>
         <p className="text-zinc-500 font-medium italic max-w-xl">
            "Exercise your artist governance rights. Submit a proposal to the network and let the collective determine the protocol's evolution."
         </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
         {/* FORM */}
         <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Proposal Title</label>
                  <input 
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Expand Network Fee Rebates for Verified Artists"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-lg font-bold text-white focus:outline-none focus:border-[#A855F7]/40 transition-all"
                  />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                     <select 
                       value={formData.category}
                       onChange={e => setFormData({...formData, category: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xs font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-[#A855F7]/40"
                     >
                        <option value="NETWORK_EXPANSION">Network Expansion</option>
                        <option value="FEE_STRUCTURE">Fee Structure</option>
                        <option value="CURATION_LOGIC">Curation Logic</option>
                        <option value="GOVERNANCE_RULES">Governance Rules</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vote Duration</label>
                     <select 
                       value={formData.duration}
                       onChange={e => setFormData({...formData, duration: e.target.value})}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xs font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-[#A855F7]/40"
                     >
                        <option value="3">3 Days (Expedited)</option>
                        <option value="7">7 Days (Standard)</option>
                        <option value="14">14 Days (Extended)</option>
                        <option value="30">30 Days (Institutional)</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Technical Brief / Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the proposal, its institutional impact, and the expected yield distribution changes..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-sm text-zinc-300 focus:outline-none focus:border-[#A855F7]/40 transition-all h-64 resize-none"
                  />
               </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-[#A855F7] text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(168, 85, 247,0.2)] disabled:opacity-50"
            >
               {isSubmitting ? 'Registering Initiative...' : 'Submit to Protocol Board'}
            </button>
         </form>

         {/* GUIDELINES */}
         <div className="space-y-10 lg:pl-16 lg:border-l border-white/5">
            <div className="space-y-4">
               <h4 className="text-xl font-black italic uppercase tracking-tighter">Submission Guidelines.</h4>
               <p className="text-zinc-500 text-sm font-medium italic leading-relaxed">
                  Every proposal is Verifiedly audited before the consensus phase. Ensure your initiative aligns with the network's high-authority mission.
               </p>
            </div>

            <div className="space-y-6">
               {[
                 { title: 'Authority Weighting', desc: 'Votes are weighted by participant LVL and XP. Ensure your proposal appeals to high-authority fans.', icon: Zap },
                 { title: 'Protocol Integrity', desc: 'Proposals that threaten network stability or artist master ownership will be rejected.', icon: ShieldCheck },
                 { title: 'Yield Transparency', desc: 'Financial changes must include a clear yield participation model for both artists and fans.', icon: TrendingUp }
               ].map((g, i) => (
                 <div key={i} className="flex gap-6 p-8 bg-white/5 border border-white/5 rounded-[2.5rem]">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                       <g.icon className="w-5 h-5 text-[#A855F7]" />
                    </div>
                    <div className="space-y-2">
                       <h5 className="font-bold text-white uppercase italic tracking-tight">{g.title}</h5>
                       <p className="text-[10px] font-bold text-zinc-600 uppercase leading-relaxed tracking-widest">{g.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] flex items-start gap-4">
               <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
               <div className="space-y-2">
                  <h5 className="font-black italic text-amber-500 uppercase text-sm">Verified Disclosure</h5>
                  <p className="text-[9px] font-bold text-amber-500/80 uppercase leading-relaxed tracking-widest">
                     Once a proposal is live, it cannot be edited or retracted. Malicious or fraudulent proposals may result in protocol-wide suspension of the submitting entity.
                  </p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
