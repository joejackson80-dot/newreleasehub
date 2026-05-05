import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isReady = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your-project-url';

// Build-safe singleton client using Proxy
const createMock = () => {
  const mock: unknown = new Proxy(() => {}, {
    get: (target, prop) => {
      if (prop === 'then') return undefined;
      return mock;
    },
    apply: () => Promise.resolve({ data: null, error: null })
  });
  return mock as any;
};

export const supabase = isReady 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMock();
