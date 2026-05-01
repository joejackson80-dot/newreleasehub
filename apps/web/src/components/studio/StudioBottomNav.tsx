'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Music, 
  DollarSign, 
  Users, 
  Settings,
  Zap
} from 'lucide-react';

const STUDIO_BOTTOM_LINKS = [
  { href: '/studio', label: 'Home', icon: LayoutDashboard },
  { href: '/studio/releases', label: 'Releases', icon: Music },
  { href: '/studio/earnings', label: 'Money', icon: DollarSign },
  { href: '/studio/supporters', label: 'Fans', icon: Users },
  { href: '/studio/customize', label: 'Profile', icon: Zap },
];

export default function StudioBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="
      fixed bottom-0 left-0 right-0 z-50
      md:hidden
      bg-[#0F0F0E]
      border-t border-white/5
      flex items-center justify-around
      h-16
      safe-area-bottom
    ">
      {STUDIO_BOTTOM_LINKS.map(link => {
        const isActive = pathname === link.href || (link.href !== '/studio' && pathname.startsWith(link.href));
        
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={`flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors ${isActive ? 'text-[#F1F5F9]' : 'text-gray-500 hover:text-white'}`}
          >
            <link.icon size={20} className={isActive ? 'fill-current/10' : ''} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
