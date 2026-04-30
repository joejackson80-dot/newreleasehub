'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VaultPage() {
  const [code, setCode] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const router = useRouter();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== '68124') {
      toast.error('Invalid Protocol Code');
      setCode('');
      return;
    }

    setIsUnlocking(true);
    
    // Call API to set cookie
    const res = await fetch('/api/vault/unlock', { method: 'POST' });
    if (res.ok) {
      toast.success('Protocol Override Authorized');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
    } else {
      setIsUnlocking(false);
      toast.error('System Error');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isUnlocking ? 1.1 : 1, opacity: isUnlocking ? 0 : 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="relative z-10 w-full max-w-md p-8 sm:p-12"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden">
           
           {/* Animated Vault Ring */}
           <motion.div 
             animate={{ rotate: isUnlocking ? 180 : 0 }}
             transition={{ duration: 1.5, ease: 'backInOut' }}
             className="w-32 h-32 rounded-full border border-white/5 bg-zinc-900/50 flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"
           >
              <div className="absolute inset-0 rounded-full border-t-2 border-[#00D2FF] opacity-50" />
              {isUnlocking ? (
                <Unlock className="w-10 h-10 text-emerald-500" />
              ) : (
                <Lock className="w-10 h-10 text-zinc-500" />
              )}
           </motion.div>

           <div className="space-y-3">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Restricted Protocol</h1>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                Platform is currently in pre-release staging. Enter authorization code to access the matrix.
              </p>
           </div>

           <form onSubmit={handleUnlock} className="w-full space-y-4">
              <input 
                 type="password"
                 value={code}
                 onChange={(e) => setCode(e.target.value)}
                 disabled={isUnlocking}
                 placeholder="ENTRY CODE"
                 className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-center text-2xl font-black tracking-[0.5em] focus:outline-none focus:border-[#00D2FF] transition-colors disabled:opacity-50"
                 maxLength={5}
              />
              <button 
                type="submit"
                disabled={isUnlocking || code.length < 5}
                className="w-full py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 group"
              >
                 {isUnlocking ? 'Unlocking...' : 'Initialize'}
                 {!isUnlocking && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>

           <div className="pt-4 border-t border-white/5 w-full flex justify-center">
              <span className="flex items-center gap-2 text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                 <ShieldCheck className="w-3 h-3" />
                 Secure Staging Environment
              </span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
