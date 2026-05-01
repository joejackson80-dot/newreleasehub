'use client';
import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, Activity, Database, AlertTriangle, CheckCircle2, XCircle, Search, Filter, ArrowUpRight, BarChart3, Globe } from 'lucide-react';
import Link from 'next/link';

export default function FraudDashboardClient({ flaggedIncidents, topStreamers, excludedStreams, ipClusters }: any) {
  const [activeView, setActiveView] = useState('incidents');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const resolveIncident = async (id: string, action: 'RESOLVE' | 'REJECT') => {
    setIsProcessing(id);
    // Mock API call
    setTimeout(() => {
       alert(`Incident ${id} marked as ${action}`);
       setIsProcessing(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 space-y-12">
      
      {/* FORENSIC HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center space-x-3 text-red-500">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Protocol: Integrity Enforcement</span>
           </div>
           <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Forensic<br />Audit Hub.</h1>
           <p className="text-gray-500 text-sm font-medium italic">Monitoring 12.4M stream events for anomalous institutional patterns.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-2xl flex items-center gap-4">
              <Activity className="w-6 h-6 text-red-500 animate-pulse" />
              <div>
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Global Risk Index</p>
                 <p className="text-xl font-bold text-red-500 italic">CRITICAL</p>
              </div>
           </div>
           <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
              <Database className="w-6 h-6 text-gray-400" />
              <div>
                 <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Protection Status</p>
                 <p className="text-xl font-bold text-white italic">ACTIVE</p>
              </div>
           </div>
        </div>
      </header>

      {/* NAVIGATION & FILTERS */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5">
        {[
          { id: 'incidents', label: 'Flagged Incidents', icon: AlertTriangle, count: flaggedIncidents.length },
          { id: 'streamers', label: 'High Velocity Nodes', icon: Fingerprint, count: topStreamers.length },
          { id: 'clusters', label: 'IP Clusters', icon: Globe, count: ipClusters.length },
          { id: 'log', label: 'Exclusion Log', icon: Database, count: excludedStreams.length },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeView === tab.id ? 'bg-white text-black shadow-2xl' : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[8px] ${activeView === tab.id ? 'bg-black text-white' : 'bg-white/10'}`}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* MAIN VIEWPORT */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* INCIDENTS VIEW */}
        {activeView === 'incidents' && (
          <div className="grid grid-cols-1 gap-6">
            {flaggedIncidents.length === 0 ? (
               <div className="py-32 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                  <CheckCircle2 className="w-12 h-12 text-green-500/20 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No pending integrity threats detected.</p>
               </div>
            ) : (
               flaggedIncidents.map((incident: any) => (
                 <div key={incident.id} className="group bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-10 hover:border-red-500/20 transition-all">
                    <div className="flex-1 space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <AlertTriangle className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Incident Category</p>
                                <h3 className="text-xl font-bold text-white italic uppercase">{incident.type}</h3>
                             </div>
                          </div>
                          <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 uppercase tracking-widest italic animate-pulse">Pending Review</span>
                       </div>
                       
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-white/5">
                          <div>
                             <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Target Account</p>
                             <p className="text-sm font-bold text-white uppercase italic">{incident.Organization?.name}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Excluded Streams</p>
                             <p className="text-sm font-bold text-red-400">{incident.excludedStreamCount.toLocaleString()}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Timestamp</p>
                             <p className="text-sm font-bold text-white">{new Date(incident.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Risk Confidence</p>
                             <p className="text-sm font-bold text-amber-500">98.4%</p>
                          </div>
                       </div>

                       <div className="bg-white/5 p-6 rounded-2xl">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Search className="w-3 h-3" /> Forensic Details
                          </p>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium italic">"{incident.details}"</p>
                       </div>
                    </div>

                    <div className="w-full md:w-64 space-y-3">
                       <button 
                         disabled={isProcessing === incident.id}
                         onClick={() => resolveIncident(incident.id, 'RESOLVE')}
                         className="w-full py-4 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#A855F7] hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Sanction Account</span>
                       </button>
                       <button 
                         disabled={isProcessing === incident.id}
                         onClick={() => resolveIncident(incident.id, 'REJECT')}
                         className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                       >
                          <XCircle className="w-4 h-4" />
                          <span>Dismiss Flag</span>
                       </button>
                       <Link href={`/admin/forensics/${incident.id}`} className="block w-full py-4 text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest hover:text-white transition-colors">
                          Advanced Trace Analysis →
                       </Link>
                    </div>
                 </div>
               ))
            )}
          </div>
        )}

        {/* CLUSTERS VIEW */}
        {activeView === 'clusters' && (
           <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden">
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <h3 className="text-lg font-bold italic uppercase tracking-tighter">Geo-IP Cluster Mapping</h3>
                 <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest italic">Live Network Propagation</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-white/[0.02] border-b border-white/5">
                          <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">IP Address</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Stream Count (24h)</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Avg Risk Score</th>
                          <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {ipClusters.map((cluster: any, i: number) => (
                          <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                   <code className="text-xs font-bold text-white bg-white/5 px-2 py-1 rounded">{cluster.ipAddress}</code>
                                   <span className="text-[8px] font-black text-amber-500 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded">Datacenter</span>
                                </div>
                             </td>
                             <td className="px-8 py-6 font-bold text-white italic">{cluster._count.id}</td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="flex-1 max-w-[100px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                                      <div className={`h-full ${cluster._avg.fraudScore < 0.2 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${(1 - cluster._avg.fraudScore) * 100}%` }}></div>
                                   </div>
                                   <span className="text-xs font-bold text-red-500">{(cluster._avg.fraudScore * 100).toFixed(1)}%</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors">
                                   <ShieldAlert className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

      </div>

      {/* FOOTER STATS */}
      <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
         {[
           { label: 'Exclusion Pool', value: '42.8 GB', icon: Database },
           { label: 'Detection Rate', value: '99.2%', icon: BarChart3 },
           { label: 'Protocol Version', value: 'V4.2.0', icon: ShieldAlert },
         ].map((stat, i) => (
           <div key={i} className="flex items-center gap-6 p-8 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                 <stat.icon className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-xl font-bold text-white italic">{stat.value}</p>
              </div>
           </div>
         ))}
      </footer>

    </div>
  );
}
