'use client'

import React from 'react';
import { createConfig, http } from 'wagmi';
import { metaMask } from '@wagmi/connectors';
import { sepolia } from 'wagmi/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [metaMask()],
  transports: { [sepolia.id]: http() },
});

export const adapter = new WagmiAdapter({ config: wagmiConfig });

export function Connect() {
  return (
    // @ts-expect-error appkit web component
    <appkit-button
      adapter={adapter}
      label="Connect"
      balance="hide"
      size="sm"
      loadingLabel="Connecting"
    />
  );
}
