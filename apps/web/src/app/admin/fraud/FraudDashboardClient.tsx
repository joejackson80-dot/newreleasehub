'use client';
import React, { useState } from 'react';
import { 
  ShieldAlert, UserX, Network, Activity, 
  Search, Filter, ChevronRight, CheckCircle, 
  XCircle, BarChart3, AlertTriangle, ShieldCheck,
  Globe, Zap, Fingerprint, Lock, Ban, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FraudDashboardClient({ flaggedIncidents, topStreamers, excludedStreams, ipClusters }: any) {
  const [activeTab, setActiveTab] = useState('flagged');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Network Integrity', value: '99.8%', icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Flagged Clusters', value: ipClusters.length, icon: Network, color: 'text-orange-500' },
    { label: 'Excluded Streams', value: excludedStreams.length, icon: Ban, color: 'text-red-500' },
    { label: 'Detected Rings', value: Math.floor(ipClusters.length / 3), icon: Zap, color: 'text-[#00D2FF]' },
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-32 pb-40 px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
           <div className="space-y-6 max-w-2xl">
              <div className="flex items-center space-x-3 text-red-500">
                 <ShieldAlert className="w-5 h-5 animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.4em]">NRH Institutional Integrity Protocol</span>
              </div>
              <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black tracking-tighter uppercase italic leading-[0.8]">
                 Verified<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Diagnostics.</span>
              </h1>
              <p className="text-gray-500 text-lg font-medium italic">
                "Real-time heuristic analysis of streaming patterns, IP clustering, and device fingerprinting to ensure 100% royalty accuracy."
              </p>
           </div>
           
           <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              {stats.map((s, i) => (
                <motion.div 
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl space-y-2 group hover:border-white/10 transition-all"
                >
                   <div className="flex items-center justify-between">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   </div>
                   <div>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
                      <p className={`text-2xl font-black italic tracking-tighter ${s.color}`}>{s.value}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </header>

        {/* NAVIGATION & FILTERS */}
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-0 gap-6">
              <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar">
                 {[
                   { id: 'flagged', label: 'Flagged Accounts', icon: UserX },
                   { id: 'rings', label: 'Streaming Rings', icon: Network },
                   { id: 'excluded', label: 'Excluded Feed', icon: BarChart3 },
                   { id: 'streamers', label: 'High-Volume Nodes', icon: Activity },
                 ].map((tab) => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`px-8 py-5 text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                   >
                     <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-red-500' : ''}`} />
                     {tab.label}
                     {activeTab === tab.id && (
                       <motion.div 
                         layoutId="activeTab"
                         className="absolute bottom-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                       />
                     )}
                   </button>
                 ))}
              </div>
              <div className="relative w-full md:w-80 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
                 <input 
                   type="text" 
                   placeholder="SEARCH NODES..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-white/20 transition-all"
                 />
              </div>
           </div>

           {/* CONTENT AREA */}
           <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
              <AnimatePresence mode="wait">
                 {activeTab === 'flagged' && (
                   <motion.div 
                     key="flagged"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="divide-y divide-white/5"
                   >
                      {flaggedIncidents.length === 0 ? (
                        <div className="py-40 text-center space-y-6">
                           <ShieldCheck className="w-16 h-16 text-emerald-500/10 mx-auto" />
                           <div className="space-y-2">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Zero Protocol Violations Detected</p>
                              <p className="text-xs text-gray-700 font-medium italic">All institutional streaming metrics are within nominal ranges.</p>
                           </div>
                        </div>
                      ) : (
                        flaggedIncidents.map((incident: any, i: number) => (
                          <div key={incident.id} className="p-10 hover:bg-white/[0.02] transition-all flex flex-col lg:flex-row items-center gap-10 group">
                             <div className="relative">
                                <div className="w-20 h-20 rounded-[2rem] bg-zinc-900 border border-white/10 overflow-hidden group-hover:border-red-500/30 transition-colors">
                                   {incident.Organization.profileImageUrl && <img src={incident.Organization.profileImageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-red-500 text-white p-2 rounded-xl shadow-xl">
                                   <AlertTriangle className="w-4 h-4" />
                                </div>
                             </div>
                             <div className="flex-1 space-y-4 text-center lg:text-left">
                                <div className="space-y-1">
                                   <h4 className="text-2xl font-black italic uppercase tracking-tighter">{incident.Organization.name}</h4>
                                   <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Protocol ID: {incident.id.slice(0, 12)}</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                   <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">{incident.type}</span>
                                   <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                      <Fingerprint className="w-3 h-3" /> {incident.excludedStreamCount} ANOMALIES
                                   </span>
                                   <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{new Date(incident.createdAt).toLocaleString()}</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Review Protocol</button>
                                <button className="px-8 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]">Uphold Ban</button>
                                <button className="p-4 bg-white/5 rounded-2xl hover:bg-emerald-500/10 transition-all group/check"><CheckCircle className="w-5 h-5 text-gray-600 group-hover/check:text-emerald-500" /></button>
                             </div>
                          </div>
                        ))
                      )}
                   </motion.div>
                 )}

                 {activeTab === 'rings' && (
                   <motion.div 
                     key="rings"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="p-10 space-y-10"
                   >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {ipClusters.map((cluster: any, i: number) => (
                           <div key={i} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-8 hover:border-orange-500/30 transition-all group">
                              <div className="flex justify-between items-start">
                                 <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Network className="w-6 h-6" />
                                 </div>
                                 <div className="text-right">
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Cluster Score</p>
                                    <p className="text-2xl font-black italic text-orange-500">{(1 - (cluster._avg.fraudScore || 0)) * 100}%</p>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <div>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Infected IP Node</p>
                                    <code className="text-lg font-black tracking-tight text-white">{cluster.ipAddress}</code>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#050505] p-4 rounded-2xl border border-white/5">
                                       <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Daily Volume</p>
                                       <p className="text-xl font-bold text-white">{cluster._count.id}</p>
                                    </div>
                                    <div className="bg-[#050505] p-4 rounded-2xl border border-white/5">
                                       <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Device Cluster</p>
                                       <p className="text-xl font-bold text-white">DETECTED</p>
                                    </div>
                                 </div>
                              </div>
                              <button className="w-full py-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-[10px] uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                                 Isolate Node
                              </button>
                           </div>
                         ))}
                      </div>
                   </motion.div>
                 )}

                 {activeTab === 'excluded' && (
                   <motion.div 
                     key="excluded"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="p-10 overflow-x-auto"
                   >
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="border-b border-white/5">
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">Entity Matrix</th>
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">IP Address</th>
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">Detection Reason</th>
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">Telemetry</th>
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] text-right">Status</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {excludedStreams.map((stream: any) => (
                              <tr key={stream.id} className="group hover:bg-white/[0.01] transition-colors">
                                 <td className="py-8">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                                          {stream.Organization?.profileImageUrl && <img src={stream.Organization.profileImageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />}
                                       </div>
                                       <div>
                                          <p className="font-bold text-white text-sm uppercase italic">{stream.Organization?.name || 'Institutional'}</p>
                                          <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{stream.id.slice(0, 8)}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="py-8">
                                    <code className="text-xs text-gray-500 font-medium">{stream.ipAddress}</code>
                                 </td>
                                 <td className="py-8">
                                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase tracking-widest rounded-lg">
                                       {stream.flagReason || 'PROTOCOL_ANOMALY'}
                                    </span>
                                 </td>
                                 <td className="py-8">
                                    <span className="text-[10px] font-medium text-gray-600 italic">{new Date(stream.startedAt).toLocaleString()}</span>
                                 </td>
                                 <td className="py-8 text-right">
                                    <span className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.2em]">Purged</span>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </motion.div>
                 )}

                 {activeTab === 'streamers' && (
                   <motion.div 
                     key="streamers"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="p-10 overflow-x-auto"
                   >
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr className="border-b border-white/5">
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">Device Fingerprint</th>
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">Last Node</th>
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">Daily Payload</th>
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">Heuristic Score</th>
                               <th className="pb-8 text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em] text-right">Intervention</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {topStreamers.map((streamer: any) => (
                              <tr key={streamer.deviceId} className="group hover:bg-white/[0.01] transition-colors">
                                 <td className="py-8">
                                    <div className="flex items-center gap-3">
                                       <Fingerprint className="w-4 h-4 text-gray-600 group-hover:text-[#00D2FF] transition-colors" />
                                       <code className="text-xs text-white font-bold">{streamer.deviceId.slice(0, 16)}...</code>
                                    </div>
                                 </td>
                                 <td className="py-8">
                                    <code className="text-xs text-gray-500">{streamer.ipAddress}</code>
                                 </td>
                                 <td className="py-8">
                                    <p className="text-xl font-black italic text-white tracking-tighter">{streamer._count.id} <span className="text-[9px] text-gray-700 uppercase ml-1">Streams</span></p>
                                 </td>
                                 <td className="py-8">
                                    <div className="flex items-center gap-4">
                                       <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full transition-all duration-1000 ${streamer._avg.fraudScore < 0.4 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                                            style={{ width: `${streamer._avg.fraudScore * 100}%` }}
                                          ></div>
                                       </div>
                                       <span className="text-[10px] font-black italic text-white">{(streamer._avg.fraudScore * 100).toFixed(0)}</span>
                                    </div>
                                 </td>
                                 <td className="py-8 text-right">
                                    <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg transition-all">Ban Hardware</button>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* NETWORK INTELLIGENCE INFO */}
        <section className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 lg:p-20 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
           <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
              <ShieldAlert className="w-12 h-12" />
           </div>
           <div className="space-y-4">
              <h4 className="text-2xl font-black italic uppercase tracking-tighter">Automatic Heuristic Governance.</h4>
              <p className="text-gray-500 font-medium leading-relaxed max-w-2xl italic">
                 The NRH Integrity Protocol utilizes advanced telemetry including hardware fingerprinting, IP reputation scoring, and behavior analysis (keyboard/mouse tracking) to automatically exclude illegitimate streams from the royalty pools.
              </p>
           </div>
           <div className="flex-1 flex justify-center md:justify-end">
              <button className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest hover:underline whitespace-nowrap">View Network Whitepaper →</button>
           </div>
        </section>

      </div>
    </div>
  );
}


