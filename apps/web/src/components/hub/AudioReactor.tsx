'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  audioUrl: string | null;
  isPlaying: boolean;
  onIntensityChange?: (intensity: number) => void;
}

export default function AudioReactor({ audioUrl, isPlaying, onIntensityChange }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audioRef.current = audio;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    const analyzer = audioCtx.createAnalyser();
    
    analyzer.fftSize = 256;
    source.connect(analyzer);
    analyzer.connect(audioCtx.destination);
    analyzerRef.current = analyzer;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      if (analyzerRef.current) {
        analyzerRef.current.getByteFrequencyData(dataArray);
        
        // Focus on bass frequencies (0-10)
        let sum = 0;
        for (let i = 0; i < 10; i++) {
          sum += dataArray[i];
        }
        const intensity = sum / 10 / 255; // 0 to 1
        
        // Update CSS variable for global reactivity
        document.documentElement.style.setProperty('--audio-intensity', intensity.toString());
        if (onIntensityChange) onIntensityChange(intensity);
      }
      animationRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      audio.pause();
      audio.src = "";
      audioCtx.close();
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!audioUrl) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[100] flex items-center space-x-4 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
      <div className="flex items-end space-x-1 h-4 w-8">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className="w-1 bg-[var(--color-accent-primary)] rounded-full transition-all duration-75"
            style={{ 
              height: isPlaying ? `${Math.random() * 100}%` : '10%',
              opacity: isPlaying ? 0.8 : 0.2
            }}
          />
        ))}
      </div>
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="text-white/60 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
        {isMuted ? 'Muted' : 'Live Audio'}
      </span>
    </div>
  );
}
