import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Play, TrendingUp, Award, Disc, Search, ArrowRight, Globe, ShieldCheck, Upload, Heart, BarChart3, Zap, Radio, Users } from 'lucide-react';

const ARTIST_IMAGE_POOL = [
  '/images/default-avatar.png',
  '/images/default-avatar.png',
  '/images/default-avatar.png',
  '/images/default-cover.png',
  '/images/default-avatar.png',
  '/images/default-avatar.png',
];

import NetworkFeed from '@/components/network/NetworkFeed';
import HeroVisual from '@/components/home/HeroVisual';
import MusicNewsFeed from '@/components/network/MusicNewsFeed';

export default async function HomePage() {
  const hubs = await prisma.organization.findMany({
    where: { isPublic: true },
    orderBy: { totalStreams: 'desc' },
    take: 6,
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

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden px-4 sm:px-8 lg:px-16 py-20 sm:py-24 lg:py-32">
         <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-[3000ms]">
            <img
              src="/images/default-avatar.png"
              className="w-full h-full object-cover scale-110"
              alt="Independent artist performing"
            />
         </div>
         <div className="absolute inset-0 bg-gradient-to-r from-[#020202] via-[#02020299] to-transparent"></div>
         <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 flex flex-col items-center lg:items-start text-center lg:text-left">
               <div className="space-y-8">
                  <div className="flex items-center space-x-3 text-[#00D2FF]">
                     <Zap className="w-4 h-4 fill-current" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em]">The Independent Alternative</span>
                  </div>
                  <h1 className="text-white text-[clamp(2.5rem,10vw,7.5rem)] font-bold leading-[0.9] uppercase italic tracking-tighter break-words max-w-full">
                     Your Music.<br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600 text-glow">Your Fans.</span>
                  </h1>
                  <p className="text-gray-500 text-[clamp(1rem,2.5vw,1.35rem)] font-medium max-w-lg leading-relaxed italic">
                      "Institutional-grade tools for independent artists who own their masters and control their destiny."
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/register" className="px-12 py-5 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#00D2FF] hover:text-white transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]">Start Building</Link>
                  <Link href="/discover" className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Explore Network</Link>
               </div>
               
               <div className="pt-12 border-t border-white/5 flex items-center gap-12">
                  <div className="space-y-2">
                     <p className="text-3xl font-bold italic tracking-tighter text-white">100%</p>
                     <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Master Retention</p>
                  </div>
                  <div className="space-y-2">
                     <p className="text-3xl font-bold italic tracking-tighter text-[#00D2FF]">Real-Time</p>
                     <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Ledger Settlement</p>
                  </div>
               </div>
            </div>

            <div className="hidden lg:block">
               <HeroVisual />
            </div>
          </div>
      </section>

      {/* DISCOVERY FEED */}
      <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-8 lg:px-16">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            
            {/* MAIN DISCOVERY */}
            <div className="lg:col-span-2 space-y-16">
               <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center space-x-3 text-[#00D2FF]">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Trending this week</span>
                     </div>
                     <h2 className="text-[clamp(2rem,6vw,3.5rem)] uppercase leading-none">Discover Artists.</h2>
                  </div>
                  <div className="relative group w-full md:w-auto">
                     <input
                        type="text"
                        placeholder="Search Artists..."
                        className="bg-white/5 border border-white/10 rounded-full px-10 py-4 text-base focus:outline-none focus:ring-2 focus:ring-[#00D2FF33] transition-all w-full md:w-80 text-white"
                     />
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
                  {validHubs.map((hub, index) => {
                    const imageUrl = hub.profileImageUrl || ARTIST_IMAGE_POOL[index % ARTIST_IMAGE_POOL.length];
                    const isLive = hub.SessionDeck?.isPlaying;

                    return (
                       <Link 
                         href={`/fan/${hub.slug}`} 
                         key={hub.id} 
                         className="group relative bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#00D2FF4d] transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                       >
                         <div className="aspect-[0.8] relative overflow-hidden">
                           <img 
                             src={imageUrl} 
                             alt={hub.name} 
                             className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60"></div>
                           
                           {isLive && (
                             <div className="absolute top-6 left-6 flex items-center space-x-2 bg-red-600 text-white text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full animate-pulse">
                               <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                               <span>Live Session</span>
                             </div>
                           )}
                        </div>
                        
                        <div className="p-8 space-y-6">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h3 className="text-2xl font-bold uppercase italic tracking-tighter text-white">{hub.name}</h3>
                                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{hub.city}, {hub.country}</p>
                              </div>
                              <div className="flex flex-col items-end">
                                 <p className="text-[#00D2FF] text-lg font-bold italic tracking-tighter">{(hub.supporterCount || 0).toLocaleString()}</p>
                                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest leading-none">SUPPORTERs</p>
                              </div>
                           </div>
                           <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                 <Play className="w-3.5 h-3.5 text-gray-500" />
                                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{(hub.totalStreams || 0).toLocaleString()} streams</span>
                              </div>
                              <div className="px-4 py-2 rounded-full bg-white/5 text-white text-[9px] font-bold uppercase tracking-widest group-hover:bg-[#00D2FF] transition-colors">
                                 View Hub
                              </div>
                           </div>
                        </div>
                      </Link>
                    );
                  })}
               </div>
            </div>

            {/* SIDEBAR FEED */}
            <div className="lg:col-span-1 space-y-12">
               <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[#00D2FF]">
                     <Zap className="w-5 h-5 fill-current" />
                     <span className="text-xs font-bold uppercase tracking-widest">Network Live</span>
                  </div>
                  <h2 className="text-4xl uppercase leading-none italic font-bold">Activity.</h2>
               </div>
               
               <NetworkFeed />
            </div>
         </div>
      </section>

      {/* RADIO NETWORK PROMO */}
      <section className="py-16 sm:py-20 lg:py-32 bg-[#050505] border-y border-white/5 px-4 sm:px-8 lg:px-16 overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 space-y-12 relative z-10">
               <div className="space-y-6">
                  <div className="flex items-center space-x-3 text-[#00D2FF]">
                     <Radio className="w-5 h-5 animate-pulse" />
                     <span className="text-xs font-bold uppercase tracking-widest">24/7 Network Broadcast</span>
                  </div>
                  <h2 className="text-[clamp(2.5rem,8vw,5rem)] font-black tracking-tighter leading-[0.8] uppercase italic">
                     Live<br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Radio.</span>
                  </h2>
                  <p className="text-gray-500 text-xl font-medium max-w-lg leading-relaxed italic">
                     "The first internet radio network built on 100% master rights retention. Listen to the future of music, verified and live."
                  </p>
               </div>
               <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/radio" className="px-12 py-5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#00D2FF] hover:text-white transition-all shadow-2xl">Enter the Broadcast</Link>
                  <div className="flex items-center gap-4 px-8 py-5 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                     <Users className="w-4 h-4 text-[#00D2FF]" />
                     <span>84.2k active listeners</span>
                  </div>
               </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="absolute inset-0 bg-[#00D2FF]/5 blur-[120px] rounded-full"></div>
               <div className="relative z-10 grid grid-cols-2 gap-6 rotate-3">
                  {[
                    { name: 'Hip-Hop', color: 'from-orange-500 to-red-600', icon: '🔥' },
                    { name: 'Electronic', color: 'from-[#00D2FF] to-blue-700', icon: '⚡' },
                    { name: 'Afrobeats', color: 'from-emerald-400 to-green-600', icon: '🌍' },
                    { name: 'Lo-Fi', color: 'from-purple-500 to-indigo-600', icon: '🌙' }
                  ].map((station, i) => (
                    <div key={i} className="p-8 bg-[#111] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-white/20 transition-all hover:-translate-y-2 group cursor-pointer shadow-2xl">
                       <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${station.color} flex items-center justify-center text-xl shadow-lg`}>
                          {station.icon}
                       </div>
                       <h4 className="text-lg font-bold uppercase italic tracking-tighter text-white group-hover:text-[#00D2FF] transition-colors">{station.name}</h4>
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Live</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>


      {/* MUSIC INDUSTRY NEWS */}
      <section className="py-24 sm:py-32 lg:py-40 px-6 md:px-16 bg-[#020202]">
         <div className="max-w-7xl mx-auto">
            <MusicNewsFeed />
         </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 lg:py-32 bg-[#050505] border-y border-white/5 px-4 sm:px-8 lg:px-16">
         <div className="max-w-7xl mx-auto space-y-16 sm:space-y-24">
            <div className="text-center space-y-4">
               <div className="flex items-center justify-center space-x-3 text-[#00D2FF]">
                  <Disc className="w-5 h-5 animate-spin-slow" />
                  <span className="text-xs font-bold uppercase tracking-widest">The Independent Cycle</span>
               </div>
               <h2 className="text-[clamp(2rem,6vw,3.5rem)] uppercase leading-none">How It Works.</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
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
                   body: 'Set custom SUPPORTER tiers with exclusive perks. Your supporters get 48-hour early access, SUPPORTER-only content, and a real micro-share of your streaming revenue — not just bragging rights.'
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
                     <div className="w-14 h-14 rounded-2xl bg-[#00D2FF1a] flex items-center justify-center text-[#00D2FF] group-hover:bg-[#00D2FF] group-hover:text-white transition-all">
                       <item.icon className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl uppercase">{item.title}</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.body}</p>
                 </div>
               ))}
            </div>
            <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/how-it-works" className="text-white font-bold text-xs uppercase tracking-widest hover:text-[#00D2FF] transition-colors">
                  Learn more about the platform
               </Link>
               <span className="hidden sm:inline text-white/10">|</span>
               <Link href="/pricing" className="text-[#00D2FF] font-bold text-xs uppercase tracking-widest hover:underline">
                  See how the money works
               </Link>
            </div>
         </div>
      </section>

      {/* INDUSTRY TOOLS */}
      <section className="bg-[#020202] py-16 sm:py-20 lg:py-32 border-b border-white/5 px-4 sm:px-8 lg:px-16">
         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            <div className="lg:col-span-1 space-y-6">
               <p className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest">Industry tools</p>
               <h3 className="text-4xl uppercase leading-tight">Everything you need to build a music business.</h3>
               <Link href="/network/board" className="inline-flex items-center space-x-3 text-[#00D2FF] font-bold text-xs uppercase tracking-widest hover:translate-x-2 transition-transform">
                 <span>Browse Opportunities</span>
                 <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            {[
              { title: 'The Hub Ecosystem', desc: 'Why distribute elsewhere when you can dominate here? NRH is where the industry happens. Your music, your data, your revenue — all in one professional network.', icon: Globe },
              { title: 'Fans become investors', desc: 'Set custom SUPPORTER tiers. Offer revenue participation to your biggest supporters. Your community funds your next release — and shares in your success.', icon: Award },
              { title: 'Independent Growth', desc: 'Build credibility with sync buyers, booking agents, and venues using our verified performance metrics without compromising your independence.', icon: ShieldCheck }
            ].map((service, i) => (
              <div key={i} className="p-10 border border-white/5 rounded-3xl space-y-6 hover:bg-white/5 transition-colors group">
                 <div className="w-14 h-14 rounded-2xl bg-[#00D2FF1a] flex items-center justify-center text-[#00D2FF] group-hover:bg-[#00D2FF] group-hover:text-white transition-all">
                    <service.icon className="w-7 h-7" />
                 </div>
                 <h4 className="text-xl uppercase">{service.title}</h4>
                 <p className="text-gray-500 text-xs font-medium leading-relaxed">{service.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* TESTIMONIALS */}
       <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
             <div className="text-center space-y-4 mb-12 sm:mb-20">
                <p className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest">Artist voices</p>
                <h2 className="text-[clamp(2rem,6vw,3.5rem)] uppercase leading-none">Real results. Real artists.</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
               {[
                 {
                   quote: "NRH helped me earn more from 1,000 fans than I ever made from 10 million streams on other platforms.",
                   author: "Marcus Webb",
                   meta: "R&B Artist | Atlanta, GA"
                 },
                 {
                   quote: "The opportunity board landed me a sync deal with a Netflix docuseries in my second month on the platform. Nothing like this existed for independent artists before.",
                   author: "DJ Solarize",
                   meta: "Electronic Producer | London, UK"
                 },
                 {
                   quote: "I kept 100% of my masters and still grew my reach to 40 countries. That's unheard of for an indie artist. NRH changed the math for me.",
                   author: "Lena Khari",
                   meta: "Afrobeats Artist | Lagos, Nigeria"
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
       <section className="bg-[#111] py-24 sm:py-32 lg:py-40 text-center space-y-12 overflow-hidden relative px-4 sm:px-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#00D2FF1a] rounded-full blur-[150px] -z-0"></div>
         <div className="relative z-10 space-y-10">
            <h2 className="text-white text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9] uppercase max-w-4xl mx-auto break-words">
               Ready to own your<br />
               <span className="text-[#00D2FF]">music career?</span>
            </h2>
            <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
               Join thousands of independent artists already building on New Release Hub. Free to start. No label required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
               <Link href="/studio/login" className="btn-primary">Get Started Free</Link>
               <Link href="mailto:info@newreleasehub.com" className="text-white/60 hover:text-white font-bold text-xs uppercase tracking-[0.3em] transition-all">Contact Us</Link>
            </div>
         </div>
      </section>

    </div>
  );
}


