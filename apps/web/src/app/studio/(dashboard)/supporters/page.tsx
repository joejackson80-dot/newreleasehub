import React from 'react';
import { getSessionArtist } from '@/lib/session';
import { Users, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default async function SupporterTiersManagerPage() {
  const org = await getSessionArtist({ includeSupporters: true });

  return (
    <div className="p-8 md:p-12 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">SUPPORTER Tiers</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Configure your funding tiers and revenue participation shares.</p>
        </div>
        <button className="bg-[#F1F5F9] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-all flex items-center gap-2 w-full md:w-auto justify-center">
          <Plus className="w-4 h-4" />
          <span>Create New Tier</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {org.SupporterTiers.map(tier => (
          <div key={tier.id} className="bg-[#111] border border-white/5 rounded-2xl p-6 relative group hover:border-[#F1F5F9]/50 transition-colors flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="font-bold text-lg text-white">{tier.name}</h4>
                <p className="text-[#F1F5F9] font-bold text-2xl mt-1">${(tier.priceCents / 100).toFixed(2)}<span className="text-xs text-gray-500 font-medium">/mo</span></p>
              </div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-black px-2 py-1 rounded border border-white/5">
                {tier.maxSlots ? `/ ${tier.maxSlots}` : 'Unlimited'} Slots
              </span>
            </div>
            
            <div className="space-y-3 mb-8 flex-1">
              <p className="text-xs text-gray-400 leading-relaxed">
                {tier.description || 'No description provided.'}
              </p>
              {tier.revenueSharePercent > 0 && (
                <div className="flex items-start gap-2 text-xs text-gray-400 pt-2 border-t border-white/5 mt-2">
                  <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="text-purple-400 font-medium">{tier.revenueSharePercent}% Rev Share</span>
                </div>
              )}
            </div>

            <button className="w-full py-3 rounded-xl bg-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors mt-auto">
              Edit Tier
            </button>
          </div>
        ))}
        {org.SupporterTiers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 text-sm bg-[#111] rounded-2xl border border-dashed border-white/10">
            No active SUPPORTER tiers. Create one to start funding your next release.
          </div>
        )}
      </div>
    </div>
  );
}


