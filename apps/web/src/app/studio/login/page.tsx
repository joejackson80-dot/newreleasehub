'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginArtist } from '@/app/actions/auth';
import { ArrowLeft, ArrowRight, Music2 } from 'lucide-react';
import Link from 'next/link';

export default function ArtistLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await loginArtist(identifier, password);
      if (result.success) {
        window.location.href = '/studio';
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-studio-base)] flex items-center justify-center p-4">
      {/* Aesthetic Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-accent-primary)]/10 via-[var(--color-studio-base)] to-[var(--color-studio-base)] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[var(--color-studio-surface)] border border-[var(--color-studio-border)] rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Return to Network</span>
           </Link>
           <div className="flex justify-center mb-10">
              <Link href="/" className="w-14 h-14 rounded-2xl bg-transparent text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl"><img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" /></Link>
           </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase italic tracking-tighter">Artist Studio</h1>
          <p className="text-[#00D2FF] text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">Command Center Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Username or email</label>
            <input 
              type="text" 
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="ENTER CREDENTIALS"
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Secret Password</label>
              <Link href="/studio/login/reset" className="text-[10px] font-bold text-gray-500 hover:text-[#00D2FF] transition-colors uppercase tracking-[0.2em]">Forgot Password?</Link>
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

        <div className="mt-8 text-center border-t border-[var(--color-studio-border)] pt-8 space-y-4">
           <Link href="/login" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-[0.2em] block">Switch to Fan Access Portal</Link>
        </div>
      </div>
    </div>
  );
}


