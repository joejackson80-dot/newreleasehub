'use client';
import React, { useState, useEffect } from 'react';
import { Award, Users, DollarSign, Flame, Trash2, Check, X, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  slug: string;
  initialOrgData?: any;
}

export default function StudioDashboard({ slug, initialOrgData }: Props) {
  const [stats, setStats] = useState({ fire: 0, cool: 0, trash: 0 });
  const [bids, setBids] = useState<any[]>([]);
  const [orgId, setOrgId] = useState(initialOrgData?.id || '');
  const [orgData, setOrgData] = useState<any>(initialOrgData || null);
  const [revenue, setRevenue] = useState(0);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'PROFILE'>('DASHBOARD');
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch State (to get Org ID and current counts)
      const stateRes = await fetch(`/api/dj/state?slug=${slug}`);
      if (stateRes.ok) {
        const stateData = await stateRes.json();
        setOrgId(stateData.organizationId);
        setStats({ fire: stateData.fireCount, cool: stateData.coolCount, trash: stateData.trashCount });
      }

      // 2. Fetch Org Data (if not provided or if we just came back from Stripe)
      const searchParams = new URLSearchParams(window.location.search);
      const isStripeSuccess = searchParams.get('stripe_success') === 'true';

      if (!orgData || isStripeSuccess) {
        const orgRes = await fetch(`/api/org?slug=${slug}`);
        if (orgRes.ok) {
          const data = await orgRes.json();
          setOrgData(data);
          setName(data.name);
          setBio(data.bio || '');
        }
      }
    };
    fetchData();
  }, [slug, orgData]);

  useEffect(() => {
    if (!orgId) return;
    const fetchBids = async () => {
      const res = await fetch(`/api/bids?orgId=${orgId}`);
      if (res.ok) {
        const data = await res.json();
        setBids(data);
        
        // Calculate revenue from accepted bids
        const acceptedTotal = data
          .filter((b: any) => b.status === 'ACCEPTED')
          .reduce((acc: number, b: any) => acc + b.offerAmountCents, 0);
        setRevenue(acceptedTotal);
      }
    };
    fetchBids();

    // Realtime Bids for Artist
    const channel = supabase
      .channel(`studio-bids-${orgId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'BidOffer',
          filter: `organizationId=eq.${orgId}`
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setBids(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBids(prev => prev.map(b => b.id === payload.new.id ? payload.new : b));
            if (payload.new.status === 'ACCEPTED' && (payload.old as any)?.status !== 'ACCEPTED') {
              setRevenue(prev => prev + payload.new.offerAmountCents);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId]);

  const handleUpdateBidStatus = async (bidId: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/bids', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bidId, status: newStatus })
      });
      if (res.ok) {
        // Optimistic update
        setBids(prev => prev.map(b => b.id === bidId ? { ...b, status: newStatus } : b));
        if (newStatus === 'ACCEPTED') {
          const bid = bids.find(b => b.id === bidId);
          if (bid) setRevenue(prev => prev + bid.offerAmountCents);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnectStripe = async () => {
    setIsConnectingStripe(true);
    try {
      const res = await fetch('/api/stripe/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, organizationId: orgId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initialize Stripe onboarding: " + (data.error || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert("Error connecting to Stripe onboarding.");
    } finally {
      setIsConnectingStripe(false);
    }
  };

  const updateProfile = async () => {
    try {
      const res = await fetch('/api/org', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, bio })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrgData(updated);
        alert("Profile updated successfully!");
        setActiveTab('DASHBOARD');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ─── TAB NAVIGATION ─── */}
      <div className="flex items-center space-x-8 border-b border-[#1f1f1f]">
         <button 
           onClick={() => setActiveTab('DASHBOARD')}
           className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
             activeTab === 'DASHBOARD' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-400'
           }`}
         >
           Analytics & Bids
         </button>
         <button 
           onClick={() => setActiveTab('PROFILE')}
           className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
             activeTab === 'PROFILE' ? 'text-white border-white' : 'text-gray-500 border-transparent hover:text-gray-400'
           }`}
         >
           Artist Profile
         </button>
      </div>

      {/* Stripe Connection Alert */}
      {!orgData?.stripeAccountId ? (
        <div className="bg-[#050505] border border-[#1f1f1f] rounded-lg p-5 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
               <DollarSign className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Payouts Not Configured</h3>
              <p className="text-xs text-gray-500 mt-0.5 max-w-lg leading-relaxed">
                You must connect a Stripe account to accept participation bids. Funds flow directly to your bank.
              </p>
            </div>
          </div>
          <button 
            onClick={handleConnectStripe}
            disabled={isConnectingStripe}
            className="px-6 py-2.5 mt-4 md:mt-0 bg-white hover:bg-gray-200 text-black font-bold text-xs rounded transition-all whitespace-nowrap disabled:opacity-50"
          >
            {isConnectingStripe ? 'Initializing...' : 'Connect Stripe'}
          </button>
        </div>
      ) : (
        <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4 flex items-center justify-between">
           <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Payouts Active (Stripe Connected)</span>
           </div>
           <span className="text-[10px] text-gray-600 font-mono">{orgData.stripeAccountId}</span>
        </div>
      )}

      {activeTab === 'DASHBOARD' ? (
        <>
          {/* ─── ANALYTICS ROW ─── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#050505] border border-[#1f1f1f] p-6 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Revenue</h4>
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-white mt-4">${(revenue / 100).toLocaleString()}</p>
            </div>
            
            <div className="bg-[#050505] border border-[#1f1f1f] p-6 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Licenses</h4>
                <Award className="w-4 h-4 text-[var(--color-gold)]" />
              </div>
              <p className="text-3xl font-bold text-white mt-4">{bids.filter(b => b.status === 'ACCEPTED').length}</p>
            </div>

            <div className="bg-[#050505] border border-[#1f1f1f] p-6 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Audience Reach</h4>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-white mt-4">{Math.floor((stats.fire + stats.cool) * 1.5)}</p>
            </div>

            <div className="bg-[#050505] border border-[#1f1f1f] p-6 rounded-xl flex flex-col justify-between">
               <div className="flex justify-between items-start">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sentiment Heat</h4>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex items-baseline space-x-2 mt-4">
                 <p className="text-3xl font-bold text-white">{stats.fire}</p>
                 <span className="text-xs font-bold text-orange-500">FIRE</span>
              </div>
            </div>
          </div>

          {/* ─── BID MANAGEMENT ─── */}
          <div className="bg-[#050505] border border-[#1f1f1f] rounded-xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-[#1f1f1f] flex justify-between items-center bg-[#080808]">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Pending Participation Offers</h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{bids.filter(b => b.status === 'PENDING').length} Actions Required</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-gray-600 uppercase tracking-widest border-b border-[#1f1f1f]">
                    <th className="px-8 py-4 font-bold">SUPPORTER ID</th>
                    <th className="px-8 py-4 font-bold">Asset</th>
                    <th className="px-8 py-4 font-bold">Offer</th>
                    <th className="px-8 py-4 font-bold">Requested %</th>
                    <th className="px-8 py-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {bids.map((bid) => (
                    <tr key={bid.id} className={`group hover:bg-[#080808] transition-colors ${bid.status !== 'PENDING' ? 'opacity-40' : ''}`}>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{bid.userId}</span>
                          <span className="text-[10px] text-gray-600 font-mono italic">{bid.note || 'No note attached'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-xs text-gray-400 font-medium">{bid.MusicAsset?.title || 'Unknown Asset'}</span>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-xs font-bold text-white">${(bid.offerAmountCents / 100).toFixed(2)}</span>
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-[10px] text-[var(--color-gold)] font-bold">{(bid.requestedBps / 100).toFixed(2)}%</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {bid.status === 'PENDING' ? (
                          <div className="flex items-center justify-end space-x-4">
                            <button 
                              onClick={() => handleUpdateBidStatus(bid.id, 'ACCEPTED')}
                              className="text-[10px] text-green-500 hover:text-green-400 font-bold uppercase tracking-widest border border-green-500/20 px-2 py-1 rounded bg-green-500/5 transition-all"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleUpdateBidStatus(bid.id, 'REJECTED')}
                              className="text-[10px] text-gray-500 hover:text-red-500 font-bold uppercase tracking-widest transition-all"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${bid.status === 'ACCEPTED' ? 'text-green-500' : 'text-red-500'}`}>
                            {bid.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {bids.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                         <Award className="w-10 h-10 text-gray-800 mx-auto mb-4" />
                         <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Your pool is empty. Promote your live stream to attract SUPPORTERs.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-2xl bg-[#050505] border border-[#1f1f1f] rounded-xl p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Public Artist Name</label>
                 <input 
                   type="text" 
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   className="w-full bg-[#080808] border border-[#1f1f1f] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors"
                 />
              </div>
              
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Artist Bio</label>
                 <textarea 
                   rows={4}
                   value={bio}
                   onChange={(e) => setBio(e.target.value)}
                   className="w-full bg-[#080808] border border-[#1f1f1f] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none"
                   placeholder="Tell your fans about your master ownership mission..."
                 />
              </div>
           </div>

           <div className="pt-4 flex justify-end">
              <button 
                onClick={updateProfile}
                className="px-8 py-3 rounded bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Save Profile Changes
              </button>
           </div>
        </div>
      )}

      {/* ─── QUICK LINKS ─── */}
      <div className="flex items-center space-x-6">
         <a href={`/${slug}/studio/dj`} className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Launch DJ Controller</span>
         </a>
         <a href={`/${slug}/live`} target="_blank" className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Stage</span>
         </a>
      </div>

    </div>
  );
}


