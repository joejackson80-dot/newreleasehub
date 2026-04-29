'use client';
import React, { useState, useEffect } from 'react';
import { Music, Users, DollarSign, Bell, Heart, Play, Pause, Lock, MessageCircle, ArrowRight, Star, Check, ShieldCheck, TrendingUp, Plus, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAudio } from '@/context/AudioContext';

const TABS = ['Feed', 'Library', 'Messages', 'Following', 'Support', 'Vault', 'Stats', 'Notifications'];

const MOCK_FEED = [
  {
    id: '1', artistName: 'Marcus Webb', artistSlug: 'marcus-webb',
    artistPhoto: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80',
    isVerified: true, time: '2h ago', type: 'release',
    content: 'New single just dropped — "Worth It (feat. Nova Rae)" is out now. This one means everything to me.',
    coverArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    releaseTitle: 'Worth It (feat. Nova Rae)', releaseType: 'single',
    isisSupporterOnly: false,
    reactions: { fire: 284, heart: 192, crown: 47, bolt: 103 },
    comments: 38,
  },
  {
    id: '2', artistName: 'Lena Khari', artistSlug: 'lena-khari',
    artistPhoto: 'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=200&q=80',
    isVerified: true, time: '5h ago', type: 'post',
    content: 'Just finished mixing the Lagos to London deluxe edition. 4 bonus tracks. SUPPORTER-only preview dropping tomorrow 🎵',
    isisSupporterOnly: false,
    reactions: { fire: 512, heart: 341, crown: 88, bolt: 220 },
    comments: 64,
  },
  {
    id: '3', artistName: 'DJ Solarize', artistSlug: 'dj-solarize',
    artistPhoto: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80',
    isVerified: true, time: '1d ago', type: 'post',
    content: '🔒 Behind-the-scenes studio session — phase 3 of Solar Frequencies is almost done.',
    isisSupporterOnly: true,
    reactions: { fire: 180, heart: 95, crown: 32, bolt: 78 },
    comments: 22,
  },
];

const MOCK_SUPPORTERAGES = [
  {
    id: '1', artistName: 'Marcus Webb', artistSlug: 'marcus-webb',
    artistPhoto: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80',
    tier: 'True Fan', amount: 15.00, earnedThisMonth: 4.20, revenueShare: 0.5, status: 'active',
  },
  {
    id: '2', artistName: 'Lena Khari', artistSlug: 'lena-khari',
    artistPhoto: 'https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=200&q=80',
    tier: 'Day One', amount: 5.00, earnedThisMonth: 2.10, revenueShare: 0.1, status: 'active',
  },
];

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'royalty', title: 'Revenue share credited', body: 'You earned $4.20 from Marcus Webb\'s streams this month.', time: '2h ago', unread: true },
  { id: '2', type: 'release', title: 'New release from Marcus Webb', body: '"Worth It (feat. Nova Rae)" is now available.', time: '5h ago', unread: true },
  { id: '3', type: 'SUPPORTER', title: 'SUPPORTER milestone', body: 'You are now SUPPORTER #742 of Lena Khari.', time: '2d ago', unread: false },
];

const REACTION_EMOJI = [
  { key: 'fire', emoji: '🔥', label: 'Fire' },
  { key: 'heart', emoji: '❤️', label: 'Heart' },
  { key: 'crown', emoji: '👑', label: 'Crown' },
  { key: 'bolt', emoji: '⚡', label: 'Bolt' },
];

