'use client';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import BrandLogo from '@/components/layout/BrandLogo';

export default function FanLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      window.location.href = '/fan/me';
    }
  };

  const handleOAuth = async (provider: 'google' | 'spotify') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans selection:bg-white selection:text-black">
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
      </div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
           <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Network</span>
           </Link>
           <div className="flex justify-center mb-6">
              <BrandLogo className="w-16 h-16" />
           </div>
           <h1 className="text-3xl font-bold tracking-tighter italic uppercase leading-none">Access<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Granted.</span></h1>
           <p className="text-xs text-gray-500 font-medium tracking-wide">Enter your credentials to enter the hub.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
           <div className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="SECRET PASSWORD" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
                <div className="flex justify-end px-2">
                  <Link href="/forgot-password?portal=fan" className="text-[10px] font-bold text-gray-600 hover:text-white transition-colors uppercase tracking-widest">Forgot Password?</Link>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? 'Verifying...' : 'Initialize Session'}</span>
                  {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
           </div>

           <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.3em]"><span className="bg-[#020202] px-4 text-gray-700">Protocol Bypass</span></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center space-x-3 bg-white/5 border border-white/5 rounded-xl py-4 hover:bg-white/10 transition-all group"
              >
                <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-white group-hover:text-black transition-colors">G</div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
              </button>
              <button 
                type="button"
                onClick={() => handleOAuth('spotify')}
                className="flex items-center justify-center space-x-3 bg-white/5 border border-white/5 rounded-xl py-4 hover:bg-white/10 transition-all group"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">S</div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Spotify</span>
              </button>
           </div>
        </form>

        <div className="text-center pt-8">
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              New to the hub? <Link href="/register" className="text-white hover:underline">Apply for Access</Link>
           </p>
        </div>
      </div>
    </div>
  );
}
