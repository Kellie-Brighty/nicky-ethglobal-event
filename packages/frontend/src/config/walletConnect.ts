import { defaultWagmiConfig } from "@web3modal/wagmi";
import { baseSepolia } from "wagmi/chains";

export const config = defaultWagmiConfig({
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!,
  chains: [baseSepolia], // Add the chains you want to support
  metadata: {
    name: "FoodieAI",
    description: "AI-powered Food Delivery dApp",
    url: window.location.origin,
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
});
