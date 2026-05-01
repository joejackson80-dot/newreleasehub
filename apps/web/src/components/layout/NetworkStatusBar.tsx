'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function NetworkStatusBar() {
  return (
    <div className="h-10 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-10 text-[9px] font-bold uppercase tracking-widest text-gray-500 overflow-hidden relative z-[60]">
       <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
             <span>Institutional Network: Online</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
             <Activity className="w-3 h-3 text-[#F1F5F9]" />
             <span>TPS: 2,404</span>
          </div>
          <div className="hidden lg:flex items-center space-x-2">
             <ShieldCheck className="w-3 h-3 text-purple-400" />
             <span>Encryption: AES-256 Verified</span>
          </div>
       </div>

       <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
             <Globe className="w-3 h-3 text-gray-700" />
             <span>Uptime: 99.998%</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-white">
             <Zap className="w-2.5 h-2.5 text-amber-500 fill-current" />
             <span>Major Event: London Hub Live</span>
          </div>
       </div>
    </div>
  );
}


