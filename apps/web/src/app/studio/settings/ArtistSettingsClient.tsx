'use client';
import React, { useState } from 'react';
import { Settings, User, Globe, Link as LinkIcon, Save, Camera, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateArtistProfile } from '@/app/actions/music';

export default function ArtistSettingsClient({ org }: { org: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: org.name || '',
    bio: org.bio || '',
    city: org.city || '',
    country: org.country || '',
    officialBio: org.officialBio || '',
    socialLinksJson: org.socialLinksJson || '{}',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await updateArtistProfile({
      name: formData.name,
      bio: formData.bio,
      city: formData.city,
      country: formData.country,
    });

    setLoading(false);
    if (res.success) {
      toast.success('Studio profile updated successfully.');
    } else {
      toast.error(res.error || 'Update failed.');
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white">Studio Settings</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Manage your public identity and network credentials.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-10">
        
        {/* PROFILE BASICS */}
        <section className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-8">
           <div className="flex items-center space-x-3 mb-2">
              <User className="w-5 h-5 text-[#F1F5F9]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Public Profile</h2>
           </div>

           <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center space-y-4">
                 <div className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-white/5 overflow-hidden relative group cursor-pointer">
                    <img src={org.profileImageUrl || '/images/default-avatar.png'} className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Camera className="w-8 h-8 text-white" />
                    </div>
                 </div>
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Change Photo</span>
              </div>

              <div className="flex-1 space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Artist Name</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#F1F5F9] outline-none transition-colors" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Network Slug</label>
                       <input 
                         type="text" 
                         value={org.slug} 
                         disabled
                         className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed" 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Public Bio</label>
                    <textarea 
                      rows={4}
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#F1F5F9] outline-none transition-colors" 
                      placeholder="Tell the network your story..."
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* LOCATION & BIO */}
        <section className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-8">
           <div className="flex items-center space-x-3 mb-2">
              <Globe className="w-5 h-5 text-[#F1F5F9]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Origin & Metadata</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">City</label>
                 <input 
                    type="text" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#F1F5F9] outline-none transition-colors" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Country</label>
                 <input 
                    type="text" 
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#F1F5F9] outline-none transition-colors" 
                 />
              </div>
           </div>
        </section>

        {/* SOCIAL LINKS */}
        <section className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <LinkIcon className="w-5 h-5 text-[#F1F5F9]" />
                 <h2 className="text-sm font-bold text-white uppercase tracking-widest">Social Matrix</h2>
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Linked Accounts</span>
           </div>

           <div className="space-y-4">
              {['Instagram', 'Twitter', 'TikTok', 'Spotify'].map(platform => (
                 <div key={platform} className="flex items-center space-x-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                       <Globe className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{platform}</p>
                       <input 
                          type="text" 
                          placeholder={`@username`}
                          className="w-full bg-transparent border-none text-white text-sm focus:ring-0 px-0 mt-1" 
                       />
                    </div>
                 </div>
              ))}
           </div>
        </section>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
           <div className="flex items-center space-x-4 text-gray-500">
              <Shield className="w-5 h-5" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Your data is secured on the NRH private ledger.</p>
           </div>
           <button 
             type="submit"
             disabled={loading}
             className="bg-[#F1F5F9] text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-all flex items-center gap-3 disabled:opacity-50"
           >
             <Save className="w-4 h-4" />
             {loading ? 'Saving Changes...' : 'Update Profile'}
           </button>
        </div>

      </form>
    </div>
  );
}
