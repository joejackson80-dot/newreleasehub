'use client';
import React, { useMemo, useState } from 'react';
import { 
  Users, Activity, TrendingUp, Globe, Smartphone, 
  Monitor, Tablet, MapPin, BarChart3, PieChart
} from 'lucide-react';

export default function AnalyticsClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');

  // Simulate 30 days of data
  const retentionData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      value: 70 + Math.random() * 20
    }));
  }, []);

  const topLocations = [
    { city: 'New York', country: 'USA', share: 24 },
    { city: 'London', country: 'UK', share: 18 },
    { city: 'Berlin', country: 'Germany', share: 12 },
    { city: 'Tokyo', country: 'Japan', share: 9 },
    { city: 'Paris', country: 'France', share: 7 },
  ];

  const devices = [
    { type: 'Mobile', icon: Smartphone, share: 68, color: 'bg-[#00D2FF]' },
    { type: 'Desktop', icon: Monitor, share: 24, color: 'bg-purple-500' },
    { type: 'Tablet', icon: Tablet, share: 8, color: 'bg-green-500' },
  ];

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-[#00D2FF]">
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-widest">Network Analytics</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tighter uppercase italic text-white">Audience<br />Intelligence.</h1>
            <p className="text-gray-500 font-medium max-w-xl mt-4">Deep insights into your listener base, device distribution, and global retention metrics over the last 30 days.</p>
          </div>
          <div className="flex space-x-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'overview' ? 'bg-[#00D2FF] text-black' : 'text-zinc-500 hover:text-white'}`}>Overview</button>
            <button onClick={() => setActiveTab('charts')} className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'charts' ? 'bg-[#1D9E75] text-white' : 'text-zinc-500 hover:text-white'}`}>Charts</button>
          </div>
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-12">

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">+12.4%</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Listener Retention</h3>
            <p className="text-4xl font-bold text-white italic">84.2%</p>
          </div>
        </div>
        
        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#00D2FF]/10 text-[#00D2FF] flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Territories</h3>
            <p className="text-4xl font-bold text-white italic">42</p>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Live Now</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Stream Velocity</h3>
            <p className="text-4xl font-bold text-white italic">Peak</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* RETENTION CHART */}
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
           <div className="flex items-center justify-between">
              <div>
                 <h4 className="text-xl font-bold uppercase italic tracking-tighter">Retention Velocity</h4>
                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Last 30 Days Breakdown</p>
              </div>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00D2FF]"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Listeners</span>
                 </div>
              </div>
           </div>

           <div className="h-64 flex items-end gap-2 group">
              {retentionData.map((d, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-[#00D2FF]/10 rounded-t-lg hover:bg-[#00D2FF] transition-all relative group/bar"
                  style={{ height: `${d.value}%` }}
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[8px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      {d.value.toFixed(1)}%
                   </div>
                </div>
              ))}
           </div>
           
           <div className="flex justify-between text-[10px] font-bold text-gray-700 uppercase tracking-widest border-t border-white/5 pt-6">
              <span>Day 1</span>
              <span>Day 15</span>
              <span>Day 30</span>
           </div>
        </div>

        {/* DEVICE BREAKDOWN */}
        <div className="lg:col-span-4 bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
           <div>
              <h4 className="text-xl font-bold uppercase italic tracking-tighter">Device Matrix</h4>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Platform Distribution</p>
           </div>

           <div className="space-y-8">
              {devices.map((device) => (
                <div key={device.type} className="space-y-3">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <device.icon className="w-4 h-4 text-gray-500" />
                         <span className="text-xs font-bold uppercase tracking-widest">{device.type}</span>
                      </div>
                      <span className="text-sm font-black italic">{device.share}%</span>
                   </div>
                   <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${device.color} transition-all duration-1000`} style={{ width: `${device.share}%` }}></div>
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-6 border-t border-white/5">
              <div className="p-4 bg-[#00D2FF]/5 border border-[#00D2FF]/10 rounded-2xl">
                 <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                    <span className="text-white font-bold uppercase">Pro Tip:</span> Your audience is mobile-heavy. Optimize your EPK for vertical displays.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* TOP LOCATIONS */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl">
         <div className="flex items-center justify-between">
            <div>
               <h4 className="text-xl font-bold uppercase italic tracking-tighter">Top Territories</h4>
               <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">Geographic Density Map</p>
            </div>
            <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Export CSV</button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {topLocations.map((loc, i) => (
              <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-4 hover:border-[#00D2FF]/30 transition-all group">
                 <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-white transition-colors">
                       <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black italic text-[#00D2FF]">{loc.share}%</span>
                 </div>
                 <div>
                    <h5 className="font-bold text-white text-lg">{loc.city}</h5>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{loc.country}</p>
                 </div>
              </div>
             ))}
          </div>
       </div>

       </div>
      )}

      {activeTab === 'charts' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Global Rank', 'Genre Rank', 'City Rank', 'Rising Rank'].map((title, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">{title}</h3>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold">#24</p>
                  <span className="text-emerald-400 text-sm font-bold">▲ +2</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-8">What's Helping Your Rank</h2>
            <div className="space-y-6">
              {[
                { name: 'Streaming Activity', score: 82, msg: 'Your streams are strong — keep releasing music' },
                { name: 'Patron Community', score: 61, msg: '43 patrons. Each new patron adds points.' },
                { name: 'Fan Growth', score: 41, msg: '+12 new followers this month' },
                { name: 'Fan Engagement', score: 89, msg: '2 tips received, 8 comments — great!' },
                { name: 'Release Consistency', score: 32, msg: '1 release in 90 days. Release more consistently.' },
                { name: 'Profile Completeness', score: 100, msg: 'Profile fully set up ✓' },
              ].map(factor => (
                <div key={factor.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">{factor.name}</span>
                    <span className="text-zinc-500">{factor.score}/100</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#1D9E75]" style={{ width: `${factor.score}%` }}></div>
                  </div>
                  <p className="text-sm text-zinc-500">{factor.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
