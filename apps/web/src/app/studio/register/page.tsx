'use client';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Music, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function ArtistRegisterPage() {
  const [email, setEmail] = useState('');
  const [artistName, setArtistName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // For Artists, we sign them up and set the role to 'artist'
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: artistName,
          role: 'artist',
          is_artist: true,
          onboarding_step: 1
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-studio-base)] text-white flex flex-col items-center justify-center p-10 font-sans">
        <div className="w-full max-w-md space-y-8 text-center bg-[var(--color-studio-surface)] border border-[var(--color-studio-border)] rounded-[2rem] p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A855F7] to-transparent opacity-50"></div>
          <div className="w-20 h-20 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Zap className="w-10 h-10 text-[#A855F7]" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">Studio Access Pending.</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your artist credentials for <span className="text-white font-bold">{artistName}</span> have been initialized. 
            Check <span className="text-[#A855F7] font-bold">{email}</span> to verify your identity and enter the command center.
          </p>
          <div className="pt-8">
            <Link href="/studio/login" className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-[0.4em]">
              Return to Studio login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-studio-base)] text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-[#A855F7] selection:text-white">
      {/* STUDIO BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.08)_0%,_transparent_50%)]"></div>
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'0.5\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="w-full max-w-[460px] space-y-10 relative z-10">
        <div className="text-center space-y-4">
           <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-[#A855F7] transition-colors mb-6 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exit Studio</span>
           </Link>
           <div className="flex justify-center mb-10">
              <div className="relative group">
                <div className="absolute inset-[-4px] bg-[#A855F7]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Link href="/" className="relative block w-16 h-16 rounded-2xl bg-transparent flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">
                  <Image src="/images/nrh-logo.png" alt="NRH Logo" width={64} height={64} className="w-full h-full object-contain mix-blend-screen" />
                </Link>
              </div>
           </div>
           <h1 className="text-4xl font-black tracking-tighter italic uppercase leading-[0.85] text-white">Scale<br /><span className="text-[#A855F7]">Independently.</span></h1>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
             <Sparkles className="w-3 h-3 text-[#A855F7]" />
             Artist Studio Protocol · Phase II
           </p>
        </div>

        <div className="bg-[var(--color-studio-surface)] border border-[var(--color-studio-border)] rounded-[2rem] p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative">
          <form onSubmit={handleRegister} className="space-y-6">
             <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Artist / Collective Name</label>
                  <input 
                    type="text" 
                    required
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="ENTER STAGE NAME" 
                    className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-[#A855F7]/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Professional Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="YOU@COLLECTIVE.COM" 
                    className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-[#A855F7]/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-2">Secure Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[var(--color-studio-elevated)] border border-[var(--color-studio-border)] rounded-xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#A855F7]/30 transition-all"
                  />
                </div>

                {error && (
                  <div className="bg-[#ef44441a] border border-[#ef444433] text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 rounded-xl bg-[#A855F7] text-white font-black text-[11px] uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-[0_15px_30px_rgba(168,85,247,0.2)] flex items-center justify-center space-x-3 group active:scale-95"
                  >
                    <Music className={`w-3.5 h-3.5 transition-transform ${isSubmitting ? 'animate-bounce' : 'group-hover:rotate-12'}`} />
                    <span>{isSubmitting ? 'Provisioning...' : 'Request Studio Access'}</span>
                    {!isSubmitting && <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
             </div>
          </form>

          <div className="mt-8 text-center">
             <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                Already verified? <Link href="/studio/login" className="text-white hover:text-[#A855F7] transition-all">Command Center Login</Link>
             </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-4 text-center">
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-700" />
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Ownership<br />Verification</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap className="w-4 h-4 text-gray-700" />
                <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Instant<br />Onboarding</span>
              </div>
           </div>
           <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest max-w-[280px]">
             By requesting access, you agree to the NRH Master Participation Protocol and Independent Growth Terms.
           </p>
        </div>
      </div>
    </div>
  );
}
