'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TheaterModeLayout from '@/components/hub/TheaterModeLayout';
import { Users, Music, ArrowRight, Zap, Globe } from 'lucide-react';

export default function LiveStagePage() {
  const params = useParams();
  const slug = params?.slug as string || "hellz-flame";
  const [isEntering, setIsEntering] = useState(true);
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    // Fetch artist name for the entrance
    const fetchOrg = async () => {
      const res = await fetch(`/api/org?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArtistName(data.name);
      }
    };
    fetchOrg();

    // Entrance animation duration
    const timer = setTimeout(() => setIsEntering(false), 3000);
    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* FAN VENUE ENTRY ANIMATION */}
      {isEntering && (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center overflow-hidden">
           {/* Stylized "Crowd" Bokeh Effect */}
           <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white opacity-5 blur-3xl animate-pulse"
                  style={{
                    width: Math.random() * 300 + 100,
                    height: Math.random() * 300 + 100,
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 5 + 's',
                    animationDuration: Math.random() * 5 + 3 + 's'
                  }}
                ></div>
              ))}
           </div>

           <div className="relative z-10 flex flex-col items-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
              <div className="flex items-center space-x-4">
                 <div className="w-1 h-1 rounded-full bg-white/20"></div>
                 <span className="text-[10px] font-bold uppercase tracking-[1em] text-gray-500">Entering the Hub</span>
                 <div className="w-1 h-1 rounded-full bg-white/20"></div>
              </div>
              
              <div className="text-center space-y-2">
                 <h1 className="text-5xl md:text-7xl font-bold tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-700">
                    {artistName || slug}
                 </h1>
                 <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Live Master Release Hub</p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                 <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-zinc-900 border-2 border-black flex items-center justify-center">
                         <Users className="w-3 h-3 text-gray-700" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-black flex items-center justify-center backdrop-blur-md">
                       <span className="text-[8px] font-bold text-white/40">+1.2k</span>
                    </div>
                 </div>
                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Joining the Global Collective</p>
              </div>
           </div>

           {/* Door Open Animation */}
           <div className="absolute inset-y-0 left-0 w-1/2 bg-black/80 backdrop-blur-xl animate-[slideLeft_3s_ease-in-out_forwards] border-r border-white/5"></div>
           <div className="absolute inset-y-0 right-0 w-1/2 bg-black/80 backdrop-blur-xl animate-[slideRight_3s_ease-in-out_forwards] border-l border-white/5"></div>

           <style>{`
              @keyframes slideLeft { 0% { transform: translateX(0); } 80% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
              @keyframes slideRight { 0% { transform: translateX(0); } 80% { transform: translateX(0); } 100% { transform: translateX(100%); } }
           `}</style>
        </div>
      )}

      {/* THEATER MODE */}
      <div className={`transition-all duration-1000 ${isEntering ? 'opacity-0 scale-110 blur-2xl' : 'opacity-100 scale-100 blur-0'}`}>
        <TheaterModeLayout slug={slug} />
      </div>

    </div>
  );
}
