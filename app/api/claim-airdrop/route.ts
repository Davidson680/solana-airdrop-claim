import { NextRequest, NextResponse } from 'next/server';
import { validatePublicKey } from '@/lib/solana';
import type { ClaimRequest, ClaimResponse, ApiError } from '@/lib/types';

// Mock claims database - replace with actual database
const claimsDatabase: Record<string, { amount: string; txHash: string; timestamp: number }[]> = {};

// Mock eligibility database - replace with actual database
const eligibilityDatabase: Record<string, { amount: string; claimed: string }> = {
  'YOUR_WALLET_ADDRESS': {
    amount: '1000000000', // 1 SOL in lamports
    claimed: '0',
  },
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<ClaimResponse | ApiError>> {
  try {
    const body = (await request.json()) as ClaimRequest;
    const { wallet, amount } = body;

    // Validate inputs
    if (!wallet || !validatePublicKey(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json(
        { error: 'Invalid claim amount' },
        { status: 400 }
      );
    }

    // Check eligibility
    const eligibilityData = eligibilityDatabase[wallet];
    if (!eligibilityData) {
      return NextResponse.json(
        { error: 'Wallet not eligible for airdrop' },
        { status: 403 }
      );
    }

    const claimed = BigInt(eligibilityData.claimed);
    const claimAmount = BigInt(Math.floor(Number(amount) * 1e9));
    const available = BigInt(eligibilityData.amount) - claimed;

    if (claimAmount > available) {
      return NextResponse.json(
        { error: 'Claim amount exceeds available balance' },
        { status: 400 }
      );
    }

    // Simulate transaction
    const txHash = `${Math.random().toString(36).substring(2, 15)}${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    // Update claimed amount
    eligibilityDatabase[wallet].claimed = (claimed + claimAmount).toString();

    // Record claim
    if (!claimsDatabase[wallet]) {
      claimsDatabase[wallet] = [];
    }

    claimsDatabase[wallet].push({
      amount: claimAmount.toString(),
      txHash,
      timestamp: Math.floor(Date.now() / 1000),
    });

    return NextResponse.json(
      {
        success: true,
        txHash,
        amount: claimAmount.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error claiming airdrop:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
