import React from 'react';
import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | New Release Hub',
  description: 'The legal agreement between you and New Release Hub regarding your use of our platform and services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="space-y-16">
          <header className="space-y-4 border-b border-white/10 pb-8">
            <div className="flex items-center space-x-3 text-[#F1F5F9]">
              <Scale className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest">Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white">Terms of Service</h1>
            <p className="text-gray-500 text-sm">Last updated: April 23, 2026</p>
          </header>

          <section className="bg-white/5 border border-white/10 rounded-[2rem] p-10 space-y-6">
            <h2 className="text-xl font-bold italic uppercase tracking-tighter text-[#F1F5F9]">The NRH Manifesto.</h2>
            <div className="prose prose-invert prose-p:text-gray-300 max-w-none text-sm leading-relaxed italic">
              <p>
                We believe the current music economy is structurally flawed. By participating in New Release Hub, you acknowledge and support our mission to dismantle predatory royalty structures and replace them with fair, direct-to-artist payouts. We prioritize sovereignty over convenience, and integrity over mass-market normalization.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">1. ACCEPTANCE OF TERMS</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                By accessing or using the New Release Hub website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">2. ARTIST RIGHTS & OWNERSHIP</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                Artists retain 100% ownership of their master recordings and intellectual property. By uploading music to NRH, you grant us a non-exclusive, worldwide, royalty-free license to stream and promote your music on the NRH platform on your behalf according to your selected release settings.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">3. FAN SUPPORTERAGE & REVENUE SHARING</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                Fans who become SUPPORTERs do so voluntarily to support artists. Revenue sharing payouts are variable and depend on actual streaming performance. NRH does not guarantee any specific return on support. All support fees are non-refundable unless required by law.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">4. USER CONDUCT</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                You agree not to use the platform for any unlawful purpose or to violate any international, federal, or state regulations. This includes, but is not limited to, uploading copyright-infringing material, engaging in fraudulent activity, or attempting to manipulate streaming data.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">5. TERMINATION</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                We reserve the right to terminate or suspend your account and access to the services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">6. PROHIBITED ACTIVITIES</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                The following activities are strictly prohibited and may result in 
                immediate account termination and legal action:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Automated scraping, crawling, or systematic extraction of any platform data including artist profiles, charts, opportunity listings, and discovery results.</li>
                <li>Reverse engineering of any algorithms, recommendation systems, ranking methods, or calculation methods used by New Release Hub.</li>
                <li>Using the platform to gather competitive intelligence about New Release Hub's technology, business model, or proprietary methods.</li>
                <li>Unauthorized reproduction, distribution, or display of proprietary platform features, designs, or business logic.</li>
                <li>Bypassing rate limits, authentication, or security controls.</li>
              </ul>
              <p>
                Violations may be prosecuted under the Computer Fraud and Abuse Act (18 U.S.C. § 1030), the Defend Trade Secrets Act (18 U.S.C. § 1836), and applicable state trade secret laws.
              </p>
            </div>
          </section>

          <section className="space-y-6 border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold uppercase tracking-widest">LEGAL INQUIRIES</h2>
            <p className="text-gray-400">
              For any legal questions regarding these terms, please contact:
              <br /><br />
              <Link href="mailto:legal@newreleasehub.com" className="text-[#F1F5F9] hover:underline">legal@newreleasehub.com</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


