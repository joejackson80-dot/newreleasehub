import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: 'New Release Hub — Your Music. Your Fans. Your Money.',
    template: '%s | New Release Hub',
  },
  description:
    'The platform for independent artists to release music, build fan patronage, and earn more per stream — without signing away their rights. No label. No middleman.',
  keywords: ['independent music', 'artist platform', 'music patronage', 'fan revenue sharing', 'music streaming'],
  metadataBase: new URL('https://www.newreleasehub.com'),
  openGraph: {
    type: 'website',
    siteName: 'New Release Hub',
    title: 'New Release Hub — Your Music. Your Fans. Your Money.',
    description: 'The platform for independent artists to release music, build fan patronage, and earn more per stream — without signing away their rights.',
    url: 'https://www.newreleasehub.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Release Hub — Your Music. Your Fans. Your Money.',
    description: 'The platform for independent artists to release music, build fan patronage, and earn more per stream — without signing away their rights.',
  },
  robots: { index: true, follow: true },
};


import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import GlobalAudioPlayer from "@/components/layout/GlobalAudioPlayer";
import { AudioProvider } from "@/context/AudioContext";
import CookieConsent from "@/components/layout/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
      data-deployment-id="v2-stable-layout"
    >
      <body className="min-h-full flex flex-col bg-[#020202] font-sans selection:bg-[#00D2FF] selection:text-white">
        <AudioProvider>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
          <GlobalAudioPlayer />
          <CookieConsent />
        </AudioProvider>
      </body>
    </html>
  );
}
