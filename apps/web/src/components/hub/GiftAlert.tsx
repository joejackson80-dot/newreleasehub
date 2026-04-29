'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function GiftAlert({ orgId }: { orgId: string }) {
  const [alert, setAlert] = useState<{ user: string, amount: number, type: string } | null>(null);

  useEffect(() => {
    if (!orgId) return;

    // Listen for new licenses (Gifts)
    const channel = supabase.channel(`gifts-${orgId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'ParticipationLicense',
        filter: `organizationId=eq.${orgId}`
      }, (payload) => {
        setAlert({ 
          user: payload.new.userId, 
          amount: payload.new.feeCents, 
          type: 'LICENSE_SECURED' 
        });
        setTimeout(() => setAlert(null), 5000);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orgId]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
            className="bg-white text-black px-8 py-4 rounded-3xl shadow-[0_0_100px_rgba(255,255,255,0.4)] flex items-center space-x-6 border border-white/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center animate-bounce">
               <Award className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">New support License</span>
               <h4 className="text-xl font-bold tracking-tighter italic">
                  {alert.user} <span className="text-gray-400 font-medium tracking-normal text-sm">secured</span> ${(alert.amount / 100).toLocaleString()}
               </h4>
            </div>
            <div className="flex space-x-1">
               {[...Array(3)].map((_, i) => (
                 <Star key={i} className="w-3 h-3 text-orange-500 fill-orange-500" />
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


