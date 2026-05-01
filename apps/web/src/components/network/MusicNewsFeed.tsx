'use client';
import React, { useState, useEffect } from 'react';
import { Newspaper, ArrowRight, ExternalLink, Globe, Zap, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_NEWS = [
  {
    id: 1,
    title: "The Rise of Direct-to-Fan Equity: How Independent Artists are Bypassing Traditional Label Loans",
    source: "NRH Editorial",
    category: "Industry Analysis",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=800",
    url: "#"
  },
  {
    id: 2,
    title: "Streaming Revenue Pool C Surpasses $1.2M as Ad Inventory Sales Hit Record Highs",
    source: "Network Pulse",
    category: "Financials",
    time: "5 hours ago",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    url: "#"
  },
  {
    id: 3,
    title: "Marcus Webb's 'Neon District' EP Breaks Platform Records for Supporter Conversion",
    source: "Artist Spotlight",
    category: "Success Stories",
    time: "1 day ago",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800",
    url: "#"
  },
  {
    id: 4,
    title: "New European Royalty Directive: What Every Independent Producer Needs to Know",
    source: "Global Law",
    category: "Legal",
    time: "1 day ago",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
    url: "#"
  }
];

export default function MusicNewsFeed() {
  return (
    <div className="space-y-16">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div className="space-y-4">
            <div className="flex items-center space-x-3 text-[#A855F7]">
               <Newspaper className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-[0.4em]">Global Industry Hub</span>
            </div>
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-black tracking-tighter uppercase italic leading-none">Music Industry <span className="text-gray-500">News.</span></h2>
         </div>
         <button className="flex items-center space-x-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors group">
            <span>View Full Archive</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
         </button>
      </div>

      {/* FEATURED NEWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {MOCK_NEWS.map((news, i) => (
            <motion.div 
               key={news.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
               className="group relative flex flex-col space-y-6"
            >
               <div className="aspect-video rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 relative">
                  <img src={news.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-60 group-hover:opacity-100" />
                  <div className="absolute top-6 left-6 flex items-center space-x-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                     <div className="w-1.5 h-1.5 bg-[#A855F7] rounded-full animate-pulse"></div>
                     <span className="text-[8px] font-bold uppercase tracking-widest text-white">{news.category}</span>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                     <span>{news.source}</span>
                     <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{news.time}</span>
                     </div>
                  </div>
                  <h3 className="text-lg font-bold leading-tight text-white group-hover:text-[#A855F7] transition-colors line-clamp-2 italic uppercase tracking-tighter">
                     {news.title}
                  </h3>
                  <a href={news.url} className="inline-flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                     <span>Read Perspective</span>
                     <ExternalLink className="w-3 h-3" />
                  </a>
               </div>
            </motion.div>
         ))}
      </div>

      {/* TICKER MARQUEE */}
      <div className="bg-white/[0.02] border-y border-white/5 py-4 overflow-hidden relative">
         <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
               <div key={i} className="flex items-center space-x-12 px-6">
                  <div className="flex items-center space-x-4">
                     <TrendingUp className="w-4 h-4 text-green-500" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white">NRH Network Index: +14.2% Growth in Direct Supporter Revenue</span>
                  </div>
                  <div className="flex items-center space-x-4">
                     <Globe className="w-4 h-4 text-blue-500" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white">Global Ingest: 4,200 New Independent Masters Protected via NRH Ledger</span>
                  </div>
                  <div className="flex items-center space-x-4">
                     <Zap className="w-4 h-4 text-[#A855F7]" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live Stats: 84.2K Active Frequencies Authorized</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
