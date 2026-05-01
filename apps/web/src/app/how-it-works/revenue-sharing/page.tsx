import React from 'react';
import { ArrowLeft, Zap, DollarSign, Users, ShieldCheck, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Revenue Sharing Explained | New Release Hub',
  description: 'Learn how the New Release Hub dual-pool royalty engine works.',
};

export default function RevenueSharingPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white py-20 pb-40">
      <div className="max-w-4xl mx-auto px-6 space-y-24">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <header className="space-y-8 text-center">
          <div className="inline-flex items-center space-x-3 text-[#A855F7] bg-[#A855F7]/5 border border-[#A855F7]/10 px-6 py-2 rounded-full">
            <DollarSign className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">The Economic Protocol</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic leading-[0.9]">
            The Dual-Pool<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Royalty Engine.</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            New Release Hub operates on a transparent, mathematical model designed to prioritize master rights holders and their SUPPORTERs.
          </p>
        </header>

        {/* POOLS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="p-10 bg-[#0A0A0A] border border-white/5 rounded-[3rem] space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/5 blur-3xl rounded-full"></div>
              <div className="w-16 h-16 rounded-2xl bg-[#A855F7]/10 text-[#A855F7] flex items-center justify-center">
                 <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold italic tracking-tighter uppercase">Premium Pool: Subscriptions</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                 70% of all platform subscription revenue is allocated to the Premium Pool. This pool is distributed based on net streaming performance, excluding bot and fraudulent activity.
              </p>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[#A855F7]">
                 <span className="text-[10px] font-bold uppercase tracking-widest">Target Share</span>
                 <span className="text-xl font-black italic">70%</span>
              </div>
           </div>

           <div className="p-10 bg-[#0A0A0A] border border-white/5 rounded-[3rem] space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-3xl rounded-full"></div>
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
                 <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold italic tracking-tighter uppercase">Network Pool: Commercials</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                 60% of all ad-generated revenue and network fees are allocated to the Network Pool. This pool rewards artists who drive consistent live hub engagement and high-intent listening.
              </p>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-green-500">
                 <span className="text-[10px] font-bold uppercase tracking-widest">Target Share</span>
                 <span className="text-xl font-black italic">60%</span>
              </div>
           </div>
        </section>

        {/* SUPPORTER MULTIPLIER */}
        <section className="bg-white text-black rounded-[4rem] p-12 md:p-20 space-y-12">
           <div className="space-y-4">
              <div className="inline-flex items-center space-x-3 text-gray-500">
                 <TrendingUp className="w-5 h-5" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Growth Accelerator</span>
              </div>
              <h2 className="text-4xl md:text-3xl font-bold tracking-tighter uppercase italic leading-[0.9]">
                 The SUPPORTER<br />Multiplier.
              </h2>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { label: 'Core Artist', bonus: '1.0x', desc: 'Starting baseline for independent creators.' },
                { label: 'Rising Hub', bonus: '1.2x', desc: 'Achieved at 50+ unique active SUPPORTERs.' },
                { label: 'Network Legend', bonus: '1.5x', desc: 'Max multiplier for top-tier hub vitality.' }
              ].map((tier, i) => (
                <div key={i} className="p-8 border border-black/10 rounded-3xl space-y-4">
                   <p className="text-4xl font-black italic">{tier.bonus}</p>
                   <h4 className="font-bold text-lg uppercase tracking-tight">{tier.label}</h4>
                   <p className="text-xs text-gray-600 leading-relaxed">{tier.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* VERIFICATION */}
        <section className="text-center space-y-10">
           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-[#A855F7]">
              <ShieldCheck className="w-10 h-10" />
           </div>
           <div className="space-y-4">
              <h3 className="text-3xl font-bold italic uppercase tracking-tighter">Verified Integrity.</h3>
              <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
                 All calculations are performed monthly and verified against our Anti-Fraud Engine. Payments are processed via Stripe Connect for immediate transparency.
              </p>
           </div>
           <Link href="/press" className="inline-block text-[10px] font-bold text-[#A855F7] uppercase tracking-widest hover:text-white transition-colors">Read the Network Whitepaper →</Link>
        </section>

      </div>
    </div>
  );
}


