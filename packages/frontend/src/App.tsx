import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoritesProvider } from "./context/FavoritesContext";
import { Marketplace } from "./pages/Marketplace";
import { CartProvider } from "./context/CartContext";
import { FilterProvider } from "./context/FilterContext";
import { OrderProvider } from "./context/OrderContext";
import { StarknetProvider } from "./components/providers/StarknetProvider";
import { useAccount, useConnect } from "@starknet-react/core";

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { status, address } = useAccount();
  const { connectors, connect } = useConnect();

  const handleConnect = async () => {
    const braavosConnector = connectors.find((c) => c.id === "braavos");
    if (braavosConnector) {
      try {
        await connect({ connector: braavosConnector });
      } catch (err: unknown) {
        console.error("Failed to connect Braavos wallet:", err);
      }
    } else {
      console.error("Please install Braavos wallet");
    }
  };

  if (status === "disconnected" || !address) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-primary">
        <div className="text-center p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-light-gray mb-2">
            Connect Braavos Wallet
          </h2>
          <p className="text-light-gray/60 mb-4">
            Please connect your Braavos wallet to access the dashboard
          </p>
          <button
            onClick={handleConnect}
            className="mt-4 px-6 py-2 bg-neon-blue text-black rounded-lg hover:bg-neon-blue/90 transition-colors"
          >
            Connect Braavos
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <StarknetProvider>
      <QueryClientProvider client={queryClient}>
        <OrderProvider>
          <FilterProvider>
            <CartProvider>
              <FavoritesProvider>
                <ThemeProvider>
                  <MobileMenuProvider>
                    <Router>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <DashboardLayout />
                            </ProtectedRoute>
                          }
                        />
                        <Route path="/marketplace" element={<Marketplace />} />
                      </Routes>
                    </Router>
                  </MobileMenuProvider>
                </ThemeProvider>
              </FavoritesProvider>
            </CartProvider>
          </FilterProvider>
        </OrderProvider>
      </QueryClientProvider>
    </StarknetProvider>
  );
}

export default App;
