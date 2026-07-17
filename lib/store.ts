import { create } from 'zustand';

interface AirdropStore {
  connected: boolean;
  wallet: string | null;
  isEligible: boolean | null;
  claimedAmount: bigint;
  totalAmount: bigint;
  setConnected: (connected: boolean) => void;
  setWallet: (wallet: string | null) => void;
  setEligible: (eligible: boolean) => void;
  setClaimedAmount: (amount: bigint) => void;
  setTotalAmount: (amount: bigint) => void;
}

export const useAirdropStore = create<AirdropStore>((set) => ({
  connected: false,
  wallet: null,
  isEligible: null,
  claimedAmount: BigInt(0),
  totalAmount: BigInt(0),
  setConnected: (connected) => set({ connected }),
  setWallet: (wallet) => set({ wallet }),
  setEligible: (eligible) => set({ isEligible: eligible }),
  setClaimedAmount: (amount) => set({ claimedAmount: amount }),
  setTotalAmount: (amount) => set({ totalAmount: amount }),
}));
