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
