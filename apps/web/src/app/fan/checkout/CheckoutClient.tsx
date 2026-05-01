'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Lock, CreditCard, Award, ArrowRight, CheckCircle2, Zap, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { processFanCheckout } from '@/app/actions/fan';
import { toast } from 'react-hot-toast';

interface Tier {
  id: string;
  name: string;
  priceMonthlyCents: number;
  revenueSharePercent: number;
  perks: string[];
}

interface Artist {
  id: string;
  name: string;
  slug: string;
  tiers?: Tier[];
}

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const artistId = searchParams.get('artist');
  
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [supporterNumber, setSupporterNumber] = useState<number>(0);

  useEffect(() => {
    if (!artistId) {
      setError('No artist specified for checkout.');
      setLoading(false);
      return;
    }

    const fetchArtist = async () => {
      try {
        // Fetch by artist ID instead of hardcoded slug
        const res = await fetch(`/api/org?id=${artistId}`);
        if (!res.ok) throw new Error('Artist not found');
        const data = await res.json();
        setArtist(data);
        
        // Fetch tiers for this artist
        const tierRes = await fetch(`/api/org/tiers?orgId=${data.id}`);
        if (tierRes.ok) {
           const tiers = await tierRes.json();
           setArtist(prev => prev ? { ...prev, tiers } : null);
           if (tiers.length > 0) setSelectedTier(tiers[0]);
        } else {
           throw new Error("Could not load tiers");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  const handleComplete = async () => {
    if (!artist || !selectedTier) return;
    setIsProcessing(true);
    
    const result = await processFanCheckout(artist.id, selectedTier.id);
    
    setIsProcessing(false);
    
    if (result.success) {
      setSupporterNumber(result.supporterNumber || 0);
      setStep(2);
    } else {
      toast.error(result.error || "Checkout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#F1F5F9] animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing Secure Vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-bold uppercase tracking-[0.3em] text-[10px]">Checkout Error: {error}</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10">Return to Profile</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN - SELECTION */}
        <div className="lg:col-span-7 space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[#F1F5F9]">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em]">Institutional Grade Security</span>
                  </div>
                  <h1 className="text-4xl md:text-3xl font-bold tracking-tighter italic uppercase leading-none">
                    Support {artist?.name}.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Own the participation.</span>
                  </h1>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select support Tier</h3>
                  <div className="space-y-4">
                    {artist?.tiers?.map((tier: any) => (
                      <button 
                        key={tier.id}
                        onClick={() => setSelectedTier(tier)}
                        className={`w-full p-8 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${selectedTier?.id === tier.id ? 'bg-white text-black border-white shadow-[0_0_50px_rgba(255,255,255,0.1)]' : 'bg-[#111] border-white/5 hover:border-white/20'}`}
                      >
                        <div className="flex justify-between items-start relative z-10">
                          <div className="space-y-2">
                             <h4 className="text-2xl font-bold italic uppercase tracking-tight">{tier.name}</h4>
                             <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedTier?.id === tier.id ? 'text-gray-500' : 'text-[#F1F5F9]'}`}>
                                {tier.revenueSharePercent}% Revenue Participation
                             </p>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-bold italic tabular-nums">${tier.priceMonthlyCents / 100}</p>
                             <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">/month</p>
                          </div>
                        </div>
                        {selectedTier?.id === tier.id && (
                          <motion.div layoutId="check" className="absolute top-4 right-4">
                             <CheckCircle2 className="w-6 h-6 text-black" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment Method</h3>
                   <div className="p-8 bg-[#111] border border-white/5 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
                      <div className="flex items-center space-x-6">
                         <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                            <CreditCard className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-white uppercase tracking-widest italic">Secure Credit Card</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Stripe Protected</p>
                         </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-800 group-hover:text-white transition-all" />
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-10"
              >
                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-green-500 border border-green-500/20">
                   <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                   <h1 className="text-4xl md:text-3xl font-bold tracking-tighter italic uppercase">Welcome, SUPPORTER.</h1>
                   <p className="text-gray-500 text-lg max-w-md mx-auto">Your participation in {artist?.name}'s revenue is now secured. You are now SUPPORTER #{supporterNumber}.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <button onClick={() => router.push(`/${artist?.slug}`)} className="px-10 py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#F1F5F9] hover:text-white transition-all">Return to Hub</button>
                   <button onClick={() => router.push('/fan/me')} className="px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Go to Dashboard</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN - SUMMARY */}
        {step === 1 && (
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                    <Award className="w-32 h-32" />
                 </div>
                 
                 <div className="space-y-2 relative z-10">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Asset Summary</p>
                    <h3 className="text-2xl font-bold italic tracking-tight text-white uppercase">{selectedTier?.name} License</h3>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center text-sm font-medium">
                       <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Monthly Commitment</span>
                       <span className="text-white">${(selectedTier?.priceMonthlyCents || 0) / 100}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                       <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Participation bps</span>
                       <span className="text-[#F1F5F9] font-bold italic">{((selectedTier?.revenueSharePercent || 0) * 100).toFixed(0)} bps</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">Total Due Today</span>
                       <span className="text-3xl font-bold italic tracking-tighter text-white">${(selectedTier?.priceMonthlyCents || 0) / 100}</span>
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10 pt-4">
                    <h5 className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Tier Benefits</h5>
                    <ul className="space-y-2">
                       {selectedTier?.perks.map((perk: string, i: number) => (
                         <li key={i} className="flex items-center space-x-3 text-xs font-medium text-gray-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500/40" />
                            <span>{perk}</span>
                         </li>
                       ))}
                    </ul>
                 </div>

                 <button 
                  onClick={handleComplete}
                  disabled={isProcessing}
                  className="w-full py-5 rounded-2xl bg-[#F1F5F9] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#00B8E0] transition-all shadow-[0_0_50px_rgba(51,102,255,0.3)] flex items-center justify-center space-x-3"
                 >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authorize Settlement</span>
                      </>
                    )}
                 </button>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 flex items-start space-x-6">
                 <Zap className="w-5 h-5 text-[#F1F5F9] mt-1 shrink-0" />
                 <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
                    "By authorizing this settlement, you enter into a legally binding Revenue Participation License. You will receive a direct share of {artist?.name}'s platform earnings."
                 </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


