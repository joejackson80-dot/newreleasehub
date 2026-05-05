import { createAdminClient } from '@/lib/supabase/admin';

export class PlaylistEngine {
  private playlistId: string;
  private timer: NodeJS.Timeout | null = null;
  private artistHistory: string[] = []; // Rolling window of last 20 artists
  private albumHistory: string[] = [];  // Rolling window of last 20 albums

  constructor(playlistId: string) {
    this.playlistId = playlistId;
  }

  async start() {
    console.log(`📡 Starting Playlist Engine for ${this.playlistId}`);
    await this.tick();
  }

  async stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private async tick() {
    try {
      const supabase = createAdminClient();
      const { data: playlist, error: pError } = await supabase
        .from('playlists')
        .select('*, stations(*)')
        .eq('id', this.playlistId)
        .maybeSingle();

      if (pError || !playlist || !playlist.track_ids?.length) {
        console.error('Engine Tick - Playlist not found or empty:', pError);
        return;
      }

      const trackId = playlist.track_ids[playlist.current_index];
      
      // Update Station's now_playing_id
      const station = Array.isArray(playlist.stations) ? playlist.stations[0] : playlist.stations;
      if (station) {
        await supabase
          .from('stations')
          .update({ now_playing_id: trackId })
          .eq('id', station.id);
      }

      // Get track duration (default to 3.5 mins if missing)
      const { data: track } = await supabase
        .from('tracks')
        .select('*')
        .eq('id', trackId)
        .single();

      const durationMs = (track?.duration || 210) * 1000;

      console.log(`🎵 Now Playing on ${station?.name || 'Unknown'}: ${track?.title || 'Unknown'} (Duration: ${durationMs / 1000}s)`);

      // Schedule next track
      this.timer = setTimeout(async () => {
        await this.next();
      }, durationMs);

    } catch (error) {
      console.error('Engine Tick Error:', error);
      // Retry in 10s
      this.timer = setTimeout(() => this.tick(), 10000);
    }
  }

  async next() {
    const supabase = createAdminClient();
    const { data: playlist, error: pError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', this.playlistId)
      .single();

    if (pError || !playlist) return;

    let nextIndex = (playlist.current_index || 0) + 1;
    if (nextIndex >= (playlist.track_ids?.length || 0)) {
      nextIndex = 0; // Loop
    }

    // Performance Complement Check
    const trackId = playlist.track_ids?.[nextIndex];
    if (trackId) {
      const { data: track } = await supabase
        .from('tracks')
        .select('*')
        .eq('id', trackId)
        .single();
      
      if (track) {
        const artistCount = this.artistHistory.filter(id => id === track.organization_id).length;
        const albumCount = this.albumHistory.filter(id => id === track.release_id).length;

        if (artistCount >= 4 || albumCount >= 3) {
          console.log(`⚠️ Rule Violation: Skipping ${track.title} by ${track.organization_id}`);
        }

        this.artistHistory.push(track.organization_id);
        this.albumHistory.push(track.release_id || 'unknown');
        
        if (this.artistHistory.length > 20) this.artistHistory.shift();
        if (this.albumHistory.length > 20) this.albumHistory.shift();
      }
    }

    await supabase
      .from('playlists')
      .update({ current_index: nextIndex })
      .eq('id', this.playlistId);

    await this.tick();
  }
}
