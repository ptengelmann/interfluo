import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { AppShell } from '@/components/layout/shell';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Interfluo — AI co-pilot for residential conveyancing',
  description:
    'Drop in the contract pack. Get out the enquiries and the first draft of the Report on Title — every assertion cited back to source.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoPlacement: 'none',
          socialButtonsVariant: 'iconButton',
        },
        variables: {
          colorPrimary: '#2E5C46',
          colorBackground: '#FFFFFF',
          colorText: '#17181C',
          colorTextSecondary: '#4A4842',
          colorInputBackground: '#FFFFFF',
          colorInputText: '#17181C',
          colorNeutral: '#17181C',
          fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
          borderRadius: '10px',
        },
        elements: {
          card: 'shadow-[0_1px_2px_rgba(30,28,24,.06)] border border-[#E2DCCF]',
          headerTitle: 'font-semibold tracking-tight text-[#17181C]',
          headerSubtitle: 'text-[#4A4842]',
          formButtonPrimary:
            'bg-[#2E5C46] hover:bg-[#234A38] text-white normal-case font-semibold',
          footerActionLink: 'text-[#2E5C46] hover:text-[#234A38]',
        },
      }}
    >
      <html lang="en-GB">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        </head>
        <body>
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
