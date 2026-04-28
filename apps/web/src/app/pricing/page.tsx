'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShieldCheck, Zap, Award, Globe, Music, ArrowRight, Star, Heart, Building2, User } from 'lucide-react';
import Link from 'next/link';

const ARTIST_TIERS = [
  {
    name: 'Artist Free',
    price: '0',
    description: 'Perfect for getting started and building your foundation.',
    features: [
      '100% Master Ownership',
      'Global Music Crate Access',
      'Fan Connection Tools',
      'Basic Stream Tracking',
      'Standard Support Center'
    ],
    buttonText: 'Get Started Free',
    color: 'border-white/10'
  },
  {
    name: 'Artist Pro',
    price: '9.99',
    description: 'The standard for independent success and monetization.',
    features: [
      'Everything in Free',
      'Custom Patron Support Tiers',
      'Revenue Participation Engine',
      'Institutional Curation Score',
      'Professional Sync Opportunities',
      'Priority Support'
    ],
    buttonText: 'Upgrade to Pro',
    popular: true,
    color: 'border-[#00D2FF]'
  },
  {
    name: 'Artist Pro Plus',
    price: '14.99',
    description: 'Maximized exposure and advanced network tools.',
    features: [
      'Everything in Pro',
      'Featured Discovery Placement',
      'Advanced Audience Insights',
      'Enhanced AI Studio Access',
      'Social Share Automation',
      'Custom EPK Hosting'
    ],
    buttonText: 'Go Pro Plus',
    color: 'border-purple-500/50'
  }
];

