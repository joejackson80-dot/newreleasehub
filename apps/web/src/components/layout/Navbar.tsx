'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Award, Zap, Radio, DollarSign, TrendingUp, Users, Info } from 'lucide-react';
import BrandLogo from './BrandLogo';

const NAV_ITEMS = [
  { label: 'Discover', href: '/discover', icon: Zap },
  { label: 'Charts', href: '/network/charts', icon: TrendingUp },
  { label: 'Opportunities', href: '/network/board', icon: Award },
  { label: 'Pricing', href: '/pricing', icon: DollarSign },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 bg-[#111111]/80 backdrop-blur-md border-b border-white/5 py-4`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-3 group">
           <BrandLogo className="w-10 h-10 transform group-hover:scale-105 transition-transform" />
           <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tighter uppercase text-white leading-none">New Release Hub</span>
           </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center space-x-12">
            {NAV_ITEMS.map((item) => {
               const isActive = pathname === item.href;
               return (
                 <Link 
                   key={item.label} 
                   href={item.href}
                   className={`text-[10px] font-bold uppercase tracking-widest transition-all ${isActive ? 'text-[#00D2FF]' : 'text-gray-400 hover:text-white'}`}
                 >
                   {item.label}
                 </Link>
               );
            })}
        </div>

        {/* ACTIONS */}
        <div className="hidden lg:flex items-center space-x-6">
           <form action="/search" method="GET" className="relative group">
              <input 
                type="text" 
                name="q"
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-full px-6 py-2.5 text-[10px] font-bold text-white placeholder-gray-700 focus:outline-none focus:border-[#00D2FF] transition-all w-48"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
           </form>
           <div className="flex items-center space-x-4">
              <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#00D2FF] transition-colors">Sign In</Link>
              <Link href="/register" className="btn-primary py-2.5 px-8 text-[10px] tracking-[0.2em]">Join Free</Link>
           </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button onClick={() => setIsOpen(true)} className="lg:hidden p-3 -mr-3 text-white">
           <Menu className="w-7 h-7" />
        </button>

      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[2000] bg-[#0A0A0A] flex flex-col"
          >
             <div className="flex justify-between items-center p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                   <BrandLogo className="w-10 h-10" />
                   <span className="text-xs font-bold uppercase tracking-widest text-white">Menu</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-3 -mr-3 bg-white/5 rounded-2xl border border-white/10">
                   <X className="w-6 h-6 text-white" />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
                
                {/* EXPLORE SECTION */}
                <div className="space-y-6">
                   <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Explore</p>
                   <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'Discover', href: '/discover', icon: Zap },
                        { label: 'Charts', href: '/network/charts', icon: TrendingUp },
                        { label: 'Opportunities', href: '/network/board', icon: Award },
                        { label: 'Verified Discovery', href: '/network/verified', icon: Search },
                        { label: 'Pricing', href: '/pricing', icon: DollarSign }
                      ].map((item) => (
                        <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="bg-[#111] border border-white/5 rounded-2xl p-5 flex items-center gap-5 group active:scale-[0.98] transition-all">
                           <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#00D2FF]">
                              <item.icon className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <p className="font-bold text-white text-sm uppercase italic">{item.label}</p>
                           </div>
                        </Link>
                      ))}
                   </div>
                </div>

                {/* ARTIST SECTION */}
                <div className="space-y-6">
                   <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Artist Studio</p>
                   <div className="grid grid-cols-1 gap-4">
                      {[
                        { label: 'Studio Dashboard', href: '/studio', icon: Zap },
                        { label: 'Opportunity Board', href: '/network/board', icon: DollarSign }
                      ].map((item) => (
                        <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-5 p-2 group">
                           <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                              <item.icon className="w-4 h-4" />
                           </div>
                           <span className="font-bold text-lg text-gray-400 group-hover:text-white uppercase tracking-tighter transition-colors italic">{item.label}</span>
                        </Link>
                      ))}
                   </div>
                </div>

             </div>

             <div className="p-8 border-t border-white/5 bg-[#0A0A0A] space-y-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.2em] text-center block">Sign In</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-full py-5 rounded-2xl bg-[#00D2FF] text-white font-black text-[11px] uppercase tracking-[0.2em] text-center block shadow-[0_10px_30px_rgba(0,210,255,0.3)]">Join Free</Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}


