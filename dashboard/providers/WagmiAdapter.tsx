// app/api/fetch.ts or similar

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { arbitrum, hardhat, mainnet, sepolia } from "viem/chains";
import { cookieStorage, createStorage } from "wagmi";

export const projectId = "75468e8f70a76e9e90aba88c038eb643";
if (!projectId) throw new Error("Project ID is not defined");

export const networks = [mainnet, arbitrum, hardhat, sepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
