'use client';
import React, { useState } from 'react';
import { 
  Coins, Play, Calendar, DollarSign, 
  RefreshCw, CheckCircle, AlertTriangle, ArrowRight 
} from 'lucide-react';

export default function RoyaltiesDashboardClient({ initialPools }: { initialPools: any[] }) {
  const [pools, setPools] = useState(initialPools);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const triggerRun = async () => {
    if (!confirm('Are you sure you want to run royalties for the previous month? This will update artist balances and send notifications.')) return;
    
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/cron/calculate-royalties');
      const data = await res.json();
      if (data.success) {
        setMessage(`Success! Processed ${data.artistCount} artists. Total payout: $${(data.payoutTotal / 100).toFixed(2)}`);
        // Refresh pools list
        const refreshRes = await fetch('/api/admin/royalties/list'); // I'll create this or just reload
        window.location.reload();
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (err: any) {
      setMessage('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-40 px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-green-500">
                 <Coins className="w-5 h-5" />
                 <span className="text-xs font-bold uppercase tracking-widest">Financial Engine</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase italic leading-[0.9]">
                 Royalty<br />Pools.
              </h1>
           </div>
           <button 
             onClick={triggerRun}
             disabled={loading}
             className="btn-primary flex items-center gap-3 disabled:opacity-50"
           >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              <span>Execute Monthly Run</span>
           </button>
        </div>

        {message && (
          <div className={`p-6 rounded-2xl border ${message.includes('Success') ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'} flex items-center gap-4`}>
             {message.includes('Success') ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
             <p className="font-bold uppercase tracking-widest text-xs">{message}</p>
          </div>
        )}

        {/* POOLS LIST */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden">
           <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-bold uppercase tracking-widest text-sm">Historical Runs</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <DollarSign className="w-3 h-3" />
                    <span>Total Distributed: $450,240</span>
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border-b border-white/5 bg-white/[0.01]">
                       <th className="py-6 pl-8">Period</th>
                       <th className="py-6">Premium Pool (Subs)</th>
                       <th className="py-6">Network Pool (Ads)</th>
                       <th className="py-6">Total Streams</th>
                       <th className="py-6">Status</th>
                       <th className="py-6 pr-8 text-right">Date</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {pools.map((pool: any) => (
                      <tr key={pool.id} className="hover:bg-white/[0.02] transition-all group">
                         <td className="py-8 pl-8">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#F1F5F9]">
                                  <Calendar className="w-5 h-5" />
                               </div>
                               <div>
                                  <p className="text-lg font-bold">{new Date(pool.year, pool.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">ID: {pool.id.slice(-8)}</p>
                               </div>
                            </div>
                         </td>
                         <td className="py-8">
                            <p className="font-bold">${(pool.premiumPoolTotal / 100).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">70% Share</p>
                         </td>
                         <td className="py-8">
                            <p className="font-bold text-gray-300">${(pool.networkPoolTotal / 100).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">60% Share</p>
                         </td>
                         <td className="py-8">
                            <p className="font-bold">{(pool.totalPremiumStreams + pool.totalNetworkStreams).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Counted Plays</p>
                         </td>
                         <td className="py-8">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${pool.status === 'PAID' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-[#F1F5F9]/10 border-[#F1F5F9]/20 text-[#F1F5F9]'}`}>
                               {pool.status}
                            </span>
                         </td>
                         <td className="py-8 pr-8 text-right">
                            <p className="text-xs font-bold text-gray-500">{pool.calculatedAt ? new Date(pool.calculatedAt).toLocaleDateString() : 'Pending'}</p>
                            <button className="text-[10px] font-bold uppercase tracking-widest text-[#F1F5F9] hover:text-white transition-colors mt-2">View Report <ArrowRight className="w-3 h-3 inline ml-1" /></button>
                         </td>
                      </tr>
                    ))}
                    {pools.length === 0 && (
                      <tr>
                         <td colSpan={6} className="py-20 text-center">
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No royalty runs recorded yet.</p>
                         </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}


