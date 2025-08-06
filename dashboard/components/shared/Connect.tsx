"use client";

import React from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const formatAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

export function Connect() {
  const { address, isConnected } = useAccount();

  return (
    <appkit-button
      label="Connect"
      balance="hide"
      size="sm"
      loadingLabel="Connecting"
    />
  );
}
