'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, AlertCircle, ArrowLeft } from 'lucide-react';

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bidId = searchParams.get('bid');

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-8 text-center selection:bg-white selection:text-black">
      <div className="max-w-md w-full space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-center">
          <div className="bg-red-500/10 p-6 rounded-full border border-red-500/20">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight italic text-red-500">Payment Cancelled.</h1>
          <p className="text-gray-500 text-sm leading-relaxed font-medium">
            No funds were captured. Your participation bid remains pending but requires payment to be activated.
          </p>
        </div>

        <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center space-x-4 backdrop-blur-xl">
          <AlertCircle className="w-5 h-5 text-gray-700" />
          <p className="text-[10px] font-bold text-gray-700 text-left uppercase tracking-widest leading-relaxed">
            If this was a mistake, you can try placing the bid again from the Live Theater stage.
          </p>
        </div>

        <div className="pt-8">
          <button 
            onClick={() => router.back()}
            className="group flex items-center space-x-2 mx-auto px-10 py-4 rounded-full bg-white text-black font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back to Stage</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancel() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.5em] text-gray-700">Reverting State...</div>}>
      <CheckoutCancelContent />
    </Suspense>
  );
}


