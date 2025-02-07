// import React, { createContext, useContext } from "react";
// import { useWallet, WalletState } from "../hooks/useWallet";

// interface WalletContextType extends WalletState {
//   connect: () => Promise<void>;
//   disconnect: () => void;
//   updateBalance: (address: string) => Promise<void>;
// }

// const WalletContext = createContext<WalletContextType | undefined>(undefined);

// export function WalletProvider({ children }: { children: React.ReactNode }) {
//   const wallet = useWallet();

//   const connect = async () => {
//     // Implement connect logic if needed
//   };

//   const disconnect = () => {
//     // Implement disconnect logic if needed
//   };

//   const updateBalance = async (address: string) => {
//     if (address) {
//       // Implement balance update logic if needed
//       console.log(`Updating balance for address: ${address}`);
//     }
//   };

//   return (
//     <WalletContext.Provider
//       value={{
//         ...wallet,
//         connect,
//         disconnect,
//         updateBalance,
//       }}
//     >
//       {children}
//     </WalletContext.Provider>
//   );
// }

// export function useWalletContext() {
//   const context = useContext(WalletContext);
//   if (!context) {
//     throw new Error("useWalletContext must be used within WalletProvider");
//   }
//   return context;
// }
