import React from "react";
import { motion } from "framer-motion";
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Product } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
}) => {
  const { addToCart } = useCart();
  const { addToFavorites, isInFavorites } = useFavorites();

  return (
    <motion.div
      layout
      layoutId={`product-${product.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-dark-secondary/50 rounded-lg overflow-hidden border border-neon-blue/10 
                hover:border-neon-blue/30 transition-colors group"
    >
      <motion.div
        layoutId={`image-${product.id}`}
        className="relative aspect-video overflow-hidden cursor-pointer"
        onClick={onSelect}
      >
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {product.isTrending && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-neon-blue/90 text-black text-xs rounded-full">
            Trending
          </div>
        )}
        {product.hasSpecialOffer && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-neon-green/90 text-black text-xs rounded-full">
            Special Offer
          </div>
        )}
      </motion.div>

      <motion.div layoutId={`content-${product.id}`} className="p-4">
        <motion.h3
          layoutId={`title-${product.id}`}
          className="text-lg font-semibold text-light-gray mb-1 cursor-pointer"
          onClick={onSelect}
        >
          {product.name}
        </motion.h3>
        <motion.p
          layoutId={`description-${product.id}`}
          className="text-sm text-neon-blue/60 mb-3"
        >
          {product.description}
        </motion.p>

        <motion.div
          layoutId={`actions-${product.id}`}
          className="flex items-center justify-between"
        >
          <span className="text-neon-blue font-mono">{product.price}</span>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToFavorites(product);
              }}
              className={`p-2 rounded-lg border ${
                isInFavorites(product.id)
                  ? "border-neon-green bg-neon-green/10 text-neon-green"
                  : "border-neon-blue/20 hover:bg-neon-blue/10 text-neon-blue"
              }`}
            >
              <HeartIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="p-2 rounded-lg bg-neon-blue text-black hover:bg-neon-green transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
