'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Zap, ShieldAlert, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

// A helper for generating random matrix-like text during decryption
const generateGlitchText = (length: number) => {
  const chars = '0123456789ABCDEF!@#$%^&*()';
  return Array.from({ length }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export default function VaultPage() {
  const [code, setCode] = useState('');
  const [unlockStage, setUnlockStage] = useState(0); // 0: Idle, 1: Verifying, 2: Access Granted, 3: Flash/Redirect
  const [glitchText, setGlitchText] = useState('AWAITING INPUT');

  // Matrix text effect during decryption
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (unlockStage === 1) {
      interval = setInterval(() => setGlitchText(generateGlitchText(14)), 50);
    } else if (unlockStage === 2) {
      setGlitchText('ACCESS GRANTED');
    } else if (unlockStage === 0) {
      setGlitchText('AWAITING INPUT');
    }
    return () => clearInterval(interval);
  }, [unlockStage]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== '68124') {
      toast.error('ACCESS DENIED. INCORRECT PROTOCOL.', {
        style: { background: '#111', color: '#EF4444', border: '1px solid #EF4444' }
      });
      setCode('');
      return;
    }

    setUnlockStage(1); // Start sequence
    
    // Call API to set cookie
    const res = await fetch('/api/vault/unlock', { method: 'POST' });
    if (res.ok) {
      // Stage 2: Rings speed up, unlock icon shows
      setTimeout(() => setUnlockStage(2), 2000);
      
      // Stage 3: Intense white flash and scale up
      setTimeout(() => setUnlockStage(3), 3500);
      
      // Redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 4500);
      
    } else {
      setUnlockStage(0);
      toast.error('SYSTEM ERROR');
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#F1F5F9] flex items-center justify-center relative overflow-hidden font-mono selection:bg-[#F1F5F9] selection:text-black">
      
      {/* --- BACKGROUND EFFECTS --- */}
      {/* 1. Breathing Ambient Core */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#F1F5F9] rounded-full blur-[150px] opacity-30 pointer-events-none"
      />

      {/* 2. Moving Perspective Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F1F5F9 1px, transparent 1px),
            linear-gradient(to bottom, #F1F5F9 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(1000px) rotateX(60deg) scale(2) translateY(-100px)',
          transformOrigin: 'top center',
        }}
      >
        <motion.div 
          animate={{ backgroundPosition: ['0px 0px', '0px 60px'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
          style={{ background: 'inherit' }}
        />
      </div>

      {/* 3. Scanline CRT Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-50 mix-blend-overlay"></div>

      {/* --- FLASH BANG TRANSITION --- */}
      <AnimatePresence>
        {unlockStage === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white z-[100] flex items-center justify-center pointer-events-none"
          >
             <div className="w-full h-px bg-[#F1F5F9] shadow-[0_0_50px_20px_#F1F5F9] animate-pulse"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* --- MAIN TERMINAL COMPONENT --- */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
        animate={{ 
          scale: unlockStage === 3 ? 2 : 1, 
          opacity: unlockStage === 3 ? 0 : 1,
          filter: unlockStage === 3 ? 'blur(20px)' : 'blur(0px)'
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="relative z-10 w-full max-w-lg p-6"
      >
        <div className="bg-black/40 backdrop-blur-3xl border border-[#F1F5F9]/30 rounded-3xl p-10 flex flex-col items-center text-center space-y-12 shadow-[0_0_80px_rgba(241,245,249,0.15)] relative overflow-hidden">
           
           {/* Corner Accents */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#F1F5F9] rounded-tl-3xl opacity-50"></div>
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#F1F5F9] rounded-tr-3xl opacity-50"></div>
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#F1F5F9] rounded-bl-3xl opacity-50"></div>
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#F1F5F9] rounded-br-3xl opacity-50"></div>

           {/* --- HOLO VAULT MECHANISM --- */}
           <div className="relative w-56 h-56 flex items-center justify-center">
              
              {/* Outer Data Ring (Dashed, slow reverse) */}
              <motion.div 
                animate={{ 
                  rotate: unlockStage === 0 ? -360 : unlockStage === 1 ? 720 : 0,
                  scale: unlockStage === 2 ? 1.2 : 1,
                  opacity: unlockStage === 2 ? 0 : 1
                }}
                transition={{ 
                  duration: unlockStage === 0 ? 30 : unlockStage === 1 ? 2 : 1, 
                  repeat: unlockStage === 0 ? Infinity : 0,
                  ease: "linear"
                }}
                className="absolute inset-0 rounded-full border border-dashed border-[#F1F5F9]/40"
              />
              
              {/* Middle Targeting Ring */}
              <motion.div 
                animate={{ 
                  rotate: unlockStage === 0 ? 360 : unlockStage === 1 ? -1080 : 0,
                  scale: unlockStage === 2 ? 1.5 : 1,
                  opacity: unlockStage === 2 ? 0 : 1
                }}
                transition={{ 
                  duration: unlockStage === 0 ? 15 : unlockStage === 1 ? 1.5 : 1, 
                  repeat: unlockStage === 0 ? Infinity : 0,
                  ease: "linear"
                }}
                className="absolute inset-6 rounded-full border-2 border-dotted border-[#F1F5F9]/80"
              />

              {/* Inner Hexagon Core */}
              <motion.div 
                animate={{ 
                  scale: unlockStage === 1 ? [1, 0.8, 1.1] : unlockStage === 2 ? 1.3 : 1,
                  rotate: unlockStage === 1 ? [0, 90, 180] : 0,
                  boxShadow: unlockStage >= 1 ? '0 0 80px #F1F5F9, inset 0 0 40px #F1F5F9' : '0 0 20px rgba(241,245,249,0.2), inset 0 0 10px rgba(241,245,249,0.1)'
                }}
                transition={{ duration: 0.5, repeat: unlockStage === 1 ? Infinity : 0 }}
                className="w-28 h-28 bg-[#F1F5F9]/5 border border-[#F1F5F9]/50 flex items-center justify-center relative z-10 backdrop-blur-md"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                <AnimatePresence mode="wait">
                  {unlockStage >= 2 ? (
                    <motion.div
                      key="unlocked"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-white"
                    >
                      <Unlock className="w-12 h-12 drop-shadow-[0_0_15px_#ffffff]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="locked"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-[#F1F5F9]"
                    >
                      <Lock className="w-12 h-12 drop-shadow-[0_0_10px_#F1F5F9]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
           </div>

           {/* --- SYSTEM TEXT --- */}
           <div className="space-y-2 relative z-10 w-full">
              <div className="flex items-center justify-between text-[10px] text-[#F1F5F9]/60 uppercase tracking-[0.3em] mb-2 border-b border-[#F1F5F9]/20 pb-2">
                 <span>SYS.STS</span>
                 <motion.span 
                   animate={{ opacity: [1, 0, 1] }} 
                   transition={{ duration: 1, repeat: Infinity }}
                 >
                   {unlockStage === 0 ? 'LOCKED' : unlockStage === 1 ? 'DECRYPTING...' : 'ONLINE'}
                 </motion.span>
              </div>
              
              <div className="h-8 flex items-center justify-center">
                 <h2 className={`text-xl font-black tracking-[0.2em] uppercase ${unlockStage >= 2 ? 'text-white drop-shadow-[0_0_10px_#ffffff]' : 'text-[#F1F5F9]'}`}>
                   {glitchText}
                 </h2>
              </div>
           </div>

           {/* --- INPUT TERMINAL --- */}
           <form onSubmit={handleUnlock} className="w-full relative z-10">
              <div className="relative group">
                {/* Decorative brackets */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#F1F5F9]/30 text-4xl font-light pointer-events-none group-focus-within:text-[#F1F5F9] transition-colors">[</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#F1F5F9]/30 text-4xl font-light pointer-events-none group-focus-within:text-[#F1F5F9] transition-colors">]</div>
                
                <input 
                   type="password"
                   value={code}
                   onChange={(e) => setCode(e.target.value.toUpperCase())}
                   disabled={unlockStage > 0}
                   placeholder="CODE"
                   className="w-full bg-transparent border-none px-8 py-4 text-center text-3xl sm:text-4xl font-black tracking-[0.5em] focus:outline-none text-white placeholder-[#F1F5F9]/20 transition-all disabled:opacity-0"
                   maxLength={5}
                   autoComplete="off"
                   autoFocus
                />

                {/* Progress bar overlay during decryption */}
                {unlockStage === 1 && (
                  <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-2 bg-[#F1F5F9]/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.8, ease: "linear" }}
                      className="h-full bg-[#F1F5F9] shadow-[0_0_10px_#F1F5F9]"
                    />
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={unlockStage > 0 || code.length < 5}
                className="hidden" // Submit via Enter key
              />
           </form>

           {/* --- FOOTER STATUS --- */}
           <div className="w-full flex justify-between items-center text-[8px] text-[#F1F5F9]/50 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1">
                 <ShieldAlert className="w-3 h-3" />
                 NRH CORE V.3.0
              </span>
              <span className="flex items-center gap-1">
                 <KeyRound className="w-3 h-3" />
                 REQ: AUTH TOKEN
              </span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