export default function FanDashboard({ user, initialLibraryCount, subscriptions = [], initialFeed = [], initialMessages = [], initialVault = [] }: { user: any, initialLibraryCount: number, subscriptions?: any[], initialFeed?: any[], initialMessages?: any[], initialVault?: any[] }) {
  const [activeTab, setActiveTab] = useState('Feed');
  const [feed, setFeed] = useState<any[]>(initialFeed.length > 0 ? initialFeed : MOCK_FEED);
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [vaultReleases, setVaultReleases] = useState<any[]>(initialVault);
  const [libraryTracks, setLibraryTracks] = useState<any[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();
  const [yieldHistory, setYieldHistory] = useState<any[]>([]);
  const [isLoadingYield, setIsLoadingYield] = useState(true);
  const [fanStats, setFanStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const unreadNotifs = MOCK_NOTIFICATIONS.filter(n => n.unread).length;
  const unreadMessages = messages.filter(m => !m.isRead && m.receiverUserId === user.id).length;

  useEffect(() => {
    const fetchStats = async () => {
      if (!user.id) return;
      try {
        const [yieldRes, statsRes] = await Promise.all([
          fetch(`/api/fan/yield/history?userId=${user.id}`),
          fetch(`/api/fan/stats?userId=${user.id}`)
        ]);
        
        const yieldData = await yieldRes.json();
        if (yieldData.success) setYieldHistory(yieldData.history);

        const statsData = await statsRes.json();
        if (statsData.success) setFanStats(statsData.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingYield(false);
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [user.id]);

  useEffect(() => {
    if (activeTab === 'Library') {
      const fetchLibrary = async () => {
        setIsLoadingLibrary(true);
        const userId = user.id;
        if (!userId) {
          setIsLoadingLibrary(false);
          return;
        }

        try {
          const res = await fetch(`/api/library/tracks?userId=${userId}`);
          const data = await res.json();
          setLibraryTracks(data.tracks || []);
        } catch (e) {
          console.error(e);
        }
        setIsLoadingLibrary(false);
      };
      fetchLibrary();
    }
  }, [activeTab]);

  const handlePlayTrack = (track: any) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.Organization?.name || 'Unknown Artist',
      artistId: track.Organization?.slug || '',
      audioUrl: track.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl: track.imageUrl
    });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pb-20">

      {/* INSTITUTIONAL HEADER */}
      <div className="border-b border-white/5 px-6 md:px-12 py-12 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
          
          <div className="space-y-10">
             {/* LOGO */}
             <div className="flex">
                <Link href="/" className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform shadow-2xl">N</Link>
             </div>

             <div className="space-y-3">
               <div className="flex items-center space-x-3 text-[#00D2FF]">
                  <ShieldCheck className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Forensic Network Terminal</span>
               </div>
               <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter italic leading-none text-white">Portfolio<br />Tracker.</h1>
             </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-right hidden md:block px-6 border-r border-white/10">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Fan Level</p>
               <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-purple-500 to-[#00D2FF]" style={{ width: `${(user.fanXP / (user.fanLevel * 500)) * 100}%` }}></div>
                  </div>
                  <span className="text-xl font-bold italic tracking-tighter text-white">LVL {user.fanLevel}</span>
               </div>
            </div>
            <div className="text-right hidden md:block px-6 border-r border-white/10">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Balance</p>
               <p className="text-xl font-bold text-green-400">$24.80</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group">
                  <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00D2FF] border-4 border-black rounded-full text-[8px] font-bold flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </div>
              <Link href="/fan/me/settings"
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all">
                <Star className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-12">
        {/* TABS */}
        <div className="flex items-center justify-between mb-12">
           <div className="flex gap-1 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
             {TABS.map(t => (
               <button key={t} onClick={() => setActiveTab(t)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                   activeTab === t ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'
                 }`}>
                 {t}
                 {t === 'Notifications' && unreadNotifs > 0 && (
                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00D2FF] rounded-full text-[8px] font-bold flex items-center justify-center text-white">
                     {unreadNotifs}
                   </span>
                 )}
               </button>
             ))}
           </div>
           <div className="hidden lg:flex items-center space-x-3 text-gray-600">
              <span className="text-[9px] font-bold uppercase tracking-widest">Protocol V2.4 Active</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           </div>
        </div>

        {/* ── FEED TAB ── */}
        {activeTab === 'Feed' && (
          <div className="space-y-6">
            {feed.map(post => (
              <div key={post.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                {/* Post header */}
                <div className="flex items-center gap-3 p-5 pb-0">
                  <Link href={`/${post.Organization?.slug || post.artistSlug || ''}`}>
                    <img src={post.Organization?.profileImageUrl || post.artistPhoto || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80'} alt={post.Organization?.name || post.artistName}
                      className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/${post.Organization?.slug || post.artistSlug || ''}`} className="font-bold text-sm text-white hover:text-[#00D2FF] transition-colors">
                        {post.Organization?.name || post.artistName}
                      </Link>
                      {(post.Organization?.isVerified || post.isVerified) && <Check className="w-3.5 h-3.5 text-[#00D2FF]" />}
                      {(post.isSupporterOnly || post.isisSupporterOnly) && (
                        <span className="text-[9px] font-bold text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          SUPPORTER Only
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">{post.time || new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Post body */}
                {(post.isSupporterOnly || post.isisSupporterOnly) ? (
                  <div className="mx-5 mt-4 rounded-xl bg-purple-500/5 border border-purple-500/10 p-6 text-center space-y-3">
                    <Lock className="w-6 h-6 text-purple-400 mx-auto" />
                    <p className="text-sm text-gray-400 italic">"{post.content}"</p>
                    <Link href={`/${post.Organization?.slug || post.artistSlug || ''}`}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-xs uppercase tracking-wider hover:bg-purple-500/20 transition-all">
                      Become a SUPPORTER to See This
                    </Link>
                  </div>
                ) : (
                  <div className="px-5 pt-4">
                    <p className="text-sm text-gray-300 leading-relaxed">{post.content}</p>
                    {(post.type === 'release' || post.coverArtUrl) && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-white/5 relative group">
                        <img src={post.coverArtUrl || post.coverArt} alt={post.title || post.releaseTitle} className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                            onClick={() => {
                              if (post.type === 'release') {
                                playTrack({
                                  id: post.id,
                                  title: post.title,
                                  artist: post.Organization?.name,
                                  artistId: post.Organization?.slug,
                                  audioUrl: post.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                                  imageUrl: post.coverArtUrl
                                });
                              }
                            }}
                          >
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black">
                          <p className="font-bold text-white text-sm">{post.title || post.releaseTitle}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{post.type}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Reactions */}
                <div className="flex items-center gap-2 px-5 py-4 mt-2 border-t border-white/5">
                  {REACTION_EMOJI.map(r => {
                    const count = post.Reactions?.filter((re: any) => re.type === r.key).length || post.reactions?.[r.key as keyof typeof post.reactions] || 0;
                    return (
                    <button key={r.key}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-xs font-medium text-gray-400 hover:text-white">
                      <span>{r.emoji}</span>
                      <span>{count}</span>
                    </button>
                  )})}
                  <button className="ml-auto flex items-center gap-2 text-[10px] text-gray-500 hover:text-white transition-colors font-bold">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post.comments || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIBRARY TAB ── */}
        {activeTab === 'Library' && (
          <div className="space-y-4">
            {isLoadingLibrary ? (
               <div className="text-center py-20 text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest animate-pulse">Loading Library...</div>
            ) : libraryTracks.length === 0 ? (
               <div className="bg-[#111] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4 hover:border-white/10 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                     <Heart className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-white font-bold text-lg">Your Library is Empty</p>
                     <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto leading-relaxed">Start exploring the Discover feed and click the heart icon on any track to save it to your collection.</p>
                  </div>
                  <Link href="/discover" className="mt-4 px-8 py-3 bg-[#00D2FF] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#00B8E0] transition-colors shadow-lg">
                     Go to Discover
                  </Link>
               </div>
            ) : (
               <div className="space-y-2">
                  {libraryTracks.map((track) => {
                     const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                     return (
                     <div key={track.id} className="flex items-center gap-4 p-4 bg-[#111] border border-white/5 rounded-2xl hover:bg-white/[0.02] hover:border-white/10 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 shrink-0 overflow-hidden relative cursor-pointer shadow-lg" onClick={() => handlePlayTrack(track)}>
                           {track.imageUrl && <img src={track.imageUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                           <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              {isThisPlaying ? <Pause className="w-4 h-4 text-[#00D2FF] fill-current" /> : <Play className="w-4 h-4 text-white fill-current ml-0.5" />}
                           </div>
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="font-bold text-white truncate text-sm hover:text-[#00D2FF] cursor-pointer transition-colors" onClick={() => handlePlayTrack(track)}>{track.title}</p>
                           <Link href={`/${track.Organization?.slug || ''}`} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors truncate block mt-0.5">
                              {track.Organization?.name || 'Unknown Artist'}
                           </Link>
                        </div>
                        <div className="hidden sm:block text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest text-right bg-[#00D2FF]/10 px-3 py-1.5 rounded-lg">
                           Saved
                        </div>
                     </div>
                  )})}
               </div>
            )}
          </div>
        )}

        {/* ── SUPPORTERAGES TAB ── */}
        {activeTab === 'Support' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                       <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Yield History</p>
                       <p className="text-4xl font-bold text-green-400">+$24.80 <span className="text-sm font-medium text-gray-600 ml-2 tracking-normal italic">(Total Lifetime)</span></p>
                     </div>
                     <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-widest italic">Updated Real-Time</span>
                     </div>
                  </div>

                  {/* SPARKLINE CHART (LIVE ANALYTICS) */}
                  <div className="h-32 w-full flex items-end gap-1.5 pt-4">
                     {isLoadingYield ? (
                        <div className="w-full h-full flex items-center justify-center">
                           <div className="w-4 h-4 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                        </div>
                     ) : yieldHistory.length > 0 ? (
                        yieldHistory.map((entry, i) => {
                           const maxAmount = Math.max(...yieldHistory.map(h => h.amountEarned), 100);
                           const height = (entry.amountEarned / maxAmount) * 100;
                           return (
                              <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group overflow-hidden">
                                 <div 
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500/40 to-green-500/10 group-hover:from-green-500/60 transition-all duration-500" 
                                    style={{ height: `${Math.max(height, 5)}%` }}
                                 ></div>
                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded">${(entry.amountEarned / 100).toFixed(2)}</span>
                                 </div>
                              </div>
                           );
                        })
                     ) : (
                        [20, 35, 25, 45, 30, 55, 40, 65, 50, 85, 70, 100].map((h, i) => (
                           <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group overflow-hidden opacity-20">
                              <div className="absolute bottom-0 left-0 right-0 bg-gray-500/20" style={{ height: `${h}%` }}></div>
                           </div>
                        ))
                     )}
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-gray-700 uppercase tracking-widest pt-2">
                     <span>Jan</span>
                     <span>Mar</span>
                     <span>May</span>
                     <span>Jul</span>
                     <span>Sep</span>
                     <span>Dec</span>
                  </div>
               </div>

               <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between">
                  <div className="space-y-6">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Stakes</p>
                        <p className="text-5xl font-bold text-white">{subscriptions.length}</p>
                     </div>
                     <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                           <span className="text-gray-500 italic">Participation BPS</span>
                           <span className="text-white">
                             {subscriptions.reduce((acc, sub) => acc + (sub.revenueSharePercent * 100), 0).toFixed(0)} BPS
                           </span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                           <span className="text-gray-500 italic">Network Rank</span>
                           <span className="text-[#00D2FF]">Top 15%</span>
                        </div>
                     </div>
                  </div>
                  <div className="pt-8 flex items-center space-x-2 text-gray-500">
                     <ShieldCheck className="w-4 h-4" />
                     <p className="text-[9px] font-bold uppercase tracking-widest italic">Verified Participant</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {subscriptions.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-2">No Active Stakes</p>
                   <Link href="/discover" className="text-[#00D2FF] hover:text-white transition-colors font-bold text-xs">Explore Artists</Link>
                </div>
              ) : subscriptions.map(sub => (
                <div key={sub.id} className="relative group">
                   <div className="absolute inset-0 bg-gradient-to-tr from-[#00D2FF]/10 to-purple-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-8 hover:border-white/20 transition-all relative z-10 space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <img src={sub.Organization?.profileImageUrl || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80'} alt={sub.Organization?.name} className="w-12 h-12 rounded-2xl object-cover border border-white/10" />
                            <div>
                               <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Asset Manager</p>
                               <p className="text-lg font-bold text-white italic uppercase">{sub.Organization?.name}</p>
                            </div>
                         </div>
                         <div className="bg-green-500/10 px-3 py-1 rounded-lg text-green-500 text-[9px] font-bold uppercase tracking-widest italic">{sub.status}</div>
                      </div>

                      <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Tier</p>
                               <p className="text-sm font-bold text-white uppercase italic">{sub.Tier?.name}</p>
                            </div>
                            <div>
                               <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Monthly Cost</p>
                               <p className="text-sm font-bold text-white">${(sub.priceCents / 100).toFixed(2)}</p>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Revenue Share</p>
                               <p className="text-sm font-bold text-[#00D2FF]">{sub.revenueSharePercent * 100}%</p>
                            </div>
                            <div>
                               <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Yield (Est.)</p>
                               <p className="text-sm font-bold text-green-400">+$0.00</p>
                            </div>
                         </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                         <Link href={`/${p.artistSlug}`} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                            Manage Seat →
                         </Link>
                         <ShieldCheck className="w-4 h-4 text-white/10" />
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <Link href="/discover"
              className="flex items-center justify-center gap-3 p-10 rounded-[2.5rem] border border-dashed border-white/5 text-gray-600 hover:text-white hover:border-white/10 hover:bg-white/[0.02] transition-all text-[10px] font-bold uppercase tracking-[0.3em] group">
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Acquire More Network Stakes
            </Link>
          </div>
        )}

        {/* ── STATS TAB ── */}
        {activeTab === 'Stats' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            {isLoadingStats ? (
              <div className="text-center py-20 text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest animate-pulse">Synchronizing Terminal Data...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Streams', value: fanStats?.totalStreamsAllTime || 0, icon: Play, color: 'text-[#00D2FF]' },
                    { label: 'Unique Artists', value: fanStats?.uniqueArtistsAllTime || 0, icon: Users, color: 'text-purple-400' },
                    { label: 'Listening Hours', value: (fanStats?.totalListeningHrs || 0).toFixed(1), icon: Clock, color: 'text-green-400' },
                    { label: 'Streak', value: `${fanStats?.listeningStreak || 0} Days`, icon: Star, color: 'text-orange-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest italic group-hover:text-gray-500 transition-colors">Verified</span>
                      </div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-1 tracking-tighter">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-[#111] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                     <div className="flex justify-between items-center">
                        <div className="space-y-1">
                           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Artist Discovery Record</p>
                           <h3 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Your First Discoveries</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                           <TrendingUp className="w-6 h-6 text-[#00D2FF]" />
                        </div>
                     </div>
                     <div className="bg-black/40 border border-white/5 rounded-3xl p-12 text-center space-y-4">
                        <p className="text-5xl font-bold text-[#00D2FF] tracking-tighter">{fanStats?.firstDiscoveries || 0}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] max-w-[200px] mx-auto leading-loose">Artists you supported before they hit the charts</p>
                     </div>
                  </div>

                  <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between">
                     <div className="space-y-6">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Favorite Genre</p>
                        <div className="space-y-2">
                           <p className="text-4xl font-bold text-white uppercase italic tracking-tighter">{fanStats?.topGenre || 'Afrobeats'}</p>
                           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-[#00D2FF] w-[75%]"></div>
                           </div>
                        </div>
                     </div>
                     <div className="pt-10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                           <ShieldCheck className="w-4 h-4 text-green-500" />
                        </div>
                       <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Protocol V2.4 Active</p>
                     </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FOLLOWING TAB ── */}
        {activeTab === 'Following' && (
          <div className="space-y-4">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-[#111] border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
                  <div className="relative">
                    <img src={sub.Organization.profileImageUrl || 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=100&q=80'} alt={sub.Organization.name} className="w-14 h-14 rounded-2xl object-cover border border-white/10" />
                    {sub.Organization.isLive && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/${sub.Organization.slug}`} className="font-bold text-white hover:text-[#00D2FF] transition-colors truncate">{sub.Organization.name}</Link>
                      {sub.Organization.isVerified && <Check className="w-3.5 h-3.5 text-[#00D2FF]" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{sub.Tier.name} Tier</span>
                      {sub.Organization.isLive && (
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest animate-pulse flex items-center gap-1">
                          <Radio className="w-2.5 h-2.5" /> Live Now
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/${sub.Organization.slug}`}
                    className="px-6 py-3 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-[#00D2FF] hover:text-white transition-all shadow-xl">
                    Enter Hub
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
                <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-4">You aren't following any artists yet</p>
                <Link href="/discover" className="px-8 py-3 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Discover Talent</Link>
              </div>
            )}
          </div>
        )}

        {/* ── NOTIFICATIONS TAB ── */}
        {activeTab === 'Notifications' && (
          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.map(n => (
              <div key={n.id}
                className={`p-5 rounded-2xl border transition-all ${n.unread ? 'bg-[#00D2FF]/5 border-[#00D2FF]/20' : 'bg-[#111] border-white/5'}`}>
                <div className="flex items-start gap-3">
                  {n.unread && <div className="w-2 h-2 rounded-full bg-[#00D2FF] mt-1.5 shrink-0" />}
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.body}</p>
                    <p className="text-[10px] text-gray-600 mt-2">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[600px]">
             {/* Conversations List */}
             <div className="lg:col-span-4 bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col">
                <div className="p-8 border-b border-white/5">
                   <h3 className="text-lg font-bold italic uppercase tracking-tighter">Direct Inbound</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                   {messages.length === 0 ? (
                      <div className="p-10 text-center space-y-4">
                         <MessageCircle className="w-10 h-10 text-white/5 mx-auto" />
                         <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">No communications yet</p>
                      </div>
                   ) : (
                      <div className="divide-y divide-white/5">
                         {messages.map(m => (
                            <button key={m.id} className="w-full p-6 text-left hover:bg-white/5 transition-all flex items-start gap-4 group">
                               <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                                  <img src={m.senderOrg?.profileImageUrl || m.senderUser?.avatarUrl || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&q=80'} alt="" className="w-full h-full object-cover" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                     <h4 className="font-bold text-sm text-white truncate">{m.senderOrg?.name || m.senderUser?.displayName}</h4>
                                     <span className="text-[9px] text-gray-500 uppercase">{new Date(m.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 line-clamp-1 group-hover:text-gray-300 transition-colors">{m.text}</p>
                               </div>
                               {!m.isRead && m.receiverUserId === user.id && (
                                  <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                               )}
                            </button>
                         ))}
                      </div>
                   )}
                </div>
             </div>

             {/* Conversation View */}
             <div className="lg:col-span-8 bg-[#111] border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10 space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700">
                   <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-bold uppercase tracking-tighter">Secure Communication</h3>
                   <p className="text-gray-500 text-sm max-w-sm font-medium leading-relaxed">Select a conversation from the left to view the secure institutional-grade messaging thread.</p>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Vault' && (
           <div className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-bold italic tracking-tighter uppercase">Supporter Vault</h2>
                    <p className="text-sm text-gray-500 font-medium">Exclusive high-fidelity masters and early access releases from your supported artists.</p>
                 </div>
                 <div className="px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{vaultReleases.length} Exclusive Items</span>
                 </div>
              </div>

              {vaultReleases.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {vaultReleases.map(release => (
                       <div key={release.id} className="group space-y-4">
                          <div className="aspect-square rounded-[2rem] overflow-hidden border border-white/5 relative shadow-2xl">
                             <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                                <button 
                                  onClick={() => playTrack(release)}
                                  className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-xl"
                                >
                                   <Play className="w-6 h-6 fill-current ml-1" />
                                </button>
                             </div>
                             <div className="absolute top-4 right-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-bold text-[#00D2FF] uppercase tracking-widest">Vault Exclusive</div>
                          </div>
                          <div className="space-y-1">
                             <h4 className="font-bold text-white truncate">{release.title}</h4>
                             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{release.Organization.name}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="py-32 text-center space-y-8 bg-[#111] border border-dashed border-white/10 rounded-[3rem] px-10">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-gray-700">
                       <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 max-w-sm mx-auto">
                       <h3 className="text-2xl font-bold uppercase tracking-tighter italic">Vault Locked</h3>
                       <p className="text-gray-500 text-sm font-medium leading-relaxed">
                          Your vault will unlock once you become a supporter of an artist on the NRH network.
                       </p>
                    </div>
                    <Link href="/discover" className="inline-block px-10 py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                       Explore Network
                    </Link>
                 </div>
              )}
           </div>
        )}
      </div>
    </div>
  );
}


