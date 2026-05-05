export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, trackId } = body;

    if (!userId || !trackId) {
      return NextResponse.json({ error: 'Missing userId or trackId' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('crate')
      .eq('id', userId)
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let updatedCrate = Array.isArray(user.crate) ? [...user.crate] : [];
    if (updatedCrate.includes(trackId)) {
      updatedCrate = updatedCrate.filter(id => id !== trackId);
    } else {
      updatedCrate.push(trackId);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ crate: updatedCrate })
      .eq('id', userId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, isLiked: updatedCrate.includes(trackId) });
  } catch (error: unknown) {
    console.error('Crate update error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ crate: [] });
  }
  
  try {
     const supabase = createAdminClient();
     const { data: user, error } = await supabase
       .from('users')
       .select('crate')
       .eq('id', userId)
       .maybeSingle();

     if (error) throw error;
     return NextResponse.json({ crate: user?.crate || [] });
  } catch (error: unknown) {
     console.error('Crate fetch error:', error);
     return NextResponse.json({ crate: [] });
  }
}
