'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Play, Pause, Plus, Music, Users, Disc, Zap, ArrowRight, Grid, List, Heart } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function DiscoverClient({ featuredArtists, latestReleases, genres: genresProp }: any) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { playTrack, currentTrack, isPlaying, togglePlay, addToQueue } = useAudio();
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  // Load liked tracks from localStorage on mount
  React.useEffect(() => {
    const mockCrate = JSON.parse(localStorage.getItem('nrh_mock_crate') || '[]');
    setLikedTracks(new Set(mockCrate));
  }, []);

  const toggleLike = async (e: React.MouseEvent, trackId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const newLiked = new Set(likedTracks);
    if (newLiked.has(trackId)) {
      newLiked.delete(trackId);
    } else {
      newLiked.add(trackId);
    }
    setLikedTracks(newLiked);

    const userId = localStorage.getItem('nrh_user');
    if (!userId) {
      localStorage.setItem('nrh_mock_crate', JSON.stringify([...newLiked]));
      return;
    }
    try {
      await fetch('/api/library/crate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, trackId })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlay = (e: React.MouseEvent, release: any) => {
    e.preventDefault();
    if (currentTrack?.id === release.id) {
      togglePlay();
      return;
    }
    
    playTrack({
      id: release.id,
      title: release.title,
      artist: release.Organization?.name || 'Unknown Artist',
      artistId: release.Organization?.id || release.Organization?.slug || '',
      audioUrl: release.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Mock fallback
      imageUrl: release.coverArtUrl
    });
  };

  const handleAddToQueue = (e: React.MouseEvent, release: any) => {
    e.preventDefault();
    addToQueue({
      id: release.id,
      title: release.title,
      artist: release.Organization?.name || 'Unknown Artist',
      artistId: release.Organization?.id || release.Organization?.slug || '',
      audioUrl: release.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Mock fallback
      imageUrl: release.coverArtUrl
    });
  };

  const filteredArtists = featuredArtists.filter((artist: any) => {
    if (activeGenre !== 'All' && !artist.genres?.includes(activeGenre)) return false;
    if (searchQuery) {
      return artist.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const filteredReleases = latestReleases.filter((release: any) => {
    if (activeGenre !== 'All' && release.primaryGenre && release.primaryGenre !== activeGenre) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return release.title.toLowerCase().includes(query) || 
             (release.Organization?.name && release.Organization.name.toLowerCase().includes(query));
    }
    return true;
  });

  const genres: string[] = genresProp || ['All', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Pop', 'Indie', 'Jazz', 'Alternative'];

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-10">
           <div className="space-y-4">
              <div className="flex items-center space-x-3 text-[#00D2FF]">
                 <Zap className="w-5 h-5" />
                 <span className="text-xs font-bold uppercase tracking-widest">Discovery Hub</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9]">
                 Find Your<br />Sound.
              </h1>
              <p className="text-gray-500 max-w-xl font-medium leading-relaxed">
                 Explore thousands of independent artists and their latest releases across the New Release Hub network.
              </p>
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search artists or tracks..." 
                   className="w-full bg-[#111] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[#00D2FF] transition-all" 
                 />
              </div>
              <button className="p-4 bg-[#111] border border-white/10 rounded-2xl text-gray-500 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
           </div>
        </header>

        {/* GENRE BAR */}
        <section className="bg-[#111] border border-white/5 rounded-3xl p-4 flex items-center justify-between gap-6">
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2">
              {genres.map((genre) => (
                 <button
                   key={genre}
                   onClick={() => setActiveGenre(genre)}
                   className={`text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all whitespace-nowrap ${activeGenre === genre ? 'bg-[#00D2FF] text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                 >
                   {genre}
                 </button>
              ))}
           </div>
           <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-6">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-white bg-white/10' : 'text-gray-600'}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'text-white bg-white/10' : 'text-gray-600'}`}><List className="w-4 h-4" /></button>
           </div>
        </section>

        {/* FEATURED ARTISTS */}
        <section className="space-y-10">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold uppercase tracking-tighter italic">Featured Artists</h2>
              <Link href="/network/charts" className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest hover:text-white transition-colors">View All Charts</Link>
           </div>
           {filteredArtists.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                 {filteredArtists.map((artist: any) => (
                    <Link key={artist.id} href={`/${artist.slug}`} className="group space-y-4">
                       <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-900 relative border border-white/5 group-hover:border-[#00D2FF]/50 transition-all">
                          {artist.profileImageUrl && <img src={artist.profileImageUrl} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <div className="w-12 h-12 rounded-full bg-[#00D2FF] flex items-center justify-center text-white">
                                <Play className="w-6 h-6 fill-current ml-1" />
                             </div>
                          </div>
                       </div>
                       <div className="text-center">
                          <h3 className="font-bold text-sm truncate">{artist.name}</h3>
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{artist.genres?.[0] || 'Independent'}</p>
                       </div>
                    </Link>
                 ))}
              </div>
           ) : (
              <div className="py-12 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                 No artists match your search.
              </div>
           )}
        </section>

        {/* LATEST RELEASES */}
        <section className="space-y-10 pt-20 border-t border-white/5">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold uppercase tracking-tighter italic">Latest Releases</h2>
           </div>
            {filteredReleases.length > 0 ? (
               <div className={`grid gap-10 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl'}`}>
                  {filteredReleases.map((release: any) => {
                     const isThisPlaying = currentTrack?.id === release.id && isPlaying;
                     return (
                     <div key={release.id} className="bg-[#111] border border-white/5 rounded-3xl p-6 flex items-center gap-6 group hover:bg-white/[0.02] transition-all">
                        <div 
                           className="w-24 h-24 rounded-2xl bg-zinc-900 shrink-0 overflow-hidden relative cursor-pointer shadow-xl"
                           onClick={(e) => handlePlay(e, release)}
                        >
                           {release.coverArtUrl && <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                           <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              {isThisPlaying ? <Pause className="w-6 h-6 text-[#00D2FF] fill-current" /> : <Play className="w-6 h-6 text-white fill-current ml-1" />}
                           </div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                           <h4 className="font-bold text-lg truncate hover:text-[#00D2FF] transition-colors cursor-pointer" onClick={(e) => handlePlay(e, release)}>{release.title}</h4>
                           <Link href={`/${release.Organization?.slug || ''}`} className="text-[10px] font-bold text-gray-500 hover:text-[#00D2FF] uppercase tracking-widest transition-colors block truncate">
                              {release.Organization?.name || 'Unknown Artist'}
                           </Link>
                           <div className="flex items-center justify-between pt-4">
                              <span className="text-[9px] font-bold text-[#00D2FF] uppercase tracking-widest">{release.type || 'Single'}</span>
                              <div className="flex items-center space-x-3">
                                 <button onClick={(e) => toggleLike(e, release.id)} className={`p-2 transition-colors ${likedTracks.has(release.id) ? 'text-pink-500' : 'text-gray-600 hover:text-pink-400'}`} title="Save to Library">
                                    <Heart className={`w-4 h-4 ${likedTracks.has(release.id) ? 'fill-current' : ''}`} />
                                 </button>
                                 <button onClick={(e) => handleAddToQueue(e, release)} className="p-2 text-gray-600 hover:text-white transition-colors" title="Add to Queue">
                                    <Plus className="w-4 h-4" />
                                 </button>
                                 <Link href={`/${release.Organization?.slug || ''}`} className="p-2 text-gray-600 hover:text-white transition-colors">
                                    <ArrowRight className="w-4 h-4" />
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </div>
                  )})}
               </div>
            ) : (
               <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem] bg-[#111] space-y-4">
                  <Search className="w-10 h-10 text-gray-600 mx-auto" />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-white">No Drops Found</h3>
                  <p className="text-gray-500 text-sm font-medium">Try searching for a different genre, track title, or artist.</p>
                  <button onClick={() => { setSearchQuery(''); setActiveGenre('All'); }} className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-[10px] font-bold uppercase tracking-widest">
                     Clear Filters
                  </button>
               </div>
            )}
        </section>

      </div>
    </div>
  );
}
