import SearchClient from './SearchClient';
import { Suspense } from 'react';

export const metadata = {
  title: 'Network Search | New Release Hub',
  description: 'Search for artists, releases, and opportunities across the NRH network.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black pt-32 text-center text-gray-500 font-bold uppercase tracking-[0.5em] animate-pulse">Initializing Network Search...</div>}>
      <SearchClient />
    </Suspense>
  );
}


