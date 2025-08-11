import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

import { Footer } from "@/components/shared/Footer";
import Web3Providers from "../providers/Web3Providers";
import { ToastProvider } from "@/components/shared/ToastProvider";
import GlobalDock from "@/components/animata/global-dock";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coverly Insurance - Decentralized Insurance Platform",
  description: "Secure, transparent insurance powered by blockchain technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Web3Providers>
          <ThemeProvider defaultTheme="light" storageKey="blocksecure-ui-theme">
            <ToastProvider>
              <main>{children}</main>
              <GlobalDock />
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </Web3Providers>
      </body>
    </html>
  );
}
