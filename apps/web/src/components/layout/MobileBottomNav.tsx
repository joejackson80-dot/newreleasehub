'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Radio, LayoutGrid, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Feed', href: '/discover', icon: Zap },
  { label: 'Radio', href: '/radio', icon: Radio },
  { label: 'Search', href: '/discover', icon: Search },
  { label: 'Studio', href: '/studio', icon: LayoutGrid },
  { label: 'Me', href: '/fan/me', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[2000] px-6 pb-6">
       <div className="bg-[#111111]/90 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className="flex-1 relative py-4 flex flex-col items-center gap-1 group"
              >
                 <div className={`relative z-10 transition-all duration-300 ${isActive ? 'text-[#A855F7] scale-110' : 'text-gray-500'}`}>
                    <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                 </div>
                 <span className={`text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-white opacity-100' : 'text-gray-600 opacity-60'}`}>
                    {item.label}
                 </span>
                 {isActive && (
                   <motion.div 
                     layoutId="activeTab"
                     className="absolute inset-0 bg-white/5 rounded-3xl -z-0"
                     transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                   />
                 )}
              </Link>
            );
          })}
       </div>
    </div>
  );
}
