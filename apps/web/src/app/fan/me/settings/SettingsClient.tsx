'use client';
import React from 'react';
import { User, Shield, CreditCard, Bell, LogOut, ArrowRight, Check, Lock, Globe } from 'lucide-react';
import Link from 'next/link';

export default function FanSettingsPage({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-12 pb-20">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-16">
        
        {/* HEADER */}
        <header className="space-y-4">
           <div className="flex items-center space-x-3 text-[#00D2FF]">
              <User className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Network Identity</span>
           </div>
           <h1 className="text-4xl md:text-3xl font-bold tracking-tighter italic uppercase">Account Settings.</h1>
        </header>

        {/* SETTINGS SECTIONS */}
        <div className="space-y-8">
           
           {/* PROFILE SECTION */}
           <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 space-y-10">
              <h3 className="text-xl font-bold italic uppercase tracking-tight flex items-center gap-3">
                 <Globe className="w-5 h-5 text-gray-500" /> Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Display Name</label>
                    <input 
                       type="text" 
                       defaultValue={user?.displayName || ''}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Email Address</label>
                    <input 
                       type="email" 
                       defaultValue={user?.email || ''}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all"
                    />
                 </div>
              </div>
              <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                 Update Profile
              </button>
           </section>

           {/* BILLING SECTION */}
           <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 space-y-10">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold italic uppercase tracking-tight flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-500" /> Billing & Patronages
                 </h3>
                 <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest">Active Settlement</span>
              </div>
              <div className="space-y-6">
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-white">Visa ending in 4242</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Expires 12/28</p>
                       </div>
                    </div>
                    <button className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest hover:underline">Update</button>
                 </div>
                 <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-400 font-medium">Manage active artist patronages and revenue shares.</p>
                    <Link href="/fan/me/library" className="flex items-center space-x-2 text-[10px] font-bold text-white uppercase tracking-widest hover:translate-x-2 transition-transform">
                       <span>View Library</span>
                       <ArrowRight className="w-4 h-4" />
                    </Link>
                 </div>
              </div>
           </section>

           {/* SECURITY SECTION */}
           <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 space-y-10">
              <h3 className="text-xl font-bold italic uppercase tracking-tight flex items-center gap-3">
                 <Shield className="w-5 h-5 text-gray-500" /> Network Security
              </h3>
              <div className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Protect your revenue shares</p>
                 </div>
                 <div className="w-12 h-6 bg-[#00D2FF] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>
           </section>

           {/* DANGER ZONE */}
           <section className="pt-12 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-1">
                 <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest">Danger Zone</h4>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Permanently deactivate your network hub</p>
              </div>
              <button className="flex items-center space-x-3 px-8 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                 <LogOut className="w-4 h-4" />
                 <span>Deactivate Account</span>
              </button>
           </section>

        </div>
      </div>
    </div>
  );
}
