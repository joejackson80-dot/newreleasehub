'use client';
import React, { useState } from 'react';
import { Check, ArrowRight, Users, Music, Zap } from 'lucide-react';
import Link from 'next/link';

const GENRES = [
  'R&B', 'Hip-Hop', 'Pop', 'Electronic', 'Afrobeats', 'Jazz', 'Indie',
  'Rock', 'Soul', 'Latin', 'Reggae', 'Gospel', 'Country', 'Classical',
  'Lo-Fi', 'Drill', 'Amapiano', 'K-Pop', 'House', 'Dancehall'
];

const SUGGESTED_ARTISTS = [
  { id: 'artist-001', slug: 'marcus-webb', name: 'Marcus Webb', genre: 'R&B · Soul', photo: '/images/default-avatar.png', SUPPORTERs: 2140 },
  { id: 'artist-003', slug: 'lena-khari', name: 'Lena Khari', genre: 'Afrobeats · Highlife', photo: '/images/default-avatar.png', SUPPORTERs: 3420 },
  { id: 'artist-002', slug: 'dj-solarize', name: 'DJ Solarize', genre: 'Electronic · House', photo: '/images/default-avatar.png', SUPPORTERs: 1820 },
  { id: 'artist-004', slug: 'hellz-flame', name: 'Hellz Flame', genre: 'Hip-Hop · Trap', photo: '/images/default-avatar.png', SUPPORTERs: 980 },
  { id: 'artist-005', slug: 'nova-rae', name: 'Nova Rae', genre: 'Indie Pop · Folk', photo: '/images/default-avatar.png', SUPPORTERs: 1240 },
  { id: 'artist-008', slug: 'solaris-bloom', name: 'Solaris Bloom', genre: 'K-Indie · Dream Pop', photo: '/images/default-avatar.png', SUPPORTERs: 1640 },
];

