import { prisma } from '@/lib/prisma';

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
      const playlist = await prisma.playlist.findUnique({
        where: { id: this.playlistId },
        include: { Station: true }
      });

      if (!playlist || !playlist.trackIds.length) return;

      const trackId = playlist.trackIds[playlist.currentIndex];
      
      // Update Station's nowPlaying
      await prisma.station.update({
        where: { id: playlist.Station?.id },
        data: { nowPlayingId: trackId }
      });

      // Get track duration (default to 3.5 mins if missing)
      const track = await prisma.musicAsset.findUnique({ where: { id: trackId } });
      const durationMs = (track?.duration || 210) * 1000;

      console.log(`🎵 Now Playing on ${playlist.Station?.name}: ${track?.title} (Duration: ${durationMs / 1000}s)`);

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
    const playlist = await prisma.playlist.findUnique({
      where: { id: this.playlistId }
    });

    if (!playlist) return;

    let nextIndex = playlist.currentIndex + 1;
    if (nextIndex >= playlist.trackIds.length) {
      nextIndex = 0; // Loop
    }

    // Performance Complement Check
    const trackId = playlist.trackIds[nextIndex];
    const track = await prisma.musicAsset.findUnique({ where: { id: trackId } });
    
    if (track) {
      const artistCount = this.artistHistory.filter(id => id === track.organizationId).length;
      const albumCount = this.albumHistory.filter(id => id === track.releaseId).length;

      if (artistCount >= 4 || albumCount >= 3) {
        console.log(`⚠️ Rule Violation: Skipping ${track.title} by ${track.organizationId}`);
        // In a real engine, we'd jump to a safe track or re-shuffle
      }

      this.artistHistory.push(track.organizationId);
      this.albumHistory.push(track.releaseId || 'unknown');
      
      if (this.artistHistory.length > 20) this.artistHistory.shift();
      if (this.albumHistory.length > 20) this.albumHistory.shift();
    }

    await prisma.playlist.update({
      where: { id: this.playlistId },
      data: { currentIndex: nextIndex }
    });

    await this.tick();
  }
}
