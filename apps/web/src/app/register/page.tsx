'use client';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import BrandLogo from '@/components/layout/BrandLogo';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/fan/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Registration failed');
        setIsSubmitting(false);
      } else {
        // Success! Now sign them in automatically
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          // If auto-sign-in fails, send them to login page
          window.location.href = '/login?registered=true';
        } else {
          window.location.href = '/fan/me';
        }
      }
    } catch {
      setError('A network error occurred. Please try again.');
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-white selection:text-black">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A855F7]/10 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
         <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '64px 64px' }}></div>
      </div>

      <div className="w-full max-w-[440px] space-y-10 relative z-10">
        <div className="text-center space-y-4">
           <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-4 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Network</span>
           </Link>
           <div className="flex justify-center mb-6">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl">
                <BrandLogo className="w-10 h-10" />
              </div>
           </div>
           <h1 className="text-4xl font-black tracking-tighter italic uppercase leading-[0.9]">Initialize<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Identity.</span></h1>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Fan Portal Registration · v16.2.4</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center space-x-3 bg-white/5 border border-white/5 rounded-2xl py-5 hover:bg-white/10 transition-all group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Google</span>
              </button>
              <button 
                type="button"
                onClick={() => handleOAuth('spotify')}
                className="flex items-center justify-center space-x-3 bg-white/5 border border-white/5 rounded-2xl py-5 hover:bg-white/10 transition-all group"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Spotify</span>
              </button>
           </div>

           <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em]"><span className="bg-[#020202] px-4 text-gray-700">Traditional Intake</span></div>
           </div>

           <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="CHOOSE USERNAME" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-700">@</span>
              </div>

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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="SECRET PASSWORD" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-5 rounded-2xl text-center flex items-center justify-center gap-3">
                  <ShieldCheck className="w-4 h-4 opacity-50" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#A855F7] hover:text-white transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] flex items-center justify-center space-x-3 group active:scale-95"
                >
                  <Zap className={`w-3.5 h-3.5 transition-transform ${isSubmitting ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                  <span>{isSubmitting ? 'Processing...' : 'Create Credentials'}</span>
                  {!isSubmitting && <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
           </div>
        </form>

        <div className="text-center space-y-6">
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Already identified? <Link href="/login" className="text-white hover:underline transition-all underline-offset-4">Sign In</Link>
           </p>
           <div className="pt-4 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-gray-700" />
                <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Verified End-to-End Encryption</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
