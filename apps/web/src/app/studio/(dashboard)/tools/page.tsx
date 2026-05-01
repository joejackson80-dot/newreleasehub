import React from 'react';
import { Wrench, Zap, Image as ImageIcon, Video, Mic, Sparkles } from 'lucide-react';

export default function ToolsHubPage() {
  const tools = [
    {
      name: 'Smart EPK Generator',
      description: 'Automatically generate a professional Electronic Press Kit using your existing network data and releases.',
      icon: ImageIcon,
      status: 'Active',
      color: 'text-[#F1F5F9]',
      bg: 'bg-[#F1F5F9]/10',
      action: 'Launch Generator'
    },
    {
      name: 'AI Cover Art Studio',
      description: 'Generate high-fidelity, commercially clear cover art concepts using advanced text-to-image models.',
      icon: Sparkles,
      status: 'Coming Soon',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      action: 'Join Waitlist'
    },
    {
      name: 'Stem Splitter & Mastering',
      description: 'Isolate vocals, drums, and melodies from any master track, or apply instant AI mastering.',
      icon: Mic,
      status: 'Beta',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      action: 'Try Beta'
    },
    {
      name: 'Video Visualizer Creator',
      description: 'Turn your tracks into reactive visualizers for YouTube and Spotify Canvas instantly.',
      icon: Video,
      status: 'Coming Soon',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      action: 'Join Waitlist'
    }
  ];

  return (
    <div className="p-6 sm:p-8 md:p-12 space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white uppercase italic">Tools Hub.</h1>
        <p className="text-sm text-gray-500 font-medium max-w-2xl">Access our suite of integrated tools designed to accelerate your creative pipeline and streamline your administrative workflow.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, index) => (
          <div key={index} className="bg-[#111] border border-white/5 rounded-2xl p-8 hover:border-white/20 transition-all group flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tool.bg}`}>
                <tool.icon className={`w-7 h-7 ${tool.color}`} />
              </div>
              <div className="bg-white/5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-gray-400">
                {tool.status}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{tool.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-grow">{tool.description}</p>
            
            <button 
              className={`mt-8 w-full py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                tool.status === 'Coming Soon' 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {tool.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
