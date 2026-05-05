import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { Users, UserCheck, UserX, Music } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user || user.user_metadata?.role !== 'admin') {
    redirect('/login');
  }
  const supabase = createAdminClient();
  
  // 1. Fetch Supabase Data (DB)
  const [dbFansResult, dbArtistsResult] = await Promise.all([
    supabase.from('users').select('email').order('created_at', { ascending: false }).limit(100),
    supabase.from('organizations').select('email').order('created_at', { ascending: false }).limit(100)
  ]);

  const dbFans = dbFansResult.data || [];
  const dbArtists = dbArtistsResult.data || [];

  // 2. Fetch Supabase Data (Auth)
  const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

  if (authError) {
    return (
      <div className="p-20 text-red-500 font-bold uppercase tracking-widest bg-black min-h-screen">
        CRITICAL ERROR: Failed to fetch identity base. Ensure SUPABASE_SERVICE_ROLE_KEY is configured.
      </div>
    );
  }

  // 3. Match and Audit
  const dbEmails = new Set([
    ...dbFans.map(f => (f.email || '').toLowerCase()),
    ...dbArtists.map(a => (a.email || '').toLowerCase())
  ]);

  const stats = {
    totalAuth: authUsers.length,
    totalFans: dbFans.length,
    totalArtists: dbArtists.length,
    desynced: authUsers.filter(u => !dbEmails.has((u.email || '').toLowerCase())).length
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-8 md:p-20 space-y-12 font-sans">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
             <Users className="w-5 h-5 text-purple-500" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500/80">Ecosystem Base</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Account Matrix.</h1>
          <p className="text-gray-500 text-xs font-medium">Monitoring sync integrity between Supabase Identity and Database Records.</p>
        </div>

        <div className="flex gap-4">
           <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Total Identities</span>
              <span className="text-xl font-black italic">{stats.totalAuth}</span>
           </div>
           <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl px-6 py-4 flex flex-col justify-center border-l-red-500/20">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 text-red-500/60">Desynced</span>
              <span className="text-xl font-black italic text-red-500">{stats.desynced}</span>
           </div>
        </div>
      </header>

      {/* MATRIX TABLE */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] italic">Identity Registry (Auth Service)</h3>
           <div className="flex items-center space-x-4">
              <span className="flex items-center gap-2 text-[9px] font-bold text-green-500/80 uppercase tracking-widest">
                <UserCheck className="w-3 h-3" /> Synced
              </span>
              <span className="flex items-center gap-2 text-[9px] font-bold text-red-500/80 uppercase tracking-widest">
                <UserX className="w-3 h-3" /> Orphaned
              </span>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Role / Metadata</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Sync Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {authUsers.map((user) => {
                const isSynced = dbEmails.has((user.email || '').toLowerCase());
                const role = user.user_metadata?.role || 'unassigned';
                const displayName = user.user_metadata?.name || user.user_metadata?.username || 'No Name';

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-[10px] uppercase">
                          {user.email?.substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{displayName}</span>
                          <span className="text-[10px] font-medium text-gray-600 tracking-tight">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          role === 'artist' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                          role === 'admin' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
                          'border-purple-500/20 text-purple-400 bg-purple-500/5'
                        }`}>
                          {role}
                        </span>
                        {user.user_metadata?.is_artist && (
                          <Music className="w-3 h-3 text-blue-500/60" />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {isSynced ? (
                        <div className="flex items-center gap-2 text-green-500/80 font-bold text-[9px] uppercase tracking-widest">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Synced to DB</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-500/80 font-bold text-[9px] uppercase tracking-widest animate-pulse">
                          <UserX className="w-3.5 h-3.5" />
                          <span>Missing Record</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                       <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                         {new Date(user.created_at).toLocaleDateString()}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Central Command
        </Link>
      </div>
    </div>
  );
}

function ArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  )
}
