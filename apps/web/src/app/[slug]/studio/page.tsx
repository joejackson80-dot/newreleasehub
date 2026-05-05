import React from 'react';
import StudioDashboard from '@/components/studio/StudioDashboard';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminClient();
  
  // Try to find or auto-create the organization for the demo
  let { data: org, error: fetchError } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (fetchError || !org) {
    // For the demo, we auto-create organizations that don't exist
    const friendlyName = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    const { data: newOrg, error: createError } = await supabase
      .from('organizations')
      .insert({
        slug,
        name: friendlyName,
        bio: `The official hub for ${friendlyName}. Master ownership retained.`,
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Failed to auto-create org:', createError);
    } else {
      org = newOrg;
    }
  }

  const isConnected = !!org?.stripe_account_id;
  
  // Normalize for UI
  const normalizedOrg = org ? {
    ...org,
    stripeAccountId: org.stripe_account_id,
    profileImageUrl: org.profile_image_url,
    headerImageUrl: org.header_image_url
  } : null;

  return (
    <div className="min-h-screen bg-[var(--color-studio-base)] text-gray-100 font-sans p-8 md:p-16">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Dashboard Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 mb-2">
               <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Artist Studio</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Management Hub</h1>
            <p className="text-gray-500 text-lg">Retain 100% Master Ownership. Secure Supporters. Scale Direct.</p>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="text-right">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Account Status</p>
                <div className="flex items-center space-x-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                   <p className={`text-sm font-bold ${isConnected ? 'text-green-500' : 'text-yellow-500'}`}>
                     {isConnected ? 'Stripe Connected' : 'Payouts Pending'}
                   </p>
                </div>
             </div>
             <div className="w-12 h-12 rounded-full bg-[#111] border border-[#1f1f1f] flex items-center justify-center text-gray-500 font-bold">
                {slug.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        {/* The Dashboard Logic */}
        <StudioDashboard slug={slug} initialOrgData={normalizedOrg} />

      </div>
    </div>
  );
}
