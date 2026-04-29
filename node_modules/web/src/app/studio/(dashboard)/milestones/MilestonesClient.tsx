'use client';
import React, { useState, useEffect } from 'react';
import { Trophy, Share2, Download, CheckCircle2, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MILESTONE_DEFINITIONS = [
  { type: 'FIRST_UPLOAD', label: 'First Upload', category: 'Creator' },
  { type: 'FIRST_SUPPORTER', label: 'First SUPPORTER', category: 'Community' },
  { type: 'SUPPORTERS_10', label: '10 SUPPORTERs', category: 'Community' },
  { type: 'SUPPORTERS_50', label: '50 SUPPORTERs', category: 'Community' },
  { type: 'SUPPORTERS_100', label: '100 SUPPORTERs', category: 'Community' },
  { type: 'SUPPORTERS_250', label: '250 SUPPORTERs', category: 'Community' },
  { type: 'SUPPORTERS_500', label: '500 SUPPORTERs', category: 'Community' },
  { type: 'SUPPORTERS_1000', label: '1,000 SUPPORTERs', category: 'Community' },
  { type: 'STREAMS_1000', label: '1,000 Streams', category: 'Impact' },
  { type: 'STREAMS_10000', label: '10,000 Streams', category: 'Impact' },
  { type: 'STREAMS_50000', label: '50,000 Streams', category: 'Impact' },
  { type: 'STREAMS_100000', label: '100,000 Streams', category: 'Impact' },
  { type: 'STREAMS_1000000', label: '1,000,000 Streams', category: 'Impact' },
  { type: 'EARNINGS_100', label: '$100 Earned', category: 'Financial' },
  { type: 'EARNINGS_1000', label: '$1,000 Earned', category: 'Financial' },
  { type: 'EARNINGS_10000', label: '$10,000 Earned', category: 'Financial' },
];

export default function MilestonesClient() {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharingMilestone, setSharingMilestone] = useState<any | null>(null);

  useEffect(() => {
    // In a real app, artistId would be handled by auth session
    fetch('/api/studio/milestones?markViewed=true')
      .then(res => res.json())
      .then(data => {
        setMilestones(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const earnedTypes = new Set(milestones.map(m => m.type));
  const earnedMilestones = milestones;
  const lockedMilestones = MILESTONE_DEFINITIONS.filter(d => !earnedTypes.has(d.type));

  const handleShare = (milestone: any) => {
    setSharingMilestone(milestone);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1D9E75]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* EARNED */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-[#1D9E75]" />
          Earned Milestones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {earnedMilestones.map(m => (
            <motion.div 
              key={m.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-white/20 transition-all"
            >
              <div className="aspect-square relative overflow-hidden bg-zinc-900">
                {m.cardImageUrl ? (
                  <img src={m.cardImageUrl} alt={m.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white/5" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-[#1D9E75] p-2 rounded-full shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-white">{m.type.replace(/_/g, ' ')}</p>
                   <p className="text-[10px] text-gray-500 font-medium mt-1">Achieved {new Date(m.achievedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleShare(m)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#1D9E75]/20 hover:border-[#1D9E75]/30 transition-all">
                      <Share2 className="w-4 h-4" />
                   </button>
                   <a href={m.cardImageUrl} download target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                      <Download className="w-4 h-4" />
                   </a>
                </div>
              </div>
            </motion.div>
          ))}
          {earnedMilestones.length === 0 && (
            <div className="lg:col-span-3 text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
               <Trophy className="w-12 h-12 text-white/10 mx-auto mb-4" />
               <p className="text-sm text-gray-500 font-medium">No milestones achieved yet. Your first upload will trigger your first card!</p>
            </div>
          )}
        </div>
      </section>

      {/* LOCKED */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Lock className="w-3 h-3" />
          Upcoming Milestones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {lockedMilestones.map(m => (
            <div key={m.type} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all border-dashed">
               <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                  <Lock className="w-4 h-4 text-gray-600" />
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-white">{m.label}</p>
               <p className="text-[9px] text-gray-600 font-bold mt-1 uppercase">{m.category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHARE MODAL */}
      <AnimatePresence>
        {sharingMilestone && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSharingMilestone(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] w-full max-w-3xl relative z-10 overflow-hidden shadow-[0_0_100px_rgba(29,158,117,0.2)]">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                   <div>
                     <h3 className="text-xl font-bold italic uppercase tracking-tight">Share Your Success</h3>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Drive fans back to your profile</p>
                   </div>
                   <button onClick={() => setSharingMilestone(null)} className="p-2 text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
                      <img src={sharingMilestone.cardImageUrl} alt="Milestone card" className="w-full h-full object-cover" />
                   </div>
                   <div className="space-y-8 flex flex-col justify-center">
                      <div className="space-y-3">
                         <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Suggested Caption</label>
                         <textarea 
                           className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white resize-none focus:border-[#1D9E75] focus:outline-none transition-colors font-medium"
                           defaultValue={`Just hit ${sharingMilestone.type.replace(/_/g, ' ')} on @newreleasehub 🎵\n\nYour support makes this possible. Check out my profile for exclusive access and more.\n\nnewreleasehub.com/artist-slug`}
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <button className="py-4 rounded-xl bg-[#1D9E75] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-[#15805d] transition-all flex items-center justify-center gap-2">
                           <Share2 className="w-3.5 h-3.5" /> Instagram
                         </button>
                         <button className="py-4 rounded-xl bg-[#1DA1F2] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-[#1a91da] transition-all">Twitter / X</button>
                         <button className="py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all">Copy Link</button>
                         <button className="py-4 rounded-xl bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-700 transition-all">Download</button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


