import React from 'react';
import Link from 'next/link';

export default function PlaceholderPage({ params }: { params?: any }) {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans selection:bg-white selection:text-black">
      <div className="text-center space-y-6 max-w-lg">
         <h1 className="text-5xl font-bold tracking-tighter italic uppercase">Coming Soon.</h1>
         <p className="text-gray-500 font-medium leading-relaxed">
            We're building something great. Questions? Email{' '}
            <a href="mailto:info@newreleasehub.com" className="text-white hover:text-[#F1F5F9] transition-colors">
               info@newreleasehub.com
            </a>
         </p>
         <div className="pt-8">
            <Link href="/" className="btn-outline border-white text-white hover:bg-white hover:text-black">
               Back to Home
            </Link>
         </div>
      </div>
    </div>
  );
}


