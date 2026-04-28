'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Zap, Star, ShieldCheck, Play, ArrowRight, Loader2 } from 'lucide-react';

const tiers = [
  {
    name: 'Free Listener',
    price: '$0',
    description: 'The standard NRH experience with occasional ads.',
    features: [
      'Full NRH catalog access',
      'Audio ads every 3–4 tracks',
      'Follow artists',
      'Basic fan profile',
    ],
    notIncluded: [
      'Cannot earn revenue share',
      'No offline listening',
    ],
    cta: 'Listen Free',
    href: '/discover',
    highlight: false,
    icon: Play,
  },
  {
    name: 'NRH Subscriber',
    price: '$9.99',
    period: '/mo',
    description: 'Ad-free listening and early access to all music.',
    features: [
      'Full catalog, no ads',
      'Offline listening',
      'Higher-quality audio (320kbps)',
      'Early access to new releases (24hr)',
      'Can earn revenue share as a patron',
    ],
    cta: 'Subscribe Now',
    href: '/api/stripe/subscribe?tier=subscriber',
    highlight: true,
    icon: Zap,
  },
  {
    name: 'NRH Patron Bundle',
    price: '$14.99',
    period: '/mo',
    description: 'The ultimate way to support and invest in artists.',
    features: [
      'Everything in Subscriber',
      '$5 monthly patron credit applied automatically',
      'Priority queue in live streams',
      'Exclusive Patron badge on profile',
    ],
    cta: 'Start Patronizing',
    href: '/discover',
    highlight: false,
    icon: Star,
  },
];

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nrh_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleSubscribe = async (tierName: string) => {
    if (tierName === 'Free Listener') {
      window.location.href = '/discover';
      return;
    }

    setLoading(tierName);
    try {
      const res = await fetch('/api/stripe/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tier: tierName.toLowerCase(),
          userId: user || 'guest_user',
          email: user ? `${user}@example.com` : 'guest@example.com'
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to start checkout');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed. Please try again.');
      setLoading(null);
    }
  };

  return (
  return (
    <div className="min-h-screen bg-[#020202] text-white py-32 selection:bg-[#00D2FF] selection:text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* INSTITUTIONAL LOGO */}
        <div className="flex justify-center mb-20">
           <Link href="/" className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</Link>
        </div>

        <div className="text-center space-y-12 mb-24">
          <div className="flex items-center justify-center space-x-3 text-[#00D2FF]">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Grade Access</span>
          </div>
          <h1 className="text-5xl md:text-9xl font-bold tracking-tighter leading-[0.8] uppercase italic">
             Upgrade Your<br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Experience.</span>
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Support the artists you love while enjoying the best listening experience. 100% of master ownership stays with the artists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div 
              key={i} 
              className={`p-10 border rounded-3xl flex flex-col space-y-8 transition-all relative ${
                tier.highlight 
                  ? 'border-[#00D2FF] bg-[#00D2FF]/5 shadow-[0_0_40px_rgba(51,102,255,0.1)]' 
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00D2FF] text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  tier.highlight ? 'bg-[#00D2FF] text-white' : 'bg-white/5 text-[#00D2FF]'
                }`}>
                  <tier.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl uppercase">{tier.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  {tier.period && <span className="text-gray-500 font-medium">{tier.period}</span>}
                </div>
                <p className="text-gray-500 text-sm font-medium">{tier.description}</p>
              </div>

              <div className="flex-grow space-y-4 pt-8 border-t border-white/5">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-start space-x-3 text-sm">
                    <Check className="w-4 h-4 text-[#00D2FF] mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
                {tier.notIncluded?.map((feature, j) => (
                  <div key={j} className="flex items-start space-x-3 text-sm opacity-30">
                    <div className="w-4 h-4 flex items-center justify-center mt-0.5">
                      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                    </div>
                    <span className="text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe(tier.name)}
                disabled={!!loading}
                className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center space-x-2 ${
                  tier.highlight 
                    ? 'bg-[#00D2FF] text-white hover:bg-[#00D2FF]/90 shadow-lg shadow-[#00D2FF]/20' 
                    : 'bg-white/5 text-white hover:bg-white/10'
                } disabled:opacity-50`}
              >
                {loading === tier.name ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{tier.cta}</span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-32 p-10 border border-white/5 rounded-3xl bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-[#00D2FF]/10 flex items-center justify-center text-[#00D2FF]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl uppercase">Transparent Royalties</h4>
              <p className="text-gray-500 text-sm">We share exactly how your subscription fees are distributed to artists.</p>
            </div>
          </div>
          <Link 
            href="/how-it-works/revenue-sharing" 
            className="flex items-center space-x-2 text-[#00D2FF] font-bold text-xs uppercase tracking-widest hover:underline"
          >
            <span>Learn About Pool A & C</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
