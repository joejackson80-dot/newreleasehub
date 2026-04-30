'use client';
import React, { useState } from 'react';
import { 
  Gavel, Users, ShieldCheck, ArrowRight, 
  CheckCircle2, XCircle, Clock, TrendingUp, 
  Lock, AlertTriangle, Info, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { voteOnProposal } from '@/app/actions/governance';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function GovernanceClient({ initialProposals, user }: { initialProposals: any[], user: any }) {
  const [proposals, setProposals] = useState(initialProposals);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/governance/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.stats);
      });
  }, []);

  const handleVote = async (proposalId: string, type: 'YES' | 'NO') => {
    setVotingId(proposalId);
    const res = await voteOnProposal(proposalId, type);
    if (res.success) {
      toast.success('Vote Registered in Protocol Ledger');
      // Update local state (optional, or rely on revalidation)
    } else {
      toast.error(res.error || 'Vote Failed');
    }
    setVotingId(null);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white font-sans pb-32">
      
      {/* INSTITUTIONAL HEADER */}
      <header className="pt-20 pb-16 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto space-y-12">
         {/* LOGO */}
         <div className="flex">
            <Link href="/" className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</Link>
         </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div className="space-y-6">
               <div className="flex items-center space-x-3 text-[#00D2FF]">
                  <Gavel className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Decentralized Governance Matrix</span>
               </div>
               <h1 className="text-[clamp(3rem,12vw,6rem)] font-black tracking-tighter uppercase leading-[0.8] italic">
                  Network<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Protocol.</span>
               </h1>
               <p className="text-zinc-500 max-w-xl font-medium leading-relaxed italic text-sm sm:text-base">
                  "Fans are the network. Exercise your governance rights to influence artist trajectories, fee structures, and the distribution of network equity."
               </p>
            </div>
            
            <div className="bg-[#111] border border-white/5 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] space-y-4 w-full lg:min-w-[300px]">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your Vote Weight</span>
                  <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
               </div>
               <div className="flex items-end gap-3">
                  <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white">x{user?.fanLevel || 1}</h2>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Based on LVL {user?.fanLevel || 1}</p>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00D2FF]" style={{ width: '60%' }}></div>
               </div>
            </div>
         </div>
      </header>

      {/* STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16">
          {[
            { label: 'Total Votes Cast', value: stats?.totalVotes?.toLocaleString() || '...', icon: CheckCircle2 },
            { label: 'Active Proposals', value: stats?.activeProposals?.toString() || proposals.length.toString(), icon: Zap },
            { label: 'Network Consensus', value: `${stats?.consensus || '...'}%`, icon: TrendingUp },
            { label: 'Locked Equity', value: `$${((stats?.lockedEquity || 0) / 1000).toFixed(1)}k`, icon: Lock }
          ].map((s, i) => (
           <div key={i} className="bg-[#111] border border-white/05 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-2">
             <div className="flex items-center justify-between">
                <s.icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                <span className="text-[8px] sm:text-[9px] font-bold text-gray-600 uppercase tracking-widest">FORENSIC DATA</span>
             </div>
             <p className="text-lg sm:text-xl font-black italic text-white tracking-tight">{s.value}</p>
             <p className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
           </div>
          ))}
      </section>

      {/* PROPOSALS LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 space-y-12">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/05 pb-6 gap-6">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Active Initiatives</h3>
            <div className="flex gap-2">
               <span className="px-4 py-2 bg-white/05 border border-white/10 rounded-full text-[9px] font-bold text-[#00D2FF] uppercase tracking-widest">All Categories</span>
               <span className="px-4 py-2 bg-white/05 border border-white/10 rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest">Ending Soon</span>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {proposals.length > 0 ? (
               proposals.map((p) => (
                  <motion.div 
                    key={p.id}
                    layoutId={p.id}
                    className="bg-[#111] border border-white/05 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 flex flex-col justify-between space-y-10 group hover:border-white/20 transition-all shadow-2xl relative overflow-hidden"
                  >
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <img src={p.Organization.profileImageUrl || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=100&q=80'} alt={p.Organization.name} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                              <span className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest italic">{p.Organization.name}</span>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-1 bg-white/05 rounded-full">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">4D 12H REMAINING</span>
                           </div>
                        </div>
                        <div className="space-y-3">
                           <h4 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white leading-none">{p.title}</h4>
                           <p className="text-sm text-zinc-500 font-medium leading-relaxed italic">{p.description}</p>
                        </div>
                     </div>

                     <div className="space-y-8">
                        {/* REAL RESULTS BAR */}
                        <div className="space-y-3">
                           <div className="flex justify-between items-end">
                              <div className="flex items-center gap-4">
                                 <div className="flex flex-col">
                                    <span className="text-xl font-black italic text-emerald-500">{p.consensusPercent}%</span>
                                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">CONSENSUS</span>
                                 </div>
                                 <div className="w-px h-6 bg-white/5"></div>
                                 <div className="flex flex-col">
                                    <span className="text-xl font-black italic text-gray-400">{100 - p.consensusPercent}%</span>
                                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">REJECTION</span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-[9px] font-bold text-white uppercase tracking-widest italic">{p.totalWeight.toLocaleString()} Weighted Units</p>
                                 <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{p._count.Votes} Forensic Entries</p>
                              </div>
                           </div>
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
                              <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{ width: `${p.consensusPercent}%` }}></div>
                              <div className="h-full bg-white/10" style={{ width: `${100 - p.consensusPercent}%` }}></div>
                           </div>
                        </div>

                        {/* FORENSIC AUDIT LOG */}
                        <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-4">
                           <div className="flex items-center justify-between border-b border-white/5 pb-3">
                              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Forensic Audit Log</span>
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                           </div>
                           <div className="space-y-3">
                              {(p.Votes || []).length > 0 ? (
                                p.Votes.map((vote: any) => (
                                  <div key={vote.id} className="flex items-center justify-between group/vote">
                                     <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${vote.voteType === 'YES' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[100px]">{vote.User?.displayName || 'Anonymous'}</span>
                                     </div>
                                     <div className="flex items-center gap-3">
                                        <span className="text-[9px] font-bold text-gray-600 uppercase">x{vote.weight} Units</span>
                                        <span className="text-[8px] text-gray-800 font-bold uppercase">{new Date(vote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                     </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest text-center py-2">No Verified Entries Detected</p>
                              )}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <button 
                             onClick={() => handleVote(p.id, 'YES')}
                             disabled={votingId === p.id}
                             className="py-5 rounded-2xl bg-emerald-500 text-black font-black text-[11px] uppercase tracking-widest hover:bg-emerald-400 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                           >
                              Affirm Proposal
                           </button>
                           <button 
                             onClick={() => handleVote(p.id, 'NO')}
                             disabled={votingId === p.id}
                             className="py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50"
                           >
                              Reject
                           </button>
                        </div>
                     </div>
                  </motion.div>
               ))
            ) : (
               <div className="col-span-2 py-32 text-center bg-[#0A0A0A] border border-dashed border-white/5 rounded-[3.5rem] space-y-6">
                  <ShieldCheck className="w-16 h-16 text-white/5 mx-auto" />
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">Awaiting New Governance Initiatives</p>
                     <p className="text-xs text-gray-700 font-medium italic">Check back shortly for the next network expansion vote.</p>
                  </div>
               </div>
            )}
         </div>
      </section>

      {/* DISCLOSURE */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mt-24">
         <div className="p-6 sm:p-10 bg-white/5 rounded-[2.5rem] border border-white/5 flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
               <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black italic uppercase tracking-widest text-white">Protocol Participation Disclosure</h4>
               <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-[0.2em]">
                  Governance votes are irreversible once registered in the protocol ledger. Your vote weight is dynamically calculated based on your current Fan Level. Misuse of governance rights may result in temporary protocol suspension. 
                  <br /><br />
                  <span className="text-[#00D2FF]">View the Full Network Whitepaper for compliance details.</span>
               </p>
            </div>
         </div>
      </footer>

    </div>
  );
}
