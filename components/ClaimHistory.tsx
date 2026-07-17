'use client';

import { useState, useEffect, FC } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Claim {
  id: string;
  amount: string;
  timestamp: number;
  txHash: string;
}

interface ClaimHistoryProps {
  wallet: string;
}

const ClaimHistory: FC<ClaimHistoryProps> = ({ wallet }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaimHistory();
  }, [wallet]);

  const fetchClaimHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/claim-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet }),
      });

      const data = await response.json();
      setClaims(data.claims || []);
    } catch (error) {
      console.error('Error fetching claim history:', error);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value: string) => {
    try {
      const num = BigInt(value);
      return (Number(num) / 1e9).toFixed(2);
    } catch {
      return '0.00';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin-slow text-solana-green">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No claims yet. Start by claiming your airdrop!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Amount</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Date</th>
            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-400">Transaction</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id} className="border-b border-white/5 hover:bg-white/5 transition">
              <td className="px-4 py-3 font-semibold text-solana-green">
                +{formatAmount(claim.amount)} SOL
              </td>
              <td className="px-4 py-3 text-sm text-gray-400">
                {formatDistanceToNow(new Date(claim.timestamp * 1000), {
                  addSuffix: true,
                })}
              </td>
              <td className="px-4 py-3">
                <a
                  href={`https://explorer.solana.com/tx/${claim.txHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-solana-purple hover:text-solana-green transition text-sm font-mono"
                >
                  {claim.txHash.slice(0, 8)}...{claim.txHash.slice(-8)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimHistory;
