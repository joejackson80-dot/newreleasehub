'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Music, Users, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NetworkFeed() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch('/api/network/feed?limit=5');
        const data = await res.json();
        if (data.success) {
          setItems(data.feed);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
    const interval = setInterval(fetchFeed, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && items.length === 0) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white/5 rounded-3xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 hover:border-[#00D2FF]/30 transition-all shadow-xl overflow-hidden"
          >
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
                  {item.artist.profileImageUrl ? (
                    <img src={item.artist.profileImageUrl} alt={item.artist.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <span className="text-xl">{item.metadata.icon}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black border border-white/10 rounded-lg flex items-center justify-center text-[10px]">
                  {item.metadata.icon}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                   <p className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest truncate">{item.artist.name}</p>
                   <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">
                     {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate mt-1">{item.title}</h4>
                <p className="text-[10px] text-gray-500 font-medium truncate mt-0.5">{item.description}</p>
              </div>

              <Link href={`/fan/${item.artist.slug}`} className="p-3 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
                 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Link href="/network/activity" className="block text-center py-4 border border-dashed border-white/10 rounded-2xl text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] hover:border-white/30 hover:text-white transition-all">
         View All Network Activity
      </Link>
    </div>
  );
}
