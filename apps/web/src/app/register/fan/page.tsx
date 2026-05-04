'use client';
import React, { useState } from 'react';
import { Mail, Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { registerFan, signInWithGoogle } from '@/app/actions/auth';
import toast from 'react-hot-toast';

export default function FanRegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await registerFan({ email, username, displayName, password });
      if (result.success) {
        toast.success('Account created! Welcome to the network.');
        window.location.href = '/fan/me';
      } else {
        setError(result.error || 'Registration failed');
        toast.error(result.error || 'Registration failed');
      }
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError('An error occurred. Please try again.');
      toast.error('Network error during registration');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-10 font-sans selection:bg-white selection:text-black">
      
      {/* BACKGROUND VIBE */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-gradient-to-b from-purple-500/10 via-transparent to-transparent"></div>
      </div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
           <Link href="/register" className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Back to Roles</span>
           </Link>
           <h1 className="text-3xl font-bold tracking-tighter italic uppercase leading-none">Join the<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Network.</span></h1>
           <p className="text-xs text-gray-500 font-medium tracking-wide">Create your fan account to support independent artists.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="USERNAME" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="DISPLAY NAME" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PASSWORD" 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-8 py-5 text-xs font-bold tracking-widest text-white placeholder-gray-800 focus:outline-none focus:border-white/20 transition-all"
                  minLength={8}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? 'Creating Account...' : 'Join Network'}</span>
                  {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
           </div>
           
           <div className="flex items-center space-x-4 py-2">
              <div className="flex-1 h-px bg-white/5"></div>
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">or continue with</span>
              <div className="flex-1 h-px bg-white/5"></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <form action={signInWithGoogle.bind(null, 'FAN', '/fan/me')} className="w-full">
                <button type="submit" className="w-full flex items-center justify-center space-x-3 bg-white/5 border border-white/5 rounded-2xl py-4 hover:bg-white/10 transition-all group">
                    <Globe className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
                </button>
              </form>
              <Link href="/login" className="flex items-center justify-center space-x-3 bg-white/5 border border-white/5 rounded-2xl py-4 hover:bg-white/10 transition-all group">
                  <Mail className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Sign In</span>
              </Link>
           </div>
        </form>

        <div className="text-center space-y-6 pt-10">
           <div className="pt-4">
              <Link href="/login" className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-[0.2em]">Already have an account? Sign In</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
