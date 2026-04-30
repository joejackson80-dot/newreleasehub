'use client';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { resetFanPassword } from '@/app/actions/auth';

export default function FanPasswordResetPage() {
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
      const result = await resetFanPassword(email, newPassword);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter italic uppercase text-white">Password Reset</h1>
          <p className="text-sm text-gray-500 font-medium">Your password has been successfully updated.</p>
          <div className="pt-8">
            <Link href="/login" className="inline-block px-10 py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
               Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans selection:bg-white selection:text-black">
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
      </div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
           <Link href="/login" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Login</span>
           </Link>
           <h1 className="text-3xl font-bold tracking-tighter italic uppercase leading-none">Account<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Recovery.</span></h1>
           <p className="text-xs text-gray-500 font-medium tracking-wide">Enter your email and a new password to reset your access.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="NEW PASSWORD" 
                  minLength={8}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
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
                  <span>{isSubmitting ? 'Processing...' : 'Reset Password'}</span>
                  {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
           </div>
        </form>
      </div>
    </div>
  );
}
