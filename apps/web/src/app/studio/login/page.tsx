'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ArtistLoginPage() {
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
      window.location.href = '/studio';
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
    <div className="min-h-screen bg-[var(--color-studio-base)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-accent-primary)]/10 via-[var(--color-studio-base)] to-[var(--color-studio-base)] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[var(--color-studio-surface)] border border-[var(--color-studio-border)] rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Return to Network</span>
           </Link>
           <div className="flex justify-center mb-10">
              <Link href="/" className="w-14 h-14 rounded-2xl bg-transparent text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl"><Image src="/images/nrh-logo.png" alt="NRH Logo" width={56} height={56} className="w-full h-full object-contain mix-blend-screen" /></Link>
           </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase italic tracking-tighter">Artist Studio</h1>
          <p className="text-[#A855F7] text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">Command Center Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER CREDENTIALS"
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold tracking-widest text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Secret Password</label>
              <Link href="/forgot-password?portal=artist" className="text-[10px] font-bold text-gray-500 hover:text-[#A855F7] transition-colors uppercase tracking-[0.2em]">Recovery</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>

          {error && (
            <div className="bg-[#ef44441a] border border-[#ef444433] text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-lg bg-[var(--color-accent-primary)] text-black font-bold text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Unlock Control Center'}</span>
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center space-x-4">
          <div className="flex-1 h-px bg-[var(--color-studio-border)]"></div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-[var(--color-studio-border)]"></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => handleOAuth('google')}
            className="w-full flex items-center justify-center space-x-3 bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-xl py-4 hover:bg-white/5 transition-all group"
          >
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-white group-hover:text-black transition-colors">G</div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
          </button>
          <button 
            type="button"
            onClick={() => handleOAuth('spotify')}
            className="w-full flex items-center justify-center space-x-3 bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-xl py-4 hover:bg-white/5 transition-all group"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-colors">S</div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Spotify</span>
          </button>
        </div>

        <div className="mt-8 text-center border-t border-[var(--color-studio-border)] pt-8 space-y-4">
           <Link href="/studio/register" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-[0.2em] block">Apply for Artist Account</Link>
        </div>
      </div>
    </div>
  );
}
