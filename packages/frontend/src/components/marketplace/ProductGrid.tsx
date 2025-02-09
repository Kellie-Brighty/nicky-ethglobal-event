import React from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useFavorites } from "../../context/FavoritesContext";

import { useFilter } from "../../context/FilterContext";
import { MenuItem } from "../../types/marketplace";

interface ProductGridProps {
  restaurantId: string | null;
  filterTrending?: boolean;
  filterSpecialOffers?: boolean;
  isNearbyOnly?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  restaurantId,
  filterTrending = false,
  filterSpecialOffers = false,
  isNearbyOnly = false,
}) => {
  const { filteredProducts } = useFilter<MenuItem>();
  const { addToCart } = useCart();
  const { addToFavorites, isInFavorites } = useFavorites();

  // Apply filters
  const displayProducts = filteredProducts.filter((product) => {
    if (restaurantId) return product.restaurantId === restaurantId;
    if (isNearbyOnly) return product.isNearby;
    if (filterTrending) return product.isTrending;
    if (filterSpecialOffers) return product.hasSpecialOffer;
    return true;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      {displayProducts.length === 0 ? (
        <div className="col-span-full text-center text-neon-blue/60 py-8">
          No products found matching your criteria
        </div>
      ) : (
        displayProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-secondary/50 rounded-lg overflow-hidden border border-neon-blue/10 hover:border-neon-blue/30 transition-colors"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-light-gray mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-neon-blue/60 mb-3">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-neon-blue font-mono">
                  {product.price}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => addToFavorites(product)}
                    className={`p-2 rounded-lg border ${
                      isInFavorites(product.id)
                        ? "border-neon-green bg-neon-green/10"
                        : "border-neon-blue/20 hover:bg-neon-blue/10"
                    }`}
                  >
                    <HeartIcon className="w-5 h-5 text-neon-blue" />
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-lg border border-neon-blue bg-neon-blue/10 hover:bg-neon-blue/20"
                  >
                    <ShoppingCartIcon className="w-5 h-5 text-neon-blue" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};
