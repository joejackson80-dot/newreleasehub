import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(168,85,247,0.06)_0%,_transparent_60%)]" />
      </div>
      <div className="relative z-10 text-center space-y-8 max-w-lg">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A855F7]">404 — Not Found</p>
        <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none">
          Lost<br />
          <span className="text-[#A855F7]">Signal.</span>
        </h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          This track doesn&apos;t exist in our catalog. The page you&apos;re looking for may have moved, been removed, or never existed.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="px-8 py-4 rounded-xl bg-[#A855F7] text-white font-black text-[11px] uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-[0_10px_30px_rgba(168,85,247,0.2)]"
          >
            Back to Hub
          </Link>
          <Link
            href="/discover"
            className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
          >
            Discover Music
          </Link>
        </div>
      </div>
    </div>
  );
}
