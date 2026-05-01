'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, SkipForward, SkipBack, Volume2, Plus, Shuffle, Repeat, Repeat1, List, X, VolumeX, Heart, MonitorSpeaker, Mic2, MonitorPlay, LayoutPanelLeft, Maximize2, Star } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAudio } from '@/context/AudioContext';

export default function GlobalAudioPlayer() {
  const { 
    currentTrack, isPlaying, togglePlay, progress, duration, seek, 
    showAd, adTimeRemaining, skipAd,
    volume, setVolume, queue, playNext, playPrevious,
    isShuffle, toggleShuffle, repeatMode, toggleRepeat
  } = useAudio();
  
  const [showQueue, setShowQueue] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimate, setLikeAnimate] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!currentTrack) return;
      
      const userId = localStorage.getItem('nrh_user');
      if (!userId) {
         const mockCrate = JSON.parse(localStorage.getItem('nrh_mock_crate') || '[]');
         setIsLiked(mockCrate.includes(currentTrack.id));
         return;
      }
      
      try {
         const res = await fetch(`/api/library/crate?userId=${userId}`);
         const data = await res.json();
         setIsLiked(data.crate.includes(currentTrack.id));
      } catch (e) {
         console.error(e);
      }
    };
    fetchLikeStatus();
  }, [currentTrack]);

  const toggleLike = async () => {
    if (!currentTrack) return;
    
    // Optimistic UI update
    const newValue = !isLiked;
    setIsLiked(newValue);
    setLikeAnimate(true);
    setTimeout(() => setLikeAnimate(false), 300);

    const userId = localStorage.getItem('nrh_user');
    if (!userId) {
       let mockCrate = JSON.parse(localStorage.getItem('nrh_mock_crate') || '[]');
       if (newValue) mockCrate.push(currentTrack.id);
       else mockCrate = mockCrate.filter((id: string) => id !== currentTrack.id);
       localStorage.setItem('nrh_mock_crate', JSON.stringify(mockCrate));
       return;
    }

    try {
       const res = await fetch('/api/library/crate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, trackId: currentTrack.id })
       });
       if (!res.ok) setIsLiked(!newValue); // revert on failure
    } catch (e) {
       setIsLiked(!newValue);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let newVolume = (e.clientX - rect.left) / rect.width;
    newVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* QUEUE OVERLAY */}
      {showQueue && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-3xl pt-24 pb-32 px-6 md:px-20 animate-in fade-in slide-in-from-bottom-10 duration-300 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold uppercase tracking-tighter">Play Queue</h2>
              <button onClick={() => setShowQueue(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Now Playing</h3>
              <div className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <img src={currentTrack.imageUrl || "/images/default-cover.png"} className="w-12 h-12 rounded-lg object-cover mr-4" alt="" />
                <div>
                  <h4 className="text-[#00D2FF] font-bold text-lg leading-tight">{currentTrack.title}</h4>
                  <p className="text-gray-400 text-sm font-medium">{currentTrack.artist}</p>
                </div>
              </div>

              {queue.length > 0 && (
                <>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">Up Next</h3>
                  <div className="space-y-1">
                    {queue.map((track, idx) => (
                      <div key={`${track.id}-${idx}`} className={`flex items-center p-3 rounded-xl hover:bg-white/5 transition-colors ${currentTrack.id === track.id ? 'opacity-50' : ''}`}>
                        <span className="w-6 text-xs text-gray-500 font-bold">{idx + 1}</span>
                        <img src={track.imageUrl || "/images/default-cover.png"} className="w-10 h-10 rounded-md object-cover mr-4" alt="" />
                        <div>
                          <h4 className="text-white font-bold text-sm leading-tight">{track.title}</h4>
                          <p className="text-gray-400 text-xs font-medium">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PLAYER BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 py-3 px-4 md:px-6 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
         {/* AD OVERLAY (Inline) */}
         {showAd && (
           <div className="absolute inset-0 bg-[#020202] z-50 flex items-center justify-between px-10 animate-in fade-in duration-500 border-t border-[#00D2FF]/30">
             <div className="flex items-center space-x-6">
               <div className="w-12 h-12 rounded-xl bg-[#00D2FF]/10 flex items-center justify-center text-[#00D2FF]">
                 <Volume2 className="w-6 h-6 animate-pulse" />
               </div>
               <div>
                 <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Advertisement</p>
                 <h4 className="text-sm font-bold text-white uppercase tracking-tight">Audio Ad Playing...</h4>
               </div>
             </div>

             <div className="flex flex-col items-center">
               <div className="w-64 h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                 <div className="h-full bg-[#00D2FF] transition-all duration-1000" style={{ width: `${(adTimeRemaining / 30) * 100}%` }}></div>
               </div>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                 Music resumes in {adTimeRemaining}s
               </p>
             </div>

             <div className="flex items-center space-x-6">
               <Link href="/subscribe" className="text-[#00D2FF] font-bold text-[10px] uppercase tracking-widest hover:underline">
                 Upgrade to remove ads
               </Link>
               {adTimeRemaining <= 15 && (
                 <button 
                   onClick={skipAd} 
                   className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-[10px] font-bold uppercase tracking-widest transition-all"
                 >
                   Skip Ad
                 </button>
               )}
             </div>
           </div>
         )}

         {/* LEFT: Track Info */}
         <div className="flex items-center space-x-3 md:space-x-4 w-1/2 md:w-1/3 lg:w-1/4 md:min-w-[250px]">
            <div className="relative w-10 h-10 md:w-14 md:h-14 bg-zinc-800 rounded-lg overflow-hidden shrink-0 shadow-lg group cursor-pointer">
               <img src={currentTrack.imageUrl || "/images/default-cover.png"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:blur-[2px]" alt="Album Art" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
               </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 overflow-hidden w-full">
               <div className="flex flex-col overflow-hidden whitespace-nowrap min-w-0">
                  <Link href={`/track/${currentTrack.id}`} className="text-sm font-bold text-white tracking-tight truncate hover:underline">{currentTrack.title}</Link>
                  <Link href={`/artist/${currentTrack.artistId}`} className="text-[10px] md:text-xs text-gray-400 font-medium truncate hover:underline">{currentTrack.artist}</Link>
               </div>
               <button 
                 onClick={toggleLike}
                 className={`hidden sm:block transition-all shrink-0 ${isLiked ? 'text-[#00D2FF] scale-110' : 'text-gray-400 hover:text-white'} ${likeAnimate ? 'scale-125' : ''}`} 
                 title={isLiked ? "Remove from Library" : "Save to Library"}
               >
                  <Heart className="w-4 h-4 transition-all" fill={isLiked ? "currentColor" : "none"} />
               </button>
               {currentTrack.artistId !== 'nrh-official' && (
                 <Link 
                   href={`/fan/checkout?artist=${currentTrack.artistId}`}
                   className="hidden lg:flex items-center space-x-1 px-3 py-1 bg-[#00D2FF]/10 border border-[#00D2FF]/30 rounded-full text-[#00D2FF] hover:bg-[#00D2FF]/20 transition-all shrink-0"
                 >
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Support</span>
                 </Link>
               )}
            </div>
         </div>
         
         {/* CENTER: Controls */}
         <div className="flex flex-col items-center justify-center flex-1 md:w-1/3 lg:w-2/4 max-w-[600px]">
            <div className="flex items-center justify-end md:justify-center space-x-4 md:space-x-6 mb-0 md:mb-2 w-full md:w-auto">
               <button onClick={toggleShuffle} className={`hidden md:block p-2 transition-colors ${isShuffle ? 'text-[#00D2FF]' : 'text-gray-400 hover:text-white'}`} title="Shuffle">
                  <Shuffle className="w-4 h-4" />
               </button>
               <button onClick={playPrevious} className="hidden md:block text-gray-300 hover:text-white transition-colors" title="Previous">
                  <SkipBack className="w-5 h-5 fill-current" />
               </button>
               
               <button 
                  className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] shrink-0"
                  onClick={togglePlay}
               >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
               </button>
               
               <button onClick={playNext} className="hidden sm:block text-gray-300 hover:text-white transition-colors" title="Next">
                  <SkipForward className="w-5 h-5 fill-current" />
               </button>
               <button onClick={toggleRepeat} className={`hidden md:block p-2 transition-colors ${repeatMode !== 'off' ? 'text-[#00D2FF]' : 'text-gray-400 hover:text-white'}`} title="Repeat">
                  {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
               </button>
            </div>

            <div className="hidden md:flex items-center w-full space-x-3 text-xs font-medium text-gray-400">
               <span className="w-10 text-right">{formatTime(progress)}</span>
               <div 
                  className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group relative"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    seek(percent * duration);
                  }}
               >
                  <div className="h-full bg-white group-hover:bg-[#00D2FF] relative transition-all duration-100 ease-linear" style={{ width: `${(progress / duration) * 100}%` }}></div>
               </div>
               <span className="w-10 text-left">{formatTime(duration)}</span>
            </div>
         </div>

         {/* RIGHT: Volume & Extras */}
         <div className="hidden md:flex items-center justify-end space-x-3 w-1/3 lg:w-1/4 min-w-[200px] text-gray-400">
            <button className="hidden lg:block p-2 hover:text-white transition-colors" title="Now Playing View">
               <LayoutPanelLeft className="w-4 h-4" />
            </button>
            <button className="hidden lg:block p-2 hover:text-white transition-colors" title="Lyrics">
               <Mic2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowQueue(!showQueue)} 
              className={`p-2 transition-colors ${showQueue ? 'text-[#00D2FF]' : 'hover:text-white'}`}
              title="Queue"
            >
               <List className="w-4 h-4" />
            </button>
            <button className="hidden sm:block p-2 hover:text-white transition-colors" title="Connect to a device">
               <MonitorSpeaker className="w-4 h-4" />
            </button>
            
            <div className="hidden md:flex items-center space-x-2 group ml-2">
               <button onClick={toggleMute} className="hover:text-white transition-colors">
                 {volume === 0 || isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
               </button>
               <div 
                 className="w-20 h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden"
                 onClick={handleVolumeClick}
               >
                  <div className="h-full bg-gray-300 group-hover:bg-[#00D2FF] transition-all" style={{ width: `${volume * 100}%` }}></div>
               </div>
            </div>

            <Link href={`/${currentTrack.artistId}/live`} className="hidden xl:block p-2 hover:text-white transition-colors ml-2" title="Theater Mode / Live Stage">
               <MonitorPlay className="w-4 h-4" />
            </Link>
         </div>
      </div>
    </>
  );
}


