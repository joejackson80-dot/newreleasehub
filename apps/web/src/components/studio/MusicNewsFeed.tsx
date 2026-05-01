'use client';
import React, { useEffect, useState } from 'react';
import { Globe, ArrowUpRight, Clock, Activity } from 'lucide-react';
import Link from 'next/link';

export default function MusicNewsFeed() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.musicbusinessworldwide.com/feed/');
        const data = await res.json();
        if (data && data.items) {
          setArticles(data.items.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch music news', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-white tracking-tight">Industry Intelligence</h2>
            <div className="bg-[#F1F5F91a] px-2 py-1 rounded text-[#F1F5F9] text-[8px] font-bold uppercase tracking-widest">Live</div>
         </div>
         <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <Globe className="w-3 h-3" />
            Global Feed
         </span>
      </div>
      
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden relative">
        {isLoading ? (
          <div className="p-10 flex flex-col items-center justify-center space-y-4 text-gray-500">
             <Activity className="w-8 h-8 animate-pulse text-[#F1F5F9]" />
             <p className="text-[10px] font-bold uppercase tracking-widest">Decrypting Live Feed...</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="divide-y divide-white/5">
            {articles.map((article, i) => (
              <a 
                key={i} 
                href={article.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-5 sm:p-6 hover:bg-white/5 transition-colors group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-sm font-bold text-white leading-tight group-hover:text-[#F1F5F9] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-3 mt-2">
                     <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(article.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                     </span>
                     <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                        {article.author || 'MBW'}
                     </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#F1F5F9] group-hover:text-black transition-all flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Feed temporarily unavailable.</p>
          </div>
        )}
      </div>
    </section>
  );
}
