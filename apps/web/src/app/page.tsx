import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Play, TrendingUp, Award, Disc, Search, ArrowRight, Globe, ShieldCheck, Upload, Heart, BarChart3 } from 'lucide-react';

const ARTIST_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
];

export default async function HomePage() {
  const hubs = await prisma.organization.findMany({
    orderBy: { totalStreams: 'desc' },
    take: 10,
    include: {
      ParticipationLicenses: true,
      SessionDeck: true
    }
  });

  const validHubs = hubs.filter(
    hub => hub?.name && hub?.slug && hub.name.toLowerCase() !== 'undefined' && hub.slug.toLowerCase() !== 'undefined'
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white">

      {/* HERO SECTION - INSTITUTIONAL CINEMATIC STYLE */}
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden pt-32 pb-20">
         <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-[3000ms]">
            <img
              src="/reverb_hero_artist_1776975832109.png"
              className="w-full h-full object-cover scale-110"
              alt="Institutional Artist"
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#020202]/60 to-transparent"></div>
         <div className="absolute inset-0 bg-black/20"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
               
               {/* INSTITUTIONAL LOGO */}
               <div className="flex">
                  <Link href="/" className="w-16 h-16 rounded-[2rem] bg-white text-black flex items-center justify-center font-bold text-3xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</Link>
               </div>

               <div className="space-y-8">
                  <div className="flex items-center space-x-3 text-[#00D2FF]">
                     <ShieldCheck className="w-4 h-4 fill-current" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em]">The Support-Tier Framework</span>
                  </div>
                  <h1 className="text-white text-6xl md:text-9xl font-bold leading-[0.8] uppercase italic tracking-tighter">
                     Own Your<br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Masters.</span>
                  </h1>
                  <p className="text-gray-500 text-xl font-medium max-w-lg leading-relaxed italic">
                     "The institutional-grade platform where independent artists secure decentralized patronage without signing away their rights."
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/studio/login" className="px-12 py-5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">Artist Onboarding</Link>
                  <Link href="/fan/login" className="px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Public Discovery</Link>
               </div>
               
               {/* NETWORK PULSE STRIP */}
               <div className="pt-16 border-t border-white/5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                     <div className="space-y-2">
                        <p className="text-white text-2xl font-bold uppercase italic tracking-tighter">1.2M+</p>
                        <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest leading-none">Verified Hubs</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[#00D2FF] text-2xl font-bold uppercase italic tracking-tighter">450K</p>
                        <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest leading-none">Stakeholders</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-white text-2xl font-bold uppercase italic tracking-tighter">$12.4M</p>
                        <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest leading-none">Yield Payouts</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-green-500 text-2xl font-bold uppercase italic tracking-tighter">100%</p>
                        <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest leading-none">Rights Retained</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* DISCOVERY FEED */}
      <section className="section-container">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-[#00D2FF]">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Trending this week</span>
               </div>
               <h2 className="text-5xl uppercase leading-none">Discover Artists.</h2>
            </div>
            <div className="flex items-center space-x-6">
               <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search Artists..."
                    className="bg-white/5 border border-white/10 rounded-full px-10 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00D2FF]/20 transition-all w-64 md:w-80 text-white"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {validHubs.map((hub, index) => {
              const imageUrl = hub.profileImageUrl || ARTIST_IMAGE_POOL[index % ARTIST_IMAGE_POOL.length];
              const isLive = hub.SessionDeck?.isPlaying;
              const patronCount = (hub as any).patronCount ?? hub.ParticipationLicenses.length;

              return (
                <Link key={hub.id} href={`/${hub.slug}`} className="group artist-card">
                   <div className="relative">
                      <img
                        src={imageUrl}
                        alt={hub.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                         <div className="w-16 h-16 rounded-full bg-[#00D2FF] flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-transform">
                            <Play className="w-8 h-8 fill-current ml-1" />
                         </div>
                      </div>
                   </div>
                   <div className="p-8 space-y-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <h3 className="text-2xl mb-1 text-white">{hub.name ?? 'Independent Artist'}</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                              {hub.city || 'Global'} &middot; {patronCount.toLocaleString()} patrons
                            </p>
                         </div>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                         {isLive && hub.liveListenerCount > 0 ? (
                           <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Live Now</span>
                           </div>
                         ) : (
                           <div className="flex items-center space-x-2 bg-white/5 px-2 py-1 rounded-md">
                              <Disc className="w-3 h-3 text-[#00D2FF]" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{hub.genres?.[0] || 'Independent'}</span>
                           </div>
                         )}
                         <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#00D2FF] transition-colors" />
                      </div>
                   </div>
                </Link>
              );
            })}
         </div>
         <div className="mt-12 text-center">
            <Link href="/discover" className="btn-outline border-white text-white hover:bg-white hover:text-black">
               Discover More Artists
            </Link>
         </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-32 border-t border-white/5 bg-[var(--color-studio-base)] relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent-primary)]/5 rounded-full blur-[120px] -z-0"></div>
         <div className="section-container">
            <div className="text-center space-y-4 mb-20">
               <div className="flex items-center justify-center space-x-3 text-[#00D2FF]">
                  <Disc className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">How it works</span>
               </div>
               <h2 className="text-5xl uppercase leading-none">How It Works.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 {
                   step: '01',
                   icon: Upload,
                   title: 'Upload your music',
                   body: 'Publish singles, EPs, and albums in any format. Set your release date, release on the new major platform, and keep every cent of your masters. Always.'
                 },
                 {
                   step: '02',
                   icon: Heart,
                   title: 'Fans fund your career',
                   body: 'Set custom patron tiers with exclusive perks. Your supporters get 48-hour early access, patron-only content, and a real micro-share of your streaming revenue — not just bragging rights.'
                 },
                 {
                   step: '03',
                   icon: BarChart3,
                   title: 'Track everything. Get paid fast.',
                   body: "Real-time analytics show you exactly where your listeners are, what's working, and what's not. Transparent royalty splits. Instant Stripe payouts with no minimum over $10. No label. No middleman."
                 }
               ].map((item, i) => (
                 <div key={i} className="p-10 border border-white/5 rounded-3xl space-y-6 hover:bg-white/5 transition-colors group relative">
                    <div className="absolute top-8 right-8 text-[10px] font-bold text-white/10 uppercase tracking-widest">Step {item.step}</div>
                    <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/10 flex items-center justify-center text-[#00D2FF] group-hover:bg-[#00D2FF] group-hover:text-white transition-all">
                       <item.icon className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl uppercase">{item.title}</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.body}</p>
                 </div>
               ))}
            </div>
            <div className="mt-12 text-center">
               <Link href="/how-it-works/revenue-sharing" className="text-[#00D2FF] font-bold text-xs uppercase tracking-widest hover:underline">
                  See how the money works →
               </Link>
            </div>
         </div>
      </section>

      {/* INDUSTRY TOOLS */}
      <section className="bg-[var(--color-studio-elevated)] py-32 border-y border-white/5">
         <div className="section-container grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1 space-y-6">
               <p className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest">Industry tools</p>
               <h3 className="text-4xl uppercase leading-tight">Everything you need to build a music business.</h3>
               <Link href="/network/board" className="inline-flex items-center space-x-3 text-[#00D2FF] font-bold text-xs uppercase tracking-widest hover:translate-x-2 transition-transform">
                 <span>Browse Opportunities</span>
                 <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            {[
              { title: 'The New Major Platform', desc: 'Why distribute elsewhere when you can dominate here? NRH is where the industry happens. Your music, your data, your revenue — all in one professional network.', icon: Globe },
              { title: 'Fans become investors', desc: 'Set custom patron tiers. Offer revenue participation to your biggest supporters. Your community funds your next release — and shares in your success.', icon: Award },
              { title: 'Certified by ReactionsAndReviews', desc: 'Every release gets an independent audit score from the ReactionsAndReviews team. Build credibility with sync buyers, booking agents, and labels without compromising your independence.', icon: ShieldCheck }
            ].map((service, i) => (
              <div key={i} className="p-10 border border-white/5 rounded-3xl space-y-6 hover:bg-white/5 transition-colors group">
                 <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/10 flex items-center justify-center text-[#00D2FF] group-hover:bg-[#00D2FF] group-hover:text-white transition-all">
                    <service.icon className="w-7 h-7" />
                 </div>
                 <h4 className="text-xl uppercase">{service.title}</h4>
                 <p className="text-gray-500 text-xs font-medium leading-relaxed">{service.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 border-b border-white/5">
         <div className="section-container">
            <div className="text-center space-y-4 mb-20">
               <p className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest">Artist voices</p>
               <h2 className="text-5xl uppercase leading-none">Real results. Real artists.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 {
                   quote: "NRH helped me earn more from 10,000 patrons than I ever made from 10 million streams on Spotify.",
                   author: "Marcus Webb",
                   meta: "R&B Artist · Atlanta, GA"
                 },
                 {
                   quote: "The opportunity board landed me a sync deal with a Netflix docuseries in my second month on the platform. Nothing like this existed for independent artists before.",
                   author: "DJ Solarize",
                   meta: "Electronic Producer · London, UK"
                 },
                 {
                   quote: "I kept 100% of my masters and still grew my reach to 40 countries. That's unheard of for an indie artist. NRH changed the math for me.",
                   author: "Lena Khari",
                   meta: "Afrobeats Artist · Lagos, Nigeria"
                 }
               ].map((test, i) => (
                 <div key={i} className="space-y-6">
                    <div className="text-[#00D2FF] text-6xl font-serif leading-none">&ldquo;</div>
                    <p className="text-xl italic font-medium leading-relaxed text-white">
                      {test.quote}
                    </p>
                    <div>
                       <p className="text-sm font-bold text-white uppercase">{test.author}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{test.meta}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-[var(--color-studio-surface)] py-40 text-center space-y-12 overflow-hidden relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00D2FF]/10 rounded-full blur-[150px] -z-0"></div>
         <div className="relative z-10 space-y-10">
            <h2 className="text-white text-7xl md:text-8xl leading-[0.9] uppercase max-w-4xl mx-auto">
               Ready to own your<br />
               <span className="text-[#00D2FF]">music career?</span>
            </h2>
            <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
               Join thousands of independent artists already building on New Release Hub. Free to start. No label required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
               <Link href="/studio/login" className="btn-primary">Get Started Free</Link>
               <Link href="mailto:info@newreleasehub.com" className="text-white/60 hover:text-white font-bold text-xs uppercase tracking-[0.3em] transition-all">Schedule a Demo</Link>
            </div>
         </div>
      </section>

    </div>
  );
}
