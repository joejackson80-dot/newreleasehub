'use client';
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface LiveAudioPlayerProps {
  playbackId: string;
  isPlaying: boolean;
  volume: number;
}

export default function LiveAudioPlayer({ playbackId, isPlaying, volume }: LiveAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = audioRef.current;
    if (!video || !playbackId) return;

    const source = `https://stream.mux.com/${playbackId}.m3u8`;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = source;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [playbackId]);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error('Play failed', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <audio ref={audioRef} className="hidden" />
  );
}
