'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Send, Award, Flame, Trash2, X, Music, Crown, TrendingUp, Swords, ShoppingBag, ArrowRight, Maximize, Minimize, Zap, Star, ShieldCheck, Gem, Disc, Users, Share2, MoreHorizontal, Globe, DollarSign } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';
import { supabase } from '@/lib/supabase';
import VirtualStageCamera from './VirtualStageCamera';
import AudioReactor from './AudioReactor';
import CommercialTicker from './CommercialTicker';
import SocialShareCard from './SocialShareCard';
import Link from 'next/link';
import FloatingReactions from './FloatingReactions';
import GiftAlert from './GiftAlert';
import NetworkHeatmap from './NetworkHeatmap';
import VirtualDJDeck from './VirtualDJDeck';
import GiftOverlay from './GiftOverlay';

import { sendChatMessage } from '@/app/actions/chat';

export default function TheaterModeLayout({ slug }: { slug: string }) {
  // ... existing states ...
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;
    setIsSending(true);
    const res = await sendChatMessage(orgId, chatInput);
    if (res.success) {
      setChatInput('');
    }
    setIsSending(false);
  };

  // ... useEffects ...

  // Find where the input is rendered (around line 300+)

  const [chatTab, setChatTab] = useState<'CHAT' | 'MERCH' | 'WAR' | 'SUPPORTERS'>('CHAT');
  const [artistName, setArtistName] = useState('Loading...');
  const [orgId, setOrgId] = useState('');
  const [trackTitle, setTrackTitle] = useState('Waiting for artist...');
  const [djPlaying, setDjPlaying] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [stats, setStats] = useState({ fire: 1204, cool: 512, trash: 42 });
  const [messages, setMessages] = useState<any[]>([]);
  const [merch, setMerch] = useState<any[]>([]);
  const [activeLicenses, setActiveLicenses] = useState<any[]>([]);
  const [isGiftTrayOpen, setIsGiftTrayOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showDecks, setShowDecks] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [muxConfig, setMuxConfig] = useState<any>(null);
  const [liveListeners, setLiveListeners] = useState(0);
  const userId = 'session-user'; // Placeholder for session ID

  useEffect(() => {
    const fetchState = async () => {
      const res = await fetch(`/api/dj/state?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setOrgId(data.organizationId);
        setDjPlaying(data.isPlaying);
        setTrackTitle(data.activeTrackTitle);
        setMuxConfig(data.muxConfig);
        setBackgroundUrl(data.backgroundUrl || '/images/default-avatar.png');
        setStats({ fire: data.fireCount, cool: data.coolCount, trash: data.trashCount });
        
        const [orgRes, merchRes, licRes] = await Promise.all([
          fetch(`/api/org?slug=${slug}`),
          fetch(`/api/merch?orgId=${data.organizationId}`),
          fetch(`/api/licenses?orgId=${data.organizationId}`)
        ]);

        if (orgRes.ok) {
          const org = await orgRes.json();
          setArtistName(org.name);
        }
        if (merchRes.ok) setMerch(await merchRes.json());
        if (licRes.ok) setActiveLicenses(await licRes.json());
      }
    };

    fetchState();

    // ── SUPABASE SCALING ARCHITECTURE ──
    // Use Presence for listener count (avoids DB writes per listener)
    // Use Broadcast for chat/reactions (low latency)
    const channel = supabase.channel(`theater:${slug}`, {
      config: {
        presence: {
          key: userId || 'anonymous',
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setLiveListeners(Object.keys(newState).length);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.info(`[NETWORK_PULSE] Listener joined: ${key}`);
      })
      .on('broadcast', { event: 'reaction' }, ({ payload }) => {
        // Handle real-time floating reactions
        if (payload?.type === 'FIRE') setStats(prev => ({ ...prev, fire: prev.fire + 1 }));
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ChatMessage',
        filter: `organizationId=eq.${orgId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug, orgId, userId]);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans pb-20 selection:bg-[#F1F5F9] selection:text-white">
      
      {/* PROFESSIONAL BANNER - INSTITUTIONAL DARK STYLE */}
      <div className="relative h-[480px] bg-black overflow-hidden border-b border-white/5">
         <img 
           src={backgroundUrl} 
           className="w-full h-full object-cover opacity-40 blur-[4px] scale-110" 
           alt="Artist Banner"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent"></div>
         <div className="absolute inset-0 bg-black/20"></div>
         
         <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-10 pb-16 flex flex-col md:flex-row md:items-end gap-12">
               <div className="w-56 h-56 rounded-3xl bg-zinc-900 p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 group cursor-pointer border border-white/10">
                  <div className="w-full h-full overflow-hidden rounded-2xl bg-zinc-800">
                     <img 
                       src={backgroundUrl} 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                     />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-[#F1F5F9] rounded-2xl flex items-center justify-center text-white shadow-xl">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
               </div>
               <div className="flex-1 space-y-6 pb-2">
                  <div className="flex items-center space-x-3 text-[#F1F5F9]">
                     <Star className="w-4 h-4 fill-current" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Grade Artist</span>
                  </div>
                  <h1 className="text-white text-5xl md:text-8xl font-bold leading-[0.8] uppercase italic tracking-tighter drop-shadow-2xl">{artistName}</h1>
                  <div className="flex items-center space-x-8">
                     <div className="flex items-center space-x-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">{activeLicenses.length.toLocaleString()} SUPPORTERs</span>
                     </div>
                     <div className="flex items-center space-x-2 text-gray-400">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Global Hub</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-4 pb-4">
                  <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${isFollowing ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' : 'bg-[#F1F5F9] text-white shadow-[0_0_30px_rgba(241,245,249,0.2)] hover:scale-105'}`}
                  >
                     {isFollowing ? 'Following' : 'Follow Network'}
                  </button>
                  <button className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all">
                     <Share2 className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-10 -mt-10 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
         
         {/* LEFT COLUMN - STATS & INFO */}
         <div className="lg:col-span-3 space-y-10">
            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
               <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Protocol & Profile</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium italic">
                     "Operating on New Release Hub. Scaled through decentralized support and fan revenue shares."
                  </p>
               </div>
               <div className="space-y-6 pt-10 border-t border-white/5">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Network Rank</span>
                     <span className="text-sm font-bold text-white italic">#142</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Monthly Pull</span>
                     <span className="text-sm font-bold text-white">1.2M Streams</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Yield Velocity</span>
                     <span className="text-sm font-bold text-green-500">+14.2%</span>
                  </div>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl space-y-8 backdrop-blur-xl">
                <h3 className="text-[10px] font-bold text-[#F1F5F9] uppercase tracking-widest">Institutional Audit</h3>
               <Link href={`/${slug}/epk`} className="flex items-center justify-between group">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Digital EPK</span>
                  <ArrowRight className="w-4 h-4 text-gray-800 group-hover:text-[#F1F5F9] transition-all" />
               </Link>
               <Link href={`/${slug}/reviews`} className="flex items-center justify-between group">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Audit Report</span>
                  <ArrowRight className="w-4 h-4 text-gray-800 group-hover:text-[#F1F5F9] transition-all" />
               </Link>
            </div>
         </div>

         {/* MAIN COLUMN - STAGE & FEED */}
         <div className="lg:col-span-9 space-y-12">
            
            {/* LIVE STAGE CONTAINER */}
            <div className="bg-[#111] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
                <div className="aspect-video bg-black relative">
                   {muxConfig?.playbackId && muxConfig?.status === 'active' ? (
                     <MuxPlayer
                        streamType="live"
                        playbackId={muxConfig.playbackId}
                        metadataVideoTitle={`Live Session - ${artistName}`}
                        metadataViewerUserId="fan-session"
                        primaryColor="#F1F5F9"
                        className="w-full h-full"
                        autoPlay
                        muted={false}
                     />
                   ) : (
                     <VirtualStageCamera 
                       backgroundUrl={backgroundUrl} 
                       isLive={muxConfig?.status === 'active'} 
                       sceneType="PRO_STUDIO"
                     />
                   )}
                  
                  {/* FAN DECK OVERLAY */}
                  <AnimatePresence>
                    {showDecks && (
                      <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="absolute inset-x-10 bottom-10 z-50 pointer-events-none"
                      >
                         <VirtualDJDeck 
                           isHologram={true}
                           activeTrack={{ title: trackTitle, id: '' }}
                           isPlaying={djPlaying}
                           onToggle={() => {}}
                           onNext={() => {}}
                         />
                         <NetworkHeatmap />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute top-8 right-8 z-50 flex items-center space-x-4">
                     <button 
                       onClick={() => setShowDecks(!showDecks)}
                       className={`flex items-center space-x-3 px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${showDecks ? 'bg-[#F1F5F9] text-white shadow-[0_0_30px_rgba(241,245,249,0.4)]' : 'bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80'}`}
                     >
                        <Disc className={`w-4 h-4 ${showDecks ? 'animate-spin' : ''}`} />
                        <span>{showDecks ? 'Hide Decks' : 'Show Decks'}</span>
                     </button>
                     <button className="p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white"><Maximize className="w-4 h-4" /></button>
                  </div>

                  <div className="absolute top-8 left-8 z-50">
                     <div className="flex items-center space-x-3 bg-red-600 px-4 py-1.5 rounded-full shadow-xl">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Live Session</span>
                     </div>
                  </div>
               </div>
               
               <div className="p-12 flex flex-col md:flex-row justify-between items-center gap-10">
                  <div className="flex items-center space-x-8">
                     <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F1F5F9] shadow-lg">
                           <Play className="w-8 h-8 fill-current ml-1" />
                        </div>
                        <div>
                           <h4 className="text-3xl italic tracking-tighter font-bold uppercase">"{trackTitle}"</h4>
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Institutional Broadcast • {artistName}</p>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-12">
                     <button className="flex flex-col items-center space-y-2 group">
                        <Flame className="w-8 h-8 text-gray-700 group-hover:text-orange-500 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-600 group-hover:text-white uppercase tracking-widest">{stats.fire}</span>
                     </button>
                     <div className="h-10 w-px bg-white/5"></div>
                     <button onClick={() => setIsGiftTrayOpen(!isGiftTrayOpen)} className="btn-primary px-10 py-5">Send Network Gift</button>
                  </div>
               </div>
            </div>

            {/* INTERACTION TABS - INSTITUTIONAL DARK STYLE */}
            <div className="bg-[#111] border border-white/5 rounded-[3rem] shadow-2xl overflow-hidden">
               <div className="flex px-12 pt-12 border-b border-white/5 space-x-16">
                  {['CHAT', 'MERCH', 'SUPPORTERS'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setChatTab(tab as any)}
                      className={`pb-10 text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 transition-all ${chatTab === tab ? 'text-[#F1F5F9] border-[#F1F5F9]' : 'text-gray-600 border-transparent hover:text-white'}`}
                    >
                       {tab}
                    </button>
                  ))}
               </div>
               
               <div className="p-12 min-h-[400px]">
                  <AnimatePresence mode="wait">
                     {chatTab === 'CHAT' && (
                       <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                          {messages.map((m, i) => (
                            <div key={i} className="flex flex-col space-y-2">
                               <span className="text-[10px] font-bold text-[#F1F5F9] uppercase tracking-widest">{m.user}</span>
                               <p className="text-gray-600 font-medium leading-relaxed">{m.text}</p>
                            </div>
                          ))}
                          <div className="pt-10">
                             <div className="relative">
                                 <input 
                                   type="text" 
                                   value={chatInput}
                                   onChange={(e) => setChatInput(e.target.value)}
                                   onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                   placeholder="Join the conversation..." 
                                   className="w-full bg-[#F5F5F5] border border-black/5 rounded-2xl px-8 py-5 text-sm font-medium focus:outline-none focus:border-[#F1F5F9]/20 transition-all"
                                 />
                                 <button 
                                   onClick={handleSendMessage}
                                   disabled={isSending}
                                   className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-[#F1F5F9] text-white shadow-lg disabled:opacity-50"
                                 >
                                    <Send className="w-5 h-5" />
                                 </button>
                             </div>
                          </div>
                       </motion.div>
                     )}
                     
                     {chatTab === 'MERCH' && (
                        <motion.div key="merch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           {merch.map((item) => (
                             <div key={item.id} className="p-8 border border-black/5 rounded-[2rem] hover:shadow-xl transition-all group">
                                <div className="aspect-square bg-[#F5F5F5] rounded-2xl mb-6 flex items-center justify-center text-gray-300">
                                   <ShoppingBag className="w-12 h-12" />
                                 </div>
                                 <h4 className="text-xl mb-1">{item.title}</h4>
                                 <p className="text-[#F1F5F9] text-sm font-bold uppercase tracking-widest">${item.priceCents / 100}</p>
                                 <button className="w-full mt-8 py-4 rounded-2xl bg-[#111111] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-[#F1F5F9] transition-colors">Buy Now</button>
                             </div>
                           ))}
                        </motion.div>
                      )}

                      {chatTab === 'SUPPORTERS' && (
                        <motion.div key="SUPPORTERs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-white space-y-10 relative overflow-hidden backdrop-blur-xl">
                              <div className="absolute top-0 right-0 p-12 opacity-5">
                                 <ShieldCheck className="w-32 h-32" />
                              </div>
                              <div className="flex items-center space-x-8 relative z-10">
                                 <div className="w-20 h-20 rounded-[2rem] bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-2xl">
                                    <Crown className="w-10 h-10" />
                                 </div>
                                 <div className="space-y-1">
                                    <h3 className="text-4xl font-bold uppercase italic tracking-tighter">support Hub.</h3>
                                    <p className="text-[#F1F5F9] text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Revenue Participation</p>
                                 </div>
                              </div>

                              <p className="text-gray-400 text-lg leading-relaxed max-w-3xl font-medium italic relative z-10">
                                "Become a verified SUPPORTER to support {artistName} and secure a {activeLicenses[0]?.allocatedBps / 100 || '15'}% share of all future streaming revenue from this hub."
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6 relative z-10">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Bid Amount (USD)</label>
                                    <div className="relative">
                                       <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-700" />
                                       <input 
                                         type="number" 
                                         defaultValue={activeLicenses[0]?.feeCents / 100 || 50}
                                         className="w-full bg-black/40 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-3xl font-bold italic text-white focus:outline-none focus:border-[#F1F5F9]/40 transition-all"
                                       />
                                    </div>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Protocol Minimum: ${activeLicenses[0]?.feeCents / 100 || 50}</p>
                                 </div>
                                 <div className="flex items-end">
                                    <button 
                                      onClick={() => window.location.href = `/studio/stripe-mock?success_redirect=/${slug}/live&status=SUPPORTER_ACTIVE`}
                                      className="w-full py-6 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                                    >
                                       Acquire Master Stake
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-10">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Active Network Stakeholders</h4>
                                 <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Verified by Protocol</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-5 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                                       <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-gray-700 group-hover:text-white transition-colors">
                                          <Users className="w-6 h-6" />
                                       </div>
                                       <div>
                                          <p className="text-xs font-bold text-white uppercase tracking-widest">SUPPORTER_{Math.floor(Math.random() * 9999)}</p>
                                          <p className="text-[10px] text-gray-600 font-medium uppercase tracking-tighter">Stake: ${Math.floor(Math.random() * 500 + 50)}.00</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
               </div>
            </div>

         </div>
      </div>

      <AudioReactor audioUrl={null} isPlaying={djPlaying} />
    </div>
  );
}


