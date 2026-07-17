import { NextRequest, NextResponse } from 'next/server';
import { validatePublicKey } from '@/lib/solana';
import type { ClaimHistoryRequest, ClaimHistoryResponse, ApiError } from '@/lib/types';

// Mock claims database - replace with actual database
const claimsDatabase: Record<string, { amount: string; txHash: string; timestamp: number; id: string }[]> = {};

export async function POST(
  request: NextRequest
): Promise<NextResponse<ClaimHistoryResponse | ApiError>> {
  try {
    const body = (await request.json()) as ClaimHistoryRequest;
    const { wallet } = body;

    // Validate wallet address
    if (!wallet || !validatePublicKey(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Get claims from database
    const claims = claimsDatabase[wallet] || [];

    return NextResponse.json(
      {
        claims: claims.map((claim, index) => ({
          id: claim.id || `claim-${index}`,
          amount: claim.amount,
          timestamp: claim.timestamp,
          txHash: claim.txHash,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching claim history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
