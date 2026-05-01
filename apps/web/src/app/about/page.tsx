import React from 'react';
import Link from 'next/link';
import { Globe, ShieldCheck, Zap, Star, Heart, ArrowRight } from 'lucide-react';
import BrandLogo from '@/components/layout/BrandLogo';

export const metadata = {
  title: 'About | New Release Hub',
  description: 'The mission, the math, and the movement behind the new major platform.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white">
      {/* ── HERO ── */}
      <section className="relative pt-48 pb-32 px-10 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D2FF]/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-16">
           
           {/* LOGO */}
           <div className="flex">
              <Link href="/" className="w-16 h-16 rounded-[2rem] bg-transparent text-black flex items-center justify-center font-bold text-3xl tracking-tighter hover:scale-105 transition-transform shadow-2xl"><img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" /></Link>
           </div>

           <div className="space-y-8">
              <div className="inline-flex items-center space-x-3 text-[#00D2FF]">
                 <Star className="w-4 h-4 fill-current" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em]">The New Major Platform</span>
              </div>
              <h1 className="text-[clamp(2.5rem,9vw,5.5rem)] font-bold tracking-tighter leading-[0.8] uppercase italic">
                 No Label.<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">No Middleman.</span>
              </h1>
           </div>
           <p className="text-2xl text-gray-500 font-medium leading-relaxed italic max-w-2xl">
              "Distribution is a commodity. Ownership is the revolution. We didn't build a tool to get you on Spotify; we built the home where you don't need them."
           </p>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="py-32 px-10 border-b border-white/5 bg-[#050505]">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
               <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[#00D2FF]">
                     <ShieldCheck className="w-5 h-5" />
                     <span className="text-xs font-bold uppercase tracking-widest">Artist First Protocol</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9]">The NRH<br />Manifesto.</h2>
               </div>
               <div className="prose prose-invert prose-p:text-gray-400 max-w-none space-y-6 text-lg font-medium italic leading-relaxed">
                  <p>
                     "We believe the current music economy is structurally flawed. By participating in New Release Hub, you acknowledge and support our mission to dismantle predatory royalty structures and replace them with fair, direct-to-artist payouts."
                  </p>
                  <p>
                     We prioritize sovereignty over convenience, and integrity over mass-market normalization. Every master on this network is owned, managed, and authorized directly by the creator.
                  </p>
               </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 space-y-12">
               <div className="space-y-6">
                  <h3 className="text-2xl font-bold uppercase italic tracking-tighter text-[#00D2FF]">Verified Integrity.</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">
                     Our model is built on the principle of verifiable integrity. We use advanced analytics to protect the financial interests of artists. This includes rigorous analysis of streaming patterns to ensure that every cent of royalty is paid out to legitimate human listeners and authenticated fans.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Artist Share</p>
                     <p className="text-3xl font-bold italic tracking-tighter">70-90%</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Label Cut</p>
                     <p className="text-3xl font-bold italic tracking-tighter text-red-500">0%</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-32 px-10">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
               { icon: Globe, title: "Global Reach", body: "Artists in 40+ countries use NRH to bypass local gatekeepers and connect with a global support network." },
               { icon: ShieldCheck, title: "Secure Ownership", body: "You keep 100% of your masters. We only take a platform fee when you get paid. No hidden clauses." },
               { icon: Heart, title: "Direct Funding", body: "support tiers allow your biggest fans to fund your next release directly in exchange for revenue sharing." }
            ].map((item, i) => (
               <div key={i} className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem] space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/10 flex items-center justify-center text-[#00D2FF]">
                     <item.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-bold uppercase italic tracking-tighter">{item.title}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.body}</p>
               </div>
            ))}
         </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-48 px-10 text-center border-t border-white/5">
         <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-7xl font-bold tracking-tighter italic uppercase">Stop Renting.<br />Start Owning.</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
               <Link href="/studio/login" className="px-12 py-5 rounded-full bg-[#00D2FF] text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-[#00D2FF]/20">
                  Artist Onboarding
               </Link>
               <Link href="/fan/login" className="px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Fan Registration
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}


