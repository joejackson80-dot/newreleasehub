'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Music, ShieldCheck, Mail, Lock, Users, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginFan } from '@/app/actions/auth';

export default function FanAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await loginFan(identifier, password);
        if (result.success) {
          // Also set localStorage for client-side components (audio player, etc.)
          localStorage.setItem('nrh_user', 'authenticated');
          router.push('/fan/me');
        } else {
          setError(result.error || 'Invalid credentials');
        }
      } else {
        // Registration — call API to create user, then log in
        const res = await fetch('/api/fan/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: displayName, email: identifier, password })
        });
        const data = await res.json();
        if (data.success) {
          const loginResult = await loginFan(identifier, password);
          if (loginResult.success) {
            localStorage.setItem('nrh_user', 'authenticated');
            router.push('/fan/me');
          }
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row selection:bg-[#00D2FF] selection:text-white">
      {/* LEFT SIDE - VISUAL */}
      <div className="hidden md:flex md:w-1/2 bg-[#050505] border-r border-white/5 relative items-center justify-center overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
         <div className="relative z-10 p-20 space-y-12 max-w-xl">
             <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter uppercase italic leading-[0.9]">
                Support<br />The Scene.
             </h1>
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-[#00D2FF1a] flex items-center justify-center shrink-0 mt-1">
                      <Music className="w-4 h-4 text-[#00D2FF]" />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm uppercase tracking-widest">Ad-Free Streaming</h3>
                      <p className="text-zinc-500 text-sm mt-1 leading-relaxed">Listen to high-fidelity audio from independent artists globally, without interruptions.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-[#00D2FF1a] flex items-center justify-center shrink-0 mt-1">
                      <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm uppercase tracking-widest">True support</h3>
                      <p className="text-zinc-500 text-sm mt-1 leading-relaxed">Your subscription directly funds the artists you love, completely bypassing major label cuts.</p>
                   </div>
                </div>
             </div>
         </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 relative">
         <div className="w-full max-w-md space-y-12">
            
            <div className="flex flex-col space-y-12">
               {/* INSTITUTIONAL LOGO */}
               <div className="flex">
                  <Link href="/" className="w-16 h-16 rounded-[2rem] bg-white text-black flex items-center justify-center font-bold text-3xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</Link>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[#00D2FF]">
                     <ShieldCheck className="w-4 h-4 fill-current" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Secure Network Entry</span>
                  </div>
                  <h2 className="text-[clamp(2.5rem,10vw,4rem)] md:text-6xl font-bold tracking-tighter uppercase italic leading-[0.8]">
                     {isLogin ? 'Welcome<br />Back.' : 'Join the<br />Network.'}
                  </h2>
                  <p className="text-zinc-500 font-medium italic text-sm">
                     {isLogin ? '"Re-entering the New Release Hub Professional Collective."' : '"Registering as an authorized platform participant."'}
                  </p>
               </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-[#ef44441a] border border-[#ef444433] text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               {!isLogin && (
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Display Name</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         required
                         value={displayName}
                         onChange={(e) => setDisplayName(e.target.value)}
                         placeholder="MusicLover99"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all"
                       />
                       <Users className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                 </div>
               )}
               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Email Address</label>
                  <div className="relative">
                     <input 
                       type="email" 
                       required
                       value={identifier}
                       onChange={(e) => setIdentifier(e.target.value)}
                       placeholder="your@email.com"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all"
                     />
                     <Mail className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Password</label>
                  <div className="relative">
                     <input 
                       type="password" 
                       required
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="••••••••"
                       className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all"
                     />
                     <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
               </div>

               <button 
                 type="submit" 
                 disabled={isLoading}
                 className="w-full py-5 rounded-2xl bg-[#00D2FF] text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#00B8E0] transition-all shadow-lg shadow-[#00D2FF33] flex items-center justify-center space-x-3 disabled:opacity-50"
               >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
               </button>
            </form>

            <div className="text-center">
               <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}


