const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

const MUX_API_BASE = 'https://api.mux.com/video/v1'; // Note: Mux Video API handles audio as well

async function muxFetch(path: string, options: any = {}) {
  const auth = Buffer.from(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`).toString('base64');
  const res = await fetch(`${MUX_API_BASE}${path}`, {
    ...options,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Mux API Error: ${JSON.stringify(error)}`);
  }

  return res.json();
}

export async function createStationStream(slug: string) {
  // Check if stream already exists (idempotent)
  const existingStreams = await muxFetch('/live-streams');
  const existing = existingStreams.data.find((s: any) => s.external_id === slug);
  
  if (existing) return existing;

  // Create new stream
  return muxFetch('/live-streams', {
    method: 'POST',
    body: JSON.stringify({
      playback_policy: ['public'],
      new_asset_settings: { playback_policy: ['public'] },
      external_id: slug,
      max_aggregate_duration: 300, // 5 minutes limit for free plan
    }),
  });
}

export async function getStreamStatus(slug: string) {
  const stream = await createStationStream(slug);
  return stream.status; // 'active', 'idle', etc.
}

export async function startStream(slug: string) {
  // Mux streams start automatically when you push data to them via RTMP/SRT
  // This function would return the stream key for the encoder to use
  const stream = await createStationStream(slug);
  return {
    streamKey: stream.stream_key,
    playbackId: stream.playback_ids?.[0]?.id,
  };
}

export async function stopStream(slug: string) {
  // For internet radio, "stopping" usually means the encoder stops pushing
  // But we can signal the DB to update
  const stream = await createStationStream(slug);
  if (stream.id) {
    await muxFetch(`/live-streams/${stream.id}/reset-reconnect`, { method: 'PUT' });
  }
}
