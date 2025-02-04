import { useAccount, useBalance, useChainId } from "wagmi";

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();

  return {
    isConnected,
    address,
    balance: balance?.formatted || "0",
    chainId: chainId || 0,
  };
}

export type WalletState = ReturnType<typeof useWallet>;
