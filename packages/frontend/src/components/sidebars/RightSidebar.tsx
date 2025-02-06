<<<<<<< HEAD
import React, { ReactNode } from "react";
import { WalletBalance } from "../WalletBalance";

interface RightSidebarProps {
  children?: ReactNode;
}

export const RightSidebar: React.FC<RightSidebarProps> = () => {
  return (
    <aside className="h-full border-l border-neon-blue/10 bg-dark-secondary/50 backdrop-blur-lg">
      <div className="p-4">
        {/* Wallet Info Section */}
        <WalletBalance />

        {/* Current Order Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-light-gray">
            Current Order
          </h2>
          <div className="text-sm text-neon-blue/60">No active orders</div>
        </div>

        {/* Today's Specials */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-light-gray">
            Today's Specials
          </h2>
          <div className="space-y-2">
            {/* Special items will go here */}
            <div className="p-3 rounded-lg bg-dark-secondary border border-neon-blue/10 hover:border-neon-blue/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                  🌮
                </div>
                <div>
                  <h3 className="font-medium text-neon-blue">Taco Tuesday</h3>
                  <p className="text-sm text-light-gray/60">
                    20% off all tacos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
=======
import { WalletBalance } from "../WalletBalance";
import { ClockIcon } from "@heroicons/react/24/outline";

export const RightSidebar = () => {
  return (
    <aside className="h-full border-l border-neon-blue/10 bg-dark-secondary/50 backdrop-blur-lg">
      <div className="p-4 h-full overflow-y-scroll">
        <div className="space-y-6">
          {/* Wallet Balance Section */}
          <div className="space-y-4">
            <WalletBalance />
          </div>

          {/* Current Order Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-light-gray">
              Current Order
            </h2>
            <div className="text-sm text-neon-blue/60">No active orders</div>
          </div>

          {/* Today's Specials */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-light-gray">
              Today's Specials
            </h2>
            <div className="space-y-2">
              {/* Special items will go here */}
              <div className="p-3 rounded-lg bg-dark-secondary border border-neon-blue/10 hover:border-neon-blue/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                    🌮
                  </div>
                  <div>
                    <h3 className="font-medium text-neon-blue">Taco Tuesday</h3>
                    <p className="text-sm text-light-gray/60">
                      20% off all tacos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div className="h-full">
            <h2 className="text-lg font-semibold mb-4 text-light-gray flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-neon-blue" />
              Order History
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4">
              <div className="flex-shrink-0 w-64 p-3 rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors cursor-pointer border border-neon-blue/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center">
                    🍕
                  </div>
                  <div>
                    <h3 className="font-medium text-light-gray">Pizza Order</h3>
                    <p className="text-sm text-neon-blue/60">
                      2 items • $24.99
                    </p>
                    <span className="text-xs text-neon-blue/60 mt-1 block">
                      2h ago
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-64 p-3 rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors cursor-pointer border border-neon-blue/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center">
                    🍜
                  </div>
                  <div>
                    <h3 className="font-medium text-light-gray">Ramen Bowl</h3>
                    <p className="text-sm text-neon-blue/60">1 item • $12.99</p>
                    <span className="text-xs text-neon-blue/60 mt-1 block">
                      Yesterday
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 w-64 p-3 rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors cursor-pointer border border-neon-blue/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center">
                    🥗
                  </div>
                  <div>
                    <h3 className="font-medium text-light-gray">Salad Bowl</h3>
                    <p className="text-sm text-neon-blue/60">
                      3 items • $18.99
                    </p>
                    <span className="text-xs text-neon-blue/60 mt-1 block">
                      2 days ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
>>>>>>> 88b1ce773bdea785d9c43b491c4066c9596f775d
