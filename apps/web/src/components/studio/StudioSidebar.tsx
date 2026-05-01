'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, DollarSign, Settings, LogOut, Radio, Disc, Users,
  BarChart3, Briefcase, Palette, Share2, Wrench, GitMerge, Sparkles, Music, Wallet, Menu, X, Trophy, Package, Gavel, Building2
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '/studio', label: 'Dashboard', icon: LayoutGrid }],
  },
  {
    label: 'Music',
    items: [
      { href: '/studio/releases', label: 'Releases', icon: Disc },
      { href: '/studio/releases', label: 'Tracks', icon: Music },
      { href: '/studio/merch', label: 'Merch Drops', icon: Package },
    ],
  },
  {
    label: 'Fans',
    items: [
      { href: '/studio/supporters', label: 'SUPPORTER Tiers', icon: Users },
      { href: '/studio/supporters', label: 'Fan List', icon: Users },
    ],
  },
  {
    label: 'Money',
    items: [
      { href: '/studio/analytics', label: 'Insights', icon: BarChart3 },
      { href: '/studio/earnings', label: 'Earnings', icon: DollarSign },
      { href: '/studio/payouts', label: 'Payouts', icon: Wallet },
    ],
  },
  {
    label: 'Governance',
    items: [
      { href: '/studio/governance/new', label: 'Submit Proposal', icon: Gavel },
      { href: '/studio/admin', label: 'Network Treasury', icon: Building2 },
      { href: '/studio/collabs', label: 'Active Deals', icon: GitMerge },
    ],
  },
  {
    label: 'Network Board',
    items: [
      { href: '/network/board', label: 'All Opportunities', icon: Briefcase },
      { href: '/studio/opportunities', label: 'My Postings', icon: Briefcase },
    ],
  },
  {
    label: 'Creative',
    items: [
      { href: '/studio/tools', label: 'Tools Hub', icon: Wrench },
      { href: '/studio/milestones', label: 'Milestones', icon: Trophy },
      { href: '/studio/share', label: 'Social Share', icon: Share2 },
    ],
  },
  {
    label: 'Services',
    items: [{ href: '/services', label: 'Marketplace', icon: Palette }],
  },
];

export default function StudioSidebar({ org }: { org: any }) {
  const isLabel = org?.planTier === 'ELITE';
  const [isOpen, setIsOpen] = useState(false);
  const [unviewedMilestones, setUnviewedMilestones] = useState(0);
  const pathname = usePathname();

  React.useEffect(() => {
    fetch('/api/studio/milestones/count')
      .then(res => res.json())
      .then(data => setUnviewedMilestones(data.count))
      .catch(() => {});
  }, [pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#050505] border-r border-[#1a1a1a]">
      <div className="px-6 py-6 border-b border-[#1a1a1a] flex items-center justify-between">
        <Link href="/studio">
          <h2 className="text-sm font-bold text-white tracking-tight hover:text-[#A855F7] transition-colors uppercase">
            NRH <span className="text-gray-500 font-light normal-case">Studio</span>
          </h2>
        </Link>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto no-scrollbar">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 px-3 mb-3">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-xs font-medium relative group ${
                      pathname === item.href || (item.href !== '/studio' && pathname?.startsWith(item.href))
                        ? 'text-[#A855F7] bg-[#A855F7]/5' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {(pathname === item.href || (item.href !== '/studio' && pathname?.startsWith(item.href))) && (
                      <motion.div 
                        layoutId="nav-glow"
                        className="absolute inset-0 bg-[#A855F7]/5 rounded-lg shadow-[inset_0_0_20px_rgba(168, 85, 247,0.1)] border border-[#A855F7]/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="flex items-center space-x-2.5 relative z-10">
                      <item.icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        pathname === item.href || (item.href !== '/studio' && pathname?.startsWith(item.href))
                          ? 'text-[#A855F7]' 
                          : 'text-gray-500 group-hover:text-white'
                      }`} />
                      <span>{item.label}</span>
                    </div>
                    {item.label === 'Milestones' && unviewedMilestones > 0 && (
                      <span className="flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#1D9E75] px-1 text-[8px] font-bold text-white">
                        {unviewedMilestones}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {isLabel && (
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-purple-500 px-3 mb-3">Institutional</p>
            <Link 
              href="/label" 
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition-all text-xs font-bold text-purple-400 hover:text-white hover:bg-purple-500/10 ${pathname === '/label' ? 'bg-purple-500/10 text-purple-300' : ''}`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Label Dashboard</span>
            </Link>
          </div>
        )}

        <div className="border-t border-white/5 pt-4">
          <Link href="/studio/dj" onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-xs font-bold">
            <Radio className="w-3.5 h-3.5" />
            <span>Go Live</span>
          </Link>
          <Link href="/studio/customize" onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[#A855F7] hover:text-purple-300 hover:bg-purple-500/10 transition-all text-xs font-medium mt-0.5">
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Page</span>
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-[#1a1a1a] bg-[#050505]">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#A855F7]/20 border border-[#A855F7]/30 flex items-center justify-center font-bold text-[10px] text-[#A855F7] shrink-0 uppercase">
            {org?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{org?.name || 'Artist Studio'}</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">
              {org?.planTier === 'ELITE' ? 'Institutional / Label' : 'Verified Artist'}
            </p>
          </div>
        </div>
        <Link href="/studio/settings" onClick={() => setIsOpen(false)}
          className="flex items-center space-x-2 text-[10px] text-gray-500 hover:text-gray-300 transition-colors font-semibold mb-1">
          <Settings className="w-3 h-3" />
          <span>Settings</span>
        </Link>
        <Link href="/studio/login" onClick={() => setIsOpen(false)}
          className="flex items-center space-x-2 text-[10px] text-gray-500 hover:text-gray-300 transition-colors font-semibold">
          <LogOut className="w-3 h-3" />
          <span>Sign out</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle - HIDDEN in favor of BottomNav */}
      <div className="hidden lg:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-3 bg-[#050505] border border-white/10 rounded-xl text-white shadow-2xl"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-72"
            >
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


