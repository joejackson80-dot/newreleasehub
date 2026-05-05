'use client';
import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import BrandLogo from '@/components/layout/BrandLogo';

export default function AdminLoginPage() {
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
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* SECURITY GRID BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #A855F7 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#A855F705] rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-md w-full space-y-12 relative z-10">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Exit Command Center</span>
          </Link>
          <div className="flex justify-center">
            <div className="relative">
              <BrandLogo className="w-16 h-16 grayscale opacity-50" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                <ShieldAlert className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase text-white">Central Command</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">Administrative Level Access Required</p>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A855F7] to-transparent opacity-50"></div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2">Operator Identity</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="OPERATOR EMAIL"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder-gray-800 focus:outline-none focus:border-[#A855F7]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2">Access Key</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder-gray-800 focus:outline-none focus:border-[#A855F7]/30 transition-all"
                />
                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
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
              className="w-full py-5 rounded-2xl bg-[#A855F7] text-white font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-[0_10px_40px_rgba(168,85,247,0.2)] active:scale-[0.98] flex items-center justify-center space-x-3"
            >
              <span>{isSubmitting ? 'Decrypting...' : 'Initialize Access'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center pt-4">
          <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest leading-loose">
            Warning: All administrative actions are logged and audited.<br />Unauthorized access attempts will be permanently blacklisted.
          </p>
        </div>
      </div>
    </div>
  );
}
