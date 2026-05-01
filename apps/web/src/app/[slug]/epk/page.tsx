import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { ShieldCheck, TrendingUp, Award, Globe, Video, Disc, Activity, FileText, Download, Share2, Briefcase, BarChart3, Radio, Music, User } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/ui/FadeIn';
import EPKClient from './EPKClient';

export default async function ElectronicPressKitPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      MusicAssets: { take: 10, orderBy: { createdAt: 'desc' } },
      Followers: true,
      ParticipationLicenses: true,
      SessionArchives: { take: 5, orderBy: { createdAt: 'desc' } }
    }
  });

  if (!org) notFound();

  // Financial Metrics Simulation
  const totalFunding = org.ParticipationLicenses.reduce((acc, lic) => acc + lic.feeCents, 0) / 100;
  const activeStakes = org.ParticipationLicenses.length;
  const avgYieldBps = 142; // Simulated network average

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-white selection:text-black font-sans pb-32">
      <EPKClient org={org} />
      
      {/* INSTITUTIONAL HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-6 border-b border-white/5 bg-black/40 backdrop-blur-3xl flex justify-between items-center">
         <div className="flex items-center space-x-4">
            <Link href="/" className="w-10 h-10 rounded-xl bg-transparent text-black flex items-center justify-center font-bold text-xl tracking-tighter hover:scale-105 transition-transform"><img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" /></Link>
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] leading-none">Institutional Press Kit</span>
               <span className="text-xs font-bold text-white uppercase tracking-tighter italic mt-1">{org.name}</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <Link href={`/${slug}/live`} className="hidden md:flex items-center space-x-2 bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all">
               <Globe className="w-4 h-4" />
               <span>Public Hub</span>
            </Link>
            <Link href={`/${slug}/live`} className="bg-[#F1F5F9] text-white px-8 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-[#F1F5F9]/20">Join Live Session</Link>
         </div>
      </header>

      {/* HERO / STATUS */}
      <section className="pt-32 md:pt-48 pb-20 md:pb-32 px-6 md:px-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
         <FadeIn direction="up">
            <div className="space-y-10 md:space-y-12">
               <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="inline-flex items-center space-x-2 bg-[#F1F5F9]/10 border border-[#F1F5F9]/20 px-4 py-1.5 rounded-full">
                       <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#F1F5F9]" />
                       <span className="text-[7px] md:text-[8px] font-bold text-[#F1F5F9] uppercase tracking-widest">Verified Artist Hub</span>
                    </div>
                    {org.ParticipationLicenses.length > 0 && (
                      <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">
                         <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500" />
                         <span className="text-[7px] md:text-[8px] font-bold text-orange-500 uppercase tracking-widest">Revenue Participation Available</span>
                      </div>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.9]">{org.name}</h1>
                  <p className="text-base md:text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                     Independent Artist & Master Rights Holder. Scaled through decentralized supporterage and fan revenue shares.
                     {org.ParticipationLicenses.length > 0 && ` Currently offering ${org.ParticipationLicenses[0].allocatedBps / 100}% stake starting at $${org.ParticipationLicenses[0].feeCents / 100}.`}
                  </p>
               </div>
            </div>
         </FadeIn>

         <FadeIn direction="left" delay={0.2}>
            <div className="relative aspect-square bg-zinc-900/40 rounded-3xl md:rounded-[4rem] border border-white/5 overflow-hidden group shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent z-10"></div>
               {org.profileImageUrl ? (
                 <img src={org.profileImageUrl} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-zinc-800"><User className="w-20 md:w-32 h-20 md:h-32" /></div>
               )}
               <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 space-y-1 md:space-y-2">
                  <p className="text-[8px] md:text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Account Verified</p>
                  <p className="text-xl md:text-2xl font-bold italic text-white tracking-tighter uppercase">Oct. 2024</p>
               </div>
            </div>
         </FadeIn>
      </section>

      {/* THE MASTER LEDGER */}
      <section className="bg-white/[0.02] border-y border-white/5 py-32">
         <div className="max-w-7xl mx-auto px-10 space-y-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
               <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                     <Disc className="w-4 h-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">The Master Ledger</span>
                  </div>
                  <h2 className="text-5xl font-bold tracking-tighter italic uppercase">Revenue Participation<br />Inventory.</h2>
               </div>
               <p className="text-sm text-gray-500 max-w-sm font-medium leading-relaxed">
                  Every asset listed below is secured by New Release Hub. All master recordings are held 100% by the artist while 5,000bps (50%) of revenue is distributed to supporters.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {org.MusicAssets.map((asset) => (
                  <div key={asset.id} className="group bg-black border border-white/5 rounded-[2.5rem] p-10 space-y-8 hover:border-white/10 transition-all">
                     <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 text-gray-700 group-hover:text-white transition-colors">
                           <Music className="w-6 h-6" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[8px] font-bold text-green-500 uppercase tracking-widest">Active Yield</div>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-xl font-bold italic tracking-tight text-white">"{asset.title}"</h4>
                        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Asset ID: {asset.id.slice(0, 8)}</p>
                     </div>
                     <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                        <div>
                           <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mb-1">Staked Bps</p>
                           <p className="text-xl font-bold text-white tracking-tighter italic">{asset.allocatedLicenseBps} bps</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mb-1">Valuation</p>
                           <p className="text-xl font-bold text-orange-500 tracking-tighter italic">$1.2k</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* PERFORMANCE DATA */}
      <section className="py-32 px-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-20">
         <div className="space-y-10">
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-gray-600">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Audience Intelligence</span>
               </div>
               <h3 className="text-3xl font-bold italic uppercase tracking-tighter">Live Session<br />Intensity.</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium leading-relaxed">
               New Release Hub tracks real-time engagement peaks during live broadcasts. This data certifies the high-intent nature of the audience.
            </p>
            <div className="p-8 bg-zinc-900/40 border border-white/5 rounded-3xl space-y-6">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Hype Velocity</span>
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">+42% Peak</span>
               </div>
               <div className="flex items-end space-x-1.5 h-16">
                  {[20, 40, 30, 60, 45, 80, 50, 90, 70, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/10 rounded-sm hover:bg-white/20 transition-colors" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-2 space-y-12">
            <div className="bg-white/5 border border-white/5 rounded-[3rem] p-12 flex flex-col md:flex-row gap-16 items-center">
               <div className="flex-1 space-y-6">
                  <h4 className="text-2xl font-bold italic tracking-tighter uppercase">Professional<br />Credentials.</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                     {org.officialBio || "Independent artist operating on a decentralized supporterage model. Secured master ownership and collective funding milestones reached across 14 release cycles."}
                  </p>
               </div>
               <div className="grid grid-cols-1 gap-4 w-full md:w-64">
                  {[
                    { label: 'Global Rank', val: '#1,204', icon: Globe },
                    { label: 'Session Time', val: '142h', icon: Radio },
                    { label: 'Archives', val: org.SessionArchives.length.toString(), icon: Video }
                  ].map((stat, i) => (
                    <div key={i} className="p-4 bg-black border border-white/5 rounded-2xl flex items-center space-x-4">
                       <stat.icon className="w-4 h-4 text-gray-700" />
                       <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">{stat.label}</span>
                          <span className="text-xs font-bold text-white uppercase tracking-tighter">{stat.val}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {org.SessionArchives.map((archive) => (
                  <div key={archive.id} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 flex items-center space-x-6 group hover:border-white/10 transition-all">
                     <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-gray-800 group-hover:text-red-500 transition-colors">
                        <Video className="w-6 h-6" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest truncate">{archive.title}</p>
                        <p className="text-xs font-bold text-white uppercase tracking-tighter italic mt-1">{archive.totalFundingCents / 100} USD Payout</p>
                     </div>
                     <Share2 className="w-4 h-4 text-gray-700 hover:text-white cursor-pointer" />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="py-40 text-center space-y-12">
         <FadeIn direction="up">
            <div className="space-y-6">
               <h2 className="text-3xl font-bold tracking-tighter italic uppercase">Invest in the<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Future of Masters.</span></h2>
               <p className="text-gray-600 max-w-xl mx-auto font-medium">
                  Professional inquiries, label curation, and institutional grants only. Secure a stake in a high-vitality artist network.
               </p>
            </div>
         </FadeIn>
         <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href={`/${slug}/live`} className="bg-white text-black px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl">Acquire Master Stake</Link>
            <button className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">Contact Management</button>
         </div>
      </section>

    </div>
  );
}
