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
            backgroundColor: '#070707',
            backgroundImage: 'radial-gradient(circle at center, rgba(29, 158, 117, 0.15) 0%, #070707 100%)',
            color: 'white',
            padding: '40px',
            fontFamily: 'Arial',
            position: 'relative',
          },
          children: [
            {
              type: 'div',
              props: {
                style: { position: 'absolute', top: '60px', left: '60px', fontSize: '32px', fontWeight: 'bold', color: '#1D9E75' },
                children: 'NRH'
              }
            },
            {
              type: 'img',
              props: {
                src: artist.profileImageUrl || 'https://www.newreleasehub.com/placeholder-artist.png',
                style: { width: '240px', height: '240px', borderRadius: '120px', marginBottom: '40px', border: '6px solid #1D9E75', objectFit: 'cover' }
              }
            },
            {
              type: 'div',
              props: {
                style: { fontSize: '56px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' },
                children: artist.name
              }
            },
            {
              type: 'div',
              props: {
                style: { fontSize: '80px', fontWeight: 'bold', color: '#1D9E75', marginBottom: '10px', textAlign: 'center' },
                children: milestoneLabel
              }
            },
            {
              type: 'div',
              props: {
                style: { fontSize: '32px', color: '#888', textTransform: 'uppercase', letterSpacing: '2px' },
                children: 'Milestone Achieved'
              }
            },
            {
              type: 'div',
              props: {
                style: { position: 'absolute', bottom: '60px', right: '60px', fontSize: '24px', color: '#444' },
                children: 'newreleasehub.com'
              }
            }
          ]
        }
      },
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
    const { data, error } = await supabase.storage
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
