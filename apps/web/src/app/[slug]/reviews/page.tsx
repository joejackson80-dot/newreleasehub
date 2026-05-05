import React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, Zap, MessageSquare, TrendingUp, Award, Disc, ArrowRight, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/ui/FadeIn';

export default async function MusicReviewsPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  const supabase = createAdminClient();

  // Fetch Org with its reviews and tracks
  const { data: org, error } = await supabase
    .from('organizations')
    .select(`
      *,
      music_reviews (*),
      tracks (*)
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (error || !org) notFound();

  const reviews = org.music_reviews || [];
  const fanReviews = reviews.filter((r: any) => r.type === 'FAN');
  const certifiedReviews = reviews.filter((r: any) => r.type === 'CERTIFIED');
  const avgRating = fanReviews.length > 0 ? (fanReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / fanReviews.length).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-white selection:text-black font-sans pb-32">
      
      {/* BRAND HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 px-10 py-6 border-b border-white/5 bg-black/60 backdrop-blur-3xl flex justify-between items-center">
         <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-black flex items-center justify-center font-bold text-xl tracking-tighter shadow-[0_0_20px_rgba(249,115,22,0.3)]">R</div>
            <div className="flex flex-col">
               <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest leading-none">ReactionsAndReviews</span>
               <span className="text-xs font-bold text-white uppercase tracking-tighter mt-1">Official Hub: {org.name}</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
               <Star className="w-3.5 h-3.5 text-orange-500" />
               <span>Avg Rating: {avgRating}</span>
            </div>
            <Link href={`/${slug}/live`} className="bg-white text-black px-8 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:scale-105 transition-all">Join Live Session</Link>
         </div>
      </header>

      {/* HERO / AUDIT OFFER */}
      <section className="pt-48 pb-32 px-10 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn direction="up">
               <div className="space-y-12">
                  <div className="space-y-6">
                     <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-[8px] font-bold text-orange-500 uppercase tracking-widest">Network Certified</span>
                     </div>
                     <h1 className="text-7xl font-bold tracking-tighter italic uppercase leading-[0.9]">The R&R Audit<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Service.</span></h1>
                     <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-xl">
                        Professional, high-fidelity music reviews for independent artists. Use our "Fiverr-style" audit system to get your track reviewed by the ReactionsAndReviews team.
                     </p>
                  </div>
                  
                  <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8">
                        <TrendingUp className="w-12 h-12 text-white/5 group-hover:text-orange-500/20 transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-2xl font-bold italic tracking-tighter uppercase">Professional Audit</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Guaranteed 48hr Turnaround</p>
                     </div>
                     <ul className="space-y-4">
                        {[
                          'Deep Technical Analysis (Mixing/Mastering)',
                          'Market Viability Score',
                          'Network Heatmap Placement',
                          'Official R&R Social Feature'
                        ].map((item, i) => (
                           <li key={i} className="flex items-center space-x-3">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-300">{item}</span>
                           </li>
                        ))}
                     </ul>
                     <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                        <div>
                           <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Standard Fee</p>
                           <p className="text-4xl font-bold text-white tracking-tighter italic">$49.99</p>
                        </div>
                        <button className="bg-orange-500 text-black px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                           Request Audit
                        </button>
                     </div>
                  </div>
               </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
               <div className="space-y-12">
                  <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.5em] mb-8">Latest Certified Audits</h3>
                  <div className="space-y-6">
                     {certifiedReviews.length > 0 ? certifiedReviews.map((review: any) => (
                        <div key={review.id} className="bg-black border border-orange-500/20 p-8 rounded-[2rem] space-y-4 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                              <ShieldCheck className="w-12 h-12 text-orange-500" />
                           </div>
                           <div className="flex items-center space-x-4">
                              <div className="flex space-x-1">
                                 {[...Array(10)].map((_, i) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < review.rating ? 'bg-orange-500' : 'bg-white/5'}`} />
                                 ))}
                              </div>
                              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">R&R CERTIFIED • {review.rating}/10</span>
                           </div>
                           <p className="text-sm text-gray-300 leading-relaxed font-medium italic">"{review.content}"</p>
                           <div className="flex items-center justify-between pt-4 border-t border-white/5">
                              <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Review ID: {review.id.slice(0, 8)}</span>
                              <Link href="#" className="text-[9px] font-bold text-white uppercase tracking-widest hover:underline">Full Report</Link>
                           </div>
                        </div>
                     )) : (
                        <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem] space-y-6">
                           <Disc className="w-12 h-12 text-zinc-800 mx-auto animate-spin-slow" />
                           <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Waiting for First Certified Audit</p>
                        </div>
                     )}
                  </div>
               </div>
            </FadeIn>
         </div>
      </section>

      {/* FAN FEEDBACK SECTION */}
      <section className="bg-white/[0.02] border-y border-white/5 py-32">
         <div className="max-w-7xl mx-auto px-10 space-y-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10">
               <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                     <MessageSquare className="w-4 h-4" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">The Collective Voice</span>
                  </div>
                  <h2 className="text-5xl font-bold tracking-tighter italic uppercase">Fan Feedback<br />Ledger.</h2>
               </div>
               <button className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Write A Review</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {fanReviews.map((review: any) => (
                  <div key={review.id} className="bg-black border border-white/5 rounded-[2.5rem] p-10 space-y-6 hover:border-white/10 transition-all">
                     <div className="flex justify-between items-center">
                        <div className="flex space-x-1">
                           {[...Array(10)].map((_, i) => (
                              <div key={i} className={`w-1 h-1 rounded-full ${i < review.rating ? 'bg-white' : 'bg-white/10'}`} />
                           ))}
                        </div>
                        <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm text-gray-400 leading-relaxed font-medium">"{review.content}"</p>
                     <div className="pt-6 border-t border-white/5">
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Fan_{review.user_id?.slice(0, 4)}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* MONETIZATION CALL TO ACTION */}
      <section className="py-40 text-center space-y-12 bg-gradient-to-b from-transparent to-orange-500/5">
         <FadeIn direction="up">
            <div className="space-y-6">
               <h2 className="text-3xl font-bold tracking-tighter italic uppercase">Scale Your Master<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">With Professional Authority.</span></h2>
               <p className="text-gray-600 max-w-xl mx-auto font-medium">
                  A ReactionsAndReviews certification increases the valuation of your participation licenses by 3.4x. Secure your audit today.
               </p>
            </div>
         </FadeIn>
         <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="bg-orange-500 text-black px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-[0_0_50px_rgba(249,115,22,0.3)]">Get Certified Audit</button>
            <button className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">View Methodology</button>
         </div>
      </section>

    </div>
  );
}
