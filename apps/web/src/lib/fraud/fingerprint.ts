import FingerprintJS from '@fingerprintjs/fingerprintjs'

let fpPromise: ReturnType<typeof FingerprintJS.load> | null = null

export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === 'undefined') return 'server'
  
  if (!fpPromise) {
    fpPromise = FingerprintJS.load()
  }
  
  const fp = await fpPromise
  if (!fp) return 'unknown'
  const result = await fp.get()
  return result.visitorId // Unique device hash
}


