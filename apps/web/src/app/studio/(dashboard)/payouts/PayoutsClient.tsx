'use client';
import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowUpRight, Clock, CheckCircle2, 
  AlertCircle, Building2, CreditCard, ChevronRight,
  TrendingUp, ShieldCheck, Info, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { requestPayout } from '@/app/actions/payouts';

export default function PayoutsClient({ artist }: { artist: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [method, setMethod] = useState('STRIPE');
  const [balance, setBalance] = useState(artist?.balanceCents || 0);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/studio/payouts');
      const data = await res.json();
      if (data.success) setRequests(data.payoutRequests);
    } catch (e) {
      toast.error('Failed to load payout history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = Math.floor(parseFloat(withdrawAmount) * 100);
    
    if (amountCents > balance) {
      toast.error('Insufficient institutional balance');
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await requestPayout({ 
        amountCents, 
        method: method as any, 
        destination: 'Primary Connected Account' 
      });
      
      if (res.success) {
        toast.success(res.message || 'Withdrawal Request Initialized');
        setBalance((prev: number) => prev - amountCents);
        // Refresh history
        fetchPayouts();
        setShowModal(false);
        setWithdrawAmount('');
      } else {
        toast.error(res.error || 'Withdrawal failed');
      }
    } catch (e) {
      toast.error('Network error during settlement');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 md:p-12 space-y-12">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
         <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#A855F7]">
               <Wallet className="w-5 h-5" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Institutional Settlement Console</span>
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter">Payouts.</h1>
            <p className="text-zinc-500 font-medium italic max-w-xl">
               Manage your master royalty withdrawals and monitor settlement status across the global network.
            </p>
         </div>

         <div className="flex items-center gap-6">
            <div className="text-right">
               <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Available for Withdrawal</p>
               <h2 className="text-4xl font-black italic text-white tracking-tighter">${(balance / 100).toLocaleString()}</h2>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="px-10 py-5 bg-[#A855F7] text-black font-black uppercase tracking-widest text-[11px] rounded-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(168, 85, 247,0.2)]"
            >
               Request Settlement
            </button>
         </div>
      </header>

      {/* STATS STRIP */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Total Withdrawn', value: `$${(requests.filter(r => r.status === 'PROCESSED').reduce((acc, r) => acc + r.amountCents, 0) / 100).toLocaleString()}`, icon: TrendingUp },
           { label: 'Pending Settlement', value: `$${(requests.filter(r => r.status === 'PENDING').reduce((acc, r) => acc + r.amountCents, 0) / 100).toLocaleString()}`, icon: Clock },
           { label: 'Protocol Authority', value: 'High', icon: ShieldCheck }
         ].map((stat, i) => (
           <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4">
              <div className="flex items-center justify-between">
                 <stat.icon className="w-5 h-5 text-zinc-600" />
                 <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">NRH-V1.4</span>
              </div>
              <div className="space-y-1">
                 <h3 className="text-3xl font-black italic text-white tracking-tighter">{stat.value}</h3>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              </div>
           </div>
         ))}
      </section>

      {/* SECURITY STATUS HUB */}
      <section className="bg-zinc-900/50 border border-white/5 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${artist.isVerified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
               <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-xl font-black italic uppercase tracking-tighter">Security Protocol</h3>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Multi-Layer Financial Guard Active</p>
            </div>
         </div>

         <div className="flex flex-wrap gap-4">
            <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 ${artist.isVerified ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-zinc-600'}`}>
               <CheckCircle2 className="w-4 h-4" />
               <span className="text-[9px] font-black uppercase tracking-widest">KYC Verified</span>
            </div>
            <div className="px-6 py-3 rounded-2xl border bg-emerald-500/5 border-emerald-500/20 text-emerald-500 flex items-center gap-3">
               <CheckCircle2 className="w-4 h-4" />
               <span className="text-[9px] font-black uppercase tracking-widest">No Open Fraud Audits</span>
            </div>
            <div className="px-6 py-3 rounded-2xl border bg-white/5 border-white/10 text-zinc-600 flex items-center gap-3">
               <CheckCircle2 className="w-4 h-4" />
               <span className="text-[9px] font-black uppercase tracking-widest">Ledger Sealed</span>
            </div>
         </div>
      </section>

      {/* HISTORY */}
      <section className="space-y-8">
         <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Settlement History</h3>
            <div className="px-4 py-2 bg-white/5 rounded-full text-[9px] font-bold text-zinc-500 uppercase tracking-widest border border-white/5">
               All Time Data
            </div>
         </div>

         <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
               <thead className="bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
                  <tr>
                     <th className="p-8">Date</th>
                     <th className="p-8">Method</th>
                     <th className="p-8">Status</th>
                     <th className="p-8">Amount</th>
                     <th className="p-8 text-right">Receipt</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                       <td colSpan={5} className="p-20 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-[#A855F7] animate-pulse">
                             <Wallet className="w-6 h-6" />
                          </div>
                          <p className="mt-4 text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Syncing Ledger...</p>
                       </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                       <td colSpan={5} className="p-20 text-center space-y-4">
                          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">No Settlements Processed</p>
                       </td>
                    </tr>
                  ) : (
                    requests.map((r) => (
                      <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                         <td className="p-8">
                            <span className="text-xs font-bold text-white uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</span>
                         </td>
                         <td className="p-8">
                            <div className="flex items-center gap-3">
                               {r.method === 'STRIPE' ? <CreditCard className="w-4 h-4 text-purple-400" /> : <Building2 className="w-4 h-4 text-blue-400" />}
                               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{r.method}</span>
                            </div>
                         </td>
                         <td className="p-8">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                               r.status === 'PROCESSED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                               r.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                               'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            }`}>
                               {r.status}
                            </span>
                         </td>
                         <td className="p-8">
                            <span className="text-lg font-black italic text-white tracking-tighter">${(r.amountCents / 100).toLocaleString()}</span>
                         </td>
                         <td className="p-8 text-right">
                            <button className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                               Verified Data <ChevronRight className="w-4 h-4 inline" />
                            </button>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </section>

      {/* WITHDRAW MODAL */}
      <AnimatePresence>
         {showModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-12 space-y-8 shadow-2xl relative"
              >
                 <button 
                   onClick={() => setShowModal(false)}
                   className="absolute top-10 right-10 text-zinc-600 hover:text-white"
                 >
                    <X className="w-6 h-6" />
                 </button>

                 <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#A855F7] uppercase tracking-widest">Settlement Request</span>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">Withdraw Funds.</h3>
                 </div>

                 <form onSubmit={handleWithdraw} className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Withdrawal Amount ($)</label>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black italic text-zinc-700">$</span>
                          <input 
                            type="number"
                            step="0.01"
                            required
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-12 pr-6 text-2xl font-black italic text-white focus:outline-none focus:border-[#A855F7]/50 transition-all"
                          />
                       </div>
                       <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Max Available: ${(balance / 100).toLocaleString()}</p>
                    </div>

                    <div className="space-y-4">
                       <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Settlement Method</label>
                       <div className="grid grid-cols-2 gap-4">
                          <button 
                            type="button"
                            onClick={() => setMethod('STRIPE')}
                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${method === 'STRIPE' ? 'bg-[#A855F7]/10 border-[#A855F7]/50 text-[#A855F7]' : 'bg-white/5 border-white/10 text-zinc-500'}`}
                          >
                             <CreditCard className="w-6 h-6" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">Stripe Connect</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => setMethod('BANK')}
                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${method === 'BANK' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-zinc-500'}`}
                          >
                             <Building2 className="w-6 h-6" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">Bank Transfer</span>
                          </button>
                       </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
                       <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                       <p className="text-[9px] font-bold text-amber-500/80 uppercase leading-relaxed tracking-widest">
                          Settlements take 3-5 business days to clear. High-value withdrawals may trigger Verified compliance auditing.
                       </p>
                    </div>

                    <button 
                      type="submit"
                      disabled={isWithdrawing}
                      className="w-full py-6 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50"
                    >
                       {isWithdrawing ? 'Initializing...' : 'Confirm Settlement'}
                    </button>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>

    </div>
  );
}
