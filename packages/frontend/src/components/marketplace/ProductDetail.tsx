import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  HeartIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { MenuItem } from "../../types/marketplace";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

interface ProductDetailProps {
  product: MenuItem;
  onClose: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { addToFavorites, isInFavorites } = useFavorites();
  // const navigate = useNavigate();

  const handleImageChange = (direction: "next" | "prev") => {
    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="min-h-screen px-4 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto bg-dark-secondary rounded-lg overflow-hidden">
          <div className="relative aspect-video">
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIndex}
                src={product.image}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => handleImageChange("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleImageChange("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-light-gray">
                  {product.name}
                </h2>
                <p className="text-neon-blue/60">{product.price}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-neon-blue/60 hover:text-neon-blue hover:bg-neon-blue/10"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <p className="text-light-gray/80 mb-6">{product.description}</p>

            {product.ingredients && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-light-gray mb-2">
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.nutritionalInfo && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-light-gray mb-2">
                  Nutritional Info
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(product.nutritionalInfo).map(
                    ([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-neon-blue font-mono">{value}</div>
                        <div className="text-xs text-neon-blue/60 capitalize">
                          {key}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => addToFavorites(product)}
                className={`flex-1 py-3 rounded-lg border ${
                  isInFavorites(product.id)
                    ? "border-neon-green bg-neon-green/10 text-neon-green"
                    : "border-neon-blue/20 hover:bg-neon-blue/10 text-neon-blue"
                }`}
              >
                <HeartIcon className="w-5 h-5 inline-block mr-2" />
                {isInFavorites(product.id)
                  ? "In Favorites"
                  : "Add to Favorites"}
              </button>
              <button
                onClick={() => addToCart(product)}
                className="flex-1 py-3 rounded-lg bg-neon-blue text-black font-semibold hover:bg-neon-green transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5 inline-block mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
