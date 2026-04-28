'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShoppingBag, MessageSquare, Award } from 'lucide-react';

interface Activity {
  id: string;
  type: 'BID' | 'LICENSE' | 'CHAT' | 'SALE';
  user: string;
  amount?: string;
  hub: string;
  timestamp: Date;
}

export default function NetworkPulse() {
  const [activities, setActivities] = useState<Activity[]>([
    { id: '1', type: 'LICENSE', user: 'alpha_fan', amount: '$450.00', hub: 'HELLZ-FLAME', timestamp: new Date() },
    { id: '2', type: 'BID', user: 'neon_patron', amount: '$120.00', hub: 'SILK-ROAD', timestamp: new Date() },
    { id: '3', type: 'CHAT', user: 'sector_9', hub: 'GHOST-MODE', timestamp: new Date() },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: Activity['type'][] = ['BID', 'LICENSE', 'CHAT', 'SALE'];
      const newActivity: Activity = {
        id: Math.random().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        user: `user_${Math.floor(Math.random() * 1000)}`,
        amount: `$${(Math.random() * 500).toFixed(2)}`,
        hub: 'GLOBAL-NETWORK',
        timestamp: new Date()
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
         <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">Network Global Pulse</h3>
         </div>
         <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Live Sync: Active</span>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {activities.map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center space-x-4">
                 <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                    {act.type === 'LICENSE' && <Award className="w-4 h-4 text-orange-500" />}
                    {act.type === 'BID' && <Zap className="w-4 h-4 text-blue-500" />}
                    {act.type === 'CHAT' && <MessageSquare className="w-4 h-4 text-green-500" />}
                    {act.type === 'SALE' && <ShoppingBag className="w-4 h-4 text-purple-500" />}
                 </div>
                 <div>
                    <p className="text-[11px] font-bold text-white tracking-tight italic uppercase">{act.user}</p>
                    <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                       {act.type === 'LICENSE' ? 'Secured Participation' : 
                        act.type === 'BID' ? 'Placed Commercial Bid' : 
                        act.type === 'CHAT' ? 'Message Sent' : 'Store Interaction'}
                    </p>
                 </div>
              </div>
              <div className="text-right">
                 {act.amount && <p className="text-sm font-bold text-white tracking-tighter italic">{act.amount}</p>}
                 <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">{act.hub}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Scanning effect */}
      <motion.div 
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none"
      />
    </div>
  );
}
