'use client';
import React, { useState } from 'react';
import { Briefcase, ArrowLeft, Plus, Music, DollarSign, Users, Mic, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';
import { createOpportunity } from '@/app/actions/opportunity';
import { useRouter } from 'next/navigation';

export default function NewOpportunityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createOpportunity(formData);

    if (res.success) {
      router.push('/studio/opportunities');
    } else {
      setError(res.error || 'Failed to create opportunity');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-8 sm:p-12 max-w-4xl mx-auto space-y-12">
      <header className="space-y-6">
        <Link href="/studio/opportunities" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
           <ArrowLeft className="w-4 h-4" />
           Back to Opportunities
        </Link>
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-[#A855F7]">
              <Plus className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Initialize Initiative</span>
           </div>
           <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              Post<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Opportunity.</span>
           </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
            <p className="text-rose-500 text-xs font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {/* TITLE */}
           <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Opportunity Title</label>
              <input 
                name="title"
                required
                placeholder="e.g., SYNC: Indie Pop Track for Luxury Brand"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-[#A855F7]/50 transition-all shadow-inner"
              />
           </div>

           {/* TYPE */}
           <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Classification</label>
              <select 
                name="type"
                required
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-[#A855F7]/50 transition-all shadow-inner appearance-none"
              >
                 <option value="SYNC">SYNC PLACEMENT</option>
                 <option value="GRANT">FINANCIAL GRANT</option>
                 <option value="COLLAB">PAID COLLABORATION</option>
                 <option value="GIG">PERFORMANCE GIG</option>
                 <option value="PROPOSAL">GOVERNANCE PROPOSAL</option>
              </select>
           </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-4">
           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Initiative Description</label>
           <textarea 
             name="description"
             required
             placeholder="Provide detailed requirements, technical specs, and expectations for applicants..."
             className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-sm text-white focus:outline-none focus:border-[#A855F7]/50 transition-all h-48 resize-none shadow-inner"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {/* BUDGET */}
           <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Budget / Reward</label>
              <input 
                name="budget"
                placeholder="e.g., $1,500 + ROYALTY"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-[#A855F7]/50 transition-all shadow-inner"
              />
           </div>

           {/* DEADLINE */}
           <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol Deadline</label>
              <input 
                name="deadline"
                type="date"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-[#A855F7]/50 transition-all shadow-inner"
              />
           </div>

           {/* GENRES */}
           <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Genre Targets (CSV)</label>
              <input 
                name="genres"
                placeholder="e.g., INDIE, LO-FI, POP"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-[#A855F7]/50 transition-all shadow-inner"
              />
           </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#A855F7]">
                 <Globe className="w-6 h-6" />
              </div>
              <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest max-w-[200px]">
                 This posting will be broadcasted to the entire NRH Professional Network.
              </p>
           </div>
           <button 
             type="submit"
             disabled={isSubmitting}
             className="w-full sm:w-auto px-16 py-6 rounded-full bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] disabled:opacity-50"
           >
              {isSubmitting ? 'Syncing Network...' : 'Broadcast Opportunity'}
           </button>
        </div>
      </form>
    </div>
  );
}
