'use client';
import React, { useState } from 'react';
import { 
  ShieldAlert, UserX, Network, Activity, 
  Search, Filter, ChevronRight, CheckCircle, 
  XCircle, BarChart3, AlertTriangle, ShieldCheck
} from 'lucide-react';

export default function FraudDashboardClient({ flaggedIncidents, topStreamers, excludedStreams }: any) {
  const [activeTab, setActiveTab] = useState('flagged');

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-40 px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-red-500">
                 <ShieldAlert className="w-5 h-5" />
                 <span className="text-xs font-bold uppercase tracking-widest">Network Integrity</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic leading-[0.9]">
                 Fraud<br />Detection.
              </h1>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              <StatCard label="Flagged" value={flaggedIncidents.length} color="text-red-500" />
              <StatCard label="Excluded" value={excludedStreams.length} color="text-gray-500" />
              <StatCard label="Saved" value="$4,820" color="text-green-500" />
              <StatCard label="Humanity" value="98.2%" color="text-[#00D2FF]" />
           </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-0">
           {[
             { id: 'excluded', label: 'Excluded Streams', icon: BarChart3 },
             { id: 'top', label: 'Top Streamers', icon: Activity },
             { id: 'flagged', label: 'Flagged Accounts', icon: UserX },
             { id: 'rings', label: 'Streaming Rings', icon: Network },
             { id: 'appeals', label: 'Appeals', icon: MessageCircle }
           ].map((tab: any) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
               {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500"></div>}
             </button>
           ))}
        </div>

        {/* CONTENT */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden">
           {activeTab === 'excluded' && (
             <div className="p-8">
                <table className="w-full text-left">
                   <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border-b border-white/5">
                         <th className="pb-4 pl-4">Artist</th>
                         <th className="pb-4">IP Address</th>
                         <th className="pb-4">Reason</th>
                         <th className="pb-4">Timestamp</th>
                         <th className="pb-4 text-right pr-4">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {excludedStreams.map((stream: any) => (
                        <tr key={stream.id} className="hover:bg-white/[0.01] transition-all group">
                           <td className="py-6 pl-4">
                              <span className="text-xs font-bold text-white">{stream.Organization?.name || 'Unknown'}</span>
                           </td>
                           <td className="py-6">
                              <code className="text-xs text-gray-400">{stream.ipAddress}</code>
                           </td>
                           <td className="py-6">
                              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                {stream.flagReason || 'FRAUD_SUSPECTED'}
                              </span>
                           </td>
                           <td className="py-6">
                              <span className="text-xs text-gray-500">{new Date(stream.startedAt).toLocaleString()}</span>
                           </td>
                           <td className="py-6 text-right pr-4">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Excluded</span>
                           </td>
                        </tr>
                      ))}
                      {excludedStreams.length === 0 && (
                        <tr>
                           <td colSpan={5} className="py-20 text-center">
                              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No excluded streams found.</p>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
           )}

           {activeTab === 'flagged' && (
             <div className="divide-y divide-white/5">
                {flaggedIncidents.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                     <ShieldCheck className="w-12 h-12 text-green-500/20 mx-auto" />
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No pending fraud incidents. Network is clean.</p>
                  </div>
                ) : (
                  flaggedIncidents.map((incident: any) => (
                    <div key={incident.id} className="p-8 hover:bg-white/[0.02] transition-all flex flex-col md:flex-row items-center gap-8">
                       <div className="w-16 h-16 rounded-2xl bg-zinc-800 shrink-0 overflow-hidden border border-white/10">
                          {incident.Organization.profileImageUrl && <img src={incident.Organization.profileImageUrl} className="w-full h-full object-cover" />}
                       </div>
                       <div className="flex-1 space-y-1 text-center md:text-left">
                          <h4 className="font-bold text-lg">{incident.Organization.name}</h4>
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                             <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded border border-red-500/20">{incident.type}</span>
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{incident.excludedStreamCount} streams excluded</span>
                             <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{new Date(incident.createdAt).toLocaleDateString()}</span>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <button className="px-6 py-3 bg-[#111] border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Review</button>
                          <button className="px-6 py-3 bg-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all">Uphold Flag</button>
                          <button className="px-3 py-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><CheckCircle className="w-5 h-5 text-green-500" /></button>
                       </div>
                    </div>
                  ))
                )}
             </div>
           )}

           {activeTab === 'top' && (
             <div className="p-8">
                <table className="w-full text-left">
                   <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border-b border-white/5">
                         <th className="pb-4 pl-4">Device ID</th>
                         <th className="pb-4">Location</th>
                         <th className="pb-4">Total Streams</th>
                         <th className="pb-4">Fraud Score</th>
                         <th className="pb-4 text-right pr-4">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {topStreamers.map((streamer: any) => (
                        <tr key={streamer.deviceId} className="hover:bg-white/[0.01] transition-all group">
                           <td className="py-6 pl-4">
                              <code className="text-xs text-gray-400">{streamer.deviceId.slice(0, 12)}...</code>
                           </td>
                           <td className="py-6">
                              <span className="text-xs font-bold text-gray-500 uppercase">Unknown (VPN suspected)</span>
                           </td>
                           <td className="py-6">
                              <span className="text-lg font-bold">{streamer._count.id}</span>
                           </td>
                           <td className="py-6">
                              <div className="flex items-center gap-2">
                                 <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${streamer._avg.fraudScore < 0.3 ? 'bg-red-500' : 'bg-[#00D2FF]'}`} style={{ width: `${streamer._avg.fraudScore * 100}%` }}></div>
                                 </div>
                                 <span className="text-[10px] font-bold text-gray-500">{(streamer._avg.fraudScore * 100).toFixed(0)}%</span>
                              </div>
                           </td>
                           <td className="py-6 text-right pr-4">
                              <button className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">Ban Device</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, color }: any) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-1">
       <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 block">{label}</span>
       <span className={`text-2xl font-bold tracking-tighter ${color}`}>{value}</span>
    </div>
  );
}

function MessageCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 21 1.9-1.9a9 9 0 1 1 3.8 3.8z" />
    </svg>
  );
}
