import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspectSchema() {
  console.log('--- INSPECTING SCHEMA ---');
  
  // Try to get one row to see columns
  const { data: orgs, error: orgError } = await supabase.from('organizations').select('*').limit(1);
  if (orgError) {
    console.error('Error fetching organizations:', orgError);
  } else if (orgs.length > 0) {
    console.log('Organizations columns:', Object.keys(orgs[0]));
  } else {
    console.log('Organizations table is empty.');
  }
  
  const { data: userData, error: userError } = await supabase.from('users').select('*').limit(1);
  if (userError) {
     console.error('Error fetching users:', userError);
  } else if (userData.length > 0) {
     console.log('Users columns:', Object.keys(userData[0]));
  } else {
     console.log('Users table is empty.');
  }

  // Also check for 'artists' or 'profiles'
  const { data: artists, error: artistError } = await supabase.from('artists').select('*').limit(1);
  if (!artistError && artists.length > 0) {
    console.log('Artists columns:', Object.keys(artists[0]));
  } else if (artistError) {
    console.log('Artists table error:', artistError.message);
  }
}

inspectSchema();
