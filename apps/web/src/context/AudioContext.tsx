import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { logListeningSession } from '@/app/actions/fan';

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  audioUrl: string;
  imageUrl?: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  progress: number;
  duration: number;
  seek: (time: number) => void;
  showAd: boolean;
  adTimeRemaining: number;
  skipAd: () => void;
  volume: number;
  setVolume: (v: number) => void;
  queue: Track[];
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  playNext: () => void;
  playPrevious: () => void;
  isShuffle: boolean;
  toggleShuffle: () => void;
  repeatMode: 'off' | 'all' | 'one';
  toggleRepeat: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [adTimeRemaining, setAdTimeRemaining] = useState(0);
  const [freeStreamCount, setFreeStreamCount] = useState(0);
  
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamPlayId = useRef<string | null>(null);
  const playTimer = useRef<number>(0);
  const lastRecordedTime = useRef<number>(0);
  
  const currentTrackRef = useRef(currentTrack);
  const queueRef = useRef(queue);
  const isShuffleRef = useRef(isShuffle);
  const repeatModeRef = useRef(repeatMode);

  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { isShuffleRef.current = isShuffle; }, [isShuffle]);
  useEffect(() => { repeatModeRef.current = repeatMode; }, [repeatMode]);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    const updateProgress = () => {
      setProgress(audio.currentTime);
      if (!audio.paused) {
        playTimer.current += 1;
        checkStreamThreshold();
      }
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);

    const handleEnded = () => {
      setIsPlaying(false);
      playTimer.current = 0;
      streamPlayId.current = null;
      
      if (repeatModeRef.current === 'one') {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else {
        handlePlayNext();
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    const analyticsInterval = setInterval(() => {
      if (!audio.paused && streamPlayId.current) {
        updateStreamDuration(Math.floor(audio.currentTime));
      }
    }, 30000);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      clearInterval(analyticsInterval);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const checkStreamThreshold = async () => {
    if (playTimer.current >= 30 && streamPlayId.current && !lastRecordedTime.current) {
      lastRecordedTime.current = 30;
      const res = await fetch('/api/streams/track', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          streamPlayId: streamPlayId.current,
          durationSeconds: 30,
          countedAsStream: true
        })
      }).catch(console.error);
      if(!res) return;
      const stream = await res.json();

      if (stream?.poolSource === 'C') {
        const newCount = freeStreamCount + 1;
        setFreeStreamCount(newCount);
        if (newCount >= 3) {
          triggerAd();
        }
      }
    }
  };

  const adIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAd = () => {
    pauseTrack();
    setShowAd(true);
    setAdTimeRemaining(30);
    setFreeStreamCount(0);

    adIntervalRef.current = setInterval(() => {
      setAdTimeRemaining(prev => {
        if (prev <= 1) {
          if (adIntervalRef.current) clearInterval(adIntervalRef.current);
          setShowAd(false);
          resumeTrack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipAd = () => {
    if (adIntervalRef.current) clearInterval(adIntervalRef.current);
    setShowAd(false);
    resumeTrack();
  };

  const updateStreamDuration = async (seconds: number) => {
    if (streamPlayId.current) {
      await fetch('/api/streams/track', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamPlayId: streamPlayId.current, durationSeconds: seconds })
      }).catch(console.error);
    }
  };

  const playTrack = async (track: Track) => {
    if (audioRef.current) {
      let deviceId = localStorage.getItem('nrh_device_id');
      if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('nrh_device_id', deviceId);
      }

      const user = localStorage.getItem('nrh_user');
      const res = await fetch('/api/streams/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId: track.id, artistId: track.artistId, userId: user || null, deviceId })
      }).catch(console.error);
      
      if(res) {
        const data = await res.json();
        streamPlayId.current = data.id;
        
        // Log listening session for fan stats
        if (user) {
          logListeningSession(user, track.id);
        }
      }
      
      playTimer.current = 0;
      lastRecordedTime.current = 0;

      setCurrentTrack(track);
      if(!queue.find(t => t.id === track.id)) {
         setQueue(prev => [...prev, track]);
      }
      
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePlayNext = useCallback(() => {
    const q = queueRef.current;
    const current = currentTrackRef.current;
    if (!q.length) return;
    
    let nextIndex = 0;
    if (current) {
      const currentIndex = q.findIndex(t => t.id === current.id);
      if (isShuffleRef.current) {
        nextIndex = Math.floor(Math.random() * q.length);
      } else {
        nextIndex = currentIndex + 1;
      }
    }

    if (nextIndex >= q.length) {
      if (repeatModeRef.current === 'all') {
        nextIndex = 0;
      } else {
        return; // End of queue
      }
    }
    
    playTrack(q[nextIndex]);
  }, []);

  const playNext = () => handlePlayNext();

  const playPrevious = () => {
    const q = queue;
    const current = currentTrack;
    if (!q.length || !current) return;
    
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex = q.findIndex(t => t.id === current.id) - 1;
    if (prevIndex < 0) {
      if (repeatMode === 'all') {
        prevIndex = q.length - 1;
      } else {
        prevIndex = 0;
      }
    }
    playTrack(q[prevIndex]);
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (showAd) return;
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) pauseTrack();
    else resumeTrack();
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);
  const toggleRepeat = () => setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off');

  return (
    <AudioContext.Provider value={{ 
      currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack, togglePlay, 
      progress, duration, seek, showAd, adTimeRemaining, skipAd,
      volume, setVolume, queue, setQueue, addToQueue, playNext, playPrevious,
      isShuffle, toggleShuffle, repeatMode, toggleRepeat
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};


