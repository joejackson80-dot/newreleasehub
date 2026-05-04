import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: 'New Release Hub — Your Music. Your Fans. Your Money.',
    template: '%s | New Release Hub',
  },
  description:
    'The platform for independent artists to release music, build fan support, and earn more per stream — without signing away their rights. No label. No middleman.',
  keywords: ['independent music', 'artist platform', 'music support', 'fan revenue sharing', 'music streaming'],
  metadataBase: new URL('https://www.newreleasehub.com'),
  openGraph: {
    type: 'website',
    siteName: 'New Release Hub',
    title: 'New Release Hub — Your Music. Your Fans. Your Money.',
    description: 'The platform for independent artists to release music, build fan support, and earn more per stream — without signing away their rights.',
    url: 'https://www.newreleasehub.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Release Hub — Your Music. Your Fans. Your Money.',
    description: 'The platform for independent artists to release music, build fan support, and earn more per stream — without signing away their rights.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};


import { Toaster } from 'react-hot-toast';
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import GlobalAudioPlayer from "@/components/layout/GlobalAudioPlayer";
import { AudioProvider } from "@/context/AudioContext";
import CookieConsent from "@/components/layout/CookieConsent";
import AuthSessionProvider from "@/components/providers/SessionProvider";

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
      <body className="min-h-full flex flex-col bg-[#020202] font-sans selection:bg-[#A855F7] selection:text-white">
        <AuthSessionProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#1D1D1B',
                color: '#F4F3EF',
                border: '1px solid rgba(255,255,255,0.08)',
              },
            }}
          />
          <AudioProvider>
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
            <GlobalAudioPlayer />
            <CookieConsent />
          </AudioProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}


