'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === '/studio') return null;

  const paths = pathname.split('/').filter(p => p && p !== 'studio' && p !== '(dashboard)');
  
  return (
    <nav className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-8">
      <Link href="/studio" className="hover:text-white transition-colors flex items-center space-x-2">
        <Home className="w-3 h-3" />
        <span>Studio</span>
      </Link>
      
      {paths.map((path, i) => {
        const href = `/studio/${paths.slice(0, i + 1).join('/')}`;
        const isLast = i === paths.length - 1;
        const label = path.replace(/-/g, ' ');

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-3 h-3 text-gray-800" />
            {isLast ? (
              <span className="text-[#A855F7] italic">{label}</span>
            ) : (
              <Link href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
