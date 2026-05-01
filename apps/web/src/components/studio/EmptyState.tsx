'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon: any;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-20 text-center space-y-6 bg-white/[0.02] border border-white/5 rounded-[3rem]"
    >
      <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-zinc-600">
         <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-sm">
         <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{title}</h3>
         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
            {description}
         </p>
      </div>
      {actionText && (
        <button 
          onClick={onAction}
          className="px-8 py-4 bg-[#A855F7] text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(168, 85, 247,0.2)] flex items-center gap-3"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </motion.div>
  );
}
