import { defaultWagmiConfig } from "@web3modal/wagmi/react";
import { mainnet, sepolia, base, baseGoerli } from "wagmi/chains";

if (!import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID) {
  throw new Error("Missing VITE_WALLET_CONNECT_PROJECT_ID");
}

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const metadata = {
  name: "Base Food",
  description: "AI-powered food ordering on Base",
  url: "https://basefood.xyz", // TODO: Update with your website
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const config = defaultWagmiConfig({
  chains: [base, baseGoerli, mainnet, sepolia], // Add chains you want to support
  projectId,
  metadata,
});
