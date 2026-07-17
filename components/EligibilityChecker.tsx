'use client';

import { FC } from 'react';

interface EligibilityCheckerProps {
  isEligible: boolean | null;
  amount: string;
  claimed: string;
  loading: boolean;
}

const EligibilityChecker: FC<EligibilityCheckerProps> = ({
  isEligible,
  amount,
  claimed,
  loading,
}) => {
  const formatAmount = (value: string) => {
    try {
      const num = BigInt(value);
      return (Number(num) / 1e9).toFixed(2);
    } catch {
      return '0.00';
    }
  };

  const remaining = BigInt(amount) - BigInt(claimed);
  const remainingFormatted = (Number(remaining) / 1e9).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-white/5 to-transparent border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-4 h-4 rounded-full ${
              loading
                ? 'bg-yellow-400 animate-pulse'
                : isEligible
                ? 'bg-solana-green'
                : 'bg-red-400'
            }`}
          />
          <p className="text-sm text-gray-400">Eligibility Status</p>
        </div>
        <p className="text-2xl font-bold">
          {loading
            ? 'Checking...'
            : isEligible
            ? '✓ You are eligible!'
            : '✗ Not eligible'}
        </p>
      </div>

      {isEligible && (
        <>
          {/* Amount Available */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Total Airdrop</p>
              <p className="text-2xl font-bold text-solana-purple">
                {formatAmount(amount)} SOL
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Already Claimed</p>
              <p className="text-2xl font-bold text-solana-green">
                {formatAmount(claimed)} SOL
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Claim Progress</p>
              <p className="text-sm font-semibold text-solana-green">
                {remainingFormatted} SOL remaining
              </p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-solana-purple to-solana-green h-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (Number(claimed) / Number(amount)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EligibilityChecker;
