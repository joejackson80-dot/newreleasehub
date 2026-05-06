'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(239,68,68,0.05)_0%,_transparent_60%)]" />
      </div>
      <div className="relative z-10 text-center space-y-8 max-w-lg">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">System Error</p>
        <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none">
          Static<br />
          <span className="text-red-500">Drop.</span>
        </h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          Something went wrong on our end. The session couldn&apos;t load. Try again or return to the hub.
        </p>
        {process.env.NODE_ENV === 'development' && error?.message && (
          <pre className="text-left text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4 overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={reset}
            className="px-8 py-4 rounded-xl bg-white text-black font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gray-200 transition-all"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
          >
            Back to Hub
          </a>
        </div>
      </div>
    </div>
  );
}
