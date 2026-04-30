import React from 'react';
import Link from 'next/link';
import {
  LayoutGrid, DollarSign, Settings, LogOut, Radio, Disc, Users,
  BarChart3, Briefcase, Palette, Share2, Wrench, GitMerge, Sparkles, Music, Wallet
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
      { href: '/studio/radio', label: 'NRH Radio', icon: Radio },
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
      { href: '/studio/earnings', label: 'Payouts', icon: Wallet },
    ],
  },
  {
    label: 'Network',
    items: [
      { href: '/network/board', label: 'Opportunities', icon: Briefcase },
      { href: '/studio/collabs', label: 'Collab Requests', icon: GitMerge },
    ],
  },
  {
    label: 'Creative',
    items: [
      { href: '/studio/tools', label: 'Tools Hub', icon: Wrench },
      { href: '/studio/share', label: 'Social Share', icon: Share2 },
    ],
  },
  {
    label: 'Services',
    items: [{ href: '/services', label: 'Marketplace', icon: Palette }],
  },
];

import StudioSidebar from '@/components/studio/StudioSidebar';
import StudioBottomNav from '@/components/studio/StudioBottomNav';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#000000] text-[#ededed] font-sans overflow-hidden">
      <StudioSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#020202] pb-20 md:pb-0">
        <div className="lg:pt-0">
          {children}
        </div>
      </main>

      <StudioBottomNav />
    </div>
  );
}


