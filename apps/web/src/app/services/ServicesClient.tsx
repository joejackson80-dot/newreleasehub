'use client';
import React, { useState } from 'react';
import { Wrench, ArrowRight, Zap, CheckCircle2, Search, Star, Filter, Music, Image as ImageIcon, Megaphone } from 'lucide-react';
import MainLayoutWrapper from '@/components/layout/MainLayoutWrapper';
import FadeIn from '@/components/ui/FadeIn';

const SERVICES_DATA = [
  {
    id: '1',
    category: 'Engineering',
    icon: Music,
    name: 'Platinum Mastering',
    provider: 'Oasis Sound Studios',
    price: 150,
    rating: 4.9,
    reviews: 124,
    deliveryDays: 3,
    description: 'Analog mastering for your track using SSL and Neve gear. Guaranteed radio-ready LUFS targets.'
  },
  {
    id: '2',
    category: 'Visuals',
    icon: ImageIcon,
    name: '3D Spotify Canvas',
    provider: 'CyberGraphics',
    price: 85,
    rating: 4.8,
    reviews: 89,
    deliveryDays: 5,
    description: 'Custom 8-second looping 3D animation for your Spotify release, perfectly synced to your track BPM.'
  },
  {
    id: '3',
    category: 'Promotion',
    icon: Megaphone,
    name: 'Algorithmic Trigger Campaign',
    provider: 'NRH Growth',
    price: 500,
    rating: 4.9,
    reviews: 240,
    deliveryDays: 14,
    description: 'Targeted ad spend and micro-influencer outreach to trigger Spotify algorithmic playlists (Discover Weekly).'
  },
  {
    id: '4',
    category: 'Engineering',
    icon: Music,
    name: 'Vocal Tuning & Comping',
    provider: 'Melody Labs',
    price: 75,
    rating: 4.7,
    reviews: 56,
    deliveryDays: 2,
    description: 'Professional vocal tuning (Melodyne/Auto-Tune) and comping for up to 5 vocal stems.'
  }
];

export default function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredServices = SERVICES_DATA.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayoutWrapper>
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic mb-4">
            Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-[#3a7bd5]">Services</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl mx-auto">
            Scale your release with institutional-grade engineering, visual arts, and promotional campaigns.
          </p>
        </div>

        <FadeIn>
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-[#111] border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
               {['All', 'Engineering', 'Visuals', 'Promotion'].map(cat => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                     activeCategory === cat ? 'bg-white text-black' : 'bg-black text-gray-500 border border-white/5 hover:border-white/20 hover:text-white'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
            </div>
            <div className="relative w-full md:w-64 shrink-0">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               <input 
                 type="text" 
                 placeholder="Search services..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
               />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredServices.map(service => (
               <div key={service.id} className="bg-[#111] border border-white/5 rounded-3xl p-8 hover:border-[#00D2FF]/30 transition-all group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center text-[#00D2FF] group-hover:scale-110 transition-transform">
                        <service.icon className="w-5 h-5" />
                     </div>
                     <span className="bg-[#00D2FF]/10 text-[#00D2FF] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#00D2FF]/20">
                        {service.category}
                     </span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                     <div>
                       <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-[#00D2FF] transition-colors">{service.name}</h3>
                       <p className="text-xs text-gray-500 font-medium mt-1">by <span className="text-gray-400">{service.provider}</span></p>
                     </div>
                     
                     <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="flex items-center text-yellow-500 gap-1">
                           <Star className="w-3.5 h-3.5 fill-current" />
                           <span>{service.rating} ({service.reviews})</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="text-gray-400">{service.deliveryDays} Day Delivery</span>
                     </div>
                     
                     <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                        {service.description}
                     </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                     <p className="text-2xl font-black italic tracking-tighter text-white">
                        ${service.price}
                     </p>
                     <button className="bg-white/5 hover:bg-white text-white hover:text-black transition-all px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span>Order</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                     </button>
                  </div>
               </div>
             ))}
             
             {filteredServices.length === 0 && (
               <div className="col-span-full py-20 text-center bg-[#111] border border-white/5 rounded-3xl">
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No services found matching your criteria</p>
               </div>
             )}
          </div>
        </FadeIn>
      </div>
    </MainLayoutWrapper>
  );
}
