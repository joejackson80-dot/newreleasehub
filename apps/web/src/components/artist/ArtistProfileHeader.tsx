'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, CheckCircle2, Star, Users, 
  Disc, MapPin, Camera, MessageCircle, 
  MonitorPlay, Globe, Zap, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

export default function ArtistProfileHeader({ org }: { org: any }) {
  const tierBadgeColor =
    org.artistTier === 'legend' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' :
    org.artistTier === 'established' ? 'border-[#A855F7]/50 text-[#A855F7] bg-[#A855F7]/10' :
    'border-white/20 text-gray-400 bg-white/5';

  const socialLinks = org.socialLinksJson ? JSON.parse(org.socialLinksJson) : {};

  return (
    <div className="relative">
      {/* FULL WIDTH IMMERSIVE COVER */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        {org.headerImageUrl ? (
          <img src={org.headerImageUrl} alt="" className="w-full h-full object-cover grayscale opacity-40" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#020202] via-[#111] to-[#020202]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent" />
        
        {/* NETWORK SCANLINES EFFECT */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* IDENTITY HUB */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative -mt-32 md:-mt-48 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
          
          {/* HIGH-RES AVATAR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] border-8 border-[#020202] overflow-hidden bg-zinc-900 shadow-2xl shrink-0 group relative"
          >
            {org.profileImageUrl && (
              <img src={org.profileImageUrl} alt={org.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#A855F7]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          {/* TEXT CONTENT */}
          <div className="flex-1 space-y-6 pb-4 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
                  {org.name}
                </h1>
                <div className="flex items-center gap-3">
                  {org.isVerified && (
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <CheckCircle2 className="w-8 h-8 text-[#A855F7]" />
                    </motion.div>
                  )}
                  <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl border ${tierBadgeColor}`}>
                    {org.artistTier}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                {org.genres.map((g: string) => (
                  <span key={g} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">{g}</span>
                ))}
                {org.city && (
                  <span className="flex items-center gap-2 border-l border-white/10 pl-4">
                    <MapPin className="w-3 h-3" />
                    {org.city}
                  </span>
                )}
              </div>
            </div>

            {/* INSTITUTIONAL STATS STRIP */}
            <div className="grid grid-cols-2 md:flex items-center gap-8 md:gap-12 pt-4">
               {[
                 { label: 'Supporters', val: org.supporterCount.toLocaleString(), icon: Users },
                 { label: 'Global Streams', val: org.totalStreams.toLocaleString(), icon: Disc },
                 { label: 'Network Rank', val: '#1,204', icon: Star },
                 { label: 'Equity Score', val: '9.4', icon: Zap, color: 'text-[#A855F7]' }
               ].map((stat, i) => (
                 <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-600">
                       <stat.icon className="w-3 h-3" />
                       <span className="text-[9px] font-bold uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <p className={`text-2xl font-black italic tracking-tighter ${stat.color || 'text-white'}`}>{stat.val}</p>
                 </div>
               ))}
            </div>

            {/* SOCIAL ACTIONS */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
               {socialLinks.instagram && (
                 <Link href={`https://instagram.com/${socialLinks.instagram}`} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-[#A855F7]/50 transition-all">
                    <Camera className="w-4 h-4" />
                 </Link>
               )}
               {socialLinks.website && (
                 <Link href={socialLinks.website} target="_blank" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-[#A855F7]/50 transition-all">
                    <Globe className="w-4 h-4" />
                 </Link>
               )}
               <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] ml-4">
                  Follow Artist
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
