'use client';
import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Users } from 'lucide-react';

export default function RoleMismatchPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8 text-center relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-8 animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Access Restricted<span className="text-red-500">.</span></h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
            You are currently signed in with a <span className="text-white">FAN</span> account. Artist Studio access requires an Artist-tier profile.
          </p>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
            To manage your music on New Release Hub, you must register a separate account with a different email address or upgrade your current account.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            <Link 
              href="/fan/me" 
              className="w-full py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              Return to Fan Portal
            </Link>
            <button 
              onClick={() => window.location.href = '/api/auth/signout'}
              className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              Sign Out & Register New
            </button>
          </div>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-700 hover:text-white transition-colors uppercase tracking-[0.3em]">
          <ArrowLeft className="w-3 h-3" /> Back to Home
        </Link>
      </div>

      {/* Aesthetic Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}
