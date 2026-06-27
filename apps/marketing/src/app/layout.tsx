import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NavBar } from '@/components/nav-bar';
import { Footer } from '@/components/footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Interfluo · AI co-pilot for residential conveyancing',
  description:
    'Drop in the contract pack. Get the enquiries and the first draft of the Report on Title. Every assertion footnoted to its source page. For UK residential conveyancing fee-earners.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Interfluo · AI co-pilot for residential conveyancing',
    description:
      'Drop in the pack. Get the enquiries and the Report on Title in 30–60 seconds, every assertion cited.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
