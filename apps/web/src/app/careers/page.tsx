import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight, Zap, Users, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const JOBS = [
  {
    title: "Senior Product Designer",
    department: "Design",
    location: "Remote / London",
    type: "Full-time"
  },
  {
    title: "Lead Streaming Engineer (Rust/Node)",
    department: "Engineering",
    location: "Remote / NYC",
    type: "Full-time"
  },
  {
    title: "Head of Artist Relations",
    department: "Community",
    location: "London, UK",
    type: "Full-time"
  },
  {
    title: "Fintech Compliance Lead",
    department: "Legal",
    location: "Remote",
    type: "Contract"
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-12 pb-20 px-10">
      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* HERO */}
        <section className="space-y-12 text-center">
           <div className="space-y-6">
              <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                 <Zap className="w-4 h-4 text-amber-500" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Join the Collective</span>
              </div>
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] italic uppercase">
                 The Future<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">of Music.</span>
              </h1>
           </div>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
              We’re building the infrastructure that will power the next century of independent music. No labels. No middlemen. Just pure innovation.
           </p>
        </section>

        {/* PERKS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-16 py-20 border-y border-white/5">
           {[
             { title: 'Remote-First', desc: 'Work from anywhere in the world. Our collective is globally distributed and radically independent.', icon: Globe },
             { title: 'Equity & Ownership', desc: 'Every team member receives meaningful equity. We win when our artists and SUPPORTERs win.', icon: ShieldCheck },
             { title: 'High Impact', desc: 'Build tools that actually change lives. Your code and designs directly support thousands of artists.', icon: Users }
           ].map((perk, i) => (
             <div key={i} className="space-y-6 group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-[#00D2FF] transition-all duration-500">
                   <perk.icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold italic tracking-tighter uppercase">{perk.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{perk.desc}</p>
             </div>
           ))}
        </section>

        {/* OPEN ROLES */}
        <section className="space-y-16">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                 <h2 className="text-5xl font-bold tracking-tighter italic uppercase leading-none">Open Positions.</h2>
                 <p className="text-gray-500 font-medium">Join our mission to democratize the music industry.</p>
              </div>
              <div className="flex items-center space-x-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                 <button className="text-white border-b-2 border-[#00D2FF] pb-1">All Roles</button>
                 <button className="hover:text-white transition-colors pb-1">Engineering</button>
                 <button className="hover:text-white transition-colors pb-1">Design</button>
                 <button className="hover:text-white transition-colors pb-1">Legal</button>
              </div>
           </div>

           <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="divide-y divide-white/5">
                 {JOBS.map((job, i) => (
                   <div key={i} className="group p-10 flex flex-col md:flex-row items-center justify-between hover:bg-white/[0.02] transition-colors gap-8">
                      <div className="space-y-4 flex-1">
                         <div className="flex items-center space-x-4">
                            <span className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest leading-none">{job.department}</span>
                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-none">{job.type}</span>
                         </div>
                         <h4 className="text-3xl font-bold italic tracking-tight uppercase group-hover:text-[#00D2FF] transition-colors">{job.title}</h4>
                      </div>
                      <div className="flex items-center space-x-12">
                         <div className="flex items-center space-x-2 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">{job.location}</span>
                         </div>
                         <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all group-hover:translate-x-2">
                            <ArrowRight className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* GENERAL INQUIRY */}
        <section className="text-center space-y-8 py-20">
           <p className="text-gray-500 font-medium">Don't see a role that fits?</p>
           <h3 className="text-4xl font-bold uppercase tracking-tighter italic">We're always looking for geniuses.</h3>
           <Link href="/contact" className="inline-flex items-center space-x-3 text-[#00D2FF] font-bold text-xs uppercase tracking-widest hover:translate-x-2 transition-transform">
              <span>Send us a general application</span>
              <ArrowRight className="w-4 h-4" />
           </Link>
        </section>

      </div>
    </div>
  );
}


