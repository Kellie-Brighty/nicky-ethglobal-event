import { useEffect, useState } from "react";
import { useAccount as useWagmiAccount } from "wagmi";
import { useAccount as useStarknetAccount } from "@starknet-react/core";

export const useWalletConnection = () => {
  const { address: baseAddress, isConnecting: isBaseConnecting } = useWagmiAccount();
  const { address: starkAddress, isConnecting: isStarkConnecting } = useStarknetAccount();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setIsConnected(Boolean(baseAddress || starkAddress));
  }, [baseAddress, starkAddress]);

  return {
    isConnected,
    baseAddress,
    starkAddress,
    isConnecting: isBaseConnecting || isStarkConnecting,
  };
}; 