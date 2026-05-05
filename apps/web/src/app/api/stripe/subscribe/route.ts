import { NextResponse } from 'next/server';
import { createSubscriptionSession } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { tier, userId, email } = await req.json();
    const supabase = await createClient();

    const priceId = tier === 'subscriber'
      ? process.env.STRIPE_SUBSCRIBER_PRICE_ID || 'price_1Q_subscriber_placeholder'
      : process.env.STRIPE_SUPPORTER_PRICE_ID || 'price_1Q_SUPPORTER_placeholder';

    let { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .or(`id.eq.${userId || 'null'},email.eq.${email || 'null'}`)
      .maybeSingle();

    if (!dbUser) {
      const adminClient = createAdminClient();
      const { data: newUser, error: createError } = await adminClient
        .from('users')
        .insert({ 
          display_name: userId || email, 
          email: email 
        })
        .select()
        .single();
      
      if (createError) throw createError;
      dbUser = newUser;
    }

    if (!dbUser) throw new Error("User creation failed");

    const session = await createSubscriptionSession(dbUser.id, dbUser.email!, priceId);

    return NextResponse.json({ success: true, checkoutUrl: session.url });
  } catch (error: unknown) {
    console.error('Subscribe POST error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
