'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import BrandLogo from '@/components/layout/BrandLogo';

function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const searchParams = useSearchParams();
  const portal = searchParams.get('portal') || 'fan';
  const supabase = createClient();

  const isArtist = portal === 'artist';
  const baseBg = isArtist ? 'bg-[var(--color-studio-base)]' : 'bg-[#020202]';
  const surfaceBg = isArtist ? 'bg-[var(--color-studio-surface)] border-[var(--color-studio-border)]' : 'bg-white/5 border-white/5';
  const accentText = isArtist ? 'text-[#A855F7]' : 'text-white';
  const buttonBg = isArtist ? 'bg-[var(--color-accent-primary)] text-black' : 'bg-white text-black';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className={`min-h-screen ${baseBg} flex items-center justify-center p-4 text-white`}>
        <div className={`w-full max-w-md ${surfaceBg} border rounded-3xl p-10 text-center space-y-6 shadow-2xl`}>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter italic uppercase">Check Email</h1>
          <p className="text-gray-500 text-xs font-medium leading-relaxed">
            A secure recovery link has been dispatched to <span className="text-white font-bold">{email}</span>.
          </p>
          <div className="pt-4">
            <Link href={isArtist ? "/studio/login" : "/login"} className={`inline-block py-4 px-10 rounded-xl ${buttonBg} font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all`}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${baseBg} flex items-center justify-center p-4 text-white`}>
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 0.5px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
           <Link href={isArtist ? "/studio/login" : "/login"} className="inline-flex items-center space-x-2 text-gray-600 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Return to Login</span>
           </Link>
           <div className="flex justify-center mb-6">
              <BrandLogo className="w-16 h-16" />
           </div>
           <h1 className="text-3xl font-bold tracking-tighter italic uppercase leading-none">Recover<br /><span className={accentText}>Access.</span></h1>
           <p className="text-xs text-gray-500 font-medium tracking-wide italic">Enter your identity to receive a decryption key.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className={`p-10 rounded-[2.5rem] ${surfaceBg} border shadow-2xl space-y-8`}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-2">Operator Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL ADDRESS" 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                  />
                  <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/40 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded-2xl ${buttonBg} font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl flex items-center justify-center space-x-3`}
              >
                <span>{isSubmitting ? 'Dispatching...' : 'Send Recovery Link'}</span>
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020202] flex items-center justify-center text-white">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
