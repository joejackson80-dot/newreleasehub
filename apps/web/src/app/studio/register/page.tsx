'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerArtist } from '@/app/actions/auth';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function ArtistRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await registerArtist({ email, username, name, password });
      if (result.success) {
        toast.success('Artist profile initialized successfully.');
        window.location.href = '/studio';
      } else {
        setError(result.error || 'Registration failed');
        toast.error(result.error || 'Registration failed');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      const { loginArtist } = await import('@/app/actions/auth');
      const result = await loginArtist('iamjoejack', 'Password123');
      if (result.success) {
        window.location.href = '/studio';
      }
    } catch (err) {
      setError('Demo login failed');
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
           <Link href="/register" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Return to Roles</span>
           </Link>
           <div className="flex justify-center mb-10">
              <Link href="/" className="w-14 h-14 rounded-2xl bg-transparent text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl"><img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" /></Link>
           </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase italic tracking-tighter">Join Studio</h1>
          <p className="text-[#A855F7] text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">Initialize Command Center</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER EMAIL"
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Artist Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ENTER STAGE NAME"
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Username (Profile URL)</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="NO SPACES"
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Secret Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>

          {error && (
            <div className="bg-[#ef44441a] border border-[#ef444433] text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-3 pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 rounded-lg bg-[var(--color-accent-primary)] text-black font-bold text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Creating Profile...' : 'Initialize Profile'}</span>
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>

        <div className="mt-8 flex items-center space-x-4">
          <div className="flex-1 h-px bg-[var(--color-studio-border)]"></div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">or continue with</span>
          <div className="flex-1 h-px bg-[var(--color-studio-border)]"></div>
        </div>

        <div className="mt-6">
          <button 
            type="button" 
            onClick={() => signIn('google', { callbackUrl: '/studio' })}
            className="w-full flex items-center justify-center space-x-3 bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-xl py-4 hover:bg-white/5 transition-all group"
          >
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black group-hover:bg-white group-hover:text-black transition-colors">G</div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Register with Google</span>
          </button>
        </div>

        <div className="mt-8 text-center border-t border-[var(--color-studio-border)] pt-8 space-y-4">
           <Link href="/studio/login" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-[0.2em] block">Already have access? Sign In</Link>
        </div>
      </div>
    </div>
  );
}
