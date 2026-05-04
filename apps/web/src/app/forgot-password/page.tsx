'use client';
import React, { useState } from 'react';
import { requestPasswordReset } from '@/app/actions/auth';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import BrandLogo from '@/components/layout/BrandLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setIsSuccess(true);
        toast.success('Recovery email sent.');
      } else {
        toast.error('Failed to send recovery email.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* BACKGROUND VIBE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A855F710] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full space-y-12 relative z-10">
        <div className="text-center space-y-6">
          <Link href="/login" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back to Login</span>
          </Link>
          <div className="flex justify-center">
            <BrandLogo className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter italic uppercase text-white">Account Recovery.</h1>
          <p className="text-gray-500 text-sm font-medium">Enter your email and we&apos;ll send a secure link to reset your password.</p>
        </div>

        {isSuccess ? (
          <div className="bg-[#A855F70a] border border-[#A855F720] rounded-[2rem] p-10 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-[#A855F7] rounded-2xl mx-auto flex items-center justify-center text-white shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase italic">Check your inbox</h2>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                We&apos;ve sent a recovery link to<br />
                <span className="text-white">{email}</span>
              </p>
            </div>
            <p className="text-gray-600 text-[9px] uppercase tracking-widest font-bold pt-4">
              Link expires in 60 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Registered Email</label>
              <div className="relative group">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder-gray-800 focus:outline-none focus:border-[#A855F7] transition-all group-hover:border-white/10"
                />
                <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 group-focus-within:text-[#A855F7] transition-colors" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#A855F7] hover:text-white transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Request Recovery Link'}
            </button>
          </form>
        )}

        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
            Need more help? <Link href="/contact" className="text-white hover:text-[#A855F7]">Contact Network Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
