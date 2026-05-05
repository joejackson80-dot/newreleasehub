import React from 'react';
export const dynamic = 'force-dynamic';
import { createAdminClient } from '@/lib/supabase/admin';
import { Award, ShieldCheck, FileText, Download, Share2, Music } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

async function getLicenseData(id: string) {
  const supabase = createAdminClient();
  const { data: license } = await supabase
    .from('participation_licenses')
    .select(`
      *,
      tracks (
        *,
        organizations (*)
      )
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (!license) return null;

  return {
    ...license,
    MusicAsset: {
      ...license.tracks,
      Organization: license.tracks.organizations
    }
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const license = await getLicenseData(id);

  if (!license) return { title: 'License Not Found | NRH' };

  const title = `Master License: ${license.MusicAsset?.title} | NRH`;
  const description = `Verified digital master participation license for ${license.MusicAsset?.title} by ${license.MusicAsset?.Organization?.name}. Issued via New Release Hub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [license.MusicAsset?.Organization?.profile_image_url || '/images/og-license.jpg'],
      type: 'article',
    }
  };
}

export default async function LicensePage(props: Props) {
  const params = await props.params;
  const license = await getLicenseData(params.id);

  if (!license) notFound();

  const percentage = (license.allocated_bps / 100).toFixed(2);
  const artistName = license.MusicAsset?.Organization?.name || "Unknown Artist";
  const dateStr = new Date(license.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-20 font-serif selection:bg-white selection:text-black">
      {/* Action Bar */}
      <div className="max-w-4xl mx-auto mb-12 flex justify-between items-center print:hidden border-b border-white/10 pb-6 font-sans">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-green-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Verified Smart License</span>
        </div>
      </div>

      {/* The Certificate */}
      <div className="max-w-4xl mx-auto bg-white text-black p-12 md:p-24 relative shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden">
        <div className="absolute inset-4 border-2 border-black/5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-12">
          
          <div className="space-y-4">
             <div className="flex justify-center mb-6">
                <Music className="w-12 h-12" />
             </div>
             <h2 className="text-xs font-sans font-bold uppercase tracking-[0.5em] text-gray-400">Digital Master Participation</h2>
             <h1 className="text-5xl md:text-7xl font-light tracking-tight italic">License Certificate</h1>
          </div>

          <div className="w-24 h-px bg-black/20"></div>

          <div className="space-y-6 max-w-2xl">
             <p className="text-xl leading-relaxed">
               This document serves as formal confirmation that <br/>
               <span className="font-bold underline decoration-1 underline-offset-4">{license.user_id}</span> <br/>
               has acquired a commercial participation interest in:
             </p>
             <p className="text-3xl font-bold tracking-tight">"{license.MusicAsset?.title || 'Untitled Master'}"</p>
          </div>

          <div className="grid grid-cols-2 gap-12 w-full max-w-lg border-y border-black/10 py-12">
             <div className="space-y-1">
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Participation Stake</p>
                <p className="text-4xl font-bold">{percentage}%</p>
             </div>
             <div className="space-y-1">
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Consideration Paid</p>
                <p className="text-4xl font-bold">${(license.fee_cents / 100).toLocaleString()}</p>
             </div>
          </div>

          <div className="space-y-8 text-sm leading-relaxed text-gray-600 max-w-xl">
             <p>The Artist, <strong>{artistName}</strong>, hereby grants the Licensee a limited right to participate in commercial revenue streams.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between w-full pt-12 space-y-8 md:space-y-0">
             <div className="text-left space-y-2">
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Issued On</p>
                <p className="font-bold">{dateStr}</p>
             </div>
             <div className="flex flex-col items-end">
                <div className="w-32 h-12 border-b border-black mb-1 flex items-end justify-center overflow-hidden italic text-2xl font-light opacity-60">
                   {artistName}
                </div>
                <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">Digital Signature</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
