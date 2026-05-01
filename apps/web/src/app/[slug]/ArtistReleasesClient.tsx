'use client';
import React from 'react';
import Link from 'next/link';
import { Play, Pause, Disc } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function ArtistReleasesClient({ releases, slug, artistName }: { releases: any[], slug: string, artistName: string }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();

  const handlePlay = (e: React.MouseEvent, release: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentTrack?.id === release.id) {
      togglePlay();
      return;
    }

    playTrack({
      id: release.id,
      title: release.title,
      artist: artistName,
      artistId: slug,
      audioUrl: release.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      imageUrl: release.coverArtUrl
    });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {releases.map(release => {
        const isThisPlaying = currentTrack?.id === release.id && isPlaying;
        
        return (
          <div key={release.id} className="group space-y-4">
            <div 
              className="aspect-square bg-zinc-800 rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-white/20 transition-all cursor-pointer"
              onClick={(e) => handlePlay(e, release)}
            >
              {release.coverArtUrl ? (
                <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Disc className="w-12 h-12 text-white/10" />
                </div>
              )}
              <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                <div className={`w-12 h-12 rounded-full bg-[#00D2FF] flex items-center justify-center text-white transition-transform ${isThisPlaying ? 'scale-100' : 'scale-75 group-hover:scale-100'}`}>
                  {isThisPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </div>
              </div>
              {release.isSupporterOnly && (
                <div className="absolute top-2 right-2 bg-purple-600/90 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">
                  Supporter Only
                </div>
              )}
            </div>
            <Link href={`/${slug}/${release.id}`}>
              <h4 className="font-bold truncate text-white hover:text-[#00D2FF] transition-colors">{release.title}</h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{release.type}</span>
                <span className="text-[10px] text-gray-600">{new Date(release.releaseDate).getFullYear()}</span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
