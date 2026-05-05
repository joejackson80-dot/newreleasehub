import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CheckoutContent from './CheckoutContent';

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login if not authenticated, returning to checkout after login
    redirect('/login?redirectTo=/checkout');
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#A855F7] animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
