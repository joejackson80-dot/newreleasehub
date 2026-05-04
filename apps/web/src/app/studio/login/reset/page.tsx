'use client';
import React, { useState } from 'react';
import { resetArtistPassword } from '@/app/actions/auth';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ArtistPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await resetArtistPassword(email, newPassword);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err: unknown) {
      console.error('Reset error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-studio-base)] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-accent-primary)]/10 via-[var(--color-studio-base)] to-[var(--color-studio-base)] pointer-events-none"></div>
        <div className="w-full max-w-md bg-[var(--color-studio-surface)] border border-[var(--color-studio-border)] rounded-2xl p-6 sm:p-12 relative z-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#A855F7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-[#A855F7]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase italic tracking-tighter">Access Restored</h1>
          <p className="text-gray-400 text-xs font-medium">Your command center password has been updated.</p>
          <div className="pt-8">
            <Link href="/studio/login" className="inline-flex py-4 px-10 rounded-lg bg-[var(--color-accent-primary)] text-black font-bold text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all">
               Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-studio-base)] flex items-center justify-center p-4">
      {/* Aesthetic Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--color-accent-primary)]/10 via-[var(--color-studio-base)] to-[var(--color-studio-base)] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[var(--color-studio-surface)] border border-[var(--color-studio-border)] rounded-2xl p-6 sm:p-8 relative z-10 shadow-2xl">
        <div className="text-center mb-8">
           <Link href="/studio/login" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Return to Login</span>
           </Link>
           <div className="flex justify-center mb-10">
              <Link href="/" className="w-14 h-14 rounded-2xl bg-transparent text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl"><img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" /></Link>
           </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase italic tracking-tighter">Recover Access</h1>
          <p className="text-[#A855F7] text-[10px] font-bold mt-2 uppercase tracking-[0.3em]">Reset Command Center Password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER EMAIL"
              className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-lg px-4 py-4 text-xs font-bold tracking-widest text-white focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">New Password</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              <span>{isSubmitting ? 'Processing...' : 'Reset Password'}</span>
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
