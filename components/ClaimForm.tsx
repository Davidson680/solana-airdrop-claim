'use client';

import { useState, FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import toast from 'react-hot-toast';

interface ClaimFormProps {
  availableAmount: string;
  onSuccess: () => void;
}

const ClaimForm: FC<ClaimFormProps> = ({ availableAmount, onSuccess }) => {
  const { publicKey, signTransaction } = useWallet();
  const [claimAmount, setClaimAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const formatAmount = (value: string) => {
    try {
      const num = BigInt(value);
      return (Number(num) / 1e9).toFixed(2);
    } catch {
      return '0.00';
    }
  };

  const maxAmount = formatAmount(availableAmount);

  const handleClaim = async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Wallet not connected');
      return;
    }

    if (!claimAmount || parseFloat(claimAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(claimAmount) > parseFloat(maxAmount)) {
      toast.error('Claim amount exceeds available balance');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/claim-airdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: publicKey.toString(),
          amount: claimAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim airdrop');
      }

      toast.success('Airdrop claimed successfully! Check your wallet.');
      setClaimAmount('');
      onSuccess();
    } catch (error) {
      console.error('Error claiming airdrop:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to claim airdrop'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Claim Amount (SOL)
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            max={maxAmount}
            step="0.1"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            placeholder="0.00"
            disabled={loading}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-solana-purple disabled:opacity-50"
          />
          <button
            onClick={() => setClaimAmount(maxAmount)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-solana-purple/20 hover:bg-solana-purple/30 px-2 py-1 rounded disabled:opacity-50 transition"
          >
            Max
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Available: {maxAmount} SOL</p>
      </div>

      <button
        onClick={handleClaim}
        disabled={loading || !claimAmount}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-semibold flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m0 0V4m0 0V1m0 0h-6m-6 0H1m0 0v6m0 0v6m0-6h6" />
            </svg>
            Claiming...
          </>
        ) : (
          'Claim Now'
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Gas fees will be deducted from the claim amount
      </p>
    </div>
  );
};

export default ClaimForm;
