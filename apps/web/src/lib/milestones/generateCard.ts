import satori from 'satori'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import fs from 'fs/promises'

export async function generateMilestoneCard(artistId: string, milestoneType: string): Promise<string | null> {
  try {
    // 1. Fetch artist data
    const artist = await prisma.organization.findUnique({
      where: { id: artistId },
      select: { name: true, profileImageUrl: true }
    })
    if (!artist) return null

    // Load Resvg dynamically to avoid Turbopack issues
    const { Resvg } = await import('@resvg/resvg-js')

    // 2. Load font (using system Arial on Windows)
    const fontPath = 'C:\\Windows\\Fonts\\arial.ttf'
    const fontData = await fs.readFile(fontPath)

    // 3. Define the card design (SVG via Satori)
    const milestoneLabel = milestoneType.replace(/_/g, ' ')
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#020202',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #111 0%, #020202 100%)',
            color: 'white',
            padding: '80px',
            fontFamily: 'Arial',
            position: 'relative',
            border: '20px solid #111',
          },
          children: [
            // Background Glows
            {
              type: 'div',
              props: {
                style: { position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', backgroundColor: '#1D9E75', opacity: 0.1, borderRadius: '100%', filter: 'blur(100px)' }
              }
            },
            {
              type: 'div',
              props: {
                style: { position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', backgroundColor: '#A855F7', opacity: 0.1, borderRadius: '100%', filter: 'blur(100px)' }
              }
            },
            // Header
            {
              type: 'div',
              props: {
                style: { position: 'absolute', top: '80px', left: '80px', display: 'flex', alignItems: 'center', gap: '15px' },
                children: [
                  { type: 'div', props: { style: { width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '10px' } } },
                  { type: 'div', props: { style: { fontSize: '24px', fontWeight: 'bold', letterSpacing: '4px' }, children: 'NEW RELEASE HUB' } }
                ]
              }
            },
            {
              type: 'div',
              props: {
                style: { position: 'absolute', top: '80px', right: '80px', fontSize: '18px', fontWeight: 'bold', color: '#555', letterSpacing: '2px' },
                children: 'PROTOCOL VERIFIED'
              }
            },
            // Main Content Container
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
                children: [
                  // Artist Image with Glow
                  {
                    type: 'div',
                    props: {
                      style: { position: 'relative', marginBottom: '60px' },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: { position: 'absolute', inset: '-10px', backgroundColor: '#1D9E75', borderRadius: '140px', opacity: 0.3, filter: 'blur(20px)' }
                          }
                        },
                        {
                          type: 'img',
                          props: {
                            src: artist.profileImageUrl || '/images/default-avatar.png',
                            style: { width: '260px', height: '260px', borderRadius: '130px', border: '8px solid #000', objectFit: 'cover', position: 'relative' }
                          }
                        }
                      ]
                    }
                  },
                  // Achievement Text
                  {
                    type: 'div',
                    props: {
                      style: { fontSize: '18px', fontWeight: 'bold', color: '#1D9E75', textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '20px' },
                      children: 'NETWORK ACHIEVEMENT'
                    }
                  },
                  {
                    type: 'div',
                    props: {
                      style: { fontSize: '90px', fontWeight: 'bold', textAlign: 'center', lineHeight: 1, marginBottom: '20px', fontStyle: 'italic', textTransform: 'uppercase' },
                      children: milestoneLabel
                    }
                  },
                  {
                    type: 'div',
                    props: {
                      style: { width: '100px', height: '4px', backgroundColor: 'white', marginBottom: '30px' }
                    }
                  },
                  {
                    type: 'div',
                    props: {
                      style: { fontSize: '42px', fontWeight: 'bold', color: '#888' },
                      children: artist.name
                    }
                  }
                ]
              }
            },
            // Footer Seal
            {
              type: 'div',
              props: {
                style: { position: 'absolute', bottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
                children: [
                  { type: 'div', props: { style: { fontSize: '12px', color: '#444', fontWeight: 'bold', letterSpacing: '4px', marginBottom: '5px' }, children: 'AUTHORIZED BY NRH GOVERNANCE' } },
                  { type: 'div', props: { style: { fontSize: '10px', color: '#222', fontWeight: 'bold' }, children: `ID: ${artistId.slice(0, 8)}-${Date.now().toString(16).slice(-8)}` } }
                ]
              }
            }
          ]
        }
      } as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- Satori's React-like DSL doesn't strictly match standard ReactNode types
      {
        width: 1080,
        height: 1080,
        fonts: [
          {
            name: 'Arial',
            data: fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    )

    // 4. Render SVG to PNG
    const resvg = new Resvg(svg)
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    // 5. Upload to Supabase
    const fileName = `milestone-cards/${artistId}/${milestoneType}.png`
    const { error } = await supabase.storage
      .from('milestones')
      .upload(fileName, pngBuffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (error) {
      console.error('Error uploading milestone card:', error)
      // If upload fails, we still return the path if we want to retry or just log
      return null
    }

    // 6. Return public URL
    const { data: { publicUrl } } = supabase.storage
      .from('milestones')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Failed to generate milestone card:', error)
    return null
  }
}


