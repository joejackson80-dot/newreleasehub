import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | New Release Hub',
  description: 'How we collect, use, and protect your personal and artist data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="space-y-16">
          <header className="space-y-4 border-b border-white/10 pb-8">
            <div className="flex items-center space-x-3 text-green-500">
              <Shield className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest">Data Protection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white">Privacy Policy</h1>
            <p className="text-gray-500 text-sm">Last updated: April 23, 2026</p>
          </header>

          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-10 space-y-6">
            <h2 className="text-xl font-bold italic uppercase tracking-tighter text-green-500">Verified Integrity.</h2>
            <div className="prose prose-invert prose-p:text-gray-300 max-w-none text-sm leading-relaxed italic">
              <p>
                Our privacy model is built on the principle of verifiable integrity. We analyze data to protect the financial interests of artists. This includes analysis of streaming patterns to ensure that every cent of royalty is paid out to legitimate human listeners and authenticated fans.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">1. DATA COLLECTION</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                We collect information you provide directly to us when you create an artist profile, connect a Stripe account, or participate in the network. This includes your name, email address, payment details, and artist metadata. We also collect automated data such as IP addresses and device identifiers to protect against fraud and verify streaming integrity.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">2. USE OF INFORMATION</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                Your data is used to provide and improve our services, process payments, and ensure a secure environment for all users. Specifically, your streaming data is analyzed to detect "stream farming" and other fraudulent activities that undermine the royalty engine.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">3. DATA SHARING</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                We do not sell your personal data. We share information with third-party service providers (like Stripe and Resend) only as necessary to provide our services. Artist profile information is public on the network to facilitate discovery and patronage.
              </p>
            </div>
          </section>

          <section className="space-y-6 border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold uppercase tracking-widest">CONTACT PRIVACY TEAM</h2>
            <p className="text-gray-400">
              For any questions regarding your data and privacy, please contact:
              <br /><br />
              <Link href="mailto:privacy@newreleasehub.com" className="text-[#00D2FF] hover:underline">privacy@newreleasehub.com</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
