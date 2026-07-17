'use client';

import { useState, FC } from 'react';
import toast from 'react-hot-toast';

interface SocialShareProps {
  wallet: string;
}

const SocialShare: FC<SocialShareProps> = ({ wallet }) => {
  const [shared, setShared] = useState(false);

  const shareText = `🎉 I just claimed my Solana airdrop! Join me and claim yours now at Solana Airdrop Claim!`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    setShared(true);
    toast.success('Shared on Twitter!');
  };

  const shareOnTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    setShared(true);
    toast.success('Shared on Telegram!');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
      setShared(true);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Share Your Success</h3>
      <div className="space-y-3">
        <button
          onClick={shareOnTwitter}
          className="w-full btn-secondary flex items-center justify-center gap-2 py-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7s1.1 1.5 1-4.5a4.5 4.5 0 00-8-2.5c-.5 0-1-1-2-1h-1z" />
          </svg>
          Share on Twitter
        </button>
        <button
          onClick={shareOnTelegram}
          className="w-full btn-secondary flex items-center justify-center gap-2 py-3"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.22-.054-.338-.373-.118l-6.871 4.326-2.962-.924c-.643-.204-.658-.643.136-.953l11.569-4.461c.542-.204 1.01.131.832.941z" />
          </svg>
          Share on Telegram
        </button>
        <button
          onClick={copyToClipboard}
          className="w-full btn-secondary flex items-center justify-center gap-2 py-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Copy Link
        </button>
      </div>
      {shared && (
        <div className="mt-4 p-3 bg-solana-green/10 border border-solana-green/20 rounded-lg text-center">
          <p className="text-sm text-solana-green font-semibold">✓ Thanks for sharing!</p>
        </div>
      )}
    </div>
  );
};

export default SocialShare;
