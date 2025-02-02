import { useState, useCallback, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export interface WalletState {
  address: string | null;
  balance: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

// Rest of the file can be removed since we're using wagmi hooks now
