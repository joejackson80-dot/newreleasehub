'use client';
import React, { useState } from 'react';
import { Briefcase, Search, Filter, Plus, Clock, Users, ArrowRight, ShieldCheck, Music, Mic, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { applyForOpportunity, voteOnProposal } from '@/app/actions/artist';

function NotifyForm({ type }: { type: string }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return sent ? (
    <p className="text-green-500 text-sm font-bold uppercase tracking-widest">You're on the list!</p>
  ) : (
    <form
      className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold tracking-widest text-white placeholder-gray-700 focus:outline-none focus:border-[#00D2FF] transition-all"
      />
      <button
        type="submit"
        className="px-8 py-4 w-full sm:w-auto rounded-2xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl whitespace-nowrap"
      >
        Notify Me
      </button>
    </form>
  );
}

const TYPE_COLORS: Record<string, string> = {
  SYNC: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  GIG: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  GRANT: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  COLLAB: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  PROPOSAL: 'text-orange-400 bg-orange-400/10 border-orange-400/20'
};

const TYPE_ICONS: Record<string, any> = {
  SYNC: Music,
  GIG: Mic,
  GRANT: DollarSign,
  COLLAB: Users,
  PROPOSAL: ShieldCheck
};

export default function BoardClient({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredOpps = initialOpportunities.filter(opp => {
    if (activeTab !== 'All' && opp.type !== activeTab.toUpperCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return opp.title.toLowerCase().includes(q) || 
             (opp.genreTargets || []).some((g: string) => g.toLowerCase().includes(q));
    }
    return true;
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);

    try {
       if (selectedOpp.type === 'PROPOSAL') {
          const res = await voteOnProposal({
             oppId: selectedOpp.id,
             voteType: selectedOpp.voteType,
             comment: (e.target as any).elements[0]?.value
          });
          if (!res.success) throw new Error(res.error || 'Vote failed');
       } else {
          const res = await applyForOpportunity({
             opportunityId: selectedOpp.id,
             pitch: (e.target as any).elements[0]?.value
          });
          if (!res.success) throw new Error(res.error || 'Application failed');
       }

       setIsApplying(false);
       setIsSuccess(true);
       setTimeout(() => {
         setIsSuccess(false);
         setSelectedOpp(null);
       }, 2000);
    } catch (err) {
       console.error(err);
       setIsApplying(false);
    }
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'Sync': return "No sync placements right now. Licensing teams post here weekly — check back soon.";
      case 'Gigs': return "No gig postings yet. Promoters and venues join the network to post here.";
      case 'Grants': return "No active grants. We partner with music foundations to post funding opportunities — subscribe for alerts.";
      case 'Collabs': return "No collaboration requests. Artists post here when looking for features, producers, and co-writers.";
      case 'Proposals': return "No active network proposals. Protocol changes and board elections will appear here for community voting.";
      default: return "No opportunities posted yet. Be the first to post.";
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white font-sans pt-12 pb-32">
      
      {/* PAGE HEADER */}
      <header className="pt-12 pb-16 sm:pb-24 px-4 sm:px-10 max-w-7xl mx-auto space-y-12">
         
         {/* LOGO */}
         <div className="flex">
            <Link href="/" className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</Link>
         </div>

         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 sm:gap-10">
            <div className="space-y-6">
               <div className="flex items-center space-x-3 text-[#00D2FF]">
                  <Briefcase className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Independent Growth Board</span>
               </div>
               <h1 className="text-[clamp(3.5rem,15vw,6rem)] md:text-8xl font-bold tracking-tighter uppercase leading-[0.8] italic break-words">
                  New<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Opportunities.</span>
               </h1>
               <p className="text-gray-500 max-w-xl font-medium leading-relaxed italic text-sm sm:text-base">
                  "Verified sync deals, performance grants, and high-value collaboration requests — exclusively for the New Release Hub artist community."
               </p>
            </div>
            <Link
              href="/studio/login?intent=opportunity-poster"
              className="w-full sm:w-auto px-12 py-5 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2"
            >
               <Plus className="w-4 h-4" />
               <span>Post Opportunity</span>
            </Link>
         </div>
      </header>

      {/* FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 md:px-10 mb-12">
         <div className="bg-[#111] border border-white/5 rounded-3xl p-4 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex overflow-x-auto scrollbar-hide items-center gap-2 md:gap-6 px-2 w-full lg:w-auto justify-start lg:justify-start -mx-2 sm:mx-0">
               {['All', 'Sync', 'Gigs', 'Grants', 'Collabs', 'Proposals'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {tab}
                  </button>
               ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
               <div className="relative w-full lg:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search opportunities..." 
                    className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[#00D2FF]" 
                  />
               </div>
               <button className="hidden sm:flex p-3 bg-black border border-white/10 rounded-xl text-gray-500 hover:text-white transition-colors">
                 <Filter className="w-4 h-4" />
               </button>
            </div>
         </div>
      </section>

      {/* GRID OR EMPTY STATE */}
      <section className="max-w-7xl mx-auto px-4 md:px-10">
         {filteredOpps.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredOpps.map(opp => {
               const typeStr = opp.type.toUpperCase();
               const colorClass = TYPE_COLORS[typeStr] || 'text-gray-400 bg-white/5 border-white/10';
               const Icon = TYPE_ICONS[typeStr] || Briefcase;

               // Fake countdown logic if missing
               const daysLeft = opp.deadline ? Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / (1000 * 3600 * 24)) : 7;
               
               return (
                 <div key={opp.id} className="bg-[#111] border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-all flex flex-col h-full group">
                   <div className="flex justify-between items-start mb-6">
                     <span className={`px-3 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${colorClass}`}>
                       <Icon className="w-3 h-3" />
                       {opp.type}
                     </span>
                     <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                       <Clock className="w-3 h-3" />
                       {daysLeft > 0 ? `${daysLeft} days left` : 'Closing soon'}
                     </div>
                   </div>

                   <h3 className="text-xl font-bold mb-2 line-clamp-2">{opp.title}</h3>
                   
                   <div className="flex items-center gap-2 mb-4">
                     <span className="text-xs text-gray-400">{opp.posterName || 'Network Partner'}</span>
                     {opp.posterIsVerified && <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />}
                   </div>

                   {opp.description && (
                     <div className="mb-6">
                       <p className="text-sm text-gray-500 line-clamp-3">
                         {opp.description}
                       </p>
                       <button className="text-xs font-bold text-[#00D2FF] uppercase tracking-widest mt-2 hover:text-white transition-colors">
                         Read more
                       </button>
                     </div>
                   )}

                   <div className="mt-auto space-y-8">
                     {opp.budget && (
                       <div className="mb-8">
                         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Budget / Reward</p>
                         <p className="font-medium text-green-400">{opp.budget}</p>
                       </div>
                     )}

                     {opp.genreTargets && opp.genreTargets.length > 0 && (
                       <div className="flex flex-wrap gap-2">
                         {opp.genreTargets.map((g: string) => (
                           <span key={g} className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                             {g}
                           </span>
                         ))}
                       </div>
                     )}

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{opp.applicantCount || 0} {typeStr === 'PROPOSAL' ? 'votes cast' : 'applied'}</span>
                        </div>
                        
                        {typeStr === 'PROPOSAL' ? (
                          <div className="flex items-center gap-3">
                             <button 
                               onClick={() => setSelectedOpp({...opp, voteType: 'YES'})}
                               className="px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest hover:bg-green-500/20 transition-all"
                             >
                               Vote Yes
                             </button>
                             <button 
                               onClick={() => setSelectedOpp({...opp, voteType: 'NO'})}
                               className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all"
                             >
                               Vote No
                             </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setSelectedOpp(opp)}
                            className="flex items-center gap-2 text-[#00D2FF] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                          >
                            Apply Now <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                   </div>
                 </div>
               );
             })}
           </div>
         ) : (
           <div className="py-32 text-center space-y-10 bg-[#111] border border-dashed border-white/10 rounded-[3rem] px-4">
              <div className="w-20 h-20 bg-[#00D2FF]/10 rounded-2xl flex items-center justify-center mx-auto text-[#00D2FF]">
                 <Briefcase className="w-8 h-8" />
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                 <h3 className="text-2xl font-bold uppercase tracking-tighter">No Matches Found</h3>
                 <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    {getEmptyStateMessage()}
                 </p>
              </div>
              <NotifyForm type={activeTab} />
           </div>
         )}
      </section>

      {/* APPLICATION MODAL */}
      {selectedOpp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
              <button 
                onClick={() => setSelectedOpp(null)}
                className="absolute top-8 right-8 text-gray-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              {isSuccess ? (
                <div className="py-12 text-center space-y-6">
                   <div className={`w-16 h-16 ${selectedOpp.type === 'PROPOSAL' ? 'bg-[#00D2FF]/10 text-[#00D2FF]' : 'bg-green-500/10 text-green-500'} rounded-2xl flex items-center justify-center mx-auto`}>
                      <ShieldCheck className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold uppercase italic tracking-tighter">
                      {selectedOpp.type === 'PROPOSAL' ? 'Forensic Vote Cast.' : 'Application Sent!'}
                   </h3>
                   <p className="text-gray-500 text-sm font-medium">
                      {selectedOpp.type === 'PROPOSAL' 
                        ? 'Your vote has been recorded on the network. Results will be audited upon the closing of the proposal.' 
                        : 'Your artist profile and demo have been submitted to the partner.'}
                   </p>
                </div>
              ) : (
                <>
                   <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest">
                         {selectedOpp.type === 'PROPOSAL' ? 'Governance Participation' : 'Apply for Opportunity'}
                      </span>
                      <h3 className="text-3xl font-bold italic tracking-tighter uppercase">{selectedOpp.title}</h3>
                   </div>

                   <form onSubmit={handleApply} className="space-y-6">
                      {selectedOpp.type === 'PROPOSAL' ? (
                         <div className="space-y-6">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Action</p>
                               <div className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${selectedOpp.voteType === 'YES' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <span className="text-xl font-bold italic uppercase tracking-tighter">
                                     Vote {selectedOpp.voteType === 'YES' ? 'YES' : 'NO'}
                                  </span>
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reason / Comment (Optional)</label>
                               <textarea 
                                 placeholder="Add a comment to your vote..."
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#00D2FF]/40 transition-all h-32 resize-none"
                               />
                            </div>
                         </div>
                      ) : (
                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pitch / Notes</label>
                               <textarea 
                                 required
                                 placeholder="Tell the partner why you're a good fit..."
                                 className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-[#00D2FF]/40 transition-all h-32 resize-none"
                               />
                            </div>
                            <div className="p-4 bg-[#00D2FF]/10 rounded-2xl border border-[#00D2FF]/20 flex items-center gap-4">
                               <Music className="w-5 h-5 text-[#00D2FF]" />
                               <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Your Latest Master will be attached automatically.</p>
                            </div>
                         </div>
                      )}
                      
                      <button 
                        type="submit"
                        disabled={isApplying}
                        className="w-full py-5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-2xl disabled:opacity-50"
                      >
                         {isApplying ? 'Processing...' : selectedOpp.type === 'PROPOSAL' ? 'Confirm Forensic Vote' : 'Submit Application'}
                      </button>
                   </form>
                </>
              )}
           </div>
        </div>
      )}

    </div>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}



