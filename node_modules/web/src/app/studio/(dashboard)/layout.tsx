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
      { href: '/studio/SUPPORTERs', label: 'SUPPORTER Tiers', icon: Users },
      { href: '/studio/SUPPORTERs', label: 'Fan List', icon: Users },
    ],
  },
  {
    label: 'Money',
    items: [
      { href: '/studio/analytics', label: 'Analytics', icon: BarChart3 },
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
      { href: '/studio/ai', label: 'AI Studio', icon: Sparkles },
      { href: '/studio/share', label: 'Social Share', icon: Share2 },
    ],
  },
  {
    label: 'Services',
    items: [{ href: '/services', label: 'Order Services', icon: Wrench }],
  },
];

import StudioSidebar from '@/components/studio/StudioSidebar';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#000000] text-[#ededed] font-sans overflow-hidden">
      <StudioSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#020202]">
        <div className="lg:pt-0 pt-20"> {/* Add padding for mobile toggle */}
          {children}
        </div>
      </main>
    </div>
  );
}


