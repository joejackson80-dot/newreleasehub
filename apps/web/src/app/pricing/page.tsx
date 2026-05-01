'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Users, Building2, User, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ARTIST_PLANS = [
  {
    name: 'INDIE',
    price: 'Free',
    royalty: '75%',
    description: 'Perfect for getting started and building your foundation.',
    features: [
      'Stream & earn',
      '75% streaming royalties',
      '1 SUPPORTER tier',
      '5 releases',
      'Basic analytics',
      '3 opportunity applications/month',
      'Monthly payouts'
    ],
    buttonText: 'Get Started Free',
    href: '/studio/register',
    color: 'border-white/10'
  },
  {
    name: 'PRO',
    price: '$5.99',
    royalty: '85%',
    popular: true,
    description: 'The standard for independent success and monetization.',
    features: [
      'Everything in Indie, plus:',
      '85% streaming royalties',
      'Unlimited releases',
      '3 SUPPORTER tiers',
      'Full analytics',
      'Unlimited opportunity applications',
      'Bi-weekly payouts',
      'Listening parties',
      'Post scheduling'
    ],
    buttonText: 'Start Pro',
    href: '/studio/register', // Ideally a stripe checkout link
    color: 'border-[#A855F7]'
  },
  {
    name: 'STUDIO',
    price: '$9.99',
    royalty: '95%',
    description: 'Maximized exposure and advanced network tools.',
    features: [
      'Everything in Pro, plus:',
      '95% streaming royalties',
      'Unlimited SUPPORTER tiers',
      'Advanced analytics',
      'Weekly payouts',
      'Custom domain support',
      'White-label player',
      'Priority support'
    ],
    buttonText: 'Start Studio',
    href: '/studio/register', // Ideally a stripe checkout link
    color: 'border-purple-500/50'
  }
];

const ENTERPRISE_PLANS = [
  {
    name: 'COLLECTIVE',
    price: '$39.99',
    description: 'Up to 10 artists / 3 team seats',
    features: [
      '95% royalties for every roster artist',
      'Consolidated earnings dashboard',
      'Revenue split automation'
    ],
    color: 'border-white/10'
  },
  {
    name: 'IMPRINT',
    price: '$59.99',
    description: 'Up to 20 artists / 10 team seats',
    features: [
      '95% royalties for every roster artist',
      'Consolidated earnings dashboard',
      'Revenue split automation'
    ],
    color: 'border-amber-500/50'
  },
  {
    name: 'POWERHOUSE',
    price: '$79.99',
    description: 'Up to 40 artists / 20 team seats',
    features: [
      '95% royalties for every roster artist',
      'Consolidated earnings dashboard',
      'Revenue split automation'
    ],
    color: 'border-[#A855F7]'
  }
];

const FAQS = [
  {
    q: 'Can I change plans anytime?',
    a: 'Yes. Upgrade or downgrade at any time.'
  },
  {
    q: 'What happens to my music if I downgrade?',
    a: 'Your music and fans are always yours.'
  },
  {
    q: 'Do you take a cut of SUPPORTER income?',
    a: 'No. SUPPORTER subscriptions go directly to you via Stripe.'
  },
  {
    q: 'Is there a free trial?',
    a: 'Your first 1,000 artists get Pro free for 12 months. After that, Indie is free forever.'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-20 pb-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-24 sm:space-y-32">
        
        {/* HEADER */}
        <section className="text-center space-y-8">
           <div className="space-y-4">
              <h1 className="text-[clamp(2.5rem,10vw,8rem)] font-bold tracking-tighter italic uppercase leading-[0.8] mb-6">Simple pricing.<br /><span className="text-[#A855F7]">Serious payouts.</span></h1>
              <p className="text-xs sm:text-xl text-gray-500 font-bold uppercase tracking-widest italic leading-relaxed">Start free. Upgrade when your music is ready to grow.</p>
           </div>
        </section>

        {/* ARTIST TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {ARTIST_PLANS.map((tier) => (
            <div key={tier.name} className={`bg-[#111] border ${tier.color} rounded-[2.5rem] p-8 sm:p-10 flex flex-col space-y-10 relative overflow-hidden group hover:bg-white/[0.02] transition-all duration-500 shadow-2xl`}>
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-[#A855F7] text-white text-[9px] font-bold uppercase tracking-widest px-6 py-2 rounded-bl-2xl">
                  Most Popular
                </div>
              )}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold uppercase tracking-tighter italic">{tier.name}</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tighter italic text-white">{tier.price}</span>
                  <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">/ Month</span>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">{tier.description}</p>
              </div>
              <ul className="flex-1 space-y-4">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-3 text-xs font-medium">
                    <Check className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link href={tier.href} className={`block w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest text-center transition-all ${tier.popular ? 'bg-[#A855F7] text-white hover:bg-[#00B8E0]' : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black'}`}>
                {tier.buttonText}
              </Link>
            </div>
          ))}
        </div>

        {/* EARNINGS COMPARISON */}
        <section className="bg-white/5 border border-white/10 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 text-center space-y-8 backdrop-blur-xl">
           <h3 className="text-lg sm:text-2xl font-bold italic uppercase tracking-tight">If you earn $1,000 in streaming this month:</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-2">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Indie</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white uppercase italic">You keep $750</p>
               </div>
               <div className="space-y-2">
                  <p className="text-[#A855F7] text-[10px] font-bold uppercase tracking-widest">Pro</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white uppercase italic">You keep $850 <span className="text-green-500 text-sm">(+$100)</span></p>
               </div>
               <div className="space-y-2">
                  <p className="text-[#A855F7] text-[10px] font-bold uppercase tracking-widest">Studio</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white uppercase italic">You keep $950 <span className="text-green-500 text-sm">(+$200)</span></p>
               </div>
           </div>
        </section>

        <div className="text-center">
           <h2 className="text-4xl font-bold uppercase italic tracking-tighter text-gray-500">For Labels & Management</h2>
        </div>

        {/* ENTERPRISE TIERS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {ENTERPRISE_PLANS.map((tier) => (
            <div key={tier.name} className={`bg-[#111] border ${tier.color} rounded-[2.5rem] p-8 sm:p-10 flex flex-col space-y-8 group hover:bg-white/[0.02] transition-all duration-500 shadow-2xl`}>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold uppercase tracking-tighter italic">{tier.name}</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold tracking-tighter italic text-white">{tier.price}</span>
                  <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">/ Month</span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{tier.description}</p>
              </div>
              <ul className="space-y-4">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-3 text-xs font-medium">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest italic">All enterprise plans include 95% royalties for every roster artist.</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ SECTION */}
        <section className="space-y-16">
           <div className="text-center">
              <h2 className="text-4xl font-bold italic uppercase tracking-tighter">Common Questions.</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {FAQS.map((faq, i) => (
                <div key={i} className="space-y-4">
                   <h4 className="text-sm font-bold uppercase tracking-widest flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-[#A855F7]" />
                      {faq.q}
                   </h4>
                   <p className="text-gray-500 text-sm leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
}


