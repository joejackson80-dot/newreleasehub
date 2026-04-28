'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Award, ArrowRight, ShieldCheck, Zap, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bidId = searchParams.get('bid');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden selection:bg-[#00D2FF] selection:text-white">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D2FF]/5 blur-[120px] rounded-full animate-pulse" />
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-12 relative z-10 text-center"
      >
        <div className="space-y-10">
           {/* INSTITUTIONAL LOGO */}
           <div className="flex justify-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-[2rem] bg-white text-black flex items-center justify-center font-bold text-3xl tracking-tighter shadow-[0_0_80px_rgba(255,255,255,0.1)]"
              >
                N
              </motion.div>
           </div>

           <div className="space-y-6">
              <div className="flex justify-center">
                <motion.div 
                  initial={{ scale: 0.5, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                  className="bg-[#00D2FF]/10 p-8 rounded-[2.5rem] border border-[#00D2FF]/20 shadow-[0_0_50px_rgba(0,210,255,0.1)]"
                >
                  <ShieldCheck className="w-20 h-20 text-[#00D2FF]" />
                </motion.div>
              </div>
              <div className="space-y-3">
                 <h1 className="text-5xl md:text-7xl font-bold tracking-tighter italic uppercase leading-[0.8]">Stake<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Secured.</span></h1>
                 <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-[10px]">Institutional Verification Complete</p>
              </div>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-10 backdrop-blur-3xl">
           <div className="space-y-4">
              <p className="text-lg text-gray-300 font-medium leading-relaxed italic">
                "Your master participation interest has been officially recorded. You are now a stakeholder in this artist's commercial journey."
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-500 font-bold uppercase tracking-widest text-[9px]">
                 <Zap className="w-3 h-3" />
                 <span>Royalties active as of next settlement period</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-1">
                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Transaction ID</p>
                 <p className="text-xs font-mono text-white truncate">{bidId || 'NRH-TRANS-772X'}</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left space-y-1">
                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Asset Type</p>
                 <p className="text-xs font-bold text-white uppercase italic">Master License</p>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-[#00D2FF] hover:text-white transition-all flex items-center justify-center gap-2">
                 <Download className="w-3.5 h-3.5" />
                 Download Certificate
              </button>
              <button className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                 <Share2 className="w-3.5 h-3.5" />
                 Share Proof
              </button>
           </div>
        </div>

        <div className="pt-4 space-y-6">
           <button 
             onClick={() => router.push('/fan/me/library')}
             className="group flex items-center space-x-3 mx-auto px-8 py-4 bg-[#00D2FF] rounded-full text-[10px] font-bold uppercase tracking-widest text-white hover:scale-105 transition-all shadow-xl shadow-[#00D2FF]/20"
           >
             <span>View in My Library</span>
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </button>
           <p className="text-[10px] text-gray-700 uppercase tracking-[0.5em] animate-pulse">Network Sync: {countdown}s</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.5em] text-gray-700">Finalizing Participation...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
