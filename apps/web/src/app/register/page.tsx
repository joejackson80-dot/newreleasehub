'use client';
import React, { useState } from 'react';
import { Mail, Globe, Zap, ArrowLeft, ArrowRight, Music, Users } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [role, setRole] = useState<'fan' | 'artist' | null>(null);

  if (!role) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans selection:bg-[#00D2FF] selection:text-white">
        <div className="fixed inset-0 pointer-events-none">
           <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
        </div>

        <div className="w-full max-w-4xl relative z-10 space-y-12">
          <div className="text-center space-y-4">
             <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Back to Home</span>
             </Link>
             <h1 className="text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-none">Join the <span className="text-[#00D2FF]">Network.</span></h1>
             <p className="text-gray-500 font-medium tracking-wide">Choose how you want to use New Release Hub.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <button onClick={() => setRole('fan')} className="group bg-[#111] border border-white/5 hover:border-[#00D2FF]/50 rounded-[2rem] p-10 text-left transition-all hover:shadow-[0_0_30px_rgba(0,210,255,0.1)] hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Users className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold uppercase italic tracking-tighter mb-4">I'm a Fan</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">Discover independent artists, join exclusive patron tiers, and earn a share of streaming royalties.</p>
                <div className="inline-flex items-center space-x-2 text-[#00D2FF] font-bold text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                   <span>Sign up as Fan</span>
                   <ArrowRight className="w-4 h-4" />
                </div>
             </button>

             <button onClick={() => setRole('artist')} className="group bg-[#111] border border-white/5 hover:border-purple-500/50 rounded-[2rem] p-10 text-left transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   <Music className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold uppercase italic tracking-tighter mb-4">I'm an Artist</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">Keep 100% of your masters, build a patron community, and access the command center.</p>
                <div className="inline-flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                   <span>Sign up as Artist</span>
                   <ArrowRight className="w-4 h-4" />
                </div>
             </button>
          </div>
          
          <div className="text-center pt-8 border-t border-white/5">
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Already have an account? <Link href="/login" className="text-white hover:text-[#00D2FF] transition-colors ml-2">Sign In Here</Link>
             </p>
          </div>
        </div>
      </div>
    );
  }

  // Simplified form for either role
  const roleColor = role === 'artist' ? 'text-purple-400' : 'text-[#00D2FF]';
  const roleBg = role === 'artist' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-[#00D2FF]/10 border-[#00D2FF]/20';
  const submitDest = role === 'artist' ? '/studio' : '/welcome';

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans selection:bg-white selection:text-black">
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
         <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b ${role === 'artist' ? 'from-purple-500/10' : 'from-[#00D2FF]/10'} via-transparent to-transparent`}></div>
      </div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
           <button onClick={() => setRole(null)} className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Roles</span>
           </button>
           <h1 className="text-3xl font-bold tracking-tighter italic uppercase leading-none">Create<br /><span className={roleColor}>{role} Account.</span></h1>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); window.location.href = submitDest; }} className="space-y-6">
           <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  required
                  placeholder="USERNAME" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="PASSWORD" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-white text-black font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl flex items-center justify-center space-x-2 mt-4"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
           </div>
           
           <div className="flex items-center space-x-4 py-2">
              <div className="flex-1 h-px bg-white/5"></div>
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">or sign up with</span>
              <div className="flex-1 h-px bg-white/5"></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center space-x-3 bg-white/5 border border-white/5 rounded-2xl py-4 hover:bg-white/10 transition-all group">
                  <Globe className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center space-x-3 bg-white/5 border border-white/5 rounded-2xl py-4 hover:bg-white/10 transition-all group">
                  <Zap className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Apple</span>
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
