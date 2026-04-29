'use client';
import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Twitter, Instagram, Facebook, Download, Copy, CheckCircle2, Music } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import { toast } from 'react-hot-toast';

export default function ShareClient({ org }: { org: any }) {
  const [selectedRelease, setSelectedRelease] = useState<any>(org?.releases?.[0] || null);
  const [activeTab, setActiveTab] = useState<'smart_link' | 'graphics'>('smart_link');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!selectedRelease) return;
    const url = `https://newreleasehub.com/${org.slug}/release/${selectedRelease.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success('Smart link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadGraphic = (type: 'square' | 'story') => {
    toast.success(`Downloading ${type} graphic...`);
    // In a real implementation, this would generate and download an image canvas
  };

  if (!org) return <div>Please log in</div>;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-2">Promotional Engine</h1>
          <p className="text-gray-400 font-medium">Generate smart links, social graphics, and campaign assets.</p>
        </div>
      </div>

      {!org.releases || org.releases.length === 0 ? (
        <div className="bg-[#111] border border-white/5 rounded-3xl p-12 text-center space-y-4">
           <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-zinc-600">
              <Music className="w-8 h-8" />
           </div>
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">No Releases Available</p>
           <p className="text-sm text-gray-400">Upload a release first to generate promotional assets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR: Release Selection */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Target Release</h3>
            <div className="space-y-3">
              {org.releases.map((release: any) => (
                <button
                  key={release.id}
                  onClick={() => setSelectedRelease(release)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                    selectedRelease?.id === release.id 
                      ? 'bg-[#00D2FF]/10 border-[#00D2FF]/30 shadow-[0_0_20px_rgba(0,210,255,0.1)]' 
                      : 'bg-[#111] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 overflow-hidden shrink-0">
                    {release.coverArtUrl ? (
                      <img src={release.coverArtUrl} alt={release.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Music className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold truncate ${selectedRelease?.id === release.id ? 'text-[#00D2FF]' : 'text-white'}`}>
                      {release.title}
                    </p>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest truncate">{release.type || 'Single'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT: Generation Area */}
          <div className="lg:col-span-8 bg-[#111] border border-white/5 rounded-3xl p-8 min-h-[500px]">
            {selectedRelease ? (
              <>
                <div className="flex items-center gap-2 border-b border-white/5 pb-6 mb-8">
                  <button 
                    onClick={() => setActiveTab('smart_link')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === 'smart_link' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Smart Link
                  </button>
                  <button 
                    onClick={() => setActiveTab('graphics')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === 'graphics' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Social Graphics
                  </button>
                </div>

                {activeTab === 'smart_link' && (
                  <FadeIn className="space-y-8">
                    <div className="flex items-center gap-6 p-6 rounded-2xl bg-black/40 border border-white/5">
                      <div className="w-24 h-24 rounded-xl bg-zinc-900 shrink-0 overflow-hidden shadow-2xl">
                        {selectedRelease.coverArtUrl && <img src={selectedRelease.coverArtUrl} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Generated URL</p>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              readOnly 
                              value={`nrh.io/${org.slug}/${selectedRelease.id}`} 
                              className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium w-full focus:outline-none"
                            />
                            <button 
                              onClick={handleCopy}
                              className="p-3 bg-[#00D2FF]/10 text-[#00D2FF] hover:bg-[#00D2FF]/20 transition-colors rounded-xl border border-[#00D2FF]/20"
                            >
                              {isCopied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-white">
                          <Share2 className="w-5 h-5 text-[#00D2FF]" />
                          <h4 className="font-bold">Auto-Campaigns</h4>
                        </div>
                        <p className="text-xs text-gray-400">Instantly share this release to your connected network.</p>
                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                            <Twitter className="w-3 h-3" /> Tweet
                          </button>
                          <button className="flex-1 py-2 bg-[#E1306C]/10 text-[#E1306C] hover:bg-[#E1306C]/20 border border-[#E1306C]/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                            <Instagram className="w-3 h-3" /> Story
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-[#00D2FF]/10 border border-[#00D2FF]/20 space-y-4">
                         <h4 className="font-bold text-white italic">Analytics Tracking Active</h4>
                         <p className="text-xs text-gray-400">This smart link automatically routes users to their preferred streaming app or allows them to purchase Network Stakes directly.</p>
                      </div>
                    </div>
                  </FadeIn>
                )}

                {activeTab === 'graphics' && (
                  <FadeIn className="space-y-6">
                    <p className="text-xs text-gray-400 mb-6">Download auto-generated promotional graphics formatted for your social channels.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Square Graphic */}
                      <div className="group relative">
                        <div className="aspect-square rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden relative">
                           {selectedRelease.coverArtUrl && (
                             <>
                               <img src={selectedRelease.coverArtUrl} alt="" className="w-full h-full object-cover blur-md opacity-50 scale-110" />
                               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-black/40">
                                 <img src={selectedRelease.coverArtUrl} alt="" className="w-48 h-48 rounded-xl shadow-2xl mb-6" />
                                 <p className="font-black text-2xl uppercase tracking-tighter text-white text-center leading-none mb-2">{selectedRelease.title}</p>
                                 <p className="text-[#00D2FF] font-black uppercase tracking-[0.2em] text-[10px]">Out Now on NRH</p>
                               </div>
                             </>
                           )}
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <button onClick={() => handleDownloadGraphic('square')} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                                <Download className="w-4 h-4" /> Download Square
                              </button>
                           </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-3 text-center">Instagram Post (1:1)</p>
                      </div>

                      {/* Story Graphic */}
                      <div className="group relative">
                        <div className="aspect-[9/16] rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden relative">
                           {selectedRelease.coverArtUrl && (
                             <>
                               <img src={selectedRelease.coverArtUrl} alt="" className="w-full h-full object-cover blur-xl opacity-40 scale-125" />
                               <div className="absolute inset-0 flex flex-col items-center justify-between py-16 px-8 bg-gradient-to-t from-black via-black/20 to-black/80">
                                 <div className="text-center">
                                    <p className="text-white/80 font-bold tracking-widest text-[10px] uppercase mb-2">New Release</p>
                                    <p className="font-black text-3xl uppercase tracking-tighter text-white leading-none">{org.name}</p>
                                 </div>
                                 <img src={selectedRelease.coverArtUrl} alt="" className="w-full aspect-square rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10" />
                                 <div className="bg-[#00D2FF] text-black w-full py-4 rounded-xl text-center font-black uppercase tracking-[0.2em] text-xs">
                                   Listen Now
                                 </div>
                               </div>
                             </>
                           )}
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <button onClick={() => handleDownloadGraphic('story')} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                                <Download className="w-4 h-4" /> Download Story
                              </button>
                           </div>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-3 text-center">Story (9:16)</p>
                      </div>
                    </div>
                  </FadeIn>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
