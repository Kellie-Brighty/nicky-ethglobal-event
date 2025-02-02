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
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-orange-500" />
            Order History
          </h2>
          <div className="space-y-3">
            {/* Sample Order Items */}
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    🍕
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      Pizza Order
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      2 items • $24.99
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  2h ago
                </span>
              </div>
            </div>
            {/* More order items... */}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <BoltIcon className="w-5 h-5 text-orange-500" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            <button className="w-full px-4 py-3 text-left rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center gap-3 group">
              <ShoppingBagIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                Go to Marketplace
              </span>
            </button>
            <div className="relative">
              <button
                className="w-full px-4 py-3 text-left rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center gap-3 group"
                onClick={() => setShowFavorites(!showFavorites)}
              >
                <HeartIcon
                  className={`w-5 h-5 text-orange-600 dark:text-orange-400 transition-transform ${
                    showFavorites ? "scale-110" : ""
                  }`}
                />
                <span className="text-gray-800 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  View Favorites
                </span>
              </button>

              <AnimatePresence>
                {showFavorites && (
                  <>
                    {/* Overlay - only show on mobile */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
                      onClick={() => setShowFavorites(false)}
                    />
                    <motion.div
                      ref={popupRef}
                      initial={{ opacity: 0, scale: 0.9, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{
                        type: "spring",
                        bounce: 0.3,
                        duration: 0.6,
                      }}
                      className={`
                        fixed w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl 
                        border border-gray-200 dark:border-gray-700 p-4 z-[70]
                        lg:fixed lg:left-0 lg:top-16 lg:bottom-0 lg:w-[280px] lg:rounded-none lg:border-0
                        lg:bg-white dark:lg:bg-gray-800
                        ${
                          !showFavorites
                            ? "translate-x-full lg:translate-x-0"
                            : "translate-x-0"
                        }
                        left-[300px] top-1/2 -translate-y-1/2
                        lg:translate-y-0
                      `}
                    >
                      {/* Add a backdrop blur overlay for the sidebar on desktop */}
                      <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-[280px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm -z-10" />

                      {/* Rest of the popup content */}
                      <div className="relative z-10 h-full overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-lg">
                            Your Favorite Meals
                          </h3>
                          <button
                            onClick={() => setShowFavorites(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>

                        {favorites.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8"
                          >
                            <div className="mb-4 flex justify-center">
                              <HeartIcon className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No favorites yet
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              Your favorite meals will appear here
                            </p>
                          </motion.div>
                        ) : (
                          <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {favorites.map((meal, index) => (
                              <motion.div
                                key={meal.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group cursor-pointer"
                              >
                                <div className="relative">
                                  {meal.imageUrl && (
                                    <img
                                      src={meal.imageUrl}
                                      alt={meal.name}
                                      className="w-16 h-16 rounded-lg object-cover"
                                    />
                                  )}
                                  {meal.rating && (
                                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1 flex items-center gap-0.5 text-xs">
                                      <StarIcon className="w-3 h-3" />
                                      {meal.rating}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm group-hover:text-orange-500 transition-colors">
                                    {meal.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {meal.price}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-orange-500" />
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span className="text-gray-700 dark:text-gray-300">
                Dietary Restrictions
              </span>
              <button className="text-orange-500 hover:text-orange-600 dark:text-orange-400">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span className="text-gray-700 dark:text-gray-300">
                Cuisine Preferences
              </span>
              <button className="text-orange-500 hover:text-orange-600 dark:text-orange-400">
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
