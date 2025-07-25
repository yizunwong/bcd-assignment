import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import Web3Providers from "@/app/providers/Web3Providers"; // ✅ import it
import GlobalNavbar from "@/components/shared/GlobalNavbar";
import { Footer } from "@/components/shared/Footer";

// Ensure this layout is always rendered dynamically so that
// server-only features like `cookies()` work even when building
// error pages such as `/404`.
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlockSecure Insurance - Decentralized Insurance Platform",
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
            <GlobalNavbar />
            <main className="pt-16">{children}</main>
            <Footer />
          </ThemeProvider>
        </Web3Providers>
      </body>
    </html>
  );
}
