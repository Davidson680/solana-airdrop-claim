export interface AirdropCheckRequest {
  wallet: string;
}

export interface AirdropCheckResponse {
  eligible: boolean;
  amount: string;
  claimedAmount: string;
  remaining: string;
}

export interface ClaimRequest {
  wallet: string;
  amount: string;
}

export interface ClaimResponse {
  success: boolean;
  txHash: string;
  amount: string;
}

export interface ClaimHistoryRequest {
  wallet: string;
}

export interface ClaimHistoryResponse {
  claims: {
    id: string;
    amount: string;
    timestamp: number;
    txHash: string;
  }[];
}

export interface ApiError {
  error: string;
  code?: string;
}
