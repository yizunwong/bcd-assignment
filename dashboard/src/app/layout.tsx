// app/layout.tsx or app/RootLayout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Web3ContextProvider from "@/context/web3";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coverly",
  description: "Decentralized Insurance Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3ContextProvider>{children}</Web3ContextProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
