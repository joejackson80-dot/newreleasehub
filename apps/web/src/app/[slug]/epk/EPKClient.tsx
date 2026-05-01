'use client';
import React, { useState } from 'react';
import { Download, BarChart3, TrendingUp, Users, Globe, Activity, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EPKClient({ org }: { org: any }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setIsComplete(false);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
            setIsComplete(true);
            setTimeout(() => setIsComplete(false), 3000);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="space-y-20">
      
      {/* EXPORT ACTION (Used in Header) */}
      <div className="fixed top-4 md:top-6 right-32 md:right-40 z-[100]">
         <button 
           onClick={handleDownload}
           disabled={isDownloading}
           className="hidden sm:flex items-center space-x-2 bg-white/5 border border-white/10 px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-[8px] md:text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
         >
            {isDownloading ? (
              <div className="flex items-center space-x-3">
                 <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#A855F7] transition-all" style={{ width: `${downloadProgress}%` }} />
                 </div>
                 <span>{downloadProgress}%</span>
              </div>
            ) : isComplete ? (
              <div className="flex items-center space-x-2 text-green-500">
                 <Check className="w-3.5 h-3.5" />
                 <span>Saved</span>
              </div>
            ) : (
              <>
                <Download className="w-3 md:w-3.5 h-3 md:h-3.5" />
                <span>Download Press Kit</span>
              </>
            )}
         </button>
      </div>

      {/* ANALYTICS PREVIEW SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Streams', val: '4.2M', growth: '+12%', icon: Activity, color: 'text-[#A855F7]' },
           { label: 'Active Supporters', val: org.ParticipationLicenses.length.toString(), growth: '+5%', icon: Users, color: 'text-orange-500' },
           { label: 'Avg. Retention', val: '68%', growth: '+2%', icon: BarChart3, color: 'text-green-500' },
           { label: 'Market Reach', val: '42 Countries', growth: 'Global', icon: Globe, color: 'text-purple-500' }
         ].map((stat, i) => (
           <div key={i} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-white/10 transition-all">
              <div className="flex justify-between items-start">
                 <div className={`p-3 bg-white/5 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{stat.growth}</span>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-3xl font-bold italic tracking-tighter text-white">{stat.val}</p>
              </div>
           </div>
         ))}
      </section>

      {/* VELOCITY GRAPH (MOCK) */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8">
         <div className="flex justify-between items-end">
            <div className="space-y-2">
               <div className="flex items-center space-x-2 text-[#A855F7]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Growth Velocity</span>
               </div>
               <h4 className="text-2xl font-bold italic uppercase tracking-tighter">Performance Trajectory</h4>
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#A855F7]"></div>
                  <span>Revenue</span>
               </div>
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                  <span>Baseline</span>
               </div>
            </div>
         </div>
         <div className="h-48 flex items-end space-x-2">
            {[30, 45, 35, 60, 50, 80, 65, 90, 75, 100, 85, 110].map((h, i) => (
               <div 
                 key={i} 
                 className="flex-1 bg-gradient-to-t from-[#A855F7]/10 to-[#A855F7]/40 rounded-t-lg hover:to-[#A855F7] transition-all cursor-pointer relative group" 
                 style={{ height: `${(h / 110) * 100}%` }}
               >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                     ${(h * 12).toLocaleString()}
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
}
