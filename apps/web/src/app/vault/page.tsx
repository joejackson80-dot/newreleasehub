'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VaultPage() {
  const [code, setCode] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockStage, setUnlockStage] = useState(0);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== '68124') {
      toast.error('Invalid Protocol Code');
      setCode('');
      return;
    }

    setIsUnlocking(true);
    setUnlockStage(1); // Start sequence
    
    // Call API to set cookie
    const res = await fetch('/api/vault/unlock', { method: 'POST' });
    if (res.ok) {
      toast.success('Protocol Override Authorized');
      
      // Stage 2: Spin rings faster
      setTimeout(() => setUnlockStage(2), 800);
      
      // Stage 3: Burst open
      setTimeout(() => setUnlockStage(3), 2000);
      
      // Redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
    } else {
      setIsUnlocking(false);
      setUnlockStage(0);
      toast.error('System Error');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]"></div>
      
      {/* Dramatic glow when unlocked */}
      <AnimatePresence>
        {unlockStage >= 3 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 2 }}
            className="absolute inset-0 bg-[#00D2FF]/20 blur-[150px] z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: unlockStage === 3 ? 1.5 : 1, 
          opacity: unlockStage === 3 ? 0 : 1,
          filter: unlockStage === 3 ? 'blur(10px)' : 'blur(0px)'
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="relative z-10 w-full max-w-lg p-6 sm:p-12"
      >
        <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
           
           {/* Complex Animated Vault Mechanism */}
           <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer Ring */}
              <motion.div 
                animate={{ 
                  rotate: unlockStage === 0 ? 360 : unlockStage === 1 ? -180 : unlockStage === 2 ? 720 : 0,
                  scale: unlockStage === 3 ? 1.5 : 1,
                  opacity: unlockStage === 3 ? 0 : 1
                }}
                transition={{ 
                  duration: unlockStage === 0 ? 20 : unlockStage === 2 ? 1 : 2, 
                  repeat: unlockStage === 0 ? Infinity : 0,
                  ease: unlockStage === 2 ? "circIn" : "linear"
                }}
                className={`absolute inset-0 rounded-full border-2 border-dashed ${unlockStage >= 2 ? 'border-[#00D2FF]' : 'border-white/20'}`}
              />
              
              {/* Middle Ring */}
              <motion.div 
                animate={{ 
                  rotate: unlockStage === 0 ? -360 : unlockStage === 1 ? 360 : unlockStage === 2 ? -720 : 0,
                  scale: unlockStage === 3 ? 2 : 1,
                  opacity: unlockStage === 3 ? 0 : 1
                }}
                transition={{ 
                  duration: unlockStage === 0 ? 15 : unlockStage === 2 ? 0.8 : 1.5, 
                  repeat: unlockStage === 0 ? Infinity : 0,
                  ease: unlockStage === 2 ? "circIn" : "linear"
                }}
                className={`absolute inset-4 rounded-full border-4 border-dotted ${unlockStage >= 2 ? 'border-emerald-500' : 'border-white/10'}`}
              />

              {/* Inner Core */}
              <motion.div 
                animate={{ 
                  scale: unlockStage >= 2 ? [1, 1.2, 1] : 1,
                  boxShadow: unlockStage >= 2 ? '0 0 50px #00D2FF' : '0 0 0px transparent'
                }}
                transition={{ duration: 0.5, repeat: unlockStage === 2 ? Infinity : 0 }}
                className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center relative z-10"
              >
                <AnimatePresence mode="wait">
                  {unlockStage >= 2 ? (
                    <motion.div
                      key="unlocked"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-[#00D2FF]"
                    >
                      <Unlock className="w-10 h-10 drop-shadow-[0_0_15px_rgba(0,210,255,0.8)]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="locked"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-zinc-600"
                    >
                      <Lock className="w-10 h-10" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
           </div>

           <div className="space-y-3 relative z-10">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                {unlockStage >= 2 ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D2FF] to-emerald-400">Access Granted</span>
                ) : (
                  'Restricted Protocol'
                )}
              </h1>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed h-10">
                {unlockStage >= 2 ? 'Initializing Network Environment...' : 'Platform is currently in pre-release staging. Enter authorization code.'}
              </p>
           </div>

           <form onSubmit={handleUnlock} className="w-full space-y-4 relative z-10">
              <div className="relative">
                <input 
                   type="password"
                   value={code}
                   onChange={(e) => setCode(e.target.value)}
                   disabled={isUnlocking}
                   placeholder="CODE"
                   className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-6 text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:border-[#00D2FF] transition-all disabled:opacity-30 disabled:border-[#00D2FF]/30 backdrop-blur-md"
                   maxLength={5}
                />
                {unlockStage >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm"
                  >
                    <Zap className="w-8 h-8 text-[#00D2FF] animate-pulse" />
                  </motion.div>
                )}
              </div>
              <button 
                type="submit"
                disabled={isUnlocking || code.length < 5}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group ${
                  unlockStage >= 2 ? 'bg-[#00D2FF] text-black shadow-[0_0_30px_rgba(0,210,255,0.4)]' : 'bg-white text-black hover:bg-gray-200 disabled:opacity-50'
                }`}
              >
                 {unlockStage >= 2 ? 'Decrypting...' : isUnlocking ? 'Verifying...' : 'Initialize'}
                 {unlockStage < 2 && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>

           <div className="pt-6 border-t border-white/5 w-full flex justify-center relative z-10">
              <span className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest transition-colors ${unlockStage >= 2 ? 'text-[#00D2FF]' : 'text-gray-600'}`}>
                 <ShieldCheck className="w-3 h-3" />
                 Secure Staging Environment
              </span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
