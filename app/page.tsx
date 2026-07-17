'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnectButton from '@/components/WalletConnectButton';
import AirdropCard from '@/components/AirdropCard';
import EligibilityChecker from '@/components/EligibilityChecker';
import ClaimForm from '@/components/ClaimForm';
import ClaimHistory from '@/components/ClaimHistory';
import SocialShare from '@/components/SocialShare';
import toast from 'react-hot-toast';

export default function Home() {
  const { connected, publicKey } = useWallet();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [airdropAmount, setAirdropAmount] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState<string>('0');

  useEffect(() => {
    if (connected && publicKey) {
      checkEligibility();
    } else {
      setIsEligible(null);
      setAirdropAmount('0');
    }
  }, [connected, publicKey]);

  const checkEligibility = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: publicKey.toString() }),
      });

      const data = await response.json();
      setIsEligible(data.eligible);
      setAirdropAmount(data.amount || '0');
      setClaimedAmount(data.claimedAmount || '0');
    } catch (error) {
      console.error('Error checking eligibility:', error);
      toast.error('Failed to check eligibility');
      setIsEligible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-solana-dark via-slate-900 to-black">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-solana-purple to-solana-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">◎</span>
              </div>
              <h1 className="text-xl font-bold gradient-text">Solana Airdrop</h1>
            </div>
            <WalletConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Claim Your Airdrop</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Check your eligibility and claim your Solana tokens now
          </p>
          {!connected && (
            <div className="inline-block">
              <WalletConnectButton />
            </div>
          )}
        </div>

        {connected && publicKey ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Eligibility Card */}
              <AirdropCard
                title="Your Airdrop Status"
                loading={loading}
                onRefresh={checkEligibility}
              >
                <EligibilityChecker
                  isEligible={isEligible}
                  amount={airdropAmount}
                  claimed={claimedAmount}
                  loading={loading}
                />
              </AirdropCard>

              {/* Claim Form */}
              {isEligible && (
                <AirdropCard title="Claim Your Tokens">
                  <ClaimForm
                    availableAmount={airdropAmount}
                    onSuccess={() => {
                      toast.success('Airdrop claimed successfully!');
                      checkEligibility();
                    }}
                  />
                </AirdropCard>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats Card */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Airdrop Info</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Network</p>
                    <p className="text-lg font-semibold text-solana-green">
                      {process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'Devnet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Your Wallet</p>
                    <p className="text-sm font-mono text-gray-300 truncate">
                      {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className={`text-lg font-semibold ${
                      isEligible === null ? 'text-yellow-400' :
                      isEligible ? 'text-solana-green' : 'text-red-400'
                    }`}>
                      {isEligible === null ? 'Checking...' :
                       isEligible ? 'Eligible ✓' : 'Not Eligible'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Share */}
              {isEligible && (
                <SocialShare wallet={publicKey.toString()} />
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center p-8">
              <div className="text-4xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-gray-400">Connect your Solana wallet to check eligibility</p>
            </div>
            <div className="card text-center p-8">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Verify Eligibility</h3>
              <p className="text-gray-400">We'll check if you're eligible for the airdrop</p>
            </div>
            <div className="card text-center p-8">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Claim Tokens</h3>
              <p className="text-gray-400">Claim your tokens and share your success</p>
            </div>
          </div>
        )}

        {/* Claim History */}
        {connected && publicKey && (
          <AirdropCard title="Recent Claims">
            <ClaimHistory wallet={publicKey.toString()} />
          </AirdropCard>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">© 2024 Solana Airdrop. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-solana-green transition">Docs</a>
              <a href="#" className="text-gray-400 hover:text-solana-green transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-solana-green transition">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
