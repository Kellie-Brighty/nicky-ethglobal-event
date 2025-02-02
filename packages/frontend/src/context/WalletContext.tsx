import React, { createContext, useContext } from "react";
import { useWallet, WalletState } from "../hooks/useWallet";

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: (address: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();

  return (
    <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
}
