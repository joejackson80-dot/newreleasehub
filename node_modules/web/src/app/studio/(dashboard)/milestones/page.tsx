import React, { Suspense } from 'react';
import MilestonesClient from './MilestonesClient';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Your Milestones | NRH Studio',
  description: 'Celebrate your growth on New Release Hub.',
};

export default function MilestonesPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight italic uppercase">Your Milestones</h1>
          <p className="text-gray-500 font-medium mt-1">Every milestone is a moment worth sharing.</p>
        </div>

        <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-[#00D2FF] animate-spin" /></div>}>
          <MilestonesClient />
        </Suspense>
      </div>
    </div>
  );
}
