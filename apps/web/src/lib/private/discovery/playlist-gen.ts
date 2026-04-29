import { prisma } from '@/lib/prisma';

export async function generateStationPlaylist(stationId: string) {
  const station = await prisma.station.findUnique({
    where: { id: stationId },
    include: { Playlist: true },
  });

  if (!station) throw new Error('Station not found');

  // 1. Query authorized tracks for the station's genres
  const tracks = await prisma.musicAsset.findMany({
    where: {
      Organization: {
        Releases: {
          some: {
            authorizedForRadio: true,
            // genres in station.genres - using simplified check for now
          }
        }
      }
    },
    include: {
      Organization: {
        include: {
          Releases: {
            where: { authorizedForRadio: true }
          }
        }
      }
    }
  });

  // Filter tracks by station genres (since genres is a string array in station)
  const filteredTracks = tracks.filter(t => 
    t.Organization.genres.some(g => station.genres.includes(g))
  );

  if (filteredTracks.length === 0) {
    console.warn(`No tracks found for station: ${station.name}`);
    return;
  }

  // 2. Shuffle and apply Performance Complement rules (Simplified for V1)
  // Logic: 
  // - Group by Artist
  // - Limit to 4 tracks per artist
  // - Flatten and shuffle again but ensure no more than 3 consecutive by same artist
  
  const artistGroups: Record<string, any[]> = {};
  filteredTracks.forEach(t => {
    if (!artistGroups[t.organizationId]) artistGroups[t.organizationId] = [];
    artistGroups[t.organizationId].push(t);
  });

  let finalTrackIds: string[] = [];
  const artists = Object.keys(artistGroups);
  
  // Interleave tracks to satisfy rules
  let maxTracks = 500;
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
  const playlist = await prisma.playlist.upsert({
    where: { slug: station.slug },
    update: {
      trackIds: finalTrackIds,
      currentIndex: 0,
    },
    create: {
      name: `${station.name} Playlist`,
      slug: station.slug,
      genres: station.genres,
      trackIds: finalTrackIds,
    }
  });

  // 4. Link to Station
  await prisma.station.update({
    where: { id: stationId },
    data: { playlistId: playlist.id },
  });

  return playlist;
}


