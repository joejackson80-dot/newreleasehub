import { createClient } from '@/lib/supabase/server';

export async function auth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      role: user.user_metadata?.role || 'fan',
      username: user.user_metadata?.username
    },
    expires: new Date(Date.now() + 3600 * 1000).toISOString() // Mock expiry
  };
}

export const signIn = () => {
  throw new Error('signIn from @/auth is deprecated. Use supabase.auth.signInWithPassword instead.');
};

export const signOut = () => {
  throw new Error('signOut from @/auth is deprecated. Use supabase.auth.signOut instead.');
};
