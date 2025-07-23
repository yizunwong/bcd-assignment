"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, arbitrum, hardhat } from "@reown/appkit/networks";
import React, { useEffect, useState, type ReactNode } from "react";
import { cookieToInitialState, State, WagmiProvider, type Config } from "wagmi";
import { projectId, wagmiAdapter } from './WagmiAdapter';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Create modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, hardhat],
  defaultNetwork: hardhat,
  features: {
    analytics: true,
  },
});

function Web3ContextProvider({ children }: { children: ReactNode }) {
  const [initialState, setInitialState] = useState<State | undefined>(
    undefined
  );

  useEffect(() => {
    const cookies = document.cookie;
    const state = cookieToInitialState(
      wagmiAdapter.wagmiConfig as Config,
      cookies
    );
    setInitialState(state);
  }, []);

  if (!initialState) return null; // or loading spinner

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3ContextProvider;
