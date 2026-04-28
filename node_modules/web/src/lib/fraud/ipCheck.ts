export async function checkIPReputation(ip: string): Promise<{
  isDatacenter: boolean
  country: string
  isp: string
}> {
  // If no API key, return default (don't break during dev)
  if (!process.env.IPHUB_API_KEY) {
    return { isDatacenter: false, country: 'UNKNOWN', isp: 'LOCAL' }
  }

  try {
    const response = await fetch(`http://v2.api.iphub.info/ip/${ip}`, {
      headers: { 'X-Key': process.env.IPHUB_API_KEY! }
    })
    
    const data = await response.json()
    
    return {
      isDatacenter: data.block === 1, // 1 = hosting/proxy/VPN
      country: data.countryCode || 'UNKNOWN',
      isp: data.isp || 'UNKNOWN',
    }
  } catch (error) {
    console.error('IPHub check failed:', error)
    // Fail open — don't block if service is down
    return { isDatacenter: false, country: 'UNKNOWN', isp: 'UNKNOWN' }
  }
}
