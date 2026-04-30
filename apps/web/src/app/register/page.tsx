'use client';
import React from 'react';
import Link from 'next/link';
import { User, Music, ArrowLeft, ArrowRight, Zap, ShieldCheck, Heart, Sparkles, Gavel } from 'lucide-react';
import BrandLogo from '@/components/layout/BrandLogo';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans selection:bg-[#00D2FF] selection:text-white">
      
      {/* HEADER */}
      <div className="p-8 flex justify-between items-center relative z-10">
         <Link href="/" className="flex items-center space-x-3 group">
            <BrandLogo className="w-10 h-10 transform group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white hidden sm:block">New Release Hub</span>
         </Link>
         <Link href="/login" className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors">Already have an account? Sign In</Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
         {/* BACKGROUND VIBE */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00D2FF1a] rounded-full blur-[120px]"></div>
         </div>

         <div className="max-w-4xl w-full space-y-16 relative z-10">
            <div className="text-center space-y-6">
               <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tighter italic uppercase leading-[0.85] text-white">
                  Join the<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Next Era.</span>
               </h1>
               <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto italic">
                  Choose your path in the independent music network.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* ARTIST PATH */}
               <Link href="/studio/register" className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] space-y-8 hover:border-[#00D2FF4d] hover:-translate-y-2 transition-all duration-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Music className="w-32 h-32 text-[#00D2FF]" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#00D2FF1a] flex items-center justify-center text-[#00D2FF] group-hover:bg-[#00D2FF] group-hover:text-white transition-all">
                     <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-3xl font-bold uppercase italic tracking-tighter text-white">Join as Artist</h2>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        Own your masters, build your supporter base, and earn more from every stream. No label required.
                     </p>
                  </div>
                  <div className="flex items-center space-x-3 text-[#00D2FF] font-bold text-[10px] uppercase tracking-[0.2em]">
                     <span>Enter Studio Portal</span>
                     <ArrowRight className="w-4 h-4" />
                  </div>
               </Link>

               {/* FAN PATH */}
               <Link href="/register/fan" className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] space-y-8 hover:border-white/20 hover:-translate-y-2 transition-all duration-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <User className="w-32 h-32 text-white" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                     <Heart className="w-8 h-8" />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-3xl font-bold uppercase italic tracking-tighter text-white">Join as Fan</h2>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        Discover independent talent, support your favorite artists, and participate in their success.
                     </p>
                  </div>
                  <div className="flex items-center space-x-3 text-white/50 font-bold text-[10px] uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                     <span>Access Fan Dashboard</span>
                     <ArrowRight className="w-4 h-4" />
                  </div>
               </Link>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {/* INSTITUTIONAL / LABEL PATH */}
               <Link href="/register/label" className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] space-y-8 hover:border-purple-500/40 hover:-translate-y-2 transition-all duration-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <ShieldCheck className="w-32 h-32 text-purple-500" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                     <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-3xl font-bold uppercase italic tracking-tighter text-white">Join as Label</h2>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        Manage multiple artists, oversee royalty distributions, and access institutional network grants.
                     </p>
                  </div>
                  <div className="flex items-center space-x-3 text-purple-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                     <span>Institutional Access</span>
                     <ArrowRight className="w-4 h-4" />
                  </div>
               </Link>

               {/* ADMIN / STAFF (FOR DEVELOPERS/OWNERS) */}
               <Link href="/login" className="group p-10 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] space-y-8 hover:border-amber-500/40 hover:-translate-y-2 transition-all duration-500 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Gavel className="w-32 h-32 text-amber-500" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
                     <Gavel className="w-8 h-8" />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-3xl font-bold uppercase italic tracking-tighter text-white">Network Admin</h2>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        Internal operations, fraud detection, and global system governance for NRH staff.
                     </p>
                  </div>
                  <div className="flex items-center space-x-3 text-amber-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                     <span>Admin Login</span>
                     <ArrowRight className="w-4 h-4" />
                  </div>
               </Link>

            </div>

            <div className="pt-12 text-center">
               <Link href="/" className="inline-flex items-center space-x-3 text-gray-700 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Back to Discover</span>
               </Link>
            </div>
         </div>
      </div>

      {/* FOOTER */}
      <div className="p-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-[#020202]">
         <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest leading-none">© 2025 New Release Hub LLC. All rights reserved.</p>
         <div className="flex space-x-8 text-[10px] text-gray-700 font-bold uppercase tracking-widest">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Support</Link>
         </div>
      </div>

    </div>
  );
}
