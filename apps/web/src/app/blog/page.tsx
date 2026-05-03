import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Clock, User, Tag, ChevronRight, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

const MOCK_POSTS: any[] = [];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-12 pb-20 px-10">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
             <div className="inline-flex items-center space-x-3 text-[#A855F7]">
                <Tag className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Industry Journal</span>
             </div>
             <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] font-bold tracking-tighter italic uppercase leading-[0.8]">
                NRH<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Editorial.</span>
             </h1>
          </div>
          <div className="flex items-center space-x-6">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="bg-white/5 border border-white/10 rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[#A855F7] transition-all w-64"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
             </div>
          </div>
        </header>

        {/* EMPTY STATE */}
        {MOCK_POSTS.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <Tag className="w-12 h-12 text-zinc-800 mx-auto" />
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No editorial content available yet.</p>
          </div>
        )}

        {/* NEWSLETTER CTA */}
        <section className="bg-[#111] border border-white/5 rounded-[3rem] p-12 lg:p-20 text-center space-y-12 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
           <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-4xl font-bold uppercase tracking-tighter italic">Stay Ahead of the Industry.</h2>
              <p className="text-gray-500 font-medium">Join 50,000+ independent artists and industry professionals receiving the NRH Editorial weekly.</p>
           </div>
           <form className="max-w-md mx-auto flex items-center space-x-4 relative z-10">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#A855F7] transition-all"
              />
              <button className="px-10 py-4 rounded-full bg-[#A855F7] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-all shadow-lg shadow-[#A855F7]/20">Join</button>
           </form>
        </section>

      </div>
    </div>
  );
}


