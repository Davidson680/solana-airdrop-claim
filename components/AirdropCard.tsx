'use client';

import { ReactNode, FC } from 'react';

interface AirdropCardProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
}

const AirdropCard: FC<AirdropCardProps> = ({ title, children, loading, onRefresh }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">{title}</h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`p-2 rounded-lg transition-all ${
              loading
                ? 'animate-spin-slow text-solana-green'
                : 'hover:bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>
      <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
        {children}
      </div>
    </div>
  );
};

export default AirdropCard;
