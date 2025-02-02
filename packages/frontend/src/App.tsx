import React from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import { ThemeProvider } from "./context/ThemeContext";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import { WagmiConfig } from "wagmi";
import { config } from "./lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoritesProvider } from "./context/FavoritesContext";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <ThemeProvider>
            <MobileMenuProvider>
              <DashboardLayout />
            </MobileMenuProvider>
          </ThemeProvider>
        </FavoritesProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
