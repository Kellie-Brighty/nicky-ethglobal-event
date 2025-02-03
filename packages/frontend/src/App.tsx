import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import { WagmiConfig } from "wagmi";
import { config } from "./lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoritesProvider } from "./context/FavoritesContext";
import { useAccount } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Initialize web3modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!,
  themeMode: "dark",
});

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <FavoritesProvider>
          <ThemeProvider>
            <MobileMenuProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Router>
            </MobileMenuProvider>
          </ThemeProvider>
        </FavoritesProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
