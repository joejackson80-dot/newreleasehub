import React from 'react';
import { getSessionArtist } from '@/lib/session';
import { Users, DollarSign, Disc, TrendingUp, Radio, Upload, Plus, Briefcase, Activity, Star, Award, MessageCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import MusicNewsFeed from '@/components/studio/MusicNewsFeed';

export default async function StudioOverviewPage() {
  const org = await getSessionArtist({ includeReleases: true, includeSupporters: true });

  const currentRevenue = (org.SupporterSubscriptions || []).reduce((sum: number, p: any) => sum + p.priceCents, 0) / 100;
  const supporterCount = (org.SupporterSubscriptions || []).length;
  const releaseCount = (org.Releases || []).length;

  return (
    <div className="p-6 sm:p-8 md:p-12 space-y-12 sm:space-y-16">
      
      {/* INSTITUTIONAL COMMAND CENTER HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
         <div className="space-y-8">
            <div className="flex">
               <Link href="/" className="w-14 h-14 rounded-2xl bg-transparent text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl"><img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" /></Link>
            </div>
            <div className="space-y-2">
                <h1 className="text-[clamp(2.5rem,10vw,4rem)] md:text-6xl font-bold tracking-tighter text-white uppercase italic leading-[0.8] mb-4">Studio<br />Command Center.</h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium italic">"Operating as {org.name} on the New Release Hub Professional Network."</p>
            </div>
         </div>
         <div className="flex items-center space-x-6 pb-2">
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Status</p>
               <div className="flex items-center justify-end space-x-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Verified Protocol</p>
               </div>
            </div>
         </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Star className="w-16 h-16 text-amber-500" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Curation Score</h3>
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-bold text-white">88<span className="text-gray-500 text-sm font-normal">/100</span></p>
            <p className="text-xs text-[#F1F5F9] mt-2 font-bold uppercase tracking-widest">Institutional Grade</p>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Award className="w-16 h-16 text-[#F1F5F9]" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Plan</h3>
            <Award className="w-4 h-4 text-[#F1F5F9]" />
          </div>
          <div className="relative z-10">
            <p className="text-xl font-bold text-white uppercase tracking-tighter italic">
              {org.planTier.replace('_', ' ')}
            </p>
            <Link href="/pricing" className="text-[9px] text-gray-500 mt-2 font-bold uppercase tracking-widest hover:text-white transition-colors block">Upgrade Account →</Link>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <TrendingUp className="w-16 h-16 text-green-500" />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Growth Velocity</h3>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-bold text-white">Rising</p>
            <p className="text-xs text-green-500 mt-2 font-medium flex items-center">+12.5% vs last month</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monthly Listeners</h3>
            <Activity className="w-4 h-4 text-[#F1F5F9]" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{org.monthlyListeners.toLocaleString()}</p>
            <p className="text-xs text-green-500 mt-2 font-medium flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12.5% vs last month</p>
          </div>
        </div>
        
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total SUPPORTERs</h3>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{supporterCount}</p>
            <p className="text-xs text-green-500 mt-2 font-medium flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +4 this week</p>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Est. Revenue (Monthly)</h3>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">${currentRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-2 font-medium">Next payout in 4 days</p>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl space-y-4 hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Releases</h3>
            <Disc className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{releaseCount}</p>
            <p className="text-xs text-gray-500 mt-2 font-medium">On New Release Hub</p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          <Link href="/studio/releases" className="bg-[#111] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0 hover:bg-white/5 transition-colors group text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-[#F1F5F91a] text-[#F1F5F9] flex items-center justify-center group-hover:bg-[#F1F5F9] group-hover:text-white transition-colors flex-shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest leading-tight">Upload Release</span>
          </Link>
          <Link href="/studio/dj" className="bg-[#111] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0 hover:bg-white/5 transition-colors group text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors flex-shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest leading-tight">Go Live</span>
          </Link>
          <Link href="/network/board" className="bg-[#111] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0 hover:bg-white/5 transition-colors group text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest leading-tight">Opportunities</span>
          </Link>
          <Link href="/studio/messages" className="bg-[#111] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0 hover:bg-white/5 transition-colors group text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest leading-tight">Messages</span>
          </Link>
          <Link href="/studio/epk" className="bg-[#111] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0 hover:bg-white/5 transition-colors group text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest leading-tight">Manage EPK</span>
          </Link>
          <Link href="/studio/supporters" className="bg-[#111] border border-white/5 p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center sm:space-x-3 space-y-3 sm:space-y-0 hover:bg-white/5 transition-colors group text-center sm:text-left">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-widest leading-tight">Manage Tiers</span>
          </Link>
        </div>
      </section>

      {/* COLLAB PIPELINE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-bold text-white tracking-tight">Creative Pipeline</h2>
           <Link href="/studio/collabs" className="text-[10px] font-bold text-[#F1F5F9] uppercase tracking-widest hover:underline">View All Requests</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-[#111] border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 hover:border-[#F1F5F94d] transition-all group">
              <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                       <img src="/images/default-avatar.png" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-xs font-bold text-white uppercase italic truncate">Nova Rae</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Vocalist</p>
                    </div>
                 </div>
                 <div className="bg-[#F1F5F91a] px-3 py-1 rounded-lg text-[#F1F5F9] text-[9px] font-bold uppercase tracking-widest italic whitespace-nowrap">94% Match</div>
              </div>
              <p className="text-xs text-gray-400 font-medium italic">"Hey! Loved your last set. I have a demo that would be perfect for your production style..."</p>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                 <button className="w-full sm:flex-1 py-3 rounded-xl bg-white text-black font-bold text-[9px] uppercase tracking-widest hover:bg-[#F1F5F9] hover:text-white transition-all">Accept</button>
                 <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-[9px] uppercase tracking-widest">Decline</button>
              </div>
           </div>
           
           <div className="bg-[#111] border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center space-y-4 border-dashed opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                 <Plus className="w-6 h-6" />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Create Collab Prompt</p>
           </div>
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white tracking-tight">Recent Network Activity</h2>
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {[
              { text: "New SUPPORTER joined the 'Inner Circle' tier.", time: "2 hours ago", icon: Users, color: "text-purple-400" },
              { text: "Your latest release 'Midnight Echo' passed 10,000 streams.", time: "1 day ago", icon: Activity, color: "text-[#F1F5F9]" },
              { text: "Payout of $450.00 processed to your connected Stripe account.", time: "3 days ago", icon: DollarSign, color: "text-green-400" },
              { text: "Opportunity 'Netflix Sync Request' is closing soon.", time: "4 days ago", icon: Briefcase, color: "text-orange-400" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 hover:bg-white/5 transition-colors">
                <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY INTELLIGENCE (RSS FEED) */}
      <MusicNewsFeed />

    </div>
  );
}


