import { createClient as createServer } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function logout() {
  const supabase = await createServer();
  await supabase.auth.signOut();
}

export async function getCurrentSession() {
  const session = await auth();
  if (!session) return null;
  
  // Return in the format expected by the legacy Navbar and other components
  return {
    type: session.user.role === 'artist' ? 'artist' : 'fan',
    data: {
      name: session.user.name,
      email: session.user.email
    }
  };
}
