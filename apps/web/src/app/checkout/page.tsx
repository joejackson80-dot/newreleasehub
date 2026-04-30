'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, CreditCard, Lock, ArrowRight, Zap, CheckCircle2, Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const tierId = searchParams.get('tier');
  const [loading, setLoading] = useState(false);
  const [tierData, setTierData] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch the tier details from the API
    // For now, we'll simulate the checkout experience
    if (tierId) {
      setTierData({
        id: tierId,
        name: 'Artist Supporter',
        price: 9.99,
        artist: 'Marcus Webb'
      });
    }
  }, [tierId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Stripe/Payment processing
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      toast.success('Capital authorized. Support finalized.');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#111] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-8 animate-in zoom-in duration-500">
           <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto border border-green-500/20">
              <CheckCircle2 className="w-10 h-10" />
           </div>
           <div className="space-y-2">
              <h1 className="text-3xl font-bold uppercase italic tracking-tighter">Support Finalized.</h1>
              <p className="text-gray-500 text-sm font-medium">Your contribution has been cleared on the network ledger.</p>
           </div>
           <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-left space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                 <span>Reference ID</span>
                 <span className="text-white">NRH-{Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                 <span>Status</span>
                 <span className="text-green-500">Authorized</span>
              </div>
           </div>
           <Link href="/fan/me" className="block w-full py-4 rounded-xl bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">
              Return to Dashboard
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row font-sans selection:bg-[#00D2FF] selection:text-white">
      
      {/* LEFT: SUMMARY */}
      <div className="w-full md:w-[45%] p-8 md:p-20 flex flex-col justify-center space-y-12 bg-zinc-900/50 border-r border-white/5">
         <Link href="/" className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xl tracking-tighter mb-12">N</Link>
         
         <div className="space-y-6">
            <div className="flex items-center space-x-3">
               <span className="px-2 py-1 bg-[#00D2FF1a] text-[#00D2FF] text-[8px] font-bold uppercase tracking-widest border border-[#00D2FF33] rounded">Secure Transaction</span>
            </div>
            <h2 className="text-5xl font-bold uppercase italic tracking-tighter leading-none">Complete<br /><span className="text-gray-500">Authorization.</span></h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-sm">
               You are about to authorize a recurring monthly contribution. 100% of the funds are routed through the NRH Network Treasury.
            </p>
         </div>

         <div className="bg-black/40 border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center">
                     <Star className="w-6 h-6 text-[#00D2FF]" />
                  </div>
                  <div>
                     <p className="font-bold text-white uppercase tracking-tight">{tierData?.name || 'Artist Supporter'}</p>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Supporting: {tierData?.artist || 'Verified Artist'}</p>
                  </div>
               </div>
               <p className="text-xl font-bold italic">${tierData?.price || '9.99'}</p>
            </div>
            <div className="flex justify-between items-center text-sm">
               <span className="text-gray-500">Network Fee</span>
               <span className="text-white font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center pt-2">
               <span className="text-lg font-bold uppercase italic tracking-tighter text-white">Total Due</span>
               <span className="text-3xl font-black text-[#00D2FF] italic">${tierData?.price || '9.99'}</span>
            </div>
         </div>

         <div className="flex items-center space-x-4 text-gray-600">
            <ShieldCheck className="w-5 h-5" />
            <p className="text-[9px] font-bold uppercase tracking-widest leading-tight">Institutional Encryption Protocol v4.2 Active</p>
         </div>
      </div>

      {/* RIGHT: FORM */}
      <div className="flex-1 p-8 md:p-20 flex flex-col justify-center items-center">
         <form onSubmit={handlePayment} className="w-full max-w-md space-y-10">
            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="border border-[#00D2FF] bg-[#00D2FF]/5 p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 cursor-pointer group">
                        <CreditCard className="w-6 h-6 text-[#00D2FF]" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">Credit Card</span>
                     </div>
                     <div className="border border-white/5 bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 cursor-not-allowed opacity-50">
                        <Zap className="w-6 h-6 text-gray-500" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">NRH Credits</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Cardholder Name</label>
                     <input type="text" required placeholder="JOHN DOE" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold uppercase tracking-widest text-white outline-none focus:border-[#00D2FF]" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Card Number</label>
                     <div className="relative">
                        <input type="text" required placeholder="•••• •••• •••• ••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold tracking-[0.2em] text-white outline-none focus:border-[#00D2FF]" />
                        <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expiry</label>
                        <input type="text" required placeholder="MM / YY" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold tracking-widest text-white outline-none focus:border-[#00D2FF]" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CVC</label>
                        <input type="text" required placeholder="•••" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm font-bold tracking-widest text-white outline-none focus:border-[#00D2FF]" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#00D2FF] hover:text-white transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl disabled:opacity-50"
               >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Authorize Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
               </button>
               
               <div className="flex items-center justify-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1.5">
                     <Lock className="w-3 h-3" />
                     <span className="text-[9px] font-bold uppercase tracking-widest">SSL Encrypted</span>
                  </div>
                  <div className="w-px h-3 bg-white/10"></div>
                  <div className="flex items-center space-x-1.5">
                     <ShieldCheck className="w-3 h-3" />
                     <span className="text-[9px] font-bold uppercase tracking-widest">Payment PCI Compliant</span>
                  </div>
               </div>
            </div>
         </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#00D2FF] animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
