'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, ArrowLeft, Building2 } from 'lucide-react';
import { registerArtist } from '@/app/actions/auth';
import toast from 'react-hot-toast';

export default function RegisterLabelPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const password = formData.get('password') as string;

    const res = await registerArtist({
      email,
      name,
      username: slug,
      password,
      planTier: 'ELITE'
    });
    
    setLoading(false);
    
    if (res.success) {
      toast.success('Label account provisioned successfully.');
      window.location.href = '/label';
    } else {
      toast.error(res.error || 'Provisioning failed.');
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      <div className="p-8 flex justify-between items-center relative z-10">
         <Link href="/register" className="flex items-center space-x-3 text-gray-500 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Exit</span>
         </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-md w-full space-y-12 relative z-10">
            <div className="text-center space-y-4">
               <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20">
                  <Building2 className="w-8 h-8" />
               </div>
               <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">Institutional<br/>Registration<span className="text-emerald-500">.</span></h1>
               <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">NRH Label & Agency Onboarding</p>
            </div>

            <form action={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Company Email</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-5 text-white text-sm font-bold placeholder:text-gray-800 focus:outline-none focus:border-emerald-500/50 transition-colors" 
                    placeholder="LEGAL@LABELNAME.COM"
                  />
               </div>
               
               <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Legal Entity Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-5 text-white text-sm font-bold placeholder:text-gray-800 focus:outline-none focus:border-emerald-500/50 transition-colors" 
                    placeholder="E.G. ASTRAL RECORDS"
                  />
               </div>

               <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Global Handle</label>
                  <input 
                    name="slug"
                    type="text" 
                    required
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-5 text-white text-sm font-bold placeholder:text-gray-800 focus:outline-none focus:border-emerald-500/50 transition-colors" 
                    placeholder="ASTRAL-RECORDS"
                  />
               </div>

               <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Administrative Secret</label>
                  <input 
                    name="password"
                    type="password" 
                    required
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-5 text-white text-sm font-bold placeholder:text-gray-800 focus:outline-none focus:border-emerald-500/50 transition-colors" 
                    placeholder="••••••••"
                  />
               </div>

               <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:brightness-110 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 shadow-2xl shadow-emerald-500/20"
               >
                  <span>{loading ? 'Provisioning...' : 'Provision Label Account'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
               </button>
            </form>

            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 flex items-start space-x-6">
               <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest opacity-60">
                  Label accounts have elevated governance weights and institutional-grade distribution tools. Verified by NRH Network Security.
               </p>
            </div>
          </div>
      </div>
    </div>
  );
}
