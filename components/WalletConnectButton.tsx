'use client';

import { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnectButton: FC = () => {
  return (
    <div className="wallet-adapter-button-container">
      <WalletMultiButton
        labels={{
          'change-wallet': 'Change',
          connecting: 'Connecting ...',
          'copy-address': 'Copy',
          copied: 'Copied',
          disconnect: 'Disconnect',
          'has-wallet': 'Connect Wallet',
          'no-wallet': 'Select Wallet',
        }}
      />
    </div>
  );
};

export default WalletConnectButton;
