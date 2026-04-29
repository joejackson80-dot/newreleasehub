import Link from 'next/link';

export default function ChartsPage() {
  return (
    <div className="min-h-screen bg-[#070707] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            NRH Charts
          </h1>
          <p className="text-zinc-400 text-xl">The pulse of independent music on New Release Hub. Updated every Monday.</p>
        </header>

        <nav className="flex space-x-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <Link href="/network/charts" className="px-6 py-2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 whitespace-nowrap">Top Artists</Link>
          <Link href="/network/charts/rising" className="px-6 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap">Rising</Link>
          <Link href="/network/charts/hip-hop" className="px-6 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap">Hip-Hop</Link>
          <Link href="/network/charts/pop" className="px-6 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap">Pop</Link>
          <Link href="/network/charts/electronic" className="px-6 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap">Electronic</Link>
          <Link href="/network/charts/indie" className="px-6 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap">Indie</Link>
          <Link href="/network/charts/patrons" className="px-6 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 whitespace-nowrap">Patrons</Link>
        </nav>

        <div className="mb-12 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 flex items-center justify-between">
          <div>
            <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-2 block">#1 This Week</span>
            <h2 className="text-4xl font-bold mb-2">To Be Computed</h2>
            <p className="text-zinc-400">Hip-Hop • Omaha, NE</p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-800/50 text-zinc-400 text-sm">
              <tr>
                <th className="p-4 font-medium">Rank</th>
                <th className="p-4 font-medium">Trend</th>
                <th className="p-4 font-medium">Artist</th>
                <th className="p-4 font-medium">Genre</th>
                <th className="p-4 font-medium">City</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <tr className="hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 text-2xl font-bold text-zinc-500">2</td>
                <td className="p-4 text-emerald-400">▲ +1</td>
                <td className="p-4 font-bold">Waiting for Chart Run...</td>
                <td className="p-4 text-zinc-400">R&B</td>
                <td className="p-4 text-zinc-400">Atlanta, GA</td>
                <td className="p-4 text-right">
                  <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-lg text-sm">
                    Follow
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
