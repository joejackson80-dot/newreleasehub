'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Mic, Music, Users, Zap, Play, Square, Volume2, Settings, MessageCircle, Heart, Share2, Activity, ShieldCheck, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { sendChatMessage } from '@/app/actions/chat';
import { getLiveStreamConfig, updateLiveStatus } from '@/app/actions/live';
import LiveAudioPlayer from '@/components/radio/LiveAudioPlayer';

export default function DJControlRoom({ artist }: { artist: any }) {
  const [isLive, setIsLive] = useState(artist.isLive);
  const [listenerCount, setListenerCount] = useState(artist.liveListenerCount || 0);
  const [reactions, setReactions] = useState<{ emoji: string, id: number }[]>([]);
  const [streamConfig, setStreamConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Initial config and chat fetch
    const init = async () => {
      const res = await getLiveStreamConfig();
      if (res.success) {
        setStreamConfig(res);
      }
      const chatRes = await fetch(`/api/chat?orgId=${artist.id}`);
      if (chatRes.ok) {
        setMessages(await chatRes.json());
      }
    };
    init();
  }, [artist.id]);

  useEffect(() => {
    // Supabase Realtime Subscription
    const channel = supabase
      .channel(`chat-${artist.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ChatMessage',
          filter: `organizationId=eq.${artist.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [artist.id]);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setListenerCount((c: number) => c + Math.floor(Math.random() * 2)); // Simulate growth
        if (Math.random() > 0.7) {
          const emojis = ['🔥', '❤️', '👑', '⚡'];
          setReactions(prev => [...prev, { emoji: emojis[Math.floor(Math.random() * emojis.length)], id: Date.now() }].slice(-10));
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;
    setIsSending(true);
    const res = await sendChatMessage(artist.id, chatInput);
    if (res.success) {
      setChatInput('');
    }
    setIsSending(false);
  };

  const handleToggleLive = async () => {
    setIsLoading(true);
    const newStatus = !isLive;
    const res = await updateLiveStatus(newStatus);
    if (res.success) {
      setIsLive(newStatus);
    }
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 space-y-12">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
         <div className="space-y-2">
            <div className="flex items-center space-x-3 text-red-500">
               <Radio className={`w-5 h-5 ${isLive ? 'animate-pulse' : ''}`} />
               <span className="text-xs font-bold uppercase tracking-[0.3em] font-mono">{isLive ? 'Live On Network' : 'Broadcast Standby'}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white uppercase italic tracking-tighter">Live Control Room</h1>
         </div>
         <div className="flex items-center space-x-4">
            <button className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors">
               <Settings className="w-5 h-5 text-gray-500" />
            </button>
            <button 
               onClick={handleToggleLive}
               disabled={isLoading}
               className={`px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-50 ${isLive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#A855F7] hover:bg-[#00B8E0] shadow-blue-500/20'}`}
            >
               {isLoading ? 'Processing...' : isLive ? 'End Broadcast' : 'Go Live Now'}
            </button>
         </div>
      </header>

      {/* MAIN CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* LEFT: MONITOR & DECK */}
         <div className="lg:col-span-2 space-y-10">
            <div className="aspect-video bg-[#0a0a0a] border border-white/5 rounded-[3rem] relative overflow-hidden flex items-center justify-center group shadow-2xl">
               {isLive ? (
                  <div className="absolute inset-0">
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                     
                     {/* Real-time Monitor Player (Muted by default to avoid feedback) */}
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-4">
                           <Activity className="w-12 h-12 text-[#A855F7] animate-pulse mx-auto" />
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Ingest Monitor Active</p>
                           <LiveAudioPlayer 
                              playbackId={streamConfig?.playbackId} 
                              isPlaying={isLive} 
                              volume={0} 
                           />
                        </div>
                     </div>

                     <div className="absolute top-10 left-10 flex items-center space-x-6 z-20">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center space-x-3">
                           <Users className="w-4 h-4 text-[#A855F7]" />
                           <span className="text-xl font-bold tabular-nums italic">{listenerCount.toLocaleString()}</span>
                        </div>
                        <div className="bg-red-500/80 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center space-x-3">
                           <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                           <span className="text-xs font-bold uppercase tracking-widest text-white italic font-mono">LIVE</span>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="text-center space-y-6 max-w-md px-10">
                     <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-700">
                        <Mic className="w-10 h-10" />
                     </div>
                     <p className="text-gray-400 text-xs font-medium leading-relaxed">
                        To broadcast, configure your DJ software (Serato, rekordbox, Traktor) or OBS to use the RTMP settings below.
                     </p>
                  </div>
               )}

               {/* Reaction Overlay */}
               <div className="absolute bottom-32 right-10 z-30 pointer-events-none">
                  <AnimatePresence>
                     {reactions.map((r) => (
                        <motion.div 
                           key={r.id}
                           initial={{ opacity: 0, y: 0, x: 0 }}
                           animate={{ opacity: 1, y: -200, x: (Math.random() - 0.5) * 100 }}
                           exit={{ opacity: 0 }}
                           className="text-4xl absolute bottom-0"
                        >
                           {r.emoji}
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>

            {/* RTMP CONFIG SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stream Server (RTMP)</p>
                  <div className="flex items-center justify-between bg-black/50 border border-white/5 p-4 rounded-2xl">
                     <code className="text-xs text-[#A855F7] truncate mr-4">{streamConfig?.rtmpUrl || 'Loading...'}</code>
                     <button 
                        onClick={() => copyToClipboard(streamConfig?.rtmpUrl, 'url')}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                     >
                        {copied === 'url' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                     </button>
                  </div>
               </div>
               <div className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Stream Key</p>
                  <div className="flex items-center justify-between bg-black/50 border border-white/5 p-4 rounded-2xl">
                     <code className="text-xs text-[#A855F7] truncate mr-4">
                        {streamConfig?.streamKey ? '••••••••••••••••' : 'Loading...'}
                     </code>
                     <button 
                        onClick={() => copyToClipboard(streamConfig?.streamKey, 'key')}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                     >
                        {copied === 'key' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: CHAT & ACTIVITY */}
         <div className="space-y-10">
            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] flex flex-col h-[600px] overflow-hidden shadow-2xl">
               <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#151515]">
                  <div className="flex items-center space-x-3">
                     <MessageCircle className="w-4 h-4 text-[#A855F7]" />
                     <h3 className="text-xs font-bold uppercase tracking-widest text-white">Live Network Chat</h3>
                  </div>
                  <span className="bg-[#A855F7]/10 text-[#A855F7] px-3 py-1 rounded-full text-[9px] font-mono font-bold">
                     {isLive ? 'ACTIVE' : 'STANDBY'}
                  </span>
               </div>
               <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                  {messages.length > 0 ? (
                     messages.map((msg, i) => (
                        <div key={i} className="space-y-1 group">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#A855F7] uppercase tracking-widest italic">{msg.user}</span>
                              <span className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">
                                 {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                           <p className="text-xs text-gray-400 font-medium leading-relaxed">{msg.text}</p>
                        </div>
                     ))
                  ) : (
                     <div className="h-full flex items-center justify-center text-center px-10">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest leading-loose">
                           {isLive ? 'Standby for fan engagement...' : 'Chat will initialize once the broadcast signal is detected.'}
                        </p>
                     </div>
                  )}
               </div>
               <div className="p-8 bg-[#0a0a0a] border-t border-white/5">
                  <div className="relative">
                     <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={!isLive || isSending}
                        placeholder={isLive ? "Broadcast to network..." : "Standby for signal..."}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#A855F7] transition-all disabled:opacity-50"
                     />
                     <button 
                        onClick={handleSendMessage}
                        disabled={!isLive || isSending}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-[#A855F7] transition-colors disabled:opacity-50"
                     >
                        <Heart className={`w-4 h-4 ${isSending ? 'animate-ping' : ''}`} />
                     </button>
                  </div>
               </div>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 space-y-6">
               <div className="flex items-center space-x-3 text-green-500">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Verified Stream</span>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Your broadcast is being distributed via the NRH High-Fidelity Network. All reactions and support during this set are settled instantly.
               </p>
               <button className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#A855F7] transition-colors group">
                  <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Invite Network Partners</span>
               </button>
            </div>
         </div>

      </div>

    </div>
  );
}


