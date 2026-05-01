'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('nrh_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('nrh_cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-xl"
        >
          <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 text-[#A855F7] flex items-center justify-center shrink-0">
                   <Shield className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs text-white font-medium leading-relaxed">
                      NRH uses cookies to optimize your studio experience and track revenue participation accuracy.
                   </p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <button 
                  onClick={handleAccept}
                  className="px-6 py-2.5 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap"
                >
                   Accept
                </button>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-2.5 text-gray-500 hover:text-white transition-colors"
                >
                   <X className="w-4 h-4" />
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


