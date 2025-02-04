import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useMobileMenu } from "../context/MobileMenuContext";
import { useAccount, useDisconnect } from "wagmi";
import { useConfig } from "wagmi";
import { useNavigate } from "react-router-dom";

export const WalletHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { toggleMenu } = useMobileMenu();
  const config = useConfig();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  return (
    <header className="h-16 border-b border-neon-blue/10 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 md:px-6 h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="p-2 md:hidden rounded-lg hover:bg-dark-secondary border border-neon-blue/20"
          >
            <Bars3Icon className="w-6 h-6 text-neon-blue" />
          </button>

          <div className="text-2xl">🍳</div>
          <h1 className="text-xl font-bold hidden sm:block text-neon-blue">
            FoodieAI
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-3 sm:px-4 py-2 rounded-lg bg-neon-blue/20 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue/30 text-sm sm:text-base flex items-center gap-2 transition-colors"
            >
              <span>
                {address?.slice(0, 4)}...{address?.slice(-4)}
              </span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-secondary/80 backdrop-blur-sm rounded-lg shadow-lg border border-neon-blue/20">
                <div className="px-4 py-2 border-b border-neon-blue/20">
                  <div className="text-sm text-neon-blue/60">Network</div>
                  <div className="font-medium text-light-gray">
                    {config.chains[0]?.name ||
                      `Chain ID: ${config.chains[0]?.id}`}
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleDisconnect();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-dark-secondary transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
