import React from 'react';
import { Mail, MessageSquare, Phone, Globe, ArrowRight, Check, Send, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-20 px-6 md:px-10 selection:bg-[#00D2FF] selection:text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
         
         {/* INFO COLUMN */}
         <div className="space-y-16">
            <div className="space-y-12">
               
               {/* LOGO */}
               <div className="flex">
                  <Link href="/" className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</Link>
               </div>

               <div className="space-y-6">
                  <div className="inline-flex items-center space-x-3 text-[#00D2FF]">
                     <MessageSquare className="w-4 h-4 fill-current" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Global Inquiries</span>
                  </div>
                  <h1 className="text-[clamp(2.25rem,8vw,4.5rem)] font-bold tracking-tighter leading-[0.8] italic uppercase">
                     Get in<br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Touch.</span>
                  </h1>
                  <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg italic">
                     "Whether you're an artist looking to scale or a business seeking institutional partnership, we're here to listen."
                  </p>
               </div>
            </div>

           <div className="space-y-10">
              <div className="flex items-start space-x-6">
                 <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
                    <Mail className="w-5 h-5" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Email Us</p>
                    <p className="text-lg font-bold italic uppercase tracking-tight">info@newreleasehub.com</p>
                 </div>
              </div>
              <div className="flex items-start space-x-6">
                 <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Global HQ</p>
                    <p className="text-lg font-bold italic uppercase tracking-tight">London, UK • Remote First</p>
                 </div>
              </div>
              <div className="flex items-start space-x-6">
                 <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00D2FF] shrink-0">
                    <Globe className="w-5 h-5" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Media & Press</p>
                    <p className="text-lg font-bold italic uppercase tracking-tight">info@newreleasehub.com</p>
                 </div>
              </div>
           </div>
        </div>

        {/* FORM COLUMN */}
        <div className="bg-[#111] border border-white/5 rounded-[3rem] p-12 lg:p-16 relative">
           <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
           <form className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all"
                    />
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Subject</label>
                 <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all appearance-none">
                    <option className="bg-[#111]">Artist Support</option>
                    <option className="bg-[#111]">Fan Inquiry</option>
                    <option className="bg-[#111]">Business Partnership</option>
                    <option className="bg-[#111]">Press / Media</option>
                    <option className="bg-[#111]">Other</option>
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Your Message</label>
                 <textarea 
                   rows={6}
                   placeholder="How can we help you?"
                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all resize-none"
                 />
              </div>
              <button className="w-full py-5 rounded-2xl bg-[#00D2FF] text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#00B8E0] transition-all shadow-lg shadow-[#00D2FF]/20 flex items-center justify-center space-x-3">
                 <span>Send Message</span>
                 <Send className="w-4 h-4" />
              </button>
           </form>
        </div>

      </div>
    </div>
  );
}


