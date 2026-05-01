'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Disc, Zap, Star, ShieldCheck } from 'lucide-react';

export default function HeroVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A855F7]/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px]"></div>

      {/* FLOATING RECORD */}
      <motion.div 
        animate={{ 
          rotateY: [0, 15, 0, -15, 0],
          rotateX: [0, -10, 0, 10, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative z-10 w-[350px] md:w-[450px] aspect-square rounded-full shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-60"></div>
          
          {/* GROOVES EFFECT */}
          <div className="absolute inset-0 bg-[repeating-radial-gradient(circle_at_center,transparent_0px,transparent_2px,rgba(255,255,255,0.03)_3px,transparent_4px)]"></div>
          
          {/* VINYL CENTER */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 bg-[#111] rounded-full border-4 border-white/5 flex items-center justify-center z-20 shadow-2xl">
             <div className="w-16 h-16 rounded-full flex items-center justify-center">
               <img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(168, 85, 247,0.6)]" />
             </div>
          </div>

          {/* SPINNING LIGHT REFLECTIONS */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full h-full skew-x-12"
          ></motion.div>
        </div>
      </motion.div>

      {/* FLOATING BADGES */}
      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-0 z-20 p-5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl space-y-3 shadow-2xl"
      >
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
           </div>
           <span className="text-[10px] font-bold uppercase tracking-widest text-white">Master Ownership Guaranteed</span>
        </div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-0 z-20 p-5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl space-y-3 shadow-2xl"
      >
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 rounded-lg bg-[#A855F7]/20 text-[#A855F7] flex items-center justify-center">
              <Zap className="w-4 h-4" />
           </div>
           <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white">Active Rotation</p>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Network Frequency 104.2</p>
           </div>
        </div>
      </motion.div>

      <motion.div 
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 -right-12 z-20 p-4 bg-white text-black rounded-2xl flex items-center space-x-3 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
      >
        <Star className="w-4 h-4 fill-current text-yellow-500" />
        <span className="text-[10px] font-black uppercase tracking-widest italic">Artist Verification Active</span>
      </motion.div>

    </div>
  );
}
