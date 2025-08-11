import { useAccount, usePublicClient } from 'wagmi';
import { formatEther } from 'viem';
import { useEffect, useState } from 'react';

export interface WalletTransaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  description: string;
  date: string;
  status: 'confirmed';
  hash: string;
}

export function useWalletTransactions(limit = 10) {
  const { address, chainId } = useAccount();
  const client = usePublicClient({ chainId });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || !client) return;
      const latestBlock = await client.getBlockNumber();
      const txs: WalletTransaction[] = [];
      let blockNumber = latestBlock;
      while (txs.length < limit && blockNumber > BigInt(0)) {
        const block = await client.getBlock({
          blockNumber,
          includeTransactions: true,
        });
        for (const tx of block.transactions) {
          if (typeof tx === 'string') continue;
          if (tx.from === address || tx.to === address) {
            txs.push({
              id: tx.hash,
              type: tx.from === address ? 'sent' : 'received',
              amount: `${formatEther(tx.value)} ETH`,
              description: 'On-chain transaction',
              date: new Date(Number(block.timestamp) * 1000)
                .toISOString()
                .split('T')[0],
              status: 'confirmed',
              hash: tx.hash,
            });
            if (txs.length >= limit) break;
          }
        }
        blockNumber -= BigInt(1);
      }
      setTransactions(txs);
    };

    fetchTransactions();
  }, [address, client, limit]);

  return { transactions };
}