export default function WelcomePage() {
  const [step, setStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [followedArtists, setFollowedArtists] = useState<string[]>([]);
  const REQUIRED_FOLLOWS = 3;

  const toggleGenre = (g: string) =>
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

  const toggleFollow = (id: string) =>
    setFollowedArtists(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const canProceedStep1 = selectedGenres.length >= 1;
  const canProceedStep2 = followedArtists.length >= REQUIRED_FOLLOWS;

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center px-6 py-20">

      {/* PROFESSIONAL LOGO */}
      <div className="mb-20">
         <Link href="/" className="w-12 h-12 rounded-2xl bg-transparent text-black flex items-center justify-center font-bold text-2xl tracking-tighter hover:scale-105 transition-transform"><img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" /></Link>
      </div>

      {/* PROGRESS */}
      <div className="w-full max-w-xl mb-16">
        <div className="flex items-center gap-3">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                step > s ? 'bg-[#00D2FF] border-[#00D2FF]' :
                step === s ? 'border-[#00D2FF] bg-[#00D2FF]/10' : 'border-white/10 bg-white/5'
              }`}>
                {step > s
                  ? <Check className="w-4 h-4 text-white" />
                  : <span className="text-[10px] font-bold text-gray-400">{s}</span>
                }
              </div>
              {s < 3 && <div className={`flex-1 h-px transition-all ${step > s ? 'bg-[#00D2FF]' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: GENRE PICKER */}
      {step === 1 && (
        <div className="w-full max-w-2xl space-y-10">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center mx-auto">
              <Music className="w-6 h-6 text-[#00D2FF]" />
            </div>
            <h1 className="text-[clamp(1.5rem,6vw,2.5rem)] font-bold uppercase tracking-tighter italic">What do you listen to?</h1>
            <p className="text-gray-500 font-medium">Select at least one genre to personalize your feed.</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {GENRES.map(g => (
              <button key={g} onClick={() => toggleGenre(g)}
                className={`px-5 py-2.5 rounded-full border text-sm font-bold transition-all ${
                  selectedGenres.includes(g)
                    ? 'bg-[#00D2FF] border-[#00D2FF] text-white shadow-lg shadow-[#00D2FF]/20'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white bg-white/5'
                }`}>
                {g}
              </button>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => canProceedStep1 && setStep(2)}
              disabled={!canProceedStep1}
              className={`px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 mx-auto ${
                canProceedStep1
                  ? 'bg-white text-black hover:bg-[#00D2FF] hover:text-white'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}>
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
            {!canProceedStep1 && (
              <p className="text-[10px] text-gray-600 font-medium mt-3">Select at least 1 genre to continue</p>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: FOLLOW 3 ARTISTS */}
      {step === 2 && (
        <div className="w-full max-w-2xl space-y-10">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/20 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-[#00D2FF]" />
            </div>
            <h1 className="text-[clamp(1.5rem,6vw,2.5rem)] font-bold uppercase tracking-tighter italic">Follow 3 artists.</h1>
            <p className="text-gray-500 font-medium">
              Your feed is built from who you follow.
            </p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all ${
              canProceedStep2
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-white/5 border-white/10 text-gray-400'
            }`}>
              {canProceedStep2
                ? <><Check className="w-4 h-4" /> 3 of 3 followed!</>
                : <>Following {followedArtists.length} of {REQUIRED_FOLLOWS}</>
              }
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SUGGESTED_ARTISTS.map(artist => {
              const isFollowed = followedArtists.includes(artist.id);
              return (
                <button key={artist.id} onClick={() => toggleFollow(artist.id)}
                  className={`relative group rounded-2xl overflow-hidden border transition-all text-left ${
                    isFollowed ? 'border-[#00D2FF] ring-1 ring-[#00D2FF]' : 'border-white/5 hover:border-white/20'
                  }`}>
                  <div className="aspect-square relative">
                    <img src={artist.photo} alt={artist.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    {isFollowed && (
                      <div className="absolute top-3 right-3 w-7 h-7 bg-[#00D2FF] rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-bold text-white text-sm leading-tight">{artist.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{artist.genre}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">{artist.SUPPORTERs.toLocaleString()} SUPPORTERs</p>
                    </div>
                  </div>
                  <div className={`py-2.5 text-center text-[10px] font-bold uppercase tracking-wider transition-all ${
                    isFollowed ? 'bg-[#00D2FF] text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'
                  }`}>
                    {isFollowed ? '✓ Following' : 'Follow'}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => canProceedStep2 && setStep(3)}
              disabled={!canProceedStep2}
              className={`px-12 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 mx-auto ${
                canProceedStep2
                  ? 'bg-white text-black hover:bg-[#00D2FF] hover:text-white'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}>
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
            {!canProceedStep2 && (
              <p className="text-[10px] text-gray-600 font-medium mt-3">
                Follow {REQUIRED_FOLLOWS - followedArtists.length} more artist{REQUIRED_FOLLOWS - followedArtists.length !== 1 ? 's' : ''} to continue
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRMATION */}
      {step === 3 && (
        <div className="w-full max-w-lg text-center space-y-10">
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <Zap className="w-9 h-9 text-green-400" />
            </div>
            <h1 className="text-[clamp(1.5rem,6vw,3.5rem)] font-bold uppercase tracking-tighter italic leading-tight">Welcome to New Release Hub.</h1>
            <p className="text-gray-400 font-medium leading-relaxed">
              You're now following {followedArtists.length + 1} accounts — including{' '}
              <span className="text-white font-bold">@newreleasehub</span>.
            </p>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 space-y-3 text-left">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Your Setup</p>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-sm text-gray-300">{selectedGenres.length} genres selected</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-sm text-gray-300">{followedArtists.length + 1} accounts followed</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-sm text-gray-300">@newreleasehub auto-followed</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fan/me"
              className="px-10 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-[#00D2FF] hover:text-white transition-all">
              Go to My Feed
            </Link>
            <Link href="/discover"
              className="px-10 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Explore All Artists
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


