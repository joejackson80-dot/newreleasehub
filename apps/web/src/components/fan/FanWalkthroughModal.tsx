'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, Globe, Zap, X, ArrowRight, ArrowLeft } from 'lucide-react';

const STEPS = [
  {
    title: 'Welcome to the Network',
    icon: Globe,
    color: 'text-[#A855F7]',
    bg: 'bg-[#A855F7]/10',
    description: 'You are now part of the premier network for independent music. Discover rising talent, build your reputation, and directly support the artists you love.'
  },
  {
    title: 'Discover & Support',
    icon: Heart,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    description: 'When you subscribe as a SUPPORTER, 100% of your contribution goes directly to the artist. No label cuts. No corporate fees.'
  },
  {
    title: 'Track Your Impact',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    description: 'Watch your Fan Level grow. Every interaction, stream, and dollar you contribute increases your network standing and unlocks exclusive perks.'
  },
  {
    title: 'Direct Connection',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    description: 'Access exclusive stems, private listening parties, and unreleased content directly from the artists you back.'
  }
];

export default function FanWalkthroughModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if they've seen it before
    const hasSeen = localStorage.getItem('nrh_fan_walkthrough_v1');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('nrh_fan_walkthrough_v1', 'true');
    setIsOpen(false);
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-[#111] border border-white/10 rounded-[2.5rem] w-full max-w-lg p-8 sm:p-12 shadow-2xl overflow-hidden flex flex-col items-center text-center space-y-8"
        >
          {/* Close Button */}
          <button onClick={handleClose} className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          {/* Progress Indicators */}
          <div className="flex gap-2 mb-4">
            {STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`w-12 h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'bg-white' : i < currentStep ? 'bg-white/40' : 'bg-white/10'}`}
              />
            ))}
          </div>

          <div className={`w-24 h-24 rounded-3xl ${step.bg} flex items-center justify-center`}>
            <Icon className={`w-12 h-12 ${step.color}`} />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{step.title}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              {step.description}
            </p>
          </div>

          <div className="flex w-full gap-4 pt-4">
            {currentStep > 0 && (
              <button 
                onClick={prevStep}
                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            <button 
              onClick={nextStep}
              className="flex-[2] py-4 rounded-2xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl flex items-center justify-center"
            >
              {currentStep === STEPS.length - 1 ? 'Enter Network' : 'Continue'}
              {currentStep !== STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
