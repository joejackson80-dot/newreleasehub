'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-[#020202] border-t border-white/5 pt-32 pb-20 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-32">
          
          {/* BRAND (col-span-2) */}
          <div className="lg:col-span-2 space-y-10">
            <Link href="/" className="flex flex-col space-y-8 group">
               <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</div>
               <div className="space-y-1">
                  <span className="text-lg font-bold tracking-tighter uppercase text-white italic leading-none">New Release Hub<span className="text-[#00D2FF]">.</span></span>
               </div>
            </Link>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs italic">
               "Your Music. Your Fans. Your Money."
            </p>
            <div className="space-y-2">
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  © 2025 New Release Hub LLC. All rights reserved.
               </p>
            </div>
          </div>

          {/* PLATFORM */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/discover" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Discover</Link></li>
              <li><Link href="/network/charts" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Charts</Link></li>
              <li><Link href="/network/board" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Opportunities</Link></li>
              <li><Link href="/pricing" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Pricing</Link></li>
              <li><Link href="/how-it-works" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">How It Works</Link></li>
            </ul>
          </div>

          {/* ARTISTS */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Artists</h4>
            <ul className="space-y-4">
              <li><Link href="/studio/login" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Artist Sign Up</Link></li>
              <li><Link href="/studio/login" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Studio Login</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">About</Link></li>
              <li><Link href="/blog" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Blog</Link></li>
              <li><Link href="/press" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Press</Link></li>
              <li><Link href="/careers" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Careers</Link></li>
              <li><Link href="/contact" className="text-xs text-gray-500 hover:text-white transition-colors font-medium">Contact</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Stay in the loop.</h4>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); console.log('Subscribed:', email); setEmail(''); }}>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 placeholder="your@email.com" 
                 className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white placeholder-gray-700 focus:outline-none focus:border-[#00D2FF] transition-all"
               />
               <button 
                 type="submit"
                 className="w-full py-3 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl"
               >
                 Subscribe
               </button>
            </form>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>|</span>
            <Link href="/dmca" className="hover:text-white transition-colors">DMCA</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
