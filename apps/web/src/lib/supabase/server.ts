import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url === 'your-project-url') {
    // Fully chainable no-op mock — supports .select().eq().order().limit() etc.
    const terminal = async () => ({ data: null, error: null });
    const builder: Record<string, unknown> = {};
    const chainMethods = [
      'select','insert','update','upsert','delete',
      'eq','neq','gt','gte','lt','lte','like','ilike',
      'is','in','contains','containedBy','or','and','not',
      'filter','match','order','limit','range','returns',
      'throwOnError','csv',
    ];
    chainMethods.forEach(m => { builder[m] = () => builder; });
    builder.single = terminal;
    builder.maybeSingle = terminal;
    builder.then = (resolve: (v: { data: null; error: null }) => void) =>
      Promise.resolve({ data: null, error: null }).then(resolve);
    return {
      auth: { getUser: async () => ({ data: { user: null } }) },
      from: () => builder,
      rpc: () => builder,
    } as any;
  }

  const cookieStore = await cookies()
  return createServerClient(url, key, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // This is likely a Server Component trying to set cookies
          }
        },
      },
    }
  )
}
