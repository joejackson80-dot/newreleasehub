'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Flame, Trash2, Settings, Monitor, Camera, Image as ImageIcon, Check, Plus, SkipForward, Music, Upload, ListMusic, Radio, Save, Zap, Truck, Package, Disc, ShoppingBag, Coffee, ArrowRight, Video, Circle, StopCircle, Archive, X, LayoutDashboard, Maximize, Minimize, Award, Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import VirtualStageCamera from '@/components/hub/VirtualStageCamera';
import VirtualDJDeck from '@/components/hub/VirtualDJDeck';
import { supabase } from '@/lib/supabase';

interface Track {
  id: string;
  title: string;
  audioUrl: string;
}

export default function DJController() {
  const params = useParams();
  const slug = params?.slug as string || "hellz-flame";
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackTitle, setActiveTrackTitle] = useState("No Track Selected");
  const [backgroundUrl, setBackgroundUrl] = useState("/backgrounds/cyberpunk.png");
  const [stats, setStats] = useState({ fire: 0, cool: 0, trash: 0 });
  const [activeTab, setActiveTab] = useState<'CONTROLS' | 'QUEUE' | 'ANALYTICS' | 'VAULT' | 'SETTINGS'>('CONTROLS');
  
  // Premium & Lean Archiving State
  const [isOnStage, setIsOnStage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [vodId, setVodId] = useState('');
  const [vodPlatform, setVodPlatform] = useState('YOUTUBE');
  const [planTier, setPlanTier] = useState<'FREE' | 'PRO' | 'ELITE'>('FREE');
  
  const [organizationId, setOrganizationId] = useState<string>('');
  const [sceneType, setSceneType] = useState<string>('NEON_DISTRICT');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  
  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  const [library, setLibrary] = useState<Track[]>([]);
  
  const fetchState = async () => {
    try {
      const res = await fetch(`/api/dj/state?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setOrganizationId(data.organizationId);
        setIsPlaying(data.isPlaying);
        setActiveTrackTitle(data.activeTrackTitle);
        if (data.backgroundUrl) setBackgroundUrl(data.backgroundUrl);
        if (data.sceneType) setSceneType(data.sceneType);
        setStats({ fire: data.fireCount, cool: data.coolCount, trash: data.trashCount });
        
        const libRes = await fetch(`/api/music?orgId=${data.organizationId}`);
        if (libRes.ok) setLibrary(await libRes.json());

        const orgRes = await fetch(`/api/org?slug=${slug}`);
        if (orgRes.ok) {
          const orgData = await orgRes.json();
          setPlanTier(orgData.planTier);
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchState();
    const channel = supabase.channel(`dj-ctrl-${slug}`).on('postgres_changes', { event: '*', schema: 'public', table: 'SessionDeck' }, () => fetchState()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [slug]);

  const selectTrack = async (track: Track) => {
    setActiveTrackTitle(track.title);
    try {
      await fetch('/api/dj/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          activeTrackId: track.id,
          activeTrackTitle: track.title,
          isPlaying: true
        })
      });
      setIsPlaying(true);
    } catch (e) { console.error(e); }
  };

  const togglePlayback = async () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    try { await fetch('/api/dj/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPlaying: newState, activeTrackTitle, slug }) }); } catch (e) { console.error(e); }
  };

  const updateScene = async (type: string) => {
    setSceneType(type);
    let bg = "/backgrounds/cyberpunk.png";
    if (type === 'ZEN_GARDEN') bg = "/backgrounds/zen.png";
    if (type === 'PRO_STUDIO') bg = "/backgrounds/studio.png";
    if (type === 'MAIN_STAGE') bg = "/backgrounds/stage.png";
    if (type === 'NEBULA') bg = "/backgrounds/nebula.png";
    if (type === 'TOKYO') bg = "/backgrounds/tokyo.png";
    if (type === 'MARS') bg = "/backgrounds/mars.png";
    if (type === 'GLITCH') bg = "/backgrounds/glitch.png";

    try {
      await fetch('/api/dj/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, sceneType: type, backgroundUrl: bg })
      });
    } catch (e) { console.error(e); }
  };

  const toggleRecording = async () => {
    if (planTier === 'FREE') {
      alert("Upgrade to PRO to archive your sessions.");
      return;
    }
    if (isRecording) {
      setIsRecording(false);
      setIsArchiveModalOpen(true);
    } else {
      setIsRecording(true);
    }
  };

  const handleArchiveSession = async () => {
    try {
      await fetch('/api/archives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          title: `LIVE: ${activeTrackTitle} - ${new Date().toLocaleDateString()}`,
          externalVodId: vodId,
          vodPlatform,
          finalFireCount: stats.fire,
          totalFundingCents: 0
        })
      });
      setIsArchiveModalOpen(false);
      alert("Session Archived.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden relative selection:bg-white selection:text-black">
      
      {/* ARTIST GREEN ROOM */}
      {!isOnStage && (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-10">
           <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '64px 64px' }}></div>
           
           <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-6">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 text-gray-500">
                       <Coffee className="w-4 h-4" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.3em]">The Green Room</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${planTier === 'FREE' ? 'bg-zinc-800 text-gray-500' : 'bg-purple-500/10 text-purple-500'}`}>
                       {planTier} Account
                    </div>
                 </div>
                 <div ref={stageRef} className="aspect-video bg-zinc-900 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
                    <VirtualStageCamera backgroundUrl={backgroundUrl} isLive={false} />
                    <div className="absolute top-6 left-6 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                       <Video className="w-3.5 h-3.5 text-gray-400" />
                       <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Adjust your visuals</span>
                    </div>
                    <button onClick={toggleFullscreen} className="absolute bottom-6 right-6 p-2 rounded-full bg-black/40 backdrop-blur-md text-gray-400 hover:text-white border border-white/10 transition-colors">
                       {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                 </div>
              </div>

              <div className="flex flex-col justify-center space-y-10">
                 <div className="space-y-2">
                    <h1 className="text-5xl font-bold tracking-tighter italic uppercase leading-none">Ready to<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Hit the Stage?</span></h1>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                       <div className="flex items-center space-x-3">
                          <Archive className={`w-4 h-4 ${planTier === 'FREE' ? 'text-gray-700' : 'text-purple-500'}`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Session Archiving</span>
                       </div>
                       <span className="text-[9px] font-bold text-gray-500">{planTier === 'FREE' ? 'LOCKED' : 'READY'}</span>
                    </div>
                 </div>

                 <button onClick={() => setIsOnStage(true)} className="group w-full py-5 rounded-3xl bg-white text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-3 hover:scale-[1.02] transition-all">
                    <span>Hit the Stage</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* MAIN MISSION CONTROL */}
      <div className={`p-10 max-w-6xl mx-auto space-y-10 transition-all duration-1000 ${isOnStage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 blur-xl pointer-events-none'}`}>
        
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <div className="flex items-center space-x-6 mb-4">
                {['CONTROLS', 'ANALYTICS', 'VAULT', 'QUEUE', 'SETTINGS'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest pb-2 border-b-2 transition-all ${activeTab === tab ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
                    <span>{tab}</span>
                  </button>
                ))}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Stage Mission Control</h1>
          </div>
          
          <div className="flex items-center space-x-4">
             <button onClick={toggleRecording} className={`flex items-center space-x-2 px-6 py-2.5 rounded-full border transition-all ${isRecording ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'bg-zinc-900 border-white/10 text-white hover:bg-zinc-800'}`}>
                {isRecording ? <StopCircle className="w-4 h-4" /> : <Circle className="w-3 h-3 fill-red-500 stroke-red-500" />}
                <span className="text-[10px] font-bold uppercase tracking-widest">{isRecording ? 'Recording Live' : 'Record Session'}</span>
             </button>
             <button onClick={() => setIsOnStage(false)} className="px-4 py-2 rounded-full border border-white/10 text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-all">Exit Stage</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'CONTROLS' && (
            <motion.div 
              key="controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
            <div className="lg:col-span-2 space-y-10">
               {/* SKEUOMORPHIC DJ CONTROLLER */}
               <VirtualDJDeck 
                 activeTrack={activeTrackTitle ? { title: activeTrackTitle, id: '' } : null}
                 isPlaying={isPlaying}
                 onToggle={togglePlayback}
                 onNext={() => {}}
               />

               <div className="grid grid-cols-3 gap-6">
                  {Object.entries(stats).map(([key, val]) => (
                    <div key={key} className="bg-[#080808] border border-white/5 p-6 rounded-3xl space-y-2">
                       <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{key}</span>
                       <p className="text-3xl font-bold text-white tracking-tighter italic">{val}</p>
                    </div>
                  ))}
               </div>

               {/* STAGE SCENE SELECTOR */}
               <div className="bg-[#050505] border border-white/5 p-10 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center space-x-3">
                     <Camera className="w-4 h-4 text-gray-600" />
                     <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Stage Scene Options</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                       { id: 'NEON_DISTRICT', label: 'Cyberpunk' },
                       { id: 'ZEN_GARDEN', label: 'Zen' },
                       { id: 'PRO_STUDIO', label: 'Studio' },
                       { id: 'MAIN_STAGE', label: 'Stage' },
                       { id: 'NEBULA', label: 'Nebula' },
                       { id: 'TOKYO', label: 'Tokyo' },
                       { id: 'MARS', label: 'Mars' },
                       { id: 'GLITCH', label: 'Glitch' }
                     ].map((scene) => (
                       <button 
                         key={scene.id} 
                         onClick={() => updateScene(scene.id)}
                         className={`py-4 rounded-2xl border text-[9px] font-bold uppercase tracking-widest transition-all ${sceneType === scene.id ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-500 border-transparent hover:border-white/10'}`}
                       >
                          {scene.label}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

            <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-10 flex flex-col h-[500px]">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Music Library</h3>
                  <Upload className="w-4 h-4 text-gray-600 hover:text-white cursor-pointer" />
               </div>
               <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                  {library.map((track) => (
                    <button 
                      key={track.id} 
                      onClick={() => selectTrack(track)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${activeTrackTitle === track.title ? 'bg-white/10 border-white/20' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                       <div className="flex items-center space-x-4">
                          <Music className={`w-4 h-4 ${activeTrackTitle === track.title ? 'text-white' : 'text-gray-600'}`} />
                          <span className={`text-[11px] font-bold uppercase tracking-widest ${activeTrackTitle === track.title ? 'text-white' : 'text-gray-500'}`}>{track.title}</span>
                       </div>
                       {activeTrackTitle === track.title && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>}
                    </button>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ANALYTICS' && (
           <motion.div 
             key="analytics"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
           >
              <div className="col-span-1 lg:col-span-2 bg-[#050505] border border-white/5 rounded-[2.5rem] p-12 space-y-10">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Network Engagement</h3>
                       <h4 className="text-2xl font-bold tracking-tight italic">Audience Hype Index</h4>
                    </div>
                    <div className="flex items-center space-x-2 text-green-500 text-[10px] font-bold uppercase tracking-widest">
                       <Zap className="w-3 h-3" />
                       <span>+24.5% Peak</span>
                    </div>
                 </div>
                 <div className="h-48 w-full flex items-end space-x-2 pb-2 border-b border-white/5">
                    {[40, 60, 30, 80, 50, 90, 70, 100, 80, 120, 150, 130].map((h, i) => (
                       <div key={i} className="flex-1 bg-white/10 rounded-t-lg hover:bg-orange-500 transition-colors" style={{ height: `${h / 1.5}%` }}></div>
                    ))}
                 </div>
                 <div className="flex justify-between text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                    <span>Session Start</span>
                    <span>Peak Intensity</span>
                    <span>Live Now</span>
                 </div>
              </div>

              <div className="space-y-6">
                 {[
                   { label: 'Stake Conversion', val: '12.4%', icon: Award },
                   { label: 'Avg. Retention', val: '42m', icon: Coffee },
                   { label: 'Network Spread', val: '14 Regions', icon: Globe }
                 ].map((stat, i) => (
                   <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-2">
                      <div className="flex items-center space-x-3 text-gray-500">
                         <stat.icon className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
                      </div>
                      <p className="text-3xl font-bold italic tracking-tighter">{stat.val}</p>
                   </div>
                 ))}
              </div>
           </motion.div>
        )}

        {activeTab === 'VAULT' && (
           <motion.div 
             key="vault"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
             className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-12 space-y-10"
           >
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold italic tracking-tighter">Master Vault.</h2>
                 <button className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-[10px] uppercase tracking-widest">Upload New Master</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {library.length > 0 ? library.map((track) => (
                    <div key={track.id} className="group p-8 bg-zinc-900/40 border border-white/5 rounded-3xl hover:border-white/10 transition-all space-y-6">
                       <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
                          <Disc className="w-6 h-6 text-gray-500" />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white tracking-tight italic">"{track.title}"</h4>
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">ID: {track.id.slice(0, 8)}</p>
                       </div>
                       <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                          <div className="space-y-1">
                             <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Revenue Participation</p>
                             <p className="text-xl font-bold text-orange-500 tracking-tighter">$1,240.00</p>
                          </div>
                          <div className="p-3 rounded-full bg-white/5 text-gray-500 hover:text-white transition-colors">
                             <Settings className="w-4 h-4" />
                          </div>
                       </div>
                    </div>
                 )) : (
                    <div className="col-span-full py-20 text-center space-y-6 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
                       <Upload className="w-12 h-12 text-zinc-800 mx-auto" />
                       <div className="space-y-2">
                          <h4 className="text-xl font-bold tracking-tight italic">Your Master Vault is Empty.</h4>
                          <p className="text-sm text-gray-600 max-w-xs mx-auto">Upload your first .mp3 or .wav master to start selling revenue participation stakes to your fans.</p>
                       </div>
                       <button className="px-10 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest">Secure First Master</button>
                    </div>
                 )}
              </div>
           </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* LEAN STORAGE ARCHIVE MODAL */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-zinc-900 border border-white/5 rounded-3xl p-8 space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold text-white tracking-tight">Archive Session</h3>
                 <button onClick={() => setIsArchiveModalOpen(false)}><X className="w-5 h-5 text-gray-700" /></button>
              </div>
              <div className="space-y-4">
                 <select value={vodPlatform} onChange={(e) => setVodPlatform(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white">
                    <option value="YOUTUBE">YouTube</option>
                    <option value="TWITCH">Twitch</option>
                    <option value="X">X (Twitter)</option>
                 </select>
                 <input 
                    type="text" 
                    value={vodId}
                    onChange={(e) => setVodId(e.target.value)}
                    placeholder="Enter External Video ID"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white"
                 />
              </div>
              <button onClick={handleArchiveSession} className="w-full py-4 rounded-2xl bg-white text-black font-bold text-[10px] uppercase tracking-widest">Commit to Archive</button>
           </div>
        </div>
      )}

    </div>
  );
}
