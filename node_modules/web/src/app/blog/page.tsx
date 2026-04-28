import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Clock, User, Tag, ChevronRight, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

const MOCK_POSTS = [
  {
    id: 1,
    title: "Why Independence is the only path in 2025.",
    excerpt: "The streaming giants are pivotting. Labels are shrinking. Here is why your master recordings are your most valuable asset.",
    author: "NRH Editorial",
    date: "Oct 28, 2026",
    category: "Manifesto",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    readTime: "8 min"
  },
  {
    id: 2,
    title: "How Marcus Webb earned $12k in his first month on NRH.",
    excerpt: "A deep dive into the numbers behind the most successful Support-Tier launch in the platform's history.",
    author: "Success Stories",
    date: "Oct 25, 2026",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1514525253361-bee8718a342b?w=800&q=80",
    readTime: "12 min"
  },
  {
    id: 3,
    title: "Understanding Revenue Participation Licenses.",
    excerpt: "Everything you need to know about the legal framework that powers fan revenue sharing on New Release Hub.",
    author: "Legal Lab",
    date: "Oct 22, 2026",
    category: "Framework",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    readTime: "15 min"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white pt-12 pb-20 px-10">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
             <div className="inline-flex items-center space-x-3 text-[#00D2FF]">
                <Tag className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Industry Journal</span>
             </div>
             <h1 className="text-3xl md:text-8xl font-bold tracking-tighter italic uppercase leading-[0.8]">
                NRH<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Editorial.</span>
             </h1>
          </div>
          <div className="flex items-center space-x-6">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="bg-white/5 border border-white/10 rounded-full px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-[#00D2FF] transition-all w-64"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
             </div>
          </div>
        </header>

        {/* FEATURED POST */}
        <section className="relative group overflow-hidden rounded-[3rem] border border-white/5 bg-[#111]">
           <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                 <img src={MOCK_POSTS[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Featured post" />
              </div>
              <div className="p-12 lg:p-20 flex flex-col justify-between space-y-12">
                 <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                       <span className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-[0.3em]">{MOCK_POSTS[0].category}</span>
                       <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                       <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{MOCK_POSTS[0].date}</span>
                    </div>
                    <h2 className="text-4xl lg:text-3xl font-bold tracking-tighter uppercase leading-tight italic">{MOCK_POSTS[0].title}</h2>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">{MOCK_POSTS[0].excerpt}</p>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-white uppercase">{MOCK_POSTS[0].author}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{MOCK_POSTS[0].readTime} Read</p>
                       </div>
                    </div>
                    <Link href={`/blog/${MOCK_POSTS[0].id}`} className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#00D2FF] hover:text-white transition-all group-hover:translate-x-2">
                       <ArrowRight className="w-6 h-6" />
                    </Link>
                 </div>
              </div>
           </div>
        </section>

        {/* LATEST POSTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20 border-t border-white/5">
           {MOCK_POSTS.slice(1).map((post) => (
             <div key={post.id} className="group space-y-8">
                <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#111]">
                   <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                </div>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                         <span className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-widest">{post.category}</span>
                         <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                         <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-gray-500 hover:text-white transition-colors"><Bookmark className="w-4 h-4" /></button>
                         <button className="text-gray-500 hover:text-white transition-colors"><Share2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                   <h3 className="text-3xl font-bold tracking-tighter uppercase leading-tight italic group-hover:text-[#00D2FF] transition-colors">{post.title}</h3>
                   <p className="text-gray-500 font-medium leading-relaxed line-clamp-2">{post.excerpt}</p>
                   <Link href={`/blog/${post.id}`} className="inline-flex items-center space-x-3 text-xs font-bold uppercase tracking-widest text-white group-hover:text-[#00D2FF] transition-colors">
                      <span>Read Full Article</span>
                      <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>
             </div>
           ))}
        </section>

        {/* NEWSLETTER CTA */}
        <section className="bg-[#111] border border-white/5 rounded-[3rem] p-12 lg:p-20 text-center space-y-12 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
           <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-4xl font-bold uppercase tracking-tighter italic">Stay Ahead of the Industry.</h2>
              <p className="text-gray-500 font-medium">Join 50,000+ independent artists and industry professionals receiving the NRH Editorial weekly.</p>
           </div>
           <form className="max-w-md mx-auto flex items-center space-x-4 relative z-10">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 text-xs font-bold text-white focus:outline-none focus:border-[#00D2FF] transition-all"
              />
              <button className="px-10 py-4 rounded-full bg-[#00D2FF] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-all shadow-lg shadow-[#00D2FF]/20">Join</button>
           </form>
        </section>

      </div>
    </div>
  );
}
