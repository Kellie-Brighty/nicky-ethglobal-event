import React, { ReactNode, useRef, useState, useEffect } from "react";
import { useMobileMenu } from "../../context/MobileMenuContext";
import { useFavorites } from "../../context/FavoritesContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  BoltIcon,
  HeartIcon,
  ShoppingBagIcon,
  AdjustmentsHorizontalIcon,
  StarIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface LeftSidebarProps {
  children?: ReactNode;
}

export const LeftSidebar = () => {
  const { closeMenu } = useMobileMenu();
  const touchStart = useRef(0);
  const threshold = 50;
  const { favorites } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const currentX = e.touches[0].clientX;
    const diff = touchStart.current - currentX;

    if (diff > threshold) {
      closeMenu();
    }
  };

  const handleTouchEnd = () => {
    touchStart.current = 0;
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowFavorites(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      className="h-full overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="p-6 space-y-8">
        {/* Order History Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-light-gray flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-neon-blue" />
            Order History
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors cursor-pointer border border-neon-blue/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center">
                    🍕
                  </div>
                  <div>
                    <h3 className="font-medium text-light-gray">Pizza Order</h3>
                    <p className="text-sm text-neon-blue/60">
                      2 items • $24.99
                    </p>
                  </div>
                </div>
                <span className="text-xs text-neon-blue/60">2h ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-light-gray flex items-center gap-2">
            <BoltIcon className="w-5 h-5 text-neon-blue" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            <button className="w-full px-4 py-3 text-left rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors border border-neon-blue/10 flex items-center gap-3 group">
              <ShoppingBagIcon className="w-5 h-5 text-neon-blue group-hover:text-neon-green transition-colors" />
              <span className="text-light-gray group-hover:text-neon-green transition-colors">
                Go to Marketplace
              </span>
            </button>
            <button className="w-full px-4 py-3 text-left rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors border border-neon-blue/10 flex items-center gap-3 group">
              <HeartIcon className="w-5 h-5 text-neon-blue group-hover:text-neon-green transition-colors" />
              <span className="text-light-gray group-hover:text-neon-green transition-colors">
                View Favorites
              </span>
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-light-gray flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-neon-blue" />
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-dark-secondary/50 border border-neon-blue/10">
              <span className="text-light-gray">Dietary Restrictions</span>
              <button className="text-neon-blue hover:text-neon-green transition-colors">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-dark-secondary/50 border border-neon-blue/10">
              <span className="text-light-gray">Cuisine Preferences</span>
              <button className="text-neon-blue hover:text-neon-green transition-colors">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
