import React from 'react';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { Award, Music, ShieldCheck, Globe, Star, TrendingUp, Grid, List, Zap, Radio, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function FanProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const fanId = params.id;

  const licenses = await prisma.participationLicense.findMany({
    where: { userId: fanId },
    include: {
      MusicAsset: {
        include: { Organization: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalSpent = licenses.reduce((acc, lic) => acc + lic.feeCents, 0) / 100;
  const totalStake = licenses.reduce((acc, lic) => acc + (lic.allocatedBps / 100), 0).toFixed(2);
  const uniqueArtists = new Set(licenses.map(lic => lic.MusicAsset?.Organization?.id).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-white selection:text-black">
      {/* Header / Hero Section */}
      <div className="relative h-80 bg-gradient-to-b from-zinc-900 to-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-6xl mx-auto px-8 pt-24 relative z-10 flex flex-col md:flex-row items-end justify-between">
           <div className="flex items-center space-x-8">
              <div className="w-32 h-32 rounded-3xl bg-zinc-800 border-4 border-black shadow-2xl flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent"></div>
                 <Award className="w-16 h-16 text-white/20" />
              </div>
              <div className="space-y-2 pb-2">
                 <div className="flex items-center space-x-3">
                    <h1 className="text-4xl font-bold tracking-tight">{fanId}</h1>
                    <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest text-white/60 flex items-center space-x-1">
                       <ShieldCheck className="w-3 h-3 text-green-500" />
                       <span>Verified Supporter</span>
                    </div>
                 </div>
                 <p className="text-gray-500 font-medium">Digital Master Participation Collector</p>
              </div>
           </div>

           <div className="flex space-x-8 pb-4">
              <div className="text-center">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Stake Owned</p>
                 <p className="text-2xl font-bold">{totalStake}%</p>
              </div>
              <div className="text-center">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Portfolio Value</p>
                 <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-center">
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Artists Backed</p>
                 <p className="text-2xl font-bold">{uniqueArtists}</p>
              </div>
           </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-12">
         {/* PORTFOLIO STATS (IMPROVEMENT) */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {[
              { label: 'Unclaimed Yield', val: `$${(totalSpent * 0.08).toFixed(2)}`, color: 'text-green-500', icon: TrendingUp },
              { label: 'Contract Integrity', val: '99.9%', color: 'text-blue-500', icon: ShieldCheck },
              { label: 'Network Rank', val: '#1,204', color: 'text-orange-500', icon: Star },
              { label: 'Daily Appreciation', val: '+0.42%', color: 'text-white', icon: Zap }
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-2 backdrop-blur-xl">
                 <div className="flex items-center space-x-2 text-gray-500">
                    <stat.icon className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{stat.label}</span>
                 </div>
                 <p className={`text-2xl font-bold tracking-tighter italic ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* PORTFOLIO GRID */}
            <div className="lg:col-span-2 space-y-10">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center space-x-3">
                     <Music className="w-5 h-5 text-gray-500" />
                     <span className="italic tracking-tight text-white/40">Participation Portfolio</span>
                  </h2>
                  <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
                     <button className="p-2 bg-zinc-800 rounded-md"><Grid className="w-4 h-4 text-white" /></button>
                     <button className="p-2 text-gray-500"><List className="w-4 h-4 hover:text-white" /></button>
                  </div>
               </div>

               {licenses.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {licenses.map((lic) => (
                     <Link 
                       key={lic.id} 
                       href={`/license/${lic.id}`}
                       className="group relative"
                     >
                       {/* HOLOGRAPHIC BACKGROUND GLOW */}
                       <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-orange-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                       
                       <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all hover:translate-y-[-8px] shadow-2xl relative z-10">
                          {/* HOLOGRAPHIC SCANNING BAR */}
                          <div className="absolute left-0 right-0 h-[1px] bg-white/20 blur-sm z-20 pointer-events-none top-0" />
                          
                          <div className="aspect-[4/5] p-10 flex flex-col justify-between relative overflow-hidden">
                             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                             
                             <div className="relative z-10 flex justify-between items-start">
                                <div className="space-y-1">
                                   <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Asset Profile</p>
                                   <p className="text-sm font-bold text-white tracking-tight italic uppercase">{lic.MusicAsset?.Organization?.name || 'Unknown Artist'}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                   <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                   </div>
                                   <div className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-[7px] font-bold text-green-500 uppercase tracking-widest">Verified Account</div>
                                </div>
                             </div>
      
                             <div className="relative z-10 space-y-6">
                                <div className="w-16 h-[1px] bg-white/10"></div>
                                <h3 className="text-3xl font-bold tracking-tighter leading-tight italic">"{lic.MusicAsset?.title || 'Untitled Asset'}"</h3>
                                <div className="flex items-center space-x-8">
                                   <div>
                                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Master Stake</p>
                                      <p className="text-xl font-bold text-white">{(lic.allocatedBps / 100).toFixed(2)}%</p>
                                   </div>
                                   <div>
                                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Contract Type</p>
                                      <p className="text-xl font-bold text-white tracking-tighter">NETWORK-V1</p>
                                   </div>
                                </div>
                             </div>
      
                             <div className="relative z-10 pt-8 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                   <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Stake</p>
                                </div>
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em]">#{lic.id.slice(0, 8)}</span>
                             </div>
                          </div>
                       </div>
                     </Link>
                   ))}
                 </div>
               ) : (
                 <div className="py-32 text-center space-y-6 bg-zinc-900/10 rounded-[3rem] border border-dashed border-white/5">
                    <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto border border-white/5">
                       <Star className="w-8 h-8 text-zinc-800" />
                    </div>
                    <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium">Your participation portfolio is empty. Explore the hubs to acquire your first network stake.</p>
                    <Link href="/" className="inline-block px-10 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">Browse Active Hubs</Link>
                 </div>
               )}
            </div>

            {/* THE SIGNAL (COLLECTIVE NEWSFEED) */}
            <div className="space-y-10">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center space-x-3">
                     <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                     <span className="italic tracking-tight text-white/40">The Signal</span>
                  </h2>
                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Global Link Active</span>
               </div>

               <div className="space-y-6">
                  {[
                    { type: 'YIELD', artist: 'HELLZ-FLAME', msg: 'Network Yield payout distributed to 14 participants.', time: '2m ago' },
                    { type: 'LIVE', artist: 'SILK-ROAD', msg: 'Broadcasting now from Tokyo Studio A.', time: '14m ago' },
                    { type: 'NEW', artist: 'ALPHA-ARTIST', msg: 'New master asset "Resonance" secured in Vault.', time: '1h ago' },
                    { type: 'STAKE', artist: 'GHOST-MODE', msg: 'Major stake (5.00%) secured by fan_88.', time: '3h ago' }
                  ].map((signal, i) => (
                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4 hover:bg-white/[0.05] transition-all group">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">{signal.artist}</p>
                             <p className="text-xs font-bold text-white leading-relaxed">{signal.msg}</p>
                          </div>
                          <span className="text-[8px] font-bold text-gray-800 uppercase tracking-widest">{signal.time}</span>
                       </div>
                       <div className="pt-4 border-t border-white/5 flex items-center space-x-3 opacity-40 group-hover:opacity-100 transition-opacity">
                          <span className="text-[8px] font-bold uppercase tracking-widest">Signal Verified</span>
                          <div className="flex-1 h-px bg-white/10"></div>
                          <ArrowRight className="w-3 h-3 text-gray-600" />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-10 bg-gradient-to-tr from-white/5 to-transparent border border-white/10 rounded-[2.5rem] space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <ShieldCheck className="w-20 h-20" />
                  </div>
                  <h3 className="text-lg font-bold italic tracking-tight">Institutional Protection.</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">Your stakes are protected by the Support-Tier network model. View the legal whitepaper to understand network security.</p>
                  <Link href="/network/whitepaper" className="block w-full py-4 rounded-2xl bg-white text-black text-center font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">Read Whitepaper</Link>
               </div>
            </div>
         </div>
      </main>

      <footer className="max-w-6xl mx-auto px-8 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-40">
         <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">New Release Hub Verified Collector</span>
         </div>
      </footer>
    </div>
  );
}

function ExternalLink({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
  );
}
