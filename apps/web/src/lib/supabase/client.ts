import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url === 'your-project-url') {
    console.warn('[Supabase] Missing or placeholder credentials');
    return {} as any;
  }

  return createBrowserClient(url, key)
}
