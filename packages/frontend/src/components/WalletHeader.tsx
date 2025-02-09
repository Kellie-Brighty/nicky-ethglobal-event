import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useMobileMenu } from "../context/MobileMenuContext";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import nataAvatar from "../assets/images/natavatar-nobg.png";

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
    // Only clear wallet connection state
    localStorage.removeItem("walletConnected");

    // Disconnect wallet
    disconnect();

    // Navigate to home page
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-dark-primary border-b border-neon-blue/10">
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center">
          <img
            src={nataAvatar}
            alt="Nata"
            className="h-16 w-auto object-contain hover:opacity-90 transition-opacity cursor-pointer"
            onClick={() => navigate("/")}
          />
          <motion.h1
            className="text-xl md:text-2xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-neon-blue via-purple-500 to-neon-green bg-clip-text text-transparent bg-[length:300%] animate-gradientFlow">
                Trex-Food
              </span>
              <motion.span
                className="absolute -inset-1 bg-gradient-to-r from-neon-blue/30 via-purple-500/30 to-neon-green/30 blur-lg opacity-75 group-hover:opacity-100 transition-all duration-300"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </span>
          </motion.h1>
        </div>
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
              Connect Braavos
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
