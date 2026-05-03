'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, User, Share2, Bookmark, MessageCircle, Heart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { notFound } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  
  // Awaiting real database integration. For now, all IDs trigger a clean 404 instead of showing fake data.
  const post: any = null;

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-[#A855F7] selection:text-white pb-32">
      
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
                  <span className="text-[#A855F7] text-[10px] font-bold uppercase tracking-[0.3em]">{post.category}</span>
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
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#A855F71a] group-hover:border-[#A855F733]">
                  <Heart className="w-5 h-5" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">2.4k</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#A855F71a] group-hover:border-[#A855F733]">
                  <MessageCircle className="w-5 h-5" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">128</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#A855F71a] group-hover:border-[#A855F733]">
                  <Share2 className="w-5 h-5" />
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest">Share</span>
            </button>
            <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
               <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#A855F71a] group-hover:border-[#A855F733]">
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
            prose-blockquote:border-l-4 prose-blockquote:border-[#A855F7] prose-blockquote:bg-[#A855F70d] prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-r-3xl prose-blockquote:not-italic prose-blockquote:text-2xl prose-blockquote:font-bold prose-blockquote:text-white prose-blockquote:my-12
         ">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="mt-20 pt-16 border-t border-white/5">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-10 bg-[#111] border border-white/5 rounded-[3rem]">
                  <div className="space-y-4 text-center sm:text-left">
                     <h4 className="text-2xl font-black italic uppercase tracking-tighter">Ready to own your masters?</h4>
                     <p className="text-zinc-500 font-medium text-sm">Join the network and start building your independent empire today.</p>
                  </div>
                  <Link href="/studio/login" className="px-12 py-5 rounded-full bg-[#A855F7] text-white font-black text-xs uppercase tracking-widest hover:bg-[#00B8E0] transition-all shadow-xl shadow-[#A855F733] whitespace-nowrap">
                     Get Started
                  </Link>
               </div>
            </div>
         </article>

      </div>
    </div>
  );
}
