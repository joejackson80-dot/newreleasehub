'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import BrandLogo from '@/components/layout/BrandLogo';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      // Wait a moment so they can see success, then redirect based on role
      const role = data.user?.user_metadata?.role;
      setTimeout(() => {
        if (role === 'artist') router.push('/studio');
        else if (role === 'admin') router.push('/admin');
        else router.push('/fan/me');
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-white/5 border border-white/5 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter italic uppercase">Key Updated</h1>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
            Your credentials have been re-encrypted. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4 text-white">
      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
           <div className="flex justify-center mb-6">
              <BrandLogo className="w-16 h-16" />
           </div>
           <h1 className="text-3xl font-bold tracking-tighter italic uppercase leading-none">Reset<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Password.</span></h1>
           <p className="text-xs text-gray-500 font-medium tracking-wide italic">Initialize your new secret access key.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 shadow-2xl space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2">New Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    minLength={8}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                  />
                  <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2">Confirm Key</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/40 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl flex items-center justify-center space-x-3"
              >
                <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
