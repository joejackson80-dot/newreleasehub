export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // 1. Create Organizations
    const artists = [
      {
        slug: 'hellz-flame',
        name: 'Hellz Flame',
        bio: 'The hottest underground live music experience. Own the master, own the moment.',
      },
      {
        slug: 'vibe-master',
        name: 'Vibe Master',
        bio: 'Chill beats and visual journeys. Join the support movement.',
      }
    ];

    const results: { org: unknown; track: unknown }[] = [];

    for (const artist of artists) {
      const { data: org } = await supabase
        .from('organizations')
        .upsert({
          slug: artist.slug,
          name: artist.name,
          bio: artist.bio,
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (org) {
        // 2. Create a track for each
        const { data: track } = await supabase
          .from('tracks')
          .upsert({
            id: `asset-${org.slug}`,
            organization_id: org.id,
            title: 'The Debut Master Collection',
            audio_url: '/music/its-not-your-fault-hellz-flame.mp3',
            allocated_license_bps: 0,
          }, { onConflict: 'id' })
          .select()
          .single();

        // 3. Create a Session Deck for each
        await supabase
          .from('session_decks')
          .upsert({
            organization_id: org.id,
            active_track_title: 'Initializing First Set...',
            is_playing: false,
            background_url: '/backgrounds/cyberpunk.png'
          }, { onConflict: 'organization_id' });

        results.push({ org, track });
      }
    }

    // 4. Create Demo Fan (johndoe)
    const { data: demoFan } = await supabase
      .from('users')
      .upsert({
        username: 'johndoe',
        email: 'johndoe@example.com',
        display_name: 'John Doe',
        password_hash: '$2a$10$7R6v7v7v7v7v7v7v7v7v7ue',
        role: 'FAN',
        fan_level: 5,
        fan_xp: 1250,
      }, { onConflict: 'username' })
      .select()
      .single();

    // 5. Create Demo Artist (iamjoejack)
    const { data: demoArtist } = await supabase
      .from('organizations')
      .upsert({
        username: 'iamjoejack',
        email: 'joe@example.com',
        name: 'Joe Jackson',
        slug: 'iamjoejack',
        password_hash: '$2a$10$7R6v7v7v7v7v7v7v7v7v7ue',
        is_verified: true,
        bio: 'The architect of the New Release Hub sound. Join the inner circle.',
      }, { onConflict: 'username' })
      .select()
      .single();

    if (demoArtist && demoFan) {
      // 6. Connect them
      await supabase
        .from('followers')
        .upsert({
          organization_id: demoArtist.id,
          user_id: demoFan.id
        }, { onConflict: 'organization_id,user_id' });

      // 9. Add Forensic Fraud Data
      await supabase.from('fraud_incidents').insert({
        artist_id: demoArtist.id,
        type: 'BOT_ATTACK',
        details: 'Anomalous stream spike from datacenter cluster in Frankfurt.',
        month: new Date().toISOString(),
        excluded_stream_count: 12400,
        status: 'PENDING'
      });

      const { data: tracks } = await supabase
        .from('tracks')
        .select('id')
        .eq('organization_id', demoArtist.id)
        .limit(1);

      if (tracks && tracks[0]) {
        // Create a cluster of suspicious streams
        const fakeIP = '45.12.34.88';
        const streams: { track_id: string; artist_id: string; ip_address: string; device_id: string; fraud_score: number; is_excluded_from_pool: boolean; flag_reason: string }[] = [];
        for (let i = 0; i < 20; i++) {
          streams.push({
            track_id: tracks[0].id,
            artist_id: demoArtist.id,
            ip_address: fakeIP,
            device_id: 'bot-node-alpha',
            fraud_score: 0.05,
            is_excluded_from_pool: true,
            flag_reason: 'HIGH_VELOCITY_IP',
          });
        }
        await supabase.from('stream_plays').insert(streams);
      }
    }

    // 10. Add Historical Royalty Pool
    await supabase
      .from('monthly_pools')
      .upsert({
        month: 4,
        year: 2026,
        pool_a_total: 100000000,
        pool_c_total: 24850000,
        status: 'PAID',
        calculated_at: new Date().toISOString(),
      }, { onConflict: 'month,year' });

    return NextResponse.json({ success: true, results, demo: { fan: demoFan, artist: demoArtist } });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
