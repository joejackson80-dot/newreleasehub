import React from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'DMCA Notice & Takedown | New Release Hub',
  description: 'Procedures for reporting copyright infringement on the NRH network.',
};

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-[#020202] text-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <div className="space-y-16">
          <header className="space-y-4 border-b border-white/10 pb-8">
            <div className="flex items-center space-x-3 text-orange-500">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest">Intellectual Property</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white">DMCA Policy</h1>
            <p className="text-gray-500 text-sm">Last updated: April 23, 2026</p>
          </header>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-widest">REPORTING INFRINGEMENT</h2>
            <div className="prose prose-invert prose-p:text-gray-400 max-w-none">
              <p>
                New Release Hub respects the intellectual property rights of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with the following information:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>A description of the copyrighted work that you claim has been infringed.</li>
                <li>A description of where the material that you claim is infringing is located on the site.</li>
                <li>Your address, telephone number, and email address.</li>
                <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6 border-t border-white/10 pt-12">
            <h2 className="text-2xl font-bold uppercase tracking-widest">DESIGNATED AGENT</h2>
            <p className="text-gray-400">
              Submit your DMCA notices to:
              <br /><br />
              New Release Hub LLC<br />
              Attn: Copyright Agent<br />
              Omaha, Nebraska<br /><br />
              <Link href="mailto:dmca@newreleasehub.com" className="text-[#00D2FF] hover:underline">dmca@newreleasehub.com</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
