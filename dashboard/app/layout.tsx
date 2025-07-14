import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/shared/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlockSecure Insurance - Decentralized Insurance Platform',
  description: 'Secure, transparent insurance powered by blockchain technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          defaultTheme="light"
          storageKey="blocksecure-ui-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}