import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'testnet' | 'mainnet-beta';
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(NETWORK);

export const connection = new Connection(RPC_URL, 'confirmed');

export const getProgramId = (): PublicKey => {
  const programId = process.env.NEXT_PUBLIC_AIRDROP_PROGRAM_ID;
  if (!programId) {
    throw new Error('NEXT_PUBLIC_AIRDROP_PROGRAM_ID is not set');
  }
  return new PublicKey(programId);
};

export const getTokenMint = (): PublicKey => {
  const tokenMint = process.env.NEXT_PUBLIC_AIRDROP_TOKEN_MINT;
  if (!tokenMint) {
    throw new Error('NEXT_PUBLIC_AIRDROP_TOKEN_MINT is not set');
  }
  return new PublicKey(tokenMint);
};

export const getAirdropAmount = (): bigint => {
  const amount = process.env.NEXT_PUBLIC_AIRDROP_AMOUNT || '1000000000';
  return BigInt(amount);
};

export const validatePublicKey = (key: string): boolean => {
  try {
    new PublicKey(key);
    return true;
  } catch {
    return false;
  }
};
