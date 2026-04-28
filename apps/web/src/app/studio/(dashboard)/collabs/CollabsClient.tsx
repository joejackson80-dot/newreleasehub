'use client';
import React, { useState } from 'react';
import { 
  Users, MessageSquare, Check, X, Clock, 
  ArrowUpRight, ArrowDownLeft, Shield, DollarSign,
  Play, ExternalLink, ChevronRight, Percent
} from 'lucide-react';
import Link from 'next/link';

export default function CollabsClient({ currentOrg, incoming: initialIncoming, sent: initialSent, activeDeals: initialActive }: any) {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incoming, setIncoming] = useState(initialIncoming);
  const [sent, setSent] = useState(initialSent);
  const [activeDeals, setActiveDeals] = useState(initialActive);

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-40 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-[#00D2FF]">
                 <Users className="w-5 h-5" />
                 <span className="text-xs font-bold uppercase tracking-widest">Studio Collabs</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic leading-[0.9]">
                 Collab<br />Engine.
              </h1>
           </div>
           <Link 
             href="/studio/collab/new"
             className="bg-[#00D2FF] hover:bg-[#2952CC] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_20px_40px_rgba(51,102,255,0.2)] flex items-center gap-3"
           >
             New Request <ArrowUpRight className="w-5 h-5" />
           </Link>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-0">
           {['incoming', 'sent', 'active', 'completed'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-white'}`}
             >
               {tab}
               {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00D2FF]"></div>}
             </button>
           ))}
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 gap-6">
            {activeTab === 'incoming' && (
              <>
                {incoming.length === 0 ? (
                  <div className="py-20 text-center space-y-4 bg-[#0A0A0A] border border-white/5 rounded-[40px]">
                     <ArrowDownLeft className="w-12 h-12 text-gray-800 mx-auto" />
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No incoming requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {incoming.map((req: any) => (
                      <CollabCard 
                        key={req.id} 
                        request={req} 
                        type="incoming" 
                        onAccept={() => {
                          alert(`Collab "${req.projectTitle}" accepted! Deal terms finalized.`);
                          setIncoming(incoming.filter((r: any) => r.id !== req.id));
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

           {activeTab === 'sent' && (
             <>
               {sent.length === 0 ? (
                 <div className="py-20 text-center space-y-4 bg-[#0A0A0A] border border-white/5 rounded-[40px]">
                    <ArrowUpRight className="w-12 h-12 text-gray-800 mx-auto" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">You haven't sent any requests.</p>
                 </div>
               ) : (
                 sent.map((req: any) => (
                   <CollabCard key={req.id} request={req} type="sent" />
                 ))
               )}
             </>
           )}

           {activeTab === 'active' && (
             <>
               {activeDeals.length === 0 ? (
                 <div className="py-20 text-center space-y-4 bg-[#0A0A0A] border border-white/5 rounded-[40px]">
                    <Shield className="w-12 h-12 text-gray-800 mx-auto" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active collab deals.</p>
                 </div>
               ) : (
                 activeDeals.map((deal: any) => (
                   <div key={deal.id} className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8 flex flex-col md:flex-row gap-8 items-center">
                      <div className="flex -space-x-4">
                        <div className="w-20 h-20 rounded-full border-4 border-[#0A0A0A] bg-zinc-800 overflow-hidden">
                           {deal.requester.profileImageUrl && <img src={deal.requester.profileImageUrl} className="w-full h-full object-cover" />}
                        </div>
                        <div className="w-20 h-20 rounded-full border-4 border-[#0A0A0A] bg-zinc-800 overflow-hidden">
                           {deal.receiver.profileImageUrl && <img src={deal.receiver.profileImageUrl} className="w-full h-full object-cover" />}
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-2">
                         <div className="flex items-center justify-center md:justify-start gap-3">
                            <h3 className="text-xl font-bold">{deal.requester.name} x {deal.receiver.name}</h3>
                            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Active Deal</span>
                         </div>
                         <p className="text-gray-500 font-medium">{deal.dealType.replace('_', ' ')} • {deal.receiverSplitPercent}% Split</p>
                      </div>
                      <div className="flex gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-8 py-4 bg-[#111] border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">View Agreement</button>
                        <button className="flex-1 md:flex-none px-8 py-4 bg-[#00D2FF] rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#2952CC] transition-all">Message</button>
                      </div>
                   </div>
                 ))
               )}
             </>
           )}
        </div>

      </div>
    </div>
  );
}

function CollabCard({ request, type, onAccept }: any) {
  const otherArtist = type === 'incoming' ? request.requester : request.receiver;
  const timeRemaining = Math.max(0, Math.floor((new Date(request.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60)));

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden hover:border-white/10 transition-all group">
       <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
          
          {/* ARTIST INFO */}
          <div className="w-full md:w-64 space-y-6">
             <div className="relative">
                <div className="w-24 h-24 rounded-[32px] bg-zinc-800 overflow-hidden border border-white/5">
                   {otherArtist.profileImageUrl && <img src={otherArtist.profileImageUrl} alt={otherArtist.name} className="w-full h-full object-cover" />}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 p-2 rounded-xl">
                   {type === 'incoming' ? <ArrowDownLeft className="w-4 h-4 text-[#00D2FF]" /> : <ArrowUpRight className="w-4 h-4 text-orange-500" />}
                </div>
             </div>
             <div>
                <h4 className="font-bold text-lg">{otherArtist.name}</h4>
                <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                   <span>{otherArtist.genres?.[0] || 'Independent'}</span>
                   <span>•</span>
                   <span className="text-[#00D2FF]">{otherArtist.patronCount} Patrons</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                {otherArtist.isVerified && <span className="p-1 bg-[#00D2FF]/10 text-[#00D2FF] rounded-md"><Check className="w-3 h-3" /></span>}
                <Link href={`/${otherArtist.slug}`} className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1">
                   View Profile <ChevronRight className="w-3 h-3" />
                </Link>
             </div>
          </div>

          {/* PROJECT INFO */}
          <div className="flex-1 space-y-8">
             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                   <span className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest">{request.collabType.replace('_', ' ')}</span>
                   <h3 className="text-3xl font-bold tracking-tighter italic uppercase">{request.projectTitle || 'Untitled Project'}</h3>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                   <Clock className="w-4 h-4 text-gray-500" />
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{timeRemaining}h remaining</span>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-2">
                   <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block">Deal Structure</span>
                   <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="font-bold">{request.dealType.replace('_', ' ')}</span>
                   </div>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-2">
                   <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block">Your Earnings</span>
                   <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-[#00D2FF]" />
                      <span className="font-bold">{type === 'incoming' ? request.receiverSplitPercent : request.requesterSplitPercent}% Revenue Share</span>
                   </div>
                </div>
             </div>

             <div className="space-y-3">
                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block">Pitch Message</span>
                <p className="text-gray-400 text-sm leading-relaxed bg-white/[0.02] p-6 rounded-2xl border border-white/5 italic">
                   "{request.message}"
                </p>
             </div>

             {request.demoUrl && (
               <Link 
                 href={request.demoUrl} 
                 target="_blank"
                 className="flex items-center gap-3 text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest hover:text-white transition-colors group"
               >
                  <div className="w-8 h-8 rounded-full bg-[#00D2FF]/10 flex items-center justify-center group-hover:bg-[#00D2FF] group-hover:text-white transition-all">
                     <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  Listen to Demo
               </Link>
             )}

             {type === 'incoming' && (
               <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-white/5">
                  <button 
                    onClick={onAccept}
                    className="flex-1 bg-[#00D2FF] hover:bg-[#2952CC] text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                     <Check className="w-5 h-5" /> Accept Deal
                  </button>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/5">
                     <MessageSquare className="w-5 h-5" /> Counter
                  </button>
                  <button className="flex-1 bg-transparent hover:bg-red-500/10 text-gray-500 hover:text-red-500 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                     <X className="w-5 h-5" /> Decline
                  </button>
               </div>
             )}
          </div>
       </div>
    </div>
  );
}
