import React from 'react';
import { motion } from 'framer-motion';
import { Download, Globe, Mail, MessageSquare, ArrowRight, Disc, Star, Award } from 'lucide-react';
import Link from 'next/link';

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-12 pb-20 px-10">
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* HEADER */}
        <section className="space-y-8">
           <div className="space-y-4">
              <div className="inline-flex items-center space-x-3 text-[#00D2FF]">
                 <Globe className="w-5 h-5" />
                 <span className="text-xs font-bold uppercase tracking-widest">Press & Media</span>
              </div>
              <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] font-bold tracking-tighter leading-[0.8] italic uppercase">
                 Press<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Resources.</span>
              </h1>
           </div>
           <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
              Official assets, brand guidelines, and media inquiries for New Release Hub.
           </p>
        </section>

        {/* MEDIA KIT */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="bg-[#111] border border-white/5 rounded-[3rem] p-12 lg:p-20 space-y-12 relative overflow-hidden group">
              <div className="space-y-6 relative z-10">
                 <h2 className="text-4xl font-bold uppercase tracking-tighter italic">Official Media Kit.</h2>
                 <p className="text-gray-400 font-medium leading-relaxed">Download our latest press release, founder bios, and platform statistics (Q4 2026).</p>
              </div>
              <button className="w-full py-5 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#00D2FF] hover:text-white transition-all flex items-center justify-center space-x-3 shadow-lg relative z-10">
                 <span>Download .ZIP</span>
                 <Download className="w-4 h-4" />
              </button>
           </div>
           <div className="bg-[#111] border border-white/5 rounded-[3rem] p-12 lg:p-20 space-y-12 relative overflow-hidden group">
              <div className="space-y-6 relative z-10">
                 <h2 className="text-4xl font-bold uppercase tracking-tighter italic">Brand Assets.</h2>
                 <p className="text-gray-400 font-medium leading-relaxed">Logo marks, typography guidelines, and institutional color palettes for NRH.</p>
              </div>
              <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all flex items-center justify-center space-x-3 relative z-10">
                 <span>Download Brand Kit</span>
                 <Download className="w-4 h-4" />
              </button>
           </div>
        </section>

        {/* LATEST NEWS / MENTIONS */}
        <section className="space-y-16">
           <h3 className="text-2xl font-bold italic uppercase tracking-tighter">In the News.</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { source: 'Wired', quote: "New Release Hub is building the first real alternative to the streaming status quo.", date: 'Oct 12, 2026' },
                { source: 'Billboard', quote: "The Support-Tier framework is the most innovative fan-monetization model we've seen in a decade.", date: 'Sep 28, 2026' },
                { source: 'The Verge', quote: "Independent artists are finally finding a way to own their success without label debt.", date: 'Aug 15, 2026' }
              ].map((news, i) => (
                <div key={i} className="space-y-6 border-l border-white/10 pl-8">
                   <p className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest">{news.source} • {news.date}</p>
                   <p className="text-lg font-medium italic text-gray-300">"{news.quote}"</p>
                </div>
              ))}
           </div>
        </section>

        {/* CONTACT PRESS */}
        <section className="bg-[#111] border border-white/5 rounded-[3rem] p-12 lg:p-20 text-center space-y-12">
           <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl font-bold uppercase tracking-tighter italic">Media Inquiries.</h2>
              <p className="text-gray-500 font-medium">For interview requests, podcast appearances, or high-res assets, please contact our communications team.</p>
           </div>
           <div className="flex justify-center">
              <Link href="mailto:press@newreleasehub.com" className="inline-flex items-center space-x-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full hover:bg-white/10 transition-all group">
                 <Mail className="w-5 h-5 text-[#00D2FF]" />
                 <span className="text-xs font-bold uppercase tracking-widest text-white">press@newreleasehub.com</span>
                 <ArrowRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>
        </section>

      </div>
    </div>
  );
}


