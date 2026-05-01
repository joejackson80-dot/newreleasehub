'use client';
import React, { useState } from 'react';
import { 
  FileText, Camera, Music, Save, Globe, 
  ExternalLink, Eye, Download, ShieldCheck, 
  ChevronRight, ArrowLeft, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function StudioEPKPage({ artist }: { artist: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    officialBio: artist?.officialBio || '',
    pressKitUrl: artist?.pressKitJson ? JSON.parse(artist.pressKitJson).url : '',
    featuredTracks: artist?.pressKitJson ? JSON.parse(artist.pressKitJson).featuredTracks : []
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/studio/profile/epk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('EPK Updated Successfully');
      }
    } catch (e) {
      toast.error('Failed to update EPK');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-16 max-w-5xl">
       
       {/* HEADER */}
       <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-8">
             <Link href="/studio" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group text-[10px] font-bold uppercase tracking-widest">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
             </Link>
             <div className="space-y-4">
                <div className="flex items-center space-x-3 text-purple-400">
                   <FileText className="w-4 h-4" />
                   <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Press Suite</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase italic text-white leading-none">Electronic<br />Press Kit.</h1>
             </div>
          </div>
          <div className="flex items-center space-x-4">
             <Link href={`/${artist.slug}/epk`} target="_blank" className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2">
                <Eye className="w-4 h-4" />
                View Live EPK
             </Link>
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className="px-8 py-4 rounded-xl bg-[#00D2FF] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-[#00B8E0] transition-all shadow-2xl flex items-center gap-2"
             >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Save Changes
             </button>
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-7 space-y-12">
             
             {/* OFFICIAL BIO */}
             <section className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest italic">Institutional Bio</h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Used by press & booking agents</p>
                   </div>
                   <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                </div>
                <textarea 
                  value={formData.officialBio}
                  onChange={(e) => setFormData({ ...formData, officialBio: e.target.value })}
                  placeholder="Draft your professional institutional narrative here..."
                  className="w-full h-64 bg-[#111] border border-white/5 rounded-3xl p-8 text-sm text-gray-300 placeholder-gray-800 focus:outline-none focus:border-[#00D2FF]/40 transition-all leading-relaxed"
                />
             </section>

             {/* PRESS ASSETS */}
             <section className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest italic">Press Assets (High-Res)</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="aspect-square bg-[#111] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-3 group hover:border-[#00D2FF]/40 transition-all cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-700 group-hover:text-white transition-colors">
                         <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Upload Profile</span>
                   </div>
                   <div className="aspect-square bg-[#111] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center space-y-3 group hover:border-[#00D2FF]/40 transition-all cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-700 group-hover:text-white transition-colors">
                         <Download className="w-6 h-6" />
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">PDF One-Sheet</span>
                   </div>
                </div>
             </section>

          </div>

          {/* RIGHT: SIDEBAR / TIPS */}
          <div className="lg:col-span-5 space-y-10">
             
             <div className="bg-gradient-to-br from-[#111] to-black border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                <div className="space-y-2">
                   <h4 className="text-sm font-bold text-white uppercase tracking-widest">EPK Integrity</h4>
                   <p className="text-[10px] text-gray-500 leading-relaxed font-medium uppercase tracking-widest">
                      Your Electronic Press Kit is the Verified gateway for industry scouts. Ensure all data points are verified.
                   </p>
                </div>
                
                <div className="space-y-6">
                   {[
                     { label: 'Revenue Shares Active', status: artist.ParticipationLicenses.length > 0 },
                     { label: 'Verified Protocol', status: artist.isVerified },
                     { label: 'High Fidelity Bio', status: formData.officialBio.length > 200 }
                   ].map((tip, i) => (
                     <div key={i} className="flex items-center justify-between group">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest group-hover:text-gray-400 transition-colors">{tip.label}</span>
                        <div className={`w-2 h-2 rounded-full ${tip.status ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gray-800'}`} />
                     </div>
                   ))}
                </div>

                <div className="pt-6 border-t border-white/5">
                   <Link href="/network/board" className="flex items-center justify-between group">
                      <span className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest">Apply for Grants</span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-1 transition-transform" />
                   </Link>
                </div>
             </div>

             <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                <div className="flex items-center gap-3 text-[#00D2FF]">
                   <Globe className="w-5 h-5" />
                   <h4 className="text-sm font-bold text-white uppercase tracking-widest italic">Global Visibility</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                   EPKs are indexed by the New Release Hub Verified Discovery matrix. High-quality kits increase your Curation Score by up to 15 points.
                </p>
             </div>

          </div>

       </div>

    </div>
  );
}
