'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Music, Disc, ShieldCheck, Zap, Globe, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { createRelease } from '@/app/actions/music';
import toast from 'react-hot-toast';

export default function UploadReleaseModal({ isOpen, onClose, isVerified = false }: { isOpen: boolean, onClose: () => void, isVerified?: boolean }) {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);
  const [authorizedForRadio, setAuthorizedForRadio] = useState(true);
  
  // Smart Import States
  const [importUrl, setImportUrl] = useState('');
  const [isFetchingImport, setIsFetchingImport] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Single');
  const [genre, setGenre] = useState('Hip-Hop');
  const [coverArt, setCoverArt] = useState<string | null>(null);

  const handleFetchImport = () => {
    if (!importUrl) return;
    setIsFetchingImport(true);
    
    // Simulate fetching metadata from Spotify API
    setTimeout(() => {
      setTitle('Midnight Echoes');
      setType('Single');
      setGenre('Electronic');
      setCoverArt('/images/default-cover.png');
      setIsFetchingImport(false);
    }, 1500);
  };

  const handleUpload = async () => {
    if (!title) {
      toast.error('Title is required');
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    
    // Step 1: Simulate audio processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 80) {
          clearInterval(interval);
          return 80;
        }
        return prev + 5;
      });
    }, 50);

    // Step 2: Call real server action
    const res = await createRelease({
      title,
      type,
      genre,
      coverArtUrl: coverArt || '/images/default-cover.png',
      authorizedForRadio: authorizedForRadio && isVerified
    });

    if (res.success) {
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setStep(3);
      }, 500);
    } else {
      clearInterval(interval);
      setIsUploading(false);
      toast.error(res.error || 'Failed to deploy release');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-[#050505] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 text-[#A855F7] flex items-center justify-center">
                     <Upload className="w-5 h-5" />
                  </div>
                  <div>
                     <h2 className="text-xl font-bold text-white tracking-tight">New Release</h2>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ownership & Distribution</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content */}
            <div className="p-10">
               {step === 1 && (
                  <div className="space-y-10">
                     <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden">
                        {isFetchingImport && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="flex items-center gap-3">
                               <div className="w-4 h-4 rounded-full border-2 border-[#A855F7] border-t-transparent animate-spin" />
                               <span className="text-xs font-bold text-[#A855F7] uppercase tracking-widest">Scanning Metadata...</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                           <Globe className="w-5 h-5 text-[#A855F7]" />
                           <div>
                             <h3 className="text-sm font-bold text-white uppercase tracking-widest">Smart Import</h3>
                             <p className="text-[10px] text-gray-500 font-medium">Paste a Spotify or Apple Music link to auto-fill metadata and artwork.</p>
                           </div>
                        </div>
                        <div className="flex gap-3">
                           <input 
                             type="text" 
                             value={importUrl}
                             onChange={(e) => setImportUrl(e.target.value)}
                             placeholder="https://open.spotify.com/album/..." 
                             className="flex-1 bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-[#A855F7]" 
                           />
                           <button 
                             onClick={handleFetchImport}
                             className="px-6 py-3 bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/20 transition-colors whitespace-nowrap"
                           >
                              Fetch Data
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Release Title</label>
                              <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Midnight Echoes" 
                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-[#A855F7]" 
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Type</label>
                                 <select 
                                   value={type}
                                   onChange={(e) => setType(e.target.value)}
                                   className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-[#A855F7]"
                                 >
                                    <option>Single</option>
                                    <option>EP</option>
                                    <option>Album</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Primary Genre</label>
                                 <select 
                                   value={genre}
                                   onChange={(e) => setGenre(e.target.value)}
                                   className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-[#A855F7]"
                                 >
                                    <option>Hip-Hop</option>
                                    <option>Electronic</option>
                                    <option>Rock</option>
                                 </select>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-8 hover:border-[#A855F7]/30 transition-colors group cursor-pointer relative overflow-hidden">
                           {coverArt ? (
                             <img src={coverArt} alt="Cover Art" className="absolute inset-0 w-full h-full object-cover" />
                           ) : (
                             <>
                               <ImageIcon className="w-12 h-12 text-gray-600 group-hover:text-[#A855F7] transition-colors mb-4" />
                               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Drag Artwork Here</p>
                               <p className="text-[10px] text-gray-700 mt-2 font-medium italic">3000 x 3000 recommended</p>
                             </>
                           )}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer group hover:border-[#A855F7]/30 transition-all">
                           <input 
                              type="checkbox" 
                              checked={authorizedForRadio && isVerified} 
                              onChange={(e) => setAuthorizedForRadio(e.target.checked)}
                              disabled={!isVerified}
                              className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-[#A855F7] focus:ring-[#A855F7] disabled:opacity-50"
                           />
                           <div className="flex-1">
                              <p className="text-xs font-bold text-white uppercase tracking-widest">Authorize NRH Radio</p>
                              <p className="text-[10px] text-gray-500 font-medium mt-0.5 leading-relaxed">
                                 I grant NRH a non-exclusive license to include my music in the NRH Radio rotation.
                                 {!isVerified && <span className="text-amber-500/80 block mt-1">Verification required to join radio rotation.</span>}
                              </p>
                           </div>
                        </label>
                     </div>

                     <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center space-x-6">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                           <ShieldCheck className="w-6 h-6" />
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                           By uploading, you certify that you own <span className="text-white font-bold">100% of the masters</span> or have obtained all necessary clearances. NRH takes 0% of your ownership.
                        </p>
                     </div>

                     <button onClick={() => setStep(2)} className="w-full py-4 rounded-xl bg-[#A855F7] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-colors shadow-lg">
                        Next: Add Audio Files
                     </button>
                  </div>
               )}

               {step === 2 && (
                  <div className="space-y-10">
                     <div className="border-2 border-dashed border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center space-y-6 hover:border-[#A855F7]/30 transition-colors cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-[#A855F7]/10 text-[#A855F7] flex items-center justify-center">
                           <Music className="w-10 h-10" />
                        </div>
                        <div className="text-center w-full max-w-xs mx-auto">
                           {isUploading ? (
                              <div className="space-y-4">
                                 <p className="text-sm font-bold text-white uppercase tracking-widest">Encoding Master Audio...</p>
                                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#A855F7] transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                                 </div>
                                 <p className="text-[10px] font-bold text-[#A855F7] uppercase tracking-widest">{uploadProgress}% Complete</p>
                              </div>
                           ) : (
                              <>
                                 <p className="text-sm font-bold text-white uppercase tracking-widest">Choose Audio Files</p>
                                 <p className="text-xs text-gray-500 mt-2">WAV or AIFF preferred for Network Audio Engine</p>
                              </>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setStep(1)} className="py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                           Back
                        </button>
                        <button 
                           onClick={handleUpload}
                           disabled={isUploading}
                           className="py-4 rounded-xl bg-[#A855F7] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-colors shadow-lg disabled:opacity-50"
                        >
                           {isUploading ? 'Encoding...' : 'Finalize & Deploy'}
                        </button>
                     </div>
                  </div>
               )}

               {step === 3 && (
                  <div className="py-20 text-center space-y-8 animate-in zoom-in duration-500">
                     <div className="w-24 h-24 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto">
                        <Zap className="w-12 h-12" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white">Release Deployed!</h3>
                        <p className="text-gray-500 text-sm">Your music is now live on the New Release Hub network.</p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/studio/share" className="px-8 py-3 rounded-xl bg-[#A855F7] text-white font-bold text-xs uppercase tracking-widest">Share on Social</Link>
                        <button onClick={onClose} className="px-8 py-3 rounded-xl bg-white/5 text-white font-bold text-xs uppercase tracking-widest">Back to Studio</button>
                     </div>
                  </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


