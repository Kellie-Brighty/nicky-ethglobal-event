import React, { ReactNode } from "react";
import { WalletBalance } from "../WalletBalance";

interface RightSidebarProps {
  children?: ReactNode;
}

export const RightSidebar: React.FC<RightSidebarProps> = () => {
  return (
    <aside className="h-full border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
      <div className="p-4">
        {/* Wallet Info Section */}
        <WalletBalance />

        {/* Current Order Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Current Order</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            No active orders
          </div>
        </div>

        {/* Today's Specials */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Today's Specials</h2>
          <div className="space-y-2">{/* Special items will go here */}</div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
