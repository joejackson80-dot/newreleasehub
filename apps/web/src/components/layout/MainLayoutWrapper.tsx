'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide global navbar/footer on studio and login pages for a cleaner app experience
  const isStudio = pathname?.startsWith('/studio');
  const isAuth = pathname?.includes('/login') || pathname?.includes('/welcome');
  const isHome = pathname === '/';
  const hideGlobalLayout = isStudio || isAuth;

  return (
    <>
      {!hideGlobalLayout && <Navbar />}
      <main className={`flex-1 ${(!hideGlobalLayout && !isHome) ? 'pt-20 md:pt-24' : ''}`}>
        {children}
      </main>
      {!hideGlobalLayout && <Footer />}
    </>
  );
}


