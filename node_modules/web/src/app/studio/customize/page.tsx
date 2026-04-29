'use client';
import React, { useState } from 'react';
import { Palette, Type, Layout, Pen, Save, ExternalLink, ChevronDown, DollarSign, Radio } from 'lucide-react';

const FONT_OPTIONS = [
  { name: 'Syne', class: 'font-sans', preview: 'The Quick Brown Fox' },
  { name: 'Inter', class: 'font-sans', preview: 'The Quick Brown Fox' },
  { name: 'Playfair', class: 'font-serif', preview: 'The Quick Brown Fox' },
  { name: 'Roboto Mono', class: 'font-mono', preview: 'The Quick Brown Fox' },
  { name: 'DM Sans', class: 'font-sans', preview: 'The Quick Brown Fox' },
  { name: 'Space Grotesk', class: 'font-sans', preview: 'The Quick Brown Fox' },
];

const HERO_STYLES = ['Minimal', 'Fullscreen', 'Split', 'Centered'];
const ACCENT_SWATCHES = ['#00D2FF', '#E63946', '#2EC4B6', '#FF9F1C', '#8338EC', '#06D6A0', '#FFBE0B', '#FB5607'];

export default function CustomizePage() {
  const [tab, setTab] = useState<'appearance' | 'layout' | 'signature' | 'account' | 'broadcast'>('appearance');
  const [bgType, setBgType] = useState<'color' | 'gradient' | 'image'>('color');
  const [accentColor, setAccentColor] = useState('#00D2FF');
  const [selectedFont, setSelectedFont] = useState('Syne');
  const [heroStyle, setHeroStyle] = useState('Minimal');
  const [manifesto, setManifesto] = useState('');
  const [moodStatus, setMoodStatus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [saved, setSaved] = useState(false);



  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const getBackgroundStyle = () => {
    if (bgType === 'color') return { backgroundColor: '#020202' };
    if (bgType === 'gradient') return { background: `linear-gradient(to bottom right, #020202, ${accentColor}30, #020202)` };
    if (bgType === 'image') return { 
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), #020202), url('https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?q=80&w=2000&auto=format&fit=crop')`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    };
  };

  const getFontClass = () => {
    return FONT_OPTIONS.find(f => f.name === selectedFont)?.class || 'font-sans';
  };

  return (
    <div className="flex h-[calc(100vh-0px)] overflow-hidden">
      {/* Controls — 40% */}
      <div className="w-[40%] border-r border-white/5 overflow-y-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Page Customizer.</h1>
          <a href="/marcus-webb" target="_blank"
            className="flex items-center gap-1.5 text-[10px] text-[#00D2FF] font-bold uppercase tracking-widest hover:text-white transition-colors">
            Live Page <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
          {(['appearance', 'layout', 'signature', 'broadcast', 'account'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-md text-[8px] font-bold uppercase tracking-widest transition-all ${
                tab === t ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'appearance' && (
          <div className="space-y-8">
            {/* Background */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Background Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['color', 'gradient', 'image'] as const).map(t => (
                  <button key={t} onClick={() => setBgType(t)}
                    className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      bgType === t ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-500 hover:text-white'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_SWATCHES.map(c => (
                  <button key={c} onClick={() => setAccentColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
              <input type="text" value={accentColor} onChange={e => setAccentColor(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 font-mono"
              />
            </div>

            {/* Font */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Font Family</label>
              <div className="space-y-2">
                {FONT_OPTIONS.map(f => (
                  <button key={f.name} onClick={() => setSelectedFont(f.name)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedFont === f.name ? 'bg-white/10 border-white/30' : 'border-white/5 hover:border-white/10 bg-[#111]'
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{f.name}</span>
                      {selectedFont === f.name && <div className="w-2 h-2 rounded-full bg-[#00D2FF]" />}
                    </div>
                    <p className={`text-white text-sm mt-1 ${f.class}`}>{f.preview}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'layout' && (
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hero Style</label>
              <div className="grid grid-cols-2 gap-3">
                {HERO_STYLES.map(s => (
                  <button key={s} onClick={() => setHeroStyle(s)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      heroStyle === s ? 'bg-[#00D2FF]/10 border-[#00D2FF]/40 text-white' : 'border-white/10 text-gray-400 hover:text-white bg-[#111]'
                    }`}>
                    <div className="w-full h-10 bg-white/5 rounded-md mb-2 flex items-center justify-center">
                      <div className={`w-6 h-1 bg-white/30 rounded ${s === 'Centered' ? 'mx-auto' : ''}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'signature' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mood Status</label>
              <input type="text" value={moodStatus} onChange={e => setMoodStatus(e.target.value)}
                placeholder="e.g. In the studio working on something big..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Artist Manifesto</label>
                <button 
                  onClick={() => {
                    setIsGenerating(true);
                    setTimeout(() => {
                      setManifesto("Pushing the boundaries of the local scene with high-intensity audio experiments. Every release is a master-class in independent growth, backed by a network of dedicated SUPPORTERs who believe in the future of sound.");
                      setIsGenerating(false);
                    }, 1500);
                  }}
                  disabled={isGenerating}
                  className="text-[9px] font-bold text-[#00D2FF] uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Pen className="w-3 h-3" /> {isGenerating ? 'Generating...' : 'AI Bio Gen'}
                </button>
              </div>
              <textarea value={manifesto} onChange={e => setManifesto(e.target.value.slice(0, 280))} rows={4}
                placeholder="Your creative vision in 280 characters..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 resize-none"
              />
            </div>
          </div>
        )}

        {tab === 'broadcast' && (
          <div className="space-y-8">
            <div className="p-6 bg-[#00D2FF]/5 border border-[#00D2FF]/10 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#00D2FF]/10 flex items-center justify-center text-[#00D2FF]">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase italic">Network Broadcast.</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Notify all followers and SUPPORTERs</p>
              </div>
              <textarea 
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                placeholder="What's the announcement?"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00D2FF]/30 resize-none"
                rows={3}
              />
              <button 
                onClick={() => { alert('Broadcast Sent to Network!'); setBroadcastMsg(''); }}
                className="w-full py-3 bg-[#00D2FF] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all shadow-lg"
              >
                Send Announcement
              </button>
            </div>
            
            <div className="space-y-4">
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recent Broadcasts</label>
               <div className="space-y-3">
                  {[
                    { date: '2 days ago', msg: 'New release dropping Friday!' },
                    { date: '1 week ago', msg: 'Live studio session tonight at 8PM' }
                  ].map((b, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl">
                       <p className="text-xs text-white">{b.msg}</p>
                       <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-2">{b.date}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {tab === 'account' && (
          <div className="space-y-6">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#00D2FF]/10 flex items-center justify-center text-[#00D2FF]">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white uppercase italic">Payout Account.</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Stripe Connect required for earnings</p>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                To receive streaming royalties and SUPPORTERage payouts, you must connect a Stripe account. This allows for instant, transparent payouts to your local bank.
              </p>
              <button 
                onClick={() => window.location.href = '/studio/stripe-mock'}
                className="w-full py-3 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-xl hover:scale-[1.02] transition-all"
              >
                Connect with Stripe
              </button>
            </div>
          </div>
        )}

        <button onClick={handleSave}
          className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
            saved ? 'bg-green-500 text-white' : 'bg-[#00D2FF] text-white hover:bg-[#00B8E0]'
          }`}>
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Preview — 60% */}
      <div className="flex-1 overflow-hidden relative border-l border-white/5 transition-all duration-700" style={getBackgroundStyle()}>
        <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-xl">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Preview
          </span>
        </div>
        
        <div className={`w-full h-full overflow-y-auto no-scrollbar pb-32 ${getFontClass()}`}>
           
           {/* HERO SECTION */}
           <div className={`w-full relative transition-all duration-500
              ${heroStyle === 'Fullscreen' ? 'h-[70vh] flex items-end pb-12' : 'pt-24 pb-12'}
              ${heroStyle === 'Centered' ? 'text-center flex flex-col items-center' : ''}
              ${heroStyle === 'Split' ? 'flex items-center gap-10 px-12' : 'px-12'}
           `}>
              <div className={`
                 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/10 bg-zinc-900
                 ${heroStyle === 'Fullscreen' ? 'hidden' : ''}
                 ${heroStyle === 'Minimal' ? 'w-24 h-24 mb-6' : ''}
                 ${heroStyle === 'Centered' ? 'w-48 h-48 mb-8' : ''}
                 ${heroStyle === 'Split' ? 'w-64 h-64' : ''}
              `}>
                 <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" alt="Artist Profile" className="w-full h-full object-cover" />
              </div>

              <div className={`space-y-4 max-w-2xl ${heroStyle === 'Fullscreen' ? 'bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10' : ''}`}>
                 <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">MARCUS WEBB</h1>
                 {moodStatus && (
                   <p className="text-sm font-medium text-gray-300 italic border-l-2 pl-3" style={{ borderColor: accentColor }}>
                     {moodStatus}
                   </p>
                 )}
                 <div className="flex items-center gap-3 mt-4">
                    <button className="px-8 py-3 rounded-xl text-black font-bold text-xs uppercase tracking-widest shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: accentColor }}>
                       Play Radio
                    </button>
                    <button className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                       Subscribe
                    </button>
                 </div>
              </div>
           </div>

           {/* MANIFESTO / BIO */}
           <div className="px-12 mt-8">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-white/5 pb-2">Manifesto</h3>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium">
                 {manifesto || "Your artist bio and creative vision will appear here. Tell the world what drives your sound."}
              </p>
           </div>

           {/* RECENT BROADCAST MOCK */}
           {broadcastMsg && (
             <div className="px-12 mt-12">
                <div className="p-6 rounded-2xl border border-[#00D2FF]/20 bg-[#00D2FF]/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Radio className="w-24 h-24 text-[#00D2FF]" />
                   </div>
                   <div className="relative z-10">
                      <span className="text-[10px] font-bold text-[#00D2FF] uppercase tracking-widest mb-2 block">Latest Broadcast</span>
                      <p className="text-white text-sm font-medium leading-relaxed">{broadcastMsg}</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}


