import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useMobileMenu } from "../context/MobileMenuContext";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useNavigate } from "react-router-dom";
import nataLogo from "../assets/images/nata-logo.jpg";

export const WalletHeader = () => {
  const { toggleMenu } = useMobileMenu();
  const { address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleConnect = async () => {
    try {
      // Add timeout handling
      const connectPromise = connect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout")), 30000)
      );

      await Promise.race([connectPromise, timeoutPromise]);
    } catch (error: unknown) {
      console.error("Connection error:", error);
      if (error instanceof Error && error.message === "Connection timeout") {
        console.log("Connection timed out. Please try again.");
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-dark-primary border-b border-neon-blue/10">
      <div className="flex items-center gap-6">
        <img
          src={nataLogo}
          alt="Nata"
          className="h-12 w-auto object-contain hover:opacity-90 transition-opacity cursor-pointer"
          onClick={() => navigate("/")}
        />
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-dark-secondary rounded-lg transition-colors lg:hidden"
        >
          <Bars3Icon className="w-6 h-6 text-light-gray" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="relative">
          {!address ? (
            <button
              onClick={handleConnect}
              className="px-4 py-2 rounded-lg bg-neon-blue text-black"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-light-gray">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button
                onClick={handleDisconnect}
                className="text-red-400 hover:text-red-300"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
