import React from "react";
import { sepolia } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  InjectedConnector,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  // Create connectors array directly instead of using useInjectedConnectors
  const connectors = [
    new InjectedConnector({
      options: {
        id: "argentX",
      },
    }),
    new InjectedConnector({
      options: {
        id: "braavos",
      },
    }),
  ];

  return (
    <StarknetConfig
      chains={[sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
