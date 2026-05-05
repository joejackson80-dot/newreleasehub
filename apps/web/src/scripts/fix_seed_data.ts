import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the web app directory
dotenv.config({ path: join(__dirname, '../../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log('--- STARTING FORENSIC DATA CORRECTION (SUPABASE) ---');

  // 2.1 — Marcus Webb Profile
  console.log('Updating Marcus Webb...');
  const { data: marcus } = await supabase
    .from('organizations')
    .update({ supporter_count: 2140 })
    .eq('slug', 'marcus-webb')
    .select()
    .single();

  if (marcus) {
    const { data: marcusReleases } = await supabase
      .from('releases')
      .select('id')
      .eq('organization_id', marcus.id)
      .order('created_at', { ascending: true });

    if (marcusReleases && marcusReleases[0]) {
      await supabase.from('releases').update({ title: 'Midnight in Atlanta', type: 'album' }).eq('id', marcusReleases[0].id);
    }
    if (marcusReleases && marcusReleases[1]) {
      await supabase.from('releases').update({ title: 'Worth It (feat. Nova Rae)', type: 'single' }).eq('id', marcusReleases[1].id);
    }
    if (marcusReleases && marcusReleases[2]) {
      await supabase.from('releases').update({ title: 'The Comeback EP', type: 'ep' }).eq('id', marcusReleases[2].id);
    }
  }
  console.log('✓ Marcus Webb updated');

  // 2.2 — Joe Jack Profile
  console.log('Updating Joe Jack...');
  const { data: joejack } = await supabase
    .from('organizations')
    .update({
      name: 'I Am Joe Jack',
      genres: ['Hip-Hop', 'Soul'],
      city: 'Omaha',
      country: 'US',
      bio: `Independent Hip-Hop artist from Omaha, Nebraska.\nOwner of Game Spittin Entertainment.\nMaking real music for real people.`
    })
    .eq('slug', 'iamjoejack')
    .select()
    .single();

  if (joejack) {
    const { data: joeReleases } = await supabase
      .from('releases')
      .select('*')
      .eq('organization_id', joejack.id);

    for (const r of (joeReleases || [])) {
      if (r.title.toLowerCase().includes('demo') || r.title.toLowerCase().includes('demo set')) {
        await supabase.from('releases').update({ title: 'Game Spittin Vol. 1', type: 'ep' }).eq('id', r.id);
      }
    }

    if ((joeReleases || []).length < 3) {
      await supabase.from('releases').insert([
        {
          organization_id: joejack.id,
          title: 'Worth It (feat. Nova Rae)',
          type: 'single',
          cover_art_url: '/images/default-cover.png',
        },
        {
          organization_id: joejack.id,
          title: 'The Comeback EP',
          type: 'ep',
          cover_art_url: '/images/default-cover.png',
        }
      ]);
    }
  }
  console.log('✓ Joe Jack updated');

  // 2.3 — Hellz Flame Profile
  console.log('Updating Hellz Flame...');
  await supabase
    .from('organizations')
    .update({ city: 'Omaha', country: 'US' })
    .eq('slug', 'hellz-flame');
  console.log('✓ Hellz Flame updated');

  // 2.4 — Hide placeholder artists
  console.log('Hiding placeholder artists...');
  const { error: hideError } = await supabase
    .from('organizations')
    .update({ is_public: false })
    .ilike('name', 'Founding Artist%');
  
  if (hideError) console.error('Error hiding artists:', hideError);
  console.log(`✓ Hid placeholder artists`);

  // Group 3 — Opportunity Board Poster Names
  console.log('Updating Opportunity Board posters...');
  await supabase.from('opportunities').update({ poster_name: 'Meridian Films' }).ilike('title', '%Commercial Spot%');
  await supabase.from('opportunities').update({ poster_name: 'DJ Solarize' }).ilike('title', '%R&B Vocalist%');
  await supabase.from('opportunities').update({ poster_name: 'Black Music Foundation' }).ilike('title', '%Creator Fund%');
  await supabase.from('opportunities').update({ poster_name: 'The Hollow Venue' }).ilike('title', '%Opening Act%');
  await supabase.from('opportunities').update({ poster_name: 'Resonance Gaming Studios' }).ilike('title', '%Netflix%');
  console.log('✓ Opportunity board updated');

  console.log('--- FORENSIC DATA CORRECTION COMPLETE ---');
}

main().catch((e) => { console.error(e); process.exit(1); });
