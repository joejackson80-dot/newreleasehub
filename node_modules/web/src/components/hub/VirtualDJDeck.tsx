'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disc, Play, Pause, SkipForward, SkipBack, Zap, Flame, Trash2, Volume2, Music, Activity, X, Check } from 'lucide-react';

interface Props {
  activeTrack: { title: string, id: string } | null;
  isPlaying: boolean;
  onToggle: () => void;
  onNext: () => void;
  isHologram?: boolean;
}

export default function VirtualDJDeck({ activeTrack, isPlaying, onToggle, onNext, isHologram: initialHologram = false }: Props) {
  const [bpm, setBpm] = useState(128.00);
  const [isHologram, setIsHologram] = useState(initialHologram);
  const [queue, setQueue] = useState([
    { id: '1', title: 'Cyberpunk Soul', requester: 'NeonFan' },
    { id: '2', title: 'Deep Ocean Bass', requester: 'WaveRider' },
  ]);
  
  // Real Hardware Aesthetics: Dark Charcoal, Industrial Grey, Precision Knobs
  const baseClass = isHologram 
    ? "bg-black/40 backdrop-blur-3xl border border-white/10 p-8 rounded-[2rem] shadow-2xl" 
    : "bg-[#111111] border border-white/5 p-10 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]";

  const handleApprove = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    // In a real app, this would trigger playback or move to a separate 'confirmed' queue
  };

  return (
    <div className={`${baseClass} w-full transition-all duration-700 relative group`}>
      
      {/* HOLOGRAM TOGGLE */}
      <button 
        onClick={() => setIsHologram(!isHologram)}
        className="absolute -top-4 -right-4 bg-[#00D2FF] text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-[100]"
      >
        <Activity className="w-5 h-5" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
         
         {/* DECK A (LEFT) - CURRENT TRACK */}
         <div className="flex flex-col items-center space-y-10">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-[#181818] border-[12px] border-black shadow-[inset_0_0_40px_rgba(0,0,0,1),0_20px_50px_rgba(0,0,0,0.5)] relative flex items-center justify-center group cursor-pointer overflow-hidden">
               {/* Vinyl Groove Texture */}
               <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'repeating-radial-gradient(circle, #000, #000 2px, #333 3px)' }}></div>
               <motion.div 
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full rounded-full flex items-center justify-center relative"
               >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center border-[8px] border-black shadow-2xl relative z-10">
                     <Disc className="w-8 h-8 md:w-10 md:h-10 text-black" />
                  </div>
                  {/* Highlight/Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
               </motion.div>
            </div>
            
            <div className="w-full bg-black/40 rounded-3xl p-6 border border-white/5 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Deck Alpha</span>
                  <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse"></div>
                     <span className="text-[10px] font-bold text-[#00D2FF] font-mono tracking-tighter">{bpm.toFixed(2)}</span>
                  </div>
               </div>
               <h4 className="text-sm font-bold text-white truncate italic tracking-tight uppercase leading-none">
                  {activeTrack?.title || 'System Standby'}
               </h4>
            </div>
         </div>

         {/* CENTRAL MIXER - PROFESSIONAL GRADE */}
         <div className="bg-black/20 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center space-y-12 shadow-2xl">
            <div className="grid grid-cols-2 gap-12 w-full">
               {/* EQ & Gain Knobs */}
               <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#181818] border-2 border-black shadow-lg relative cursor-pointer active:scale-95 transition-transform group">
                     <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/40 rounded-full group-hover:bg-[#00D2FF]"></div>
                  </div>
                  <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Gain</span>
               </div>
               <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#181818] border-2 border-black shadow-lg relative cursor-pointer active:scale-95 transition-transform group">
                     <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/40 rounded-full group-hover:bg-[#00D2FF]"></div>
                  </div>
                  <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Master</span>
               </div>
            </div>

            {/* Volume Faders */}
            <div className="flex space-x-16 h-56 py-6">
               <div className="w-10 h-full bg-black/40 rounded-full border border-white/5 relative flex justify-center p-1 group">
                  <motion.div 
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 160 }}
                    className="w-8 h-12 bg-[#222] rounded-lg border border-black shadow-xl cursor-ns-resize absolute top-4 z-10 group-hover:bg-[#00D2FF] transition-colors"
                  />
                  <div className="h-full w-[2px] bg-white/5 absolute left-1/2 -translate-x-1/2" />
               </div>
               <div className="w-10 h-full bg-black/40 rounded-full border border-white/5 relative flex justify-center p-1 group">
                  <motion.div 
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 160 }}
                    className="w-8 h-12 bg-[#222] rounded-lg border border-black shadow-xl cursor-ns-resize absolute top-12 z-10 group-hover:bg-[#00D2FF] transition-colors"
                  />
                  <div className="h-full w-[2px] bg-white/5 absolute left-1/2 -translate-x-1/2" />
               </div>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center space-x-8">
               <button onClick={onToggle} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-[#00D2FF] text-white shadow-[0_0_30px_rgba(51,102,255,0.4)]' : 'bg-white text-black hover:scale-105'}`}>
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
               </button>
               <button onClick={onNext} className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-white hover:bg-zinc-800">
                  <SkipForward className="w-6 h-6" />
               </button>
            </div>
         </div>

         {/* DECK B (RIGHT) - REQUEST QUEUE */}
         <div className="flex flex-col items-center space-y-10">
            <div className="w-full bg-black/40 rounded-3xl p-8 border border-white/5 space-y-8 min-h-[300px]">
               <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center space-x-3">
                     <Volume2 className="w-4 h-4 text-orange-500" />
                     <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Request Queue</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{queue.length} Tracks</span>
               </div>

               <div className="space-y-4 max-h-[200px] overflow-y-auto no-scrollbar">
                  {queue.map((item) => (
                    <div key={item.id} className="flex items-center justify-between group/item p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#00D2FF]/30 transition-all">
                       <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Requested by {item.requester}</p>
                       </div>
                       <div className="flex items-center space-x-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleApprove(item.id)}
                            className="p-1.5 bg-green-500/20 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-all"
                          >
                             <Check className="w-3 h-3" />
                          </button>
                          <button className="p-1.5 bg-red-500/20 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all">
                             <X className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                  ))}
                  {queue.length === 0 && (
                    <div className="py-10 text-center space-y-2 opacity-30">
                       <Music className="w-8 h-8 mx-auto" />
                       <p className="text-[8px] font-bold uppercase tracking-widest">Queue Empty</p>
                    </div>
                  )}
               </div>

               <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest transition-all">
                  Load Next Track
               </button>
            </div>

            <div className="w-full bg-[#00D2FF]/5 border border-[#00D2FF]/10 rounded-2xl p-4 flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <Activity className="w-4 h-4 text-[#00D2FF]" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">Master Clock</span>
               </div>
               <span className="text-[10px] font-bold text-[#00D2FF] font-mono">128.00 SYNC</span>
            </div>
         </div>

      </div>
    </div>
  );
}



