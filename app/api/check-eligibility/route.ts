import { NextRequest, NextResponse } from 'next/server';
import { validatePublicKey } from '@/lib/solana';
import type { AirdropCheckRequest, AirdropCheckResponse, ApiError } from '@/lib/types';

// Mock eligibility database - replace with actual database
const eligibilityDatabase: Record<string, { amount: string; claimed: string }> = {
  // Example entries - replace with real data
  'YOUR_WALLET_ADDRESS': {
    amount: '1000000000', // 1 SOL in lamports
    claimed: '0',
  },
};

export async function POST(
  request: NextRequest
): Promise<NextResponse<AirdropCheckResponse | ApiError>> {
  try {
    const body = (await request.json()) as AirdropCheckRequest;
    const { wallet } = body;

    // Validate wallet address
    if (!wallet || !validatePublicKey(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Check eligibility from database
    const eligibilityData = eligibilityDatabase[wallet];

    if (!eligibilityData) {
      return NextResponse.json(
        {
          eligible: false,
          amount: '0',
          claimedAmount: '0',
          remaining: '0',
        },
        { status: 200 }
      );
    }

    const remaining = BigInt(eligibilityData.amount) - BigInt(eligibilityData.claimed);

    return NextResponse.json(
      {
        eligible: remaining > BigInt(0),
        amount: eligibilityData.amount,
        claimedAmount: eligibilityData.claimed,
        remaining: remaining.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
