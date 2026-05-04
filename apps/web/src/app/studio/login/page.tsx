'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { signInWithGoogle } from '@/app/actions/auth';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ArtistLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username: identifier,
        password: password,
        role: 'artist',
        callbackUrl: '/studio',
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        return;
      }

      // We need to check the session to verify the role
      // Since NextAuth signIn with redirect: false doesn't return the user object easily here,
      // we'll fetch the session or just rely on the callbackUrl if we're sure.
      // However, the instructions say to check role.
      
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      
      if (session?.user?.role === 'FAN') {
        setError('This is the artist portal. Fan login is at newreleasehub.com/login');
        // Sign out if they shouldn't be here
        await fetch('/api/auth/signout', { method: 'POST' });
      } else {
        window.location.href = '/studio';
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
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
              <Link href="/" className="w-14 h-14 rounded-2xl bg-transparent text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl"><Image src="/images/nrh-logo.png" alt="NRH Logo" width={56} height={56} className="w-full h-full object-contain mix-blend-screen" /></Link>
           </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase italic tracking-tighter">Artist Studio</h1>
          <p className="text-[#A855F7] text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">Command Center Authentication</p>
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
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold tracking-widest text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Secret Password</label>
              <Link href="/forgot-password" title="Recover your studio credentials" className="text-[10px] font-bold text-gray-500 hover:text-[#A855F7] transition-colors uppercase tracking-[0.2em]">Forgot Password?</Link>
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
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">or continue with</span>
          <div className="flex-1 h-px bg-[var(--color-studio-border)]"></div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <form action={signInWithGoogle.bind(null, 'ARTIST', '/studio')}>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center space-x-3 bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-xl py-4 hover:bg-white/5 transition-all group"
            >
              <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-white group-hover:text-black transition-colors">G</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Google Login</span>
            </button>
          </form>
          <Link 
            href="/studio/register"
            className="flex items-center justify-center space-x-3 bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-xl py-4 hover:bg-white/5 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Sign Up</span>
          </Link>
        </div>

        <div className="mt-8 text-center border-t border-[var(--color-studio-border)] pt-8 space-y-4">
           <Link href="/login" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-[0.2em] block">Switch to Fan Access Portal</Link>
        </div>
      </div>
    </div>
  );
}


