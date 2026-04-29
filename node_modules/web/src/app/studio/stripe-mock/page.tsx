'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function StripeMockSuccess() {
  const router = useRouter();
  const [status, setStatus] = useState<'processing' | 'success'>('processing');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
      // In a real app, we'd update the DB here via an API call
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl">
        {status === 'processing' ? (
          <>
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-[#00D2FF] animate-spin" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold uppercase italic tracking-tighter">Connecting<br />Stripe...</h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Verifying your account details with Stripe Secure. This will only take a second.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto border border-green-500/20">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold uppercase italic tracking-tighter text-green-500">Connected<br />Successfully.</h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Your artist account is now linked to Stripe. You can now accept support and receive streaming royalties.
              </p>
            </div>
            <button 
              onClick={() => router.push('/studio/customize')}
              className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl"
            >
              Return to Studio
            </button>
          </>
        )}
      </div>
    </div>
  );
}


