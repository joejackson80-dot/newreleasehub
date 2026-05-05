import { createAdminClient } from '@/lib/supabase/admin';

export async function generateStationPlaylist(stationId: string) {
  const supabase = createAdminClient();

  const { data: station, error: sError } = await supabase
    .from('stations')
    .select('*, playlists(*)')
    .eq('id', stationId)
    .maybeSingle();

  if (sError || !station) throw new Error('Station not found');

  // 1. Query authorized tracks for the station's genres
  // We fetch tracks where the organization has radio-authorized releases
  const { data: tracks, error: tError } = await supabase
    .from('tracks')
    .select(`
      *,
      organizations!inner(
        *,
        releases!inner(*)
      )
    `)
    .eq('organizations.releases.authorized_for_radio', true);

  if (tError) {
    console.error('Error fetching tracks for playlist:', tError);
    return;
  }

  // Filter tracks by station genres
  const filteredTracks = (tracks || []).filter((t: any) => 
    (t.organizations.genres || []).some((g: string) => (station.genres || []).includes(g))
  );

  if (filteredTracks.length === 0) {
    console.warn(`No tracks found for station: ${station.name}`);
    return;
  }

  // 2. Shuffle and apply rules
  const artistGroups: Record<string, any[]> = {};
  filteredTracks.forEach((t: any) => {
    if (!artistGroups[t.organization_id]) artistGroups[t.organization_id] = [];
    artistGroups[t.organization_id].push(t);
  });

  const finalTrackIds: string[] = [];
  const artists = Object.keys(artistGroups);
  
  const maxTracks = 500;
  let addedCount = 0;
  
  while (addedCount < maxTracks && artists.length > 0) {
    for (let i = 0; i < artists.length; i++) {
      const artistId = artists[i];
      const track = artistGroups[artistId].shift();
      if (track) {
        finalTrackIds.push(track.id);
        addedCount++;
      } else {
        artists.splice(i, 1);
        i--;
      }
      if (addedCount >= maxTracks) break;
    }
  }

  // 3. Upsert Playlist
  const { data: playlist, error: pError } = await supabase
    .from('playlists')
    .upsert({
      name: `${station.name} Playlist`,
      slug: station.slug,
      genres: station.genres,
      track_ids: finalTrackIds,
      current_index: 0,
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (pError || !playlist) {
    console.error('Error upserting playlist:', pError);
    return;
  }

  // 4. Link to Station
  await supabase
    .from('stations')
    .update({ playlist_id: playlist.id })
    .eq('id', stationId);

  return playlist;
}
