import React, { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Secure Checkout | New Release Hub',
  description: 'Complete your revenue participation license and support your favorite artists.',
};

function CheckoutLoader() {
  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-[#00D2FF] animate-spin" />
      <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing Secure Vault...</p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoader />}>
      <CheckoutClient />
    </Suspense>
  );
}


