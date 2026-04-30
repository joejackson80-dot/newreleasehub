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
      window.location.href = '/studio';
    } else {
      toast.error(res.error || 'Provisioning failed.');
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans selection:bg-purple-500 selection:text-white">
      <div className="p-8 flex justify-between items-center relative z-10">
         <Link href="/register" className="flex items-center space-x-3 text-gray-500 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Back</span>
         </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="max-w-md w-full space-y-12 relative z-10">
            <div className="text-center space-y-4">
               <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mx-auto border border-purple-500/20">
                  <Building2 className="w-8 h-8" />
               </div>
               <h1 className="text-4xl font-bold tracking-tighter italic uppercase text-white">Institutional Access</h1>
               <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">NRH Label & Agency Onboarding</p>
            </div>

            <form action={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Company Email</label>
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" 
                    placeholder="legal@labelname.com"
                  />
               </div>
               
               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Label Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" 
                    placeholder="e.g. Astral Records"
                  />
               </div>

               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Network Handle</label>
                  <input 
                    name="slug"
                    type="text" 
                    required
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" 
                    placeholder="astral-records"
                  />
               </div>

               <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Administrative Password</label>
                  <input 
                    name="password"
                    type="password" 
                    required
                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors" 
                    placeholder="••••••••"
                  />
               </div>

               <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-500 hover:text-white transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50"
               >
                  <span>{loading ? 'Provisioning...' : 'Provision Label Account'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
               </button>
            </form>

            <div className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-6 flex items-start space-x-4">
               <ShieldCheck className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
               <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                  By joining as a Label, you agree to the NRH Institutional Terms of Service. Label accounts have elevated governance weights and automated royalty distribution tools.
               </p>
            </div>
          </div>
      </div>
    </div>
  );
}
