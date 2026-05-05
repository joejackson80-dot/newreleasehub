export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre') || 'Top Artists';
    const limit = 20;

    const supabase = await createClient();
    let ranking: any[] = [];

    if (genre === 'Top Artists') {
      const { data: orgs, error } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          slug,
          profile_image_url,
          supporter_count,
          total_streams,
          genres,
          city,
          is_verified,
          is_public
        `)
        .eq('is_public', true)
        .order('supporter_count', { ascending: false })
        .order('total_streams', { ascending: false })
        .limit(limit);

      if (error) throw error;

      ranking = (orgs || []).map(org => ({
        ...org,
        profileImageUrl: org.profile_image_url,
        supporterCount: org.supporter_count,
        totalStreams: org.total_streams,
        isVerified: org.is_verified,
        verifiedScore: Math.min(99, 70 + Math.floor((org.supporter_count || 0) / 10) + Math.min(20, Math.floor((org.total_streams || 0) / 10000)))
      }));
    } else if (genre === 'Rising') {
      const { data: orgs, error } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          slug,
          profile_image_url,
          supporter_count,
          total_streams,
          genres,
          city,
          is_verified,
          is_public,
          created_at
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      ranking = (orgs || []).map(org => ({
        ...org,
        profileImageUrl: org.profile_image_url,
        supporterCount: org.supporter_count,
        totalStreams: org.total_streams,
        isVerified: org.is_verified,
        verifiedScore: Math.min(99, 65 + Math.floor((org.supporter_count || 0) / 5) + Math.min(15, Math.floor((org.total_streams || 0) / 5000)))
      }));
    } else if (genre === 'Top Fans') {
      const { data: fans, error } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          username,
          avatar_url,
          fan_level,
          fan_xp,
          badges
        `)
        .eq('role', 'FAN')
        .order('fan_level', { ascending: false })
        .order('fan_xp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      ranking = (fans || []).map(fan => ({
        ...fan,
        displayName: fan.display_name,
        avatarUrl: fan.avatar_url,
        fanLevel: fan.fan_level,
        fanXP: fan.fan_xp,
      }));
    } else {
      // In Supabase, filtering by an array containing a value uses .contains() or .filter
      // We'll use cs (contains) for the genres array
      const { data: orgs, error } = await supabase
        .from('organizations')
        .select(`
          id,
          name,
          slug,
          profile_image_url,
          supporter_count,
          total_streams,
          genres,
          city,
          is_verified,
          is_public
        `)
        .eq('is_public', true)
        .contains('genres', [genre])
        .order('supporter_count', { ascending: false })
        .order('total_streams', { ascending: false })
        .limit(limit);

      if (error) throw error;

      ranking = (orgs || []).map(org => ({
        ...org,
        profileImageUrl: org.profile_image_url,
        supporterCount: org.supporter_count,
        totalStreams: org.total_streams,
        isVerified: org.is_verified,
        verifiedScore: Math.min(99, 70 + Math.floor((org.supporter_count || 0) / 10) + Math.min(20, Math.floor((org.total_streams || 0) / 10000)))
      }));
    }

    return NextResponse.json({ success: true, ranking });
  } catch (error: any) {
    console.error('Error fetching charts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
