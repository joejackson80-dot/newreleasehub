import { getDeviceFingerprint } from '@/lib/fraud/fingerprint'

let interactionSignals = {
  hadMouseMovement: false,
  hadKeyboardInput: false,
  wasTabVisible: false,
  wasAudioMuted: false,
}

// Track user interactions during playback
function setupInteractionTracking() {
  let mouseMoved = false
  let keyPressed = false
  
  const onMouseMove = () => { mouseMoved = true }
  const onKeyDown = () => { keyPressed = true }
  
  if (typeof document !== 'undefined') {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('keydown', onKeyDown)
  }
  
  // Check every 10 seconds during playback
  const interval = setInterval(() => {
    if (mouseMoved) interactionSignals.hadMouseMovement = true
    if (keyPressed) interactionSignals.hadKeyboardInput = true
    if (typeof document !== 'undefined' && !document.hidden) interactionSignals.wasTabVisible = true
    
    // Check if audio element is muted
    if (typeof document !== 'undefined') {
      const audioEl = document.querySelector('audio')
      if (audioEl && !audioEl.muted) {
        interactionSignals.wasAudioMuted = false
      } else {
        interactionSignals.wasAudioMuted = true
      }
    }
    
    mouseMoved = false
    keyPressed = false
  }, 10000)
  
  return () => {
    clearInterval(interval)
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('keydown', onKeyDown)
    }
  }
}

export async function startStreamPlay(trackId: string, artistId: string) {
  const deviceId = await getDeviceFingerprint()
  
  const cleanup = setupInteractionTracking()
  
  // Call API to create StreamPlay record
  try {
    const response = await fetch('/api/stream/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackId,
        artistId,
        deviceId,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      })
    })
    
    const { streamPlayId } = await response.json()
    
    // After 30 seconds, mark as counted (if still playing)
    const countTimeout = setTimeout(async () => {
      await fetch('/api/stream/count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          streamPlayId,
          interactionSignals,
        })
      })
    }, 30000)

    return { streamPlayId, cleanup: () => { cleanup(); clearTimeout(countTimeout); } }
  } catch (err) {
    console.error('Failed to start stream play tracking', err)
    return { streamPlayId: null, cleanup }
  }
}
