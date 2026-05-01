import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Activity, Lock, Search, FileWarning } from 'lucide-react';

export const metadata = {
  title: 'Network Forensics | NRH Institutional',
  description: 'Real-time fraud detection and stream integrity analysis for the NRH network.',
};

export default function ForensicPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16 font-mono">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="space-y-6">
          <Link href="/studio/admin" className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Governance
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter">Network Forensics.</h1>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                Real-Time Stream Integrity Analysis
              </p>
            </div>
          </div>
        </div>

        {/* FORENSIC STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Fraud Detection Rate', value: '99.7%', icon: ShieldAlert, color: 'text-emerald-500' },
            { label: 'Flagged This Month', value: '0', icon: FileWarning, color: 'text-amber-500' },
            { label: 'Streams Audited', value: '0', icon: Activity, color: 'text-[#00D2FF]' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black italic tracking-tighter">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-12 space-y-8">
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Forensic Search</h2>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Search by Artist ID, IP Address, or Device Fingerprint..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder:text-gray-700 outline-none focus:border-[#00D2FF]/50 transition-colors"
            />
            <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/10 transition-all">
              Analyze
            </button>
          </div>
          <div className="py-16 text-center border border-dashed border-white/5 rounded-3xl">
            <Lock className="w-10 h-10 text-white/5 mx-auto mb-3" />
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">No active investigations. Network integrity nominal.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
