'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, User, Share2, Bookmark, MessageCircle, Heart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const MOCK_POSTS = [
  {
    id: 1,
    title: "Why Independence is the only path in 2025.",
    content: `
      <p>The music industry is currently undergoing its most significant transformation since the invention of the MP3. As streaming giants pivot towards a more centralized, algorithmic model, independent artists are finding themselves at a crossroads: either continue renting space on platforms that prioritize shareholders over creators, or build a home where they own the infrastructure.</p>
      
      <h2>The Commodity of Distribution</h2>
      <p>Distribution has become a commodity. In 2010, getting your music on Spotify was a badge of honor. In 2025, it's the bare minimum. The value has shifted from *access* to *ownership*. Labels have historically provided the bridge between these two, but at the cost of your masters and your creative freedom.</p>
      
      <blockquote>
        "Independence isn't about doing everything yourself; it's about owning everything you do."
      </blockquote>

      <h2>The Math of the Future</h2>
      <p>On traditional DSPs, an artist needs millions of streams just to pay their rent. On New Release Hub, a dedicated community of 500 supporters can generate more monthly income than 5,000,000 monthly listeners on a major streaming service. This is the "New Music Economy" in action.</p>
      
      <p>By leveraging revenue participation licenses, artists on NRH aren't just selling a product; they're inviting their fans to become stakeholders in their success. This creates a feedback loop of support that the algorithmic giants simply cannot replicate.</p>
    `,
    author: "NRH Editorial",
    date: "Oct 28, 2026",
    category: "Manifesto",
    image: "/images/default-avatar.png",
    readTime: "8 min"
  },
  {
    id: 2,
    title: "How Marcus Webb earned $12k in his first month on NRH.",
    content: `
      <p>When Marcus Webb joined New Release Hub, he was already an established indie artist with a loyal following. However, like many of his peers, he was struggling to turn that loyalty into a sustainable living through traditional streaming platforms.</p>
      
      <h2>The Strategy</h2>
      <p>Marcus launched his Hub with three clear supporter tiers: "The Studio Pass" ($5/mo), "The Master Class" ($15/mo), and "The Executive Producer" ($50/mo). The key wasn't just the price; it was the transparency.</p>
      
      <p>By offering a 2% revenue share on his upcoming album to the "Executive" tier, Marcus didn't just find fans; he found investors. He filled all 50 slots in less than 48 hours.</p>
      
      <h2>The Result</h2>
      <p>Between his monthly subscriptions and the upfront support for his new master recordings, Marcus cleared $12,450 in his first 30 days. More importantly, he did it while retaining 100% ownership of his music.</p>
    `,
    author: "Success Stories",
    date: "Oct 25, 2026",
    category: "Case Study",
    image: "/images/default-cover.png",
    readTime: "12 min"
  }
];

export default function BlogPostPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const post = MOCK_POSTS.find(p => p.id === id) || MOCK_POSTS[0];

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#00D2FF] selection:text-white pb-32">
      
      {/* ── HEADER ── */}
      <div className="relative h-[60vh] sm:h-[70vh] w-full overflow-hidden">
         <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60" />
         <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#02020266] to-transparent" />
         
         <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 lg:p-20">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
               <div className="flex items-center gap-4">
                  <Link href="/blog" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all">
                     <ChevronLeft className="w-5 h-5" />
                  </Link>
                  <span className="text-[#00D2FF] text-[10px] font-bold uppercase tracking-[0.3em]">{post.category}</span>
               </div>
               <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black tracking-tighter uppercase leading-[0.9] italic">
                  {post.title}
               </h1>
               <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                        <User className="w-4 h-4 text-zinc-500" />
                     </div>
                     <div>
                        <p className="text-xs font-bold uppercase">{post.author}</p>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">NRH Collective</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                     </div>
                     <div>{post.date}</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-20 mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
         
         {/* SIDEBAR */}
         <div className="lg:col-span-1 flex lg:flex-col items-center justify-center lg:justify-start gap-8 sticky top-32 h-fit order-2 lg:order-1">
            <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00D2FF1a] group-hover:border-[#00D2FF33]">
                  <Heart className="w-5 h-5" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">2.4k</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00D2FF1a] group-hover:border-[#00D2FF33]">
                  <MessageCircle className="w-5 h-5" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">128</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00D2FF1a] group-hover:border-[#00D2FF33]">
                  <Share2 className="w-5 h-5" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">Share</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00D2FF1a] group-hover:border-[#00D2FF33]">
                  <Bookmark className="w-5 h-5" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">Save</span>
            </button>
         </div>

         {/* ARTICLE BODY */}
         <article className="lg:col-span-11 prose prose-invert prose-zinc max-w-none order-1 lg:order-2
            prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:font-black
            prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:text-white
            prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-400 prose-p:font-medium prose-p:italic
            prose-blockquote:border-l-4 prose-blockquote:border-[#00D2FF] prose-blockquote:bg-[#00D2FF0d] prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic prose-blockquote:text-2xl prose-blockquote:font-bold prose-blockquote:text-white prose-blockquote:my-12
         ">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="mt-20 pt-16 border-t border-white/5">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-10 bg-[#111] border border-white/5 rounded-[3rem]">
                  <div className="space-y-4 text-center sm:text-left">
                     <h4 className="text-2xl font-black italic uppercase tracking-tighter">Ready to own your masters?</h4>
                     <p className="text-zinc-500 font-medium text-sm">Join the network and start building your independent empire today.</p>
                  </div>
                  <Link href="/studio/login" className="px-12 py-5 rounded-full bg-[#00D2FF] text-white font-black text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-all shadow-xl shadow-[#00D2FF33] whitespace-nowrap">
                     Get Started
                  </Link>
               </div>
            </div>
         </article>

      </div>
    </div>
  );
}
