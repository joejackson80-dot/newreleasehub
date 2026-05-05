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

async function testAuthSync() {
  console.log('--- STARTING AUTH SYNC PROOF ---');
  const testEmail = `test_user_${Date.now()}@newreleasehub.com`;
  const testUsername = `test_v${Date.now().toString().slice(-4)}`;

  console.log(`Attempting to create user: ${testEmail}`);

  // 1. Create in Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'Password123!',
    email_confirm: true,
    user_metadata: { username: testUsername, role: 'fan' }
  });

  if (authError) {
    console.error('❌ Auth Creation Failed:', authError.message);
    return;
  }
  console.log(`✅ Supabase Auth User Created: ${authUser.user.id}`);

  // 2. Create in public.users (Simulating the API logic I wrote)
  const { error: dbError } = await supabase
    .from('users')
    .insert({
      id: authUser.user.id,
      username: testUsername,
      email: testEmail,
      display_name: 'Test Verification User'
    });

  if (dbError) {
    console.error('❌ Database Sync Failed:', dbError.message);
    await supabase.auth.admin.deleteUser(authUser.user.id);
    return;
  }
  console.log('✅ Public Database Record Created');

  // 3. Final Verification: Query the public.users table
  const { data: verifiedUser, error: verifyError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.user.id)
    .single();

  if (verifyError || !verifiedUser) {
    console.error('❌ Final Verification Failed: User not found in DB');
  } else {
    console.log('--- TEST SUCCESSFUL ---');
    console.log('Verified Database Entry:');
    console.table({
      id: verifiedUser.id,
      username: verifiedUser.username,
      email: verifiedUser.email,
      created_at: verifiedUser.created_at
    });
  }

  // Cleanup
  await supabase.auth.admin.deleteUser(authUser.user.id);
  console.log('\nTest user cleaned up.');
}

testAuthSync();
