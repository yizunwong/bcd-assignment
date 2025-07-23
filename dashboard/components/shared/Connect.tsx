"use client";

import React, { useEffect, useMemo } from "react";
import { createConfig, http } from "wagmi";
import { metaMask } from "@wagmi/connectors";
import { sepolia } from "wagmi/chains";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineCustomElements } from "@reown/appkit/dist/loader";

export const chains = [sepolia];

export const wagmiConfig = createConfig({
  chains,
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

export function Connect() {
  useEffect(() => {
    defineCustomElements();
  }, []);

  const adapter = useMemo(
    () => new WagmiAdapter({ config: wagmiConfig, chains }),
    []
  );

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
