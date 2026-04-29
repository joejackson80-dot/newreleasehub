'use client';
import React, { useState } from 'react';
import { ShieldAlert, Send, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function AppealPage() {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send to API
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0A0A0A] border border-white/5 rounded-[40px] p-12 text-center space-y-6">
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
              <CheckCircle className="w-10 h-10" />
           </div>
           <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter uppercase italic">Appeal Submitted</h2>
              <p className="text-gray-500 text-sm">Our integrity team will review your account history. This typically takes 48-72 hours.</p>
           </div>
           <Link href="/studio" className="block w-full py-4 bg-[#111] rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all">Return to Studio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-40 px-4">
      <div className="max-w-2xl mx-auto space-y-12">
        <Link href="/studio" className="flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-all text-xs uppercase tracking-widest">
           <ArrowLeft className="w-4 h-4" /> Back to Studio
        </Link>

        <div className="space-y-6">
           <div className="flex items-center gap-4 text-red-500">
              <ShieldAlert className="w-8 h-8" />
              <h1 className="text-4xl md:text-3xl font-bold tracking-tighter uppercase italic leading-none">Submit Appeal.</h1>
           </div>
           <p className="text-gray-500 font-medium text-lg leading-relaxed">
              If your streams were flagged for unusual activity, you can provide context or evidence of your promotion efforts (social campaigns, playlist placements) here.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-10 space-y-8">
           <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Explanation</label>
              <textarea 
                required
                className="w-full bg-[#111] border border-white/10 rounded-3xl p-6 text-sm min-h-[200px] focus:outline-none focus:border-red-500 transition-all resize-none"
                placeholder="Describe your recent traffic or promotional activities..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Supporting Evidence (Optional)</label>
              <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 text-center space-y-4 hover:border-white/10 transition-all cursor-pointer group">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gray-600 group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                 </div>
                 <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Upload screenshots or PDFs</p>
              </div>
           </div>

           <button 
             type="submit"
             className="w-full py-5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(239,68,68,0.2)] flex items-center justify-center gap-3"
           >
             Submit for Review <Send className="w-5 h-5" />
           </button>
        </form>

        <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
           Intentional submission of false evidence will result in a permanent platform ban.
        </p>
      </div>
    </div>
  );
}


