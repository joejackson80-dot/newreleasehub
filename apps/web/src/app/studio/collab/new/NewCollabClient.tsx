'use client';
import React, { useState } from 'react';
import { 
  Music, Users, Zap, Check, ArrowRight, ArrowLeft, 
  DollarSign, Percent, Lock, Clock, Send, Play 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewCollabClient({ targetArtist: initialTarget, currentOrg }: any) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetArtist, setTargetArtist] = useState(initialTarget);
  const [artistSearch, setArtistSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleArtistSearch = async (query: string) => {
    setArtistSearch(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`/api/search?q=${query}&type=artist`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };
  const [formData, setFormData] = useState({
    collabType: 'FEATURE',
    projectTitle: '',
    demoUrl: '',
    proposedDeadline: '',
    dealType: 'FIFTY_FIFTY',
    requesterSplit: 50,
    receiverSplit: 50,
    feeAmount: 0,
    message: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    // In a real implementation, this would call the API
    console.log('Submitting collab request:', formData);
    
    try {
      const response = await fetch('/api/studio/collab/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetArtistId: targetArtist?.id,
          requesterId: currentOrg.id
        })
      });

      if (response.ok) {
        router.push('/studio/collabs?tab=sent');
      }
    } catch (err) {
      console.error('Failed to submit collab request', err);
      // Fallback for demo
      router.push('/studio/collabs?tab=sent');
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-40 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* PROGRESS BAR */}
        <div className="flex items-center justify-between mb-12 relative">
           <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0"></div>
           {[1, 2, 3].map((s) => (
             <div 
               key={s}
               className={`w-10 h-10 rounded-full flex items-center justify-center z-10 font-bold transition-all ${step >= s ? 'bg-[#A855F7] text-white scale-110 shadow-[0_0_20px_rgba(51,102,255,0.4)]' : 'bg-[#111] text-gray-500 border border-white/10'}`}
             >
               {step > s ? <Check className="w-5 h-5" /> : s}
             </div>
           ))}
        </div>

        {/* STEP CONTENT */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter uppercase italic">Step 1: The Project</h2>
                  {targetArtist ? (
                    <div className="flex items-center gap-4 bg-[#A855F7]/10 border border-[#A855F7]/20 p-4 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
                        {targetArtist.profileImageUrl && <img src={targetArtist.profileImageUrl} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Collaborating with</p>
                        <p className="text-lg font-bold text-white uppercase italic">{targetArtist.name}</p>
                      </div>
                      <button onClick={() => setTargetArtist(null)} className="text-[10px] font-bold text-[#A855F7] uppercase tracking-widest hover:text-white transition-colors">Change</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-500 font-medium">Search for an artist by name or slug.</p>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search artists..."
                          className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#A855F7] transition-all"
                          value={artistSearch}
                          onChange={(e) => handleArtistSearch(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                          <div className="absolute top-full left-0 w-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden z-[100] shadow-2xl">
                            {searchResults.map((artist) => (
                              <button 
                                key={artist.id}
                                onClick={() => {
                                  setTargetArtist(artist);
                                  setSearchResults([]);
                                }}
                                className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
                              >
                                <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
                                  {artist.profileImageUrl && <img src={artist.profileImageUrl} className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                  <p className="font-bold text-white">{artist.name}</p>
                                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">@{artist.slug}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['FEATURE', 'PRODUCTION', 'CO_WRITE', 'REMIX', 'OTHER'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, collabType: type})}
                      className={`p-6 rounded-3xl border text-left transition-all ${formData.collabType === type ? 'bg-[#A855F7]/10 border-[#A855F7] text-white' : 'bg-[#111]/50 border-white/5 text-gray-400 hover:border-white/20'}`}
                    >
                       <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">Collab Type</span>
                       <span className="font-bold">{type.replace('_', ' ')}</span>
                    </button>
                  ))}
               </div>

               <div className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Project Title (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Summer Anthem 2026"
                      className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#A855F7] transition-all"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Demo Link (SoundCloud, Dropbox, etc.)</label>
                    <input 
                      type="url" 
                      placeholder="https://..."
                      className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#A855F7] transition-all"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                    />
                  </div>
               </div>

               <div className="flex justify-end pt-4">
                  <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-[#A855F7] hover:bg-[#2952CC] text-white px-8 py-4 rounded-2xl font-bold transition-all group"
                  >
                    Continue to Deal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter uppercase italic">Step 2: The Deal</h2>
                 <p className="text-gray-500 font-medium">Define how the revenue will be shared.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CARD A: FREE OFFER */}
                  <button
                    onClick={() => setFormData({...formData, dealType: 'FREE', requesterSplit: 50, receiverSplit: 50})}
                    className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between h-full ${formData.dealType === 'FREE' ? 'bg-[#A855F7]/10 border-[#A855F7]' : 'bg-[#111]/50 border-white/5 hover:border-white/20'}`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                        <Percent className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg">FREE OFFER</h3>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest leading-relaxed">No upfront cost. Negotiation based on revenue splits.</p>
                    </div>
                    {formData.dealType === 'FREE' && <Check className="w-5 h-5 text-[#A855F7] mt-4 self-end" />}
                  </button>

                  {/* CARD B: 50/50 SPLIT */}
                  <button
                    onClick={() => setFormData({...formData, dealType: 'FIFTY_FIFTY', requesterSplit: 50, receiverSplit: 50})}
                    className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between h-full ${formData.dealType === 'FIFTY_FIFTY' ? 'bg-[#A855F7]/10 border-[#A855F7]' : 'bg-[#111]/50 border-white/5 hover:border-white/20'}`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7] mb-4">
                        <Users className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg">50/50 SPLIT</h3>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest leading-relaxed">Equal partnership. 50% split on all revenue streams.</p>
                    </div>
                    {formData.dealType === 'FIFTY_FIFTY' && <Check className="w-5 h-5 text-[#A855F7] mt-4 self-end" />}
                  </button>

                  {/* CARD C: PAID FLAT */}
                  <button
                    onClick={() => setFormData({...formData, dealType: 'PAID_FLAT', requesterSplit: 100, receiverSplit: 0})}
                    className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between h-full ${formData.dealType === 'PAID_FLAT' ? 'bg-[#A855F7]/10 border-[#A855F7]' : 'bg-[#111]/50 border-white/5 hover:border-white/20'}`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg">PAY FLAT FEE</h3>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest leading-relaxed">One-time payment for the collab. You keep 100% of royalties.</p>
                    </div>
                    {formData.dealType === 'PAID_FLAT' && <Check className="w-5 h-5 text-[#A855F7] mt-4 self-end" />}
                  </button>

                  {/* CARD D: HYBRID */}
                  <button
                    onClick={() => setFormData({...formData, dealType: 'HYBRID'})}
                    className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between h-full ${formData.dealType === 'HYBRID' ? 'bg-[#A855F7]/10 border-[#A855F7]' : 'bg-[#111]/50 border-white/5 hover:border-white/20'}`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg">HYBRID DEAL</h3>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest leading-relaxed">Combine a smaller flat fee with a custom revenue split.</p>
                    </div>
                    {formData.dealType === 'HYBRID' && <Check className="w-5 h-5 text-[#A855F7] mt-4 self-end" />}
                  </button>
               </div>

               {(formData.dealType === 'PAID_FLAT' || formData.dealType === 'HYBRID') && (
                 <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Offer Amount (USD)</label>
                      <div className="grid grid-cols-4 gap-3">
                         {[250, 500, 1000, 2500].map((amt) => (
                           <button 
                             key={amt}
                             onClick={() => setFormData({...formData, feeAmount: amt})}
                             className={`py-3 rounded-xl border text-[10px] font-bold transition-all ${formData.feeAmount === amt ? 'bg-[#A855F7] border-[#A855F7] text-white' : 'bg-[#111] border-white/5 text-gray-500 hover:text-white'}`}
                           >
                             ${amt}
                           </button>
                         ))}
                      </div>
                      <input 
                        type="number" 
                        placeholder="Custom Amount"
                        className="w-full bg-[#111] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#A855F7] transition-all"
                        value={formData.feeAmount || ''}
                        onChange={(e) => setFormData({...formData, feeAmount: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                       <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          <Lock className="w-4 h-4 text-[#A855F7]" /> Secure Escrow Payment
                       </div>
                       <div className="h-12 bg-black/40 rounded-xl border border-white/5 flex items-center px-4 text-gray-700 text-xs font-mono">
                          STRIPE CARD ELEMENT PLACEHOLDER
                       </div>
                       <p className="text-[9px] text-gray-600 uppercase tracking-widest font-medium">Your card will NOT be charged until the request is accepted.</p>
                    </div>
                 </div>
               )}

               {(formData.dealType === 'FREE' || formData.dealType === 'HYBRID' || formData.dealType === 'CUSTOM_SPLIT') && (
                 <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Revenue Split</label>
                         <div className="text-right">
                           <span className="text-[10px] font-bold text-gray-500 uppercase block">Receiving Artist gets</span>
                           <span className="text-2xl font-bold text-[#A855F7]">{formData.receiverSplit}%</span>
                         </div>
                       </div>
                       <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         step="1"
                         className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A855F7]"
                         value={formData.receiverSplit}
                         onChange={(e) => {
                           const val = parseInt(e.target.value);
                           setFormData({...formData, receiverSplit: val, requesterSplit: 100 - val});
                         }}
                       />
                       <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-gray-600">
                          <span>0% (Full Ownership)</span>
                          <span>100% (Full Buyout)</span>
                       </div>
                    </div>
                 </div>
               )}

               <div className="flex justify-between pt-4">
                  <button 
                    onClick={prevStep}
                    className="flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-[#A855F7] hover:bg-[#2952CC] text-white px-8 py-4 rounded-2xl font-bold transition-all group"
                  >
                    Continue to Pitch <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="space-y-2">
                 <h2 className="text-3xl font-bold tracking-tighter uppercase italic">Step 3: The Pitch</h2>
                 <p className="text-gray-500 font-medium">Introduce yourself and explain the vision.</p>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Your Message</label>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${formData.message.length > 500 ? 'text-red-500' : 'text-gray-600'}`}>
                        {formData.message.length}/500
                      </span>
                    </div>
                    <textarea 
                      placeholder="Hey, I've been following your work and I think our styles would mash perfectly on this new track..."
                      className="w-full bg-[#111] border border-white/10 rounded-3xl p-6 text-sm min-h-[200px] focus:outline-none focus:border-[#A855F7] transition-all resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
               </div>

               {/* PREVIEW CARD */}
               <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[32px] space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#A855F7]/5 blur-3xl rounded-full"></div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-sm">Target: {targetArtist?.name || 'Search for artist...'}</h4>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Collab Request Preview</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest block mb-1">Deal Type</span>
                        <span className="text-xs font-bold">{formData.dealType.replace('_', ' ')}</span>
                     </div>
                     <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest block mb-1">You Receive</span>
                        <span className="text-xs font-bold">{formData.receiverSplit}% Payout</span>
                     </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 italic line-clamp-2">"{formData.message || 'No message yet...'}"</p>
               </div>

               <div className="flex justify-between pt-4">
                  <button 
                    onClick={prevStep}
                    className="flex items-center gap-2 text-gray-500 hover:text-white font-bold transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" /> Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!formData.message}
                    className={`flex items-center gap-2 px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all group ${!formData.message ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#A855F7] hover:bg-[#2952CC] text-white shadow-[0_20px_40px_rgba(51,102,255,0.2)]'}`}
                  >
                    Send Request <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* SIDEBAR TIPS */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="flex gap-4 items-start">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Zap className="w-4 h-4 text-yellow-500" /></div>
             <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Artists who include a high-quality demo have an 80% higher acceptance rate.</p>
           </div>
           <div className="flex gap-4 items-start">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-[#A855F7]" /></div>
             <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Requests expire after 72 hours if not accepted or countered.</p>
           </div>
           <div className="flex gap-4 items-start">
             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Lock className="w-4 h-4 text-green-500" /></div>
             <p className="text-[10px] text-gray-500 font-medium leading-relaxed">All payments are held in secure escrow until the project is delivered.</p>
           </div>
        </div>

      </div>
    </div>
  );
}


