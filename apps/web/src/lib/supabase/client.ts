import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key || url === 'your-project-url') {
    console.warn('[Supabase] Missing or placeholder credentials — OAuth and DB calls will be no-ops.');
    const notConfigured = new Error('Supabase not configured');
    return {
      auth: {
        signInWithOAuth: async () => ({ data: null, error: notConfigured }),
        signInWithPassword: async () => ({ data: null, error: notConfigured }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(url, key)
}