const LABEL_TIERS = [
  {
    name: 'Label Basic',
    price: '59.99',
    description: 'Scale your roster with institutional grade tools.',
    features: [
      'Manage 10 Artist Pro Plus Accounts',
      'Centralized Royalty Dashboard',
      'Advanced Roster Analytics',
      'Label-Wide Sync Opportunities',
      'Institutional Verified Status',
      'Dedicated Account Manager'
    ],
    buttonText: 'Start Label Basic',
    color: 'border-white/10'
  },
  {
    name: 'Label Pro',
    price: '79.99',
    description: 'The ultimate powerhouse for growing collectives.',
    features: [
      'Manage 20 Artist Pro Plus Accounts',
      'White-label Management Portal',
      'Priority Roster Discovery',
      'Direct Sync Agent Access',
      'Advanced API Integration',
      'Unlimited Support'
    ],
    buttonText: 'Go Label Pro',
    popular: true,
    color: 'border-amber-500/50'
  },
  {
    name: 'Label Enterprise',
    price: '99.99',
    description: 'Elite infrastructure for major institutional operations.',
    features: [
      'Manage 40 Artist Pro Plus Accounts',
      'Custom White-label Domains',
      'Institutional Data Feed',
      'Bulk Rights Management',
      'Premium Sync Placement Priority',
      '24/7 Dedicated Concierge'
    ],
    buttonText: 'Contact Enterprise',
    color: 'border-[#00D2FF]'
  }
];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'artist' | 'label'>('artist');

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-12 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* HEADER */}
        <section className="text-center space-y-12">
           <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md"
              >
                 <Award className="w-4 h-4 text-[#00D2FF]" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Institutional Ownership Plans</span>
              </motion.div>
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] italic uppercase">
                 Scale Your<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Network.</span>
              </h1>
           </div>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              No middleman. No hidden fees. Just 100% independence for you and your entire roster.
           </p>

           {/* TOGGLE */}
           <div className="flex justify-center pt-8">
              <div className="bg-[#111] p-1.5 rounded-2xl border border-white/5 flex items-center shadow-2xl">
                 <button 
                   onClick={() => setActiveTab('artist')}
                   className={`flex items-center space-x-3 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'artist' ? 'bg-[#00D2FF] text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                    <User className="w-4 h-4" />
                    <span>Independent Artist</span>
                 </button>
                 <button 
                   onClick={() => setActiveTab('label')}
                   className={`flex items-center space-x-3 px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'label' ? 'bg-[#00D2FF] text-white' : 'text-gray-500 hover:text-white'}`}
                 >
                    <Building2 className="w-4 h-4" />
                    <span>Collective / Label</span>
                 </button>
              </div>
           </div>
        </section>

        {/* PRICING CARDS */}
        <div className="relative min-h-[600px]">
           <AnimatePresence mode="wait">
              {activeTab === 'artist' ? (
                <motion.section 
                  key="artist"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {ARTIST_TIERS.map((tier) => (
                    <div key={tier.name} className={`bg-[#111] border ${tier.color} rounded-[2.5rem] p-10 flex flex-col space-y-10 relative overflow-hidden group hover:bg-white/[0.02] transition-all duration-500 shadow-2xl`}>
                      {tier.popular && (
                        <div className="absolute top-0 right-0 bg-[#00D2FF] text-white text-[9px] font-bold uppercase tracking-widest px-6 py-2 rounded-bl-2xl">
                          Recommended
                        </div>
                      )}
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold uppercase tracking-tighter italic">{tier.name}</h3>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-5xl font-bold tracking-tighter italic">${tier.price}</span>
                          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">/ Month</span>
                        </div>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{tier.description}</p>
                      </div>
                      <ul className="flex-1 space-y-4">
                        {tier.features.map((feat, i) => (
                          <li key={i} className="flex items-start space-x-3 text-xs font-medium">
                            <Check className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />
                            <span className="text-gray-300">{feat}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/studio/login" className={`block w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest text-center transition-all ${tier.popular ? 'bg-[#00D2FF] text-white hover:bg-[#00B8E0]' : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'}`}>
                        {tier.buttonText}
                      </Link>
                    </div>
                  ))}
                </motion.section>
              ) : (
                <motion.section 
                  key="label"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                   {LABEL_TIERS.map((tier) => (
                    <div key={tier.name} className={`bg-[#111] border ${tier.color} rounded-[3rem] p-12 lg:p-16 flex flex-col space-y-12 relative overflow-hidden group hover:bg-white/[0.02] transition-all duration-500 shadow-2xl`}>
                      {tier.popular && (
                        <div className="absolute top-0 right-0 bg-[#00D2FF] text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-bl-3xl">
                          Best Value
                        </div>
                      )}
                      <div className="space-y-6">
                        <h3 className="text-4xl font-bold uppercase tracking-tighter italic">{tier.name}</h3>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-7xl font-bold tracking-tighter italic">${tier.price}</span>
                          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">/ Month</span>
                        </div>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">{tier.description}</p>
                      </div>
                      <ul className="flex-1 space-y-5">
                        {tier.features.map((feat, i) => (
                          <li key={i} className="flex items-start space-x-4 text-sm font-medium">
                            <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-gray-300">{feat}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href="/studio/login" className={`block w-full py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] text-center transition-all ${tier.popular ? 'bg-[#00D2FF] text-white hover:bg-[#00B8E0]' : 'bg-white text-black hover:bg-gray-200'}`}>
                        {tier.buttonText}
                      </Link>
                    </div>
                  ))}
                </motion.section>
              )}
           </AnimatePresence>
        </div>

        {/* REVENUE SHARE FOOTER */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-4xl font-bold uppercase tracking-tighter italic leading-tight">Everything built for<br />Network Growth.</h2>
              <p className="text-gray-400 leading-relaxed font-medium text-lg">
                 Whether you are an independent creator or a legacy label, NRH provides the infrastructure to retain ownership while maximizing revenue yield through fan patronage.
              </p>
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <Zap className="w-6 h-6 text-[#00D2FF]" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">Instant Deployment</p>
                 </div>
                 <div className="space-y-2">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">IP Protection</p>
                 </div>
              </div>
           </div>
           <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#00D2FF]/20 to-purple-500/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative bg-[#111] p-12 rounded-[3rem] border border-white/5 space-y-10 shadow-2xl">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Success Story</p>
                    <Star className="w-5 h-5 text-amber-500" />
                 </div>
                 <p className="text-2xl font-medium italic text-white leading-relaxed">
                    "Moving our roster to NRH Label Pro saved us $2k/month in distribution fees and increased our fan yield by 400%."
                 </p>
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10"></div>
                    <div>
                       <p className="text-xs font-bold uppercase tracking-widest">Collective X</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Institutional Partner</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}
