import React from 'react';
import Link from 'next/link';
import { 
  Upload, 
  Users, 
  BarChart3, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Award, 
  DollarSign,
  Music,
  Heart,
  Share2
} from 'lucide-react';

export const metadata = {
  title: 'How It Works | New Release Hub',
  description: 'Learn how New Release Hub empowers independent artists and connects them with fans through a transparent, high-yield ecosystem.',
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#00D2FF]/5 rounded-full blur-[120px] -z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 text-center space-y-10">
          <div className="inline-flex items-center space-x-3 text-[#00D2FF] bg-[#00D2FF]/5 border border-[#00D2FF]/10 px-6 py-2 rounded-full">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">The New Music Economy</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter uppercase italic leading-[0.8] animate-in fade-in slide-in-from-bottom-8 duration-700">
            Built for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Independence.</span>
          </h1>
          
          <p className="text-gray-500 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed italic animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            "The old industry was built on gatekeepers. New Release Hub is built on direct connection, transparent data, and fair math."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <Link href="/studio/login" className="btn-primary px-12 py-5">Artist Onboarding</Link>
            <Link href="/fan/login" className="px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Explore as Fan</Link>
          </div>
        </div>
      </section>

      {/* THE THREE PILLARS */}
      <section className="py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            
            <div className="space-y-8 group">
              <div className="w-20 h-20 rounded-3xl bg-[#111] border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:border-[#00D2FF]/50 transition-all">
                <Music className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold italic uppercase tracking-tighter">1. Release</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Upload your music directly to your professional Hub. You keep 100% of your master rights and control your own distribution schedule. No middleman, no waiting for approvals.
                </p>
                <ul className="space-y-3 pt-4">
                  {['High-fidelity streaming', 'Custom release dates', 'Instant Hub updates'].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-[#00D2FF]"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8 group">
              <div className="w-20 h-20 rounded-3xl bg-[#111] border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:border-[#00D2FF]/50 transition-all">
                <Users className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold italic uppercase tracking-tighter">2. Connect</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Invite your fans to your Hub. Offer exclusive SUPPORTER tiers with real benefits like early access, exclusive content, and even a share of your streaming revenue.
                </p>
                <ul className="space-y-3 pt-4">
                  {['Custom SUPPORTER Tiers', 'Direct fan messaging', 'Live Session Deck'].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-[#00D2FF]"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-8 group">
              <div className="w-20 h-20 rounded-3xl bg-[#111] border border-white/10 flex items-center justify-center text-[#00D2FF] group-hover:border-[#00D2FF]/50 transition-all">
                <DollarSign className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold italic uppercase tracking-tighter">3. Earn</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Get paid more per stream through our high-yield royalty engine. Combine streaming income with predictable monthly SUPPORTER revenue and collab opportunities.
                </p>
                <ul className="space-y-3 pt-4">
                  {['High-yield royalties', 'Monthly SUPPORTER income', 'Transparent splits'].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-[#00D2FF]"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DETAILED FLOW */}
      <section className="py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-[0.3em]">The Artist Journey</h2>
              <h3 className="text-5xl md:text-6xl font-bold italic uppercase tracking-tighter leading-none">From Bedroom to<br />Business.</h3>
            </div>
            
            <div className="space-y-10">
              {[
                { title: 'Set Up Your Hub', desc: 'Create your digital storefront in minutes. Customize your branding and set your SUPPORTER tiers.', icon: Globe },
                { title: 'Release & Distribute', desc: 'Upload your masters. Choose whether to release to the whole network or just your SUPPORTERs first.', icon: Upload },
                { title: 'Engage with Fans', desc: 'Use the Session Deck to host live listening parties and interact with your community in real-time.', icon: Heart },
                { title: 'Monetize Everything', desc: 'From streams to SUPPORTERage to merch, track every dollar through your real-time analytics dashboard.', icon: BarChart3 },
              ].map((step, i) => (
                <div key={i} className="flex space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold uppercase tracking-tight">{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
             <div className="aspect-square rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80" 
                  alt="Artist in studio" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
             </div>
             <div className="absolute -bottom-10 -left-10 bg-white text-black p-10 rounded-[3rem] shadow-2xl max-w-xs space-y-4 hidden md:block">
                <ShieldCheck className="w-10 h-10 text-[#00D2FF]" />
                <p className="text-xs font-bold leading-relaxed">
                  "NRH is the first platform that actually treats artists like business owners, not just content creators."
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">— Alex River, Independent Producer</p>
             </div>
          </div>
        </div>
      </section>

      {/* REVENUE LINK SECTION */}
      <section className="py-32 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="w-20 h-20 bg-[#00D2FF]/10 rounded-full flex items-center justify-center mx-auto text-[#00D2FF]">
             <DollarSign className="w-10 h-10" />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold italic uppercase tracking-tighter">The Math Behind the Music.</h2>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              We've replaced the opaque streaming model with a transparent, dual-pool royalty engine. No hidden fees, no complicated accounting.
            </p>
          </div>
          <Link href="/how-it-works/revenue-sharing" className="inline-flex items-center space-x-4 bg-white text-black px-10 py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            <span>Explore Revenue Sharing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center space-y-4 mb-20">
             <p className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest">Common Questions</p>
             <h2 className="text-5xl uppercase italic tracking-tighter">Everything else.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { q: 'Do I keep my masters?', a: 'Yes. 100%. Always. New Release Hub is a platform, not a label. You grant us a non-exclusive license to stream your music, that\'s it.' },
              { q: 'How do I get paid?', a: 'We use Stripe Connect for instant payouts. Once your balance is over $10, you can withdraw your earnings directly to your bank account.' },
              { q: 'Can I use NRH alongside Spotify?', a: 'Absolutely. Many artists use NRH as their "premium" home for super-fans while keeping their music on major DSPs for broad discovery.' },
              { q: 'What are SUPPORTER Tiers?', a: 'Custom monthly subscriptions you create for your fans. You decide the price and the perks, from early access to exclusive downloads.' },
            ].map((faq, i) => (
              <div key={i} className="p-10 border border-white/5 rounded-[2.5rem] bg-[#050505] space-y-4">
                <h4 className="text-lg font-bold uppercase tracking-tight">{faq.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00D2FF]/5"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-12">
           <h2 className="text-6xl md:text-8xl font-bold italic uppercase tracking-tighter leading-none">
             Stop streaming.<br />
             <span className="text-[#00D2FF]">Start building.</span>
           </h2>
           <p className="text-gray-400 text-xl font-medium">
             Join the movement of independent artists taking back control.
           </p>
           <div className="pt-8">
             <Link href="/studio/login" className="btn-primary px-16 py-6 text-sm">Join the Network</Link>
           </div>
        </div>
      </section>

    </div>
  );
}


