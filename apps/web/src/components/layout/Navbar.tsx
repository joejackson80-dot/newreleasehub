'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Award, Zap, Radio, DollarSign } from 'lucide-react';
import BrandLogo from './BrandLogo';

const NAV_ITEMS = [
  { label: 'Discover', href: '/discover', icon: Zap },
  { label: 'Charts', href: '/network/charts', icon: Radio },
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
        <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 text-white">
           <Menu className="w-6 h-6" />
        </button>

      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[2000] bg-[#111111] p-10 flex flex-col"
          >
             <div className="flex justify-between items-center mb-12">
                <BrandLogo className="w-12 h-12" />
                <button onClick={() => setIsOpen(false)}><X className="w-8 h-8 text-white" /></button>
             </div>
             <div className="space-y-10 flex-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <Link 
                    key={item.label} 
                    href={item.href} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-6 group"
                  >
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#00D2FF]">
                         <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-2xl font-bold uppercase tracking-tighter text-white">{item.label}</span>
                  </Link>
                ))}
             </div>
             <div className="pt-10 border-t border-white/5 space-y-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="btn-outline w-full text-center block py-3 border-white/20 hover:bg-white hover:text-black">Sign In</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full text-center block">Join Free</Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
}
