import React, { useRef, useState, useEffect } from "react";
import { useMobileMenu } from "../../context/MobileMenuContext";
import { useFavorites } from "../../context/FavoritesContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  BoltIcon,
  HeartIcon,
  ShoppingBagIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export const LeftSidebar = () => {
  const { closeMenu } = useMobileMenu();
  const touchStart = useRef(0);
  const threshold = 50;
  const { favorites } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
      className="h-full overflow-y-auto relative"
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
            <button
              onClick={() => navigate("/marketplace")}
              className="w-full px-4 py-3 text-left rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors border border-neon-blue/10 flex items-center gap-3 group"
            >
              <ShoppingBagIcon className="w-5 h-5 text-neon-blue group-hover:text-neon-green transition-colors" />

              <span className="text-light-gray group-hover:text-neon-green transition-colors">
                Go to Marketplace
              </span>
            </button>
            <button
              onClick={() => setShowFavorites(true)}
              className="w-full px-4 py-3 text-left rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors border border-neon-blue/10 flex items-center gap-3 group"
            >
              <HeartIcon className="w-5 h-5 text-neon-blue group-hover:text-neon-green transition-colors" />
              <span className="text-light-gray group-hover:text-neon-green transition-colors">
                View Favorites ({favorites.length})
              </span>
            </button>
          </div>
        </div>

        {/* Animated Favorites Modal */}
        <AnimatePresence>
          {showFavorites && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {/* Animated blur background */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                onClick={() => setShowFavorites(false)}
              />

              <motion.div
                className="bg-dark-secondary/90 backdrop-blur-md p-6 rounded-2xl max-w-md w-full border border-neon-blue/20 shadow-2xl shadow-neon-blue/20 relative"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.h2
                    className="text-2xl font-bold text-neon-blue"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Your Favorites
                  </motion.h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFavorites(false)}
                    className="p-2 rounded-full hover:bg-neon-blue/10"
                  >
                    <XMarkIcon className="w-6 h-6 text-neon-blue" />
                  </motion.button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {favorites.length > 0 ? (
                    favorites.map((favorite, index) => (
                      <motion.div
                        key={favorite.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * (index + 1) }}
                        className="p-4 rounded-lg bg-black/50 border border-neon-blue/10 hover:border-neon-blue/30 transition-colors backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-4">
                          {favorite.imageUrl && (
                            <motion.img
                              whileHover={{ scale: 1.05 }}
                              src={favorite.imageUrl}
                              alt={favorite.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-medium text-light-gray">
                              {favorite.name}
                            </h3>
                            <p className="text-neon-blue">{favorite.price}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-light-gray/60 py-8"
                    >
                      No favorites yet. Start adding some meals! ✨
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
