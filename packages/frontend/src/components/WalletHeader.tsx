import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useMobileMenu } from "../context/MobileMenuContext";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { useConfig } from "wagmi";
import { injected } from "wagmi/connectors";

export const WalletHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toggleMenu } = useMobileMenu();
  const config = useConfig();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const chain = config.chains[0];
  const { connect, isPending: isConnecting, error } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() });
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-4 md:px-6 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="p-2 md:hidden rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <div className="text-2xl">🍳</div>
          <h1 className="text-xl font-bold hidden sm:block">FoodieAI</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          {error && (
            <div className="text-red-500 text-sm hidden md:block">
              {error.message}
            </div>
          )}
          {isConnected ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 sm:px-4 py-2 rounded-lg bg-orange-500 text-white text-sm sm:text-base flex items-center gap-2"
              >
                <span>
                  {address?.slice(0, 4)}...{address?.slice(-4)}
                </span>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Network
                    </div>
                    <div className="font-medium">
                      {chain?.name || `Chain ID: ${chain?.id}`}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      disconnect();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`
                px-4 py-2 rounded-lg text-white text-sm sm:text-base
                ${
                  isConnecting
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }
              `}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
