'use client';
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ShieldCheck, Download, History, Zap, Loader2, AlertCircle, Star, Users, Music, Clock, CreditCard, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createStripeOnboardingLink, getStripeAccountStatus } from '@/app/actions/stripe';

export default function EarningsPage({ artist }: { artist: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stripeStatus, setStripeStatus] = useState<any>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [participation, setParticipation] = useState<any[]>([]);
  const [isLoadingParticipation, setIsLoadingParticipation] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [earningsRes, statusRes] = await Promise.all([
          fetch('/api/studio/earnings'),
          getStripeAccountStatus()
        ]);

        if (!earningsRes.ok) throw new Error('Failed to fetch earnings');
        const earningsJson = await earningsRes.json();
        
        setData(earningsJson);
        setStripeStatus(statusRes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
    fetchParticipation();
  }, []);

  const fetchParticipation = async () => {
    try {
      const res = await fetch('/api/studio/earnings/participation');
      const json = await res.json();
      if (json.success) setParticipation(json.participation);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingParticipation(false);
    }
  };

  const handleLinkPayout = async () => {
    setIsLinking(true);
    try {
      await createStripeOnboardingLink();
    } catch (err) {
      console.error('Failed to create onboarding link', err);
      setIsLinking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#00D2FF] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Retrieving Financial Records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-bold uppercase tracking-[0.3em] text-[10px]">Sync Error: {error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10">Retry</button>
      </div>
    );
  }

  const balance = data?.balance || 0;
  const payouts = data?.payouts || [];
  const stats = data?.stats || {};
  const earningsLevel = 'Enhanced';

  return (
    <div className="p-8 md:p-12 space-y-16 max-w-6xl">
      
      {/* INSTITUTIONAL SETTLEMENT HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-10">
           
           {/* LOGO */}
           <div className="flex">
              <Link href="/" className="w-14 h-14 rounded-2xl bg-transparent text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl"><img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" /></Link>
           </div>

           <div className="space-y-4">
             <div className="flex items-center space-x-3 text-[#00D2FF]">
               <ShieldCheck className="w-4 h-4 fill-current" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Verified Settlement Hub</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter italic uppercase text-white leading-none">Revenue<br />Control.</h1>
           </div>
        </div>
        <div className="flex items-center space-x-4">
           {stripeStatus?.connected ? (
             <button className="px-8 py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#00D2FF] hover:text-white transition-all shadow-2xl">
                Withdraw Funds
             </button>
           ) : (
             <button 
               onClick={handleLinkPayout}
               disabled={isLinking}
               className="px-8 py-4 rounded-xl bg-[#00D2FF] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-[#00B8E0] transition-all shadow-2xl flex items-center gap-2"
             >
                {isLinking ? <Loader2 className="w-3 h-3 animate-spin" /> : <CreditCard className="w-3 h-3" />}
                Link Payout Account
             </button>
           )}
           <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" />
           </button>
        </div>
      </header>

      {/* STRIPE ALERT IF NOT CONNECTED */}
      {!stripeStatus?.connected && (
        <section className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
               <AlertCircle className="w-7 h-7 text-amber-500" />
            </div>
            <div className="space-y-1">
               <h3 className="text-sm font-bold text-white uppercase tracking-widest">Payout Account Missing</h3>
               <p className="text-xs text-gray-500 font-medium">To receive master royalties and participation fees, you must connect a Stripe account.</p>
            </div>
          </div>
          <button 
            onClick={handleLinkPayout}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
             <span>Complete Onboarding</span>
             <ExternalLink className="w-3 h-3" />
          </button>
        </section>
      )}

      {/* REVENUE PERFORMANCE CHART */}
      <section className="bg-[#111] border border-white/5 rounded-[3rem] p-12 space-y-10">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h3 className="text-xl font-bold italic uppercase tracking-tight text-white">Revenue Performance</h3>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monthly Growth & Settlement Trends</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00D2FF]"></div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Settled Revenue</span>
               </div>
            </div>
         </div>

         <div className="h-64 flex items-end gap-4 md:gap-8 px-4">
            {data?.chartData && data.chartData.length > 0 ? (
               data.chartData.map((d: any, i: number) => {
                  const maxVal = Math.max(...data.chartData.map((item: any) => item.value), 1);
                  const height = (d.value / maxVal) * 100;
                  return (
                     <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                        <div className="w-full relative flex flex-col justify-end" style={{ height: '100%' }}>
                           <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: i * 0.1, duration: 1, ease: 'circOut' }}
                              className="w-full bg-gradient-to-t from-[#00D2FF]/20 to-[#00D2FF] rounded-t-xl group-hover:to-white transition-all relative"
                           >
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                 <span className="text-xs font-bold text-white bg-black border border-white/10 px-3 py-1 rounded-lg">${d.value.toLocaleString()}</span>
                              </div>
                           </motion.div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{d.label}</span>
                     </div>
                  );
               })
            ) : (
               <div className="w-full h-full flex items-center justify-center border border-dashed border-white/5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest italic">Awaiting Verified Data Consolidation...</p>
               </div>
            )}
         </div>
      </section>

      {/* BALANCE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform">
               <DollarSign className="w-20 h-20 text-black" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Available Settlement</p>
            <div className="space-y-2 relative z-10">
               <h2 className="text-5xl font-bold italic tracking-tighter text-black">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
               <p className="text-[10px] font-bold text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +14.2% from last month
               </p>
            </div>
         </div>

         <div className="bg-[#111] border border-white/5 p-10 rounded-[2.5rem] space-y-6 relative overflow-hidden group hover:border-white/20 transition-all">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active support (MRR)</p>
            <div className="space-y-1">
               <h2 className="text-4xl font-bold italic tracking-tighter text-white">${(stats.activesupportCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stats.supporterCount} Active Master Holders</p>
            </div>
         </div>

         <div className="bg-[#111] border border-white/5 p-10 rounded-[2.5rem] space-y-6 relative overflow-hidden group hover:border-white/20 transition-all">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Growth Pool</p>
            <div className="space-y-1">
               <h2 className="text-4xl font-bold italic tracking-tighter text-white">Level: {earningsLevel}</h2>
               <p className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest">Phase 8 Performance Multiplier Active</p>
            </div>
         </div>
      </div>

      {/* HISTORY */}
      <div className="space-y-8">
         <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center space-x-3">
               <History className="w-5 h-5 text-gray-500" />
               <h3 className="text-xl font-bold italic uppercase tracking-tight text-white">Settlement History</h3>
            </div>
            <button className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">View All Statements</button>
         </div>

         <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
            {payouts.length > 0 ? (
              <div className="divide-y divide-white/5">
                {payouts.map((payout: any) => (
                    <div key={payout.id} className="p-8 flex flex-col md:flex-row items-center justify-between hover:bg-white/[0.02] transition-colors gap-6">
                      <div className="flex items-center space-x-6 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-lg font-bold italic text-white uppercase tracking-tight">{payout.date}</p>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">{payout.type}</p>
                          </div>
                      </div>
                      <div className="flex items-center space-x-12">
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Status</p>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${payout.status === 'PAID' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                {payout.status}
                            </span>
                          </div>
                          <div className="text-right w-32">
                            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Settled Amount</p>
                            <p className="text-xl font-bold italic text-white tracking-tighter">${payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                          </div>
                          <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all">
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                      </div>
                    </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-700">
                   <History className="w-8 h-8" />
                </div>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">No Settlement Records Found.</p>
              </div>
            )}
         </div>
      </div>

       {/* PARTICIPATION LEDGER */}
       <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
             <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-[#00D2FF]" />
                <h3 className="text-xl font-bold italic uppercase tracking-tight text-white">Participation Ledger</h3>
             </div>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{participation.length} Holders Verified</p>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden">
             {isLoadingParticipation ? (
               <div className="py-20 text-center animate-pulse text-[10px] font-bold text-gray-700 uppercase tracking-widest">Consolidating Stakeholder Data...</div>
             ) : participation.length > 0 ? (
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-white/5">
                           <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Network Participant</th>
                           <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Reputation</th>
                           <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">Asset Share</th>
                           <th className="p-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] text-right">Yield Settled</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {participation.map((p: any) => (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                             <td className="p-8">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden">
                                      {p.User.avatarUrl && <img src={p.User.avatarUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />}
                                   </div>
                                   <div>
                                      <p className="font-bold text-white text-sm tracking-tight">{p.User.displayName}</p>
                                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Joined {new Date(p.createdAt).toLocaleDateString()}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="p-8">
                                <div className="flex items-center gap-2">
                                   <Star className="w-3.5 h-3.5 text-amber-500" />
                                   <span className="text-[10px] font-bold text-white uppercase tracking-widest">LVL {p.User.fanLevel}</span>
                                </div>
                             </td>
                             <td className="p-8">
                                <span className="text-xs font-black text-[#00D2FF] italic">{(p.revenueSharePercent * 100).toFixed(1)}%</span>
                             </td>
                             <td className="p-8 text-right">
                                <span className="text-sm font-black text-white italic tracking-tighter">${(p.amountEarned / 100).toFixed(2)}</span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
             ) : (
               <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-700">
                     <Users className="w-8 h-8" />
                  </div>
                  <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">No External Stakeholders Detected.</p>
               </div>
             )}
          </div>
       </div>

      {/* DISCLOSURE */}
      <footer className="p-10 bg-white/5 rounded-[2rem] border border-white/5">
         <div className="flex items-start space-x-6">
            <Zap className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
            <div className="space-y-4">
               <h4 className="text-xs font-bold text-white uppercase tracking-widest">Network Revenue Participation Disclosure</h4>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Settlements are calculated based on your Earnings Level and active Participation Licenses. Premium & Network Pool percentages are determined by quarterly platform performance. Historical performance is not indicative of future results.
               </p>
            </div>
         </div>
      </footer>

    </div>
  );
}


