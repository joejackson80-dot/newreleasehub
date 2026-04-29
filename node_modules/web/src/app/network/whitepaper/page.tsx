'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Award, Music, ArrowRight, Check, Lock, Users } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/ui/FadeIn';

export default function NetworkWhitepaper() {
  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white font-sans overflow-x-hidden">
      
      {/* HERO */}
      <section className="relative py-48 px-10 border-b border-white/5 overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
         
         <div className="max-w-4xl mx-auto relative z-10 text-center space-y-20">
            {/* INSTITUTIONAL LOGO */}
            <div className="flex justify-center">
               <Link href="/" className="w-16 h-16 rounded-[2rem] bg-white text-black flex items-center justify-center font-bold text-3xl tracking-tighter hover:scale-105 transition-transform shadow-[0_0_80px_rgba(255,255,255,0.1)]">N</Link>
            </div>

            <FadeIn direction="up">
               <div className="space-y-12">
                  <div className="space-y-6">
                     <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                        <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Institutional Protocol v1.0.4</span>
                     </div>
                     <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.8] italic uppercase">
                        The Support<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Framework.</span>
                     </h1>
                  </div>
                  <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                     A forensic support model enabling independent artists to retain 100% master ownership while sharing commercial success with the global collective.
                  </p>
               </div>
            </FadeIn>
         </div>
      </section>

      {/* CORE PILLARS */}
      <section className="max-w-6xl mx-auto px-10 py-32 grid grid-cols-1 md:grid-cols-3 gap-16">
         {[
           { title: 'Zero Dilution', desc: 'Artists retain full creative control and 100% legal ownership of their master recordings.', icon: Music },
           { title: 'Support-Tier Equity', desc: 'SUPPORTERs acquire "Fan Revenue Shares" – a non-security support stake in future yield.', icon: Award },
           { title: 'Network Security', desc: 'Every transaction is secured on the NRH Professional Network with full commercial transparency.', icon: ShieldCheck }
         ].map((pillar, i) => (
            <FadeIn key={i} delay={i * 0.1}>
               <div className="space-y-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
                     <pillar.icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold italic tracking-tighter uppercase">{pillar.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{pillar.desc}</p>
               </div>
            </FadeIn>
         ))}
      </section>

      {/* THE MECHANISM */}
      <section className="bg-white/[0.02] border-y border-white/5 py-32">
         <div className="max-w-6xl mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-10">
               <h2 className="text-4xl font-bold tracking-tighter italic uppercase">How the<br />Network Operates.</h2>
               <div className="space-y-8">
                  {[
                    { step: '01', title: 'Asset Securitization', desc: 'Artists upload high-fidelity masters to the Network Vault.' },
                    { step: '02', title: 'Participation Auction', desc: 'Fans bid on Support-Tier licenses representing a % of revenue.' },
                    { step: '03', title: 'Yield Distribution', desc: 'Commercial revenue is automatically split via New Release Hub.' }
                  ].map((step, i) => (
                     <div key={i} className="flex space-x-8">
                        <span className="text-xs font-bold text-gray-800">{step.step}</span>
                        <div className="space-y-2">
                           <h4 className="text-xl font-bold italic tracking-tight">{step.title}</h4>
                           <p className="text-sm text-gray-600 leading-relaxed font-medium">{step.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="relative">
               <div className="aspect-square bg-zinc-900/40 rounded-[3rem] border border-white/5 p-12 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                  <div className="flex justify-between items-start relative z-10">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Network Visualization</p>
                        <h4 className="text-2xl font-bold italic">Network Infrastructure.v1</h4>
                     </div>
                     <Globe className="w-6 h-6 text-white/20" />
                  </div>
                  
                  {/* SIMULATED GRAPH */}
                  <div className="h-40 flex items-end space-x-2 relative z-10">
                     {[1,2,3,4,5,6,7,8].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [`${Math.random() * 100}%`, `${Math.random() * 100}%`] }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                          className="flex-1 bg-white/10 rounded-t-lg"
                        />
                     ))}
                  </div>

                  <div className="pt-8 border-t border-white/5 flex justify-between relative z-10">
                     <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">System Operational</span>
                     </div>
                     <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Network Load: 12.4%</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-10 py-48 text-center space-y-12">
         <h2 className="text-5xl font-bold tracking-tighter italic uppercase">Join the Collective.</h2>
         <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Ready to secure your first network stake? Explore the active hubs and join the front row of the music revolution.
         </p>
         <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/" className="px-12 py-5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.2)]">Explore Hubs</Link>
            <Link href="/studio/login" className="px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Artist Onboarding</Link>
         </div>
      </section>

    </div>
  );
}


