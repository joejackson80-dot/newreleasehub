'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Flame, Star, Zap, Award } from 'lucide-react';

interface Props {
  orgId: string;
}

export default function GiftOverlay({ orgId }: Props) {
  const [activeGifts, setActiveGifts] = useState<any[]>([]);

  useEffect(() => {
    if (!orgId) return;
    const channel = supabase.channel(`org-${orgId}`)
      .on('broadcast', { event: 'GIFT_RECEIVED' }, (payload: any) => {
        const newGift = { ...payload.payload, key: Date.now() };
        setActiveGifts(prev => [...prev, newGift]);
        setTimeout(() => {
          setActiveGifts(prev => prev.filter(g => g.key !== newGift.key));
        }, 5000);
      })
      .subscribe();
    
    return () => { supabase.removeChannel(channel); };
  }, [orgId]);

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {activeGifts.map((gift) => (
          <motion.div
            key={gift.key}
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1.5, opacity: 1, y: 0 }}
            exit={{ scale: 4, opacity: 0, y: -200 }}
            transition={{ duration: 1, ease: "backOut" }}
            className="absolute inset-0 flex items-center justify-center flex-col space-y-6"
          >
             <div className="relative">
                {gift.giftType === 'ENERGY' && (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
                )}
                {gift.giftType === 'GOLD_RECORD' && (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl" />
                )}
                {gift.giftType === 'SUPERNOVA' && (
                  <motion.div animate={{ scale: [1, 2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="w-96 h-96 bg-white/20 rounded-full blur-[100px]" />
                )}
                
                <div className="relative z-10 flex flex-col items-center">
                   {gift.giftType === 'ENERGY' && <Flame className="w-24 h-24 text-orange-500" />}
                   {gift.giftType === 'GOLD_RECORD' && <Star className="w-32 h-32 text-yellow-500" />}
                   {gift.giftType === 'SUPERNOVA' && <Zap className="w-48 h-48 text-white shadow-[0_0_50px_rgba(255,255,255,0.5)]" />}
                   
                   <div className="mt-8 text-center bg-black/40 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-[2rem]">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{gift.userName} SENT A GIFT</p>
                      <h4 className="text-2xl font-bold italic tracking-tighter uppercase text-white">{gift.giftType.replace('_', ' ')}</h4>
                      {gift.message && <p className="text-xs text-white/60 italic mt-2">"{gift.message}"</p>}
                   </div>
                </div>
             </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
