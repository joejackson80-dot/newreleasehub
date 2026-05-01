'use client';
import React, { useState } from 'react';
import { Briefcase, Users, Plus, ArrowRight, ShieldCheck, Clock, ExternalLink, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function OpportunitiesManagerClient({ initialOpportunities }: { initialOpportunities: any[] }) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-[#F1F5F9]">
              <Briefcase className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Resource Logistics</span>
           </div>
           <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
              Inbound<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Initiatives.</span>
           </h1>
        </div>
        <Link 
          href="/studio/opportunities/new"
          className="px-10 py-5 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
        >
           <Plus className="w-4 h-4" />
           Post New Opportunity
        </Link>
      </header>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* LEFT: LIST */}
         <div className="lg:col-span-5 space-y-6">
            <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-8">Active Postings</h2>
            {opportunities.length === 0 ? (
               <div className="p-12 border border-dashed border-white/5 rounded-[2.5rem] text-center space-y-6">
                  <Briefcase className="w-12 h-12 text-white/5 mx-auto" />
                  <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest leading-relaxed">
                     You haven't posted any opportunities yet.
                  </p>
               </div>
            ) : (
               <div className="space-y-4">
                  {opportunities.map((opp) => (
                     <button
                       key={opp.id}
                       onClick={() => setSelectedOpp(opp)}
                       className={`w-full text-left p-8 rounded-[2rem] border transition-all group relative overflow-hidden ${selectedOpp?.id === opp.id ? 'bg-white/5 border-[#F1F5F9]/30' : 'bg-[#0A0A0A] border-white/5 hover:border-white/10'}`}
                     >
                        <div className="flex justify-between items-start mb-4">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${opp.status === 'OPEN' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 'text-zinc-500 border-zinc-500/20 bg-zinc-500/10'}`}>
                              {opp.status}
                           </span>
                           <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(opp.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-xl font-bold italic uppercase tracking-tighter group-hover:text-[#F1F5F9] transition-colors">{opp.title}</h3>
                        <div className="mt-6 flex items-center gap-6">
                           <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-zinc-600" />
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{opp.Applications.length} Applicants</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-zinc-600" />
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type: {opp.type}</span>
                           </div>
                        </div>
                     </button>
                  ))}
               </div>
            )}
         </div>

         {/* RIGHT: DETAILS & APPLICANTS */}
         <div className="lg:col-span-7">
            {selectedOpp ? (
               <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Briefcase className="w-32 h-32" />
                     </div>
                     
                     <div className="space-y-4 relative z-10">
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">{selectedOpp.title}</h2>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed italic">"{selectedOpp.description}"</p>
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/5 relative z-10">
                        <div>
                           <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Budget</p>
                           <p className="text-lg font-black italic text-[#F1F5F9]">{selectedOpp.budget || 'N/A'}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Deadline</p>
                           <p className="text-lg font-black italic text-white">{selectedOpp.deadline ? new Date(selectedOpp.deadline).toLocaleDateString() : 'Rolling'}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Applications</p>
                           <p className="text-lg font-black italic text-white">{selectedOpp.Applications.length}</p>
                        </div>
                        <div>
                           <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Visibility</p>
                           <p className="text-lg font-black italic text-emerald-500">PUBLIC</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Applicant Roster</h3>
                     {selectedOpp.Applications.length === 0 ? (
                        <div className="p-20 text-center bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                           <Users className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                           <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">No applications received yet.</p>
                        </div>
                     ) : (
                        <div className="space-y-4">
                           {selectedOpp.Applications.map((app: any) => (
                              <div key={app.id} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white/10 transition-all">
                                 <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                       <img src={app.Artist.profileImageUrl || '/images/default-avatar.png'} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-2">
                                          <h4 className="text-xl font-bold uppercase italic tracking-tighter">{app.Artist.name}</h4>
                                          <ShieldCheck className="w-4 h-4 text-[#F1F5F9]" />
                                       </div>
                                       <div className="flex items-center gap-4">
                                          <Link href={`/${app.Artist.slug}`} target="_blank" className="text-[9px] font-black text-[#F1F5F9] uppercase tracking-widest flex items-center gap-1 hover:underline">
                                             View Profile <ExternalLink className="w-2.5 h-2.5" />
                                          </Link>
                                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(app.createdAt).toLocaleDateString()}</span>
                                       </div>
                                    </div>
                                 </div>
                                 
                                 <div className="flex-1 max-w-md">
                                    <p className="text-xs text-zinc-500 italic line-clamp-2">"{app.pitch}"</p>
                                 </div>

                                 <div className="flex items-center gap-3">
                                    <Link 
                                      href={`/studio/messages?userId=${app.userId}`}
                                      className="p-4 rounded-xl bg-white text-black hover:bg-[#F1F5F9] hover:text-white transition-all"
                                    >
                                       <MessageSquare className="w-5 h-5" />
                                    </Link>
                                    <button className="px-6 py-4 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                                       Review
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-10 bg-white/[0.01] border border-dashed border-white/5 rounded-[4rem]">
                  <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5">
                     <Briefcase className="w-8 h-8 text-zinc-800" />
                  </div>
                  <div className="space-y-4 max-w-xs">
                     <h3 className="text-2xl font-bold uppercase tracking-tighter italic">Selection Required</h3>
                     <p className="text-zinc-600 text-xs font-medium leading-relaxed">
                        Select an active initiative from the logistical roster to manage inbound applications and network participants.
                     </p>
                  </div>
               </div>
            )}
         </div>

      </div>
    </div>
  );
}
