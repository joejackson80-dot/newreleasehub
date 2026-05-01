'use client';
import React, { useState } from 'react';
import { 
  ShieldAlert, TrendingUp, DollarSign, Users, 
  Activity, Zap, Lock, ArrowUpRight, CheckCircle2, 
  XCircle, Clock, Search, Filter, RefreshCcw, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GovernanceClient({ 
  pendingPayouts, 
  openFraudCases, 
  pools,
  recentSettlements
}: any) {
  const [activeTab, setActiveTab] = useState('payouts');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const stats = [
    { label: 'Pool A (Ad Revenue)', value: `$${((pools?.poolATotal || 0) / 100).toLocaleString()}`, icon: Activity, trend: '+12.4%', color: 'text-purple-500' },
    { label: 'Pool C (Subscriptions)', value: `$${((pools?.poolCTotal || 0) / 100).toLocaleString()}`, icon: Zap, trend: '+8.1%', color: 'text-purple-500' },
    { label: 'Pending Settlement', value: `$${(pendingPayouts.reduce((acc: number, p: any) => acc + p.amountCents, 0) / 100).toLocaleString()}`, icon: Clock, trend: 'High Priority', color: 'text-amber-500' },
    { label: 'Fraud Incidents', value: openFraudCases.length, icon: ShieldAlert, trend: 'Low Density', color: 'text-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 space-y-12 font-mono">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-[#A855F7]">
            <Lock className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">NRH Institutional Governance</span>
          </div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Treasury Control.</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-xl">
             Authorized access only. Monitor network liquidity, approve institutional settlements, and maintain protocol integrity.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right space-y-1">
             <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Network Status</p>
             <p className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Synchronized
             </p>
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-6 group hover:border-[#A855F7]/20 transition-all">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black italic tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN INTERFACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR TABS */}
        <div className="lg:col-span-3 space-y-4">
          {[
            { id: 'payouts', label: 'Payout Queue', count: pendingPayouts.length, icon: DollarSign },
            { id: 'fraud', label: 'Fraud Audit', count: openFraudCases.length, icon: ShieldAlert },
            { id: 'settlements', label: 'Recent Settlements', count: null, icon: CheckCircle2 },
            { id: 'settings', label: 'Protocol Config', count: null, icon: Filter },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all border ${
                activeTab === tab.id 
                  ? 'bg-white/5 border-white/10 text-white' 
                  : 'border-transparent text-gray-600 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center space-x-4">
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
              </div>
              {tab.count !== null && (
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${tab.count > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-white/5 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-9 bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">
              {activeTab === 'payouts' && 'Pending Disbursements'}
              {activeTab === 'fraud' && 'Active Integrity Reviews'}
              {activeTab === 'settlements' && 'Platform Settlement History'}
              {activeTab === 'settings' && 'Network Governance Parameters'}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-all">
                <Search className="w-4 h-4" />
              </button>
              <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-all">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'payouts' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {pendingPayouts.length > 0 ? (
                    pendingPayouts.map((p: any) => (
                      <div key={p.id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center space-x-6">
                           <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A855F7]">
                              <DollarSign className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{p.Organization.name}</p>
                              <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">${(p.amountCents / 100).toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-12">
                           <div className="text-right">
                              <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Method</p>
                              <p className="text-[10px] font-bold text-white uppercase tracking-widest">{p.method}</p>
                           </div>
                           <div className="flex items-center space-x-3">
                              <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
                                 Decline
                              </button>
                              <button 
                                onClick={async () => {
                                  setIsProcessing(p.id);
                                  const { authorizePayout } = await import('@/app/actions/admin');
                                  const res = await authorizePayout(p.id);
                                  setIsProcessing(null);
                                  if (res.error) {
                                    alert('Payout Failed: ' + res.error);
                                  }
                                }}
                                disabled={isProcessing === p.id}
                                className="px-6 py-3 rounded-xl bg-[#A855F7] text-black text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(168, 85, 247,0.2)] disabled:opacity-50"
                              >
                                 {isProcessing === p.id ? 'Processing...' : 'Authorize'}
                              </button>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center space-y-4 border border-dashed border-white/10 rounded-3xl">
                       <CheckCircle2 className="w-12 h-12 text-white/5 mx-auto" />
                       <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Payout queue fully settled.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'fraud' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                   {openFraudCases.map((c: any) => (
                      <div key={c.id} className="p-8 bg-rose-500/[0.02] border border-rose-500/10 rounded-3xl flex items-center justify-between">
                         <div className="flex items-center space-x-6">
                            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                               <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{c.Organization.name}</p>
                               <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest italic">{c.type}</p>
                            </div>
                         </div>
                         <div className="flex items-center space-x-10 text-right">
                            <div>
                               <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-1">Streams At Risk</p>
                               <p className="text-[10px] font-bold text-white uppercase tracking-widest">{c.excludedStreamCount.toLocaleString()}</p>
                            </div>
                            <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline underline-offset-4">Review Case →</button>
                         </div>
                      </div>
                   ))}
                </motion.div>
              )}

              {activeTab === 'settlements' && (
                 <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                   {recentSettlements.map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between p-6 border-b border-white/5 hover:bg-white/[0.01] transition-all">
                         <div className="flex items-center space-x-4">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <div>
                               <p className="text-[10px] font-bold text-white uppercase">{s.Organization.name}</p>
                               <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">ID: {s.id.substring(0, 8)}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-white italic tracking-tighter">${(s.amountCents / 100).toFixed(2)}</p>
                            <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">{new Date(s.processedAt).toLocaleDateString()}</p>
                         </div>
                      </div>
                   ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
