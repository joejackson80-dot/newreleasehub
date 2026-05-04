'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPasswordWithToken } from '@/app/actions/auth';
import { ShieldCheck, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import BrandLogo from '@/components/layout/BrandLogo';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-red-500 rounded-2xl mx-auto flex items-center justify-center text-white">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase italic text-white">Invalid Request</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            No security token provided.<br />Please request a new recovery link.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await resetPasswordWithToken(token, password);
      if (res.success) {
        toast.success('Password updated successfully.');
        router.push('/login');
      } else {
        setError(res.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">New Password</label>
          <div className="relative group">
            <input 
              type="password" 
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder-gray-800 focus:outline-none focus:border-[#A855F7] transition-all"
            />
            <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-[#A855F7] transition-colors" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Confirm New Password</label>
          <div className="relative group">
            <input 
              type="password" 
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder-gray-800 focus:outline-none focus:border-[#A855F7] transition-all"
            />
            <ShieldCheck className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-[#A855F7] transition-colors" />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-5 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#A855F7] hover:text-white transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
      >
        <span>{isSubmitting ? 'Updating Secret...' : 'Set New Password'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A855F710] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full space-y-12 relative z-10">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <BrandLogo className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter italic uppercase text-white">Create New Secret.</h1>
          <p className="text-gray-500 text-sm font-medium italic">Secure your account with a fresh network credential.</p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 animate-pulse">Initializing Secure Channel...</div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
            Identity Verified via Security Token
          </p>
        </div>
      </div>
    </div>
  );
}
