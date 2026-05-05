export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${process.env.NEXT_PUBLIC_APP_URL || 'https://newreleasehub.com'}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
