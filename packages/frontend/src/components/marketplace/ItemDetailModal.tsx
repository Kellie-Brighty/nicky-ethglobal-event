import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  HeartIcon as HeartOutline,
  FireIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon, ClockIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
// import { useCart } from "../../context/CartContext";

// interface NutritionInfo {
//   calories: number;
//   protein: number;
//   carbs: number;
//   fat: number;
// }

interface ItemDetails {
  id: string;
  name: string;
  images?: string[];
  price: string;
  rating: number;
  prepTime: number;
  description: string;
  calories?: number;
  nutritionInfo?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  dietaryInfo: string[];
  spicyLevel: number;
}

interface ItemDetailModalProps {
  item: ItemDetails;
  onClose: () => void;
  onAddToCart: (item: ItemDetails) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const { addItem } = useCart();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (item.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + (item.images?.length || 1)) % (item.images?.length || 1)
    );
  };

  // const handleAddToCart = () => {
  //   addItem({
  //     id: item.id,
  //     name: item.name,
  //     price: item.price,
  //     quantity: 1,
  //     image: item.images?.[0] || "/placeholder.jpg",
  //   });
  //   onAddToCart(item);
  // };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // You can add additional logic here to persist favorites
  };

  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-secondary rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Carousel */}
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={item.images?.[currentImageIndex] || "/placeholder.jpg"}
              alt={`${item.name} ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {item.images?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-neon-blue" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-light-gray">{item.name}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neon-blue/10 text-neon-blue/60 hover:text-neon-blue"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-light-gray">{item.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-5 h-5 text-neon-blue" />
              <span className="text-light-gray">{item.prepTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <FireIcon className="w-5 h-5 text-orange-500" />
              <div className="flex gap-1">
                {Array.from({ length: item.spicyLevel }).map((_, i) => (
                  <span key={i} className="text-orange-500">
                    ●
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-neon-blue/80 mb-6">{item.description}</p>

          {item.calories && (
            <div className="flex items-center gap-2 text-light-gray/60">
              <span>{item.calories} calories</span>
            </div>
          )}

          {item.nutritionInfo && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {item.nutritionInfo.protein && (
                <div className="text-center">
                  <div className="text-neon-blue">
                    {item.nutritionInfo.protein}g
                  </div>
                  <div className="text-xs text-light-gray/60">Protein</div>
                </div>
              )}
              {item.nutritionInfo.carbs && (
                <div className="text-center">
                  <div className="text-neon-blue">
                    {item.nutritionInfo.carbs}g
                  </div>
                  <div className="text-xs text-light-gray/60">Carbs</div>
                </div>
              )}
              {item.nutritionInfo.fat && (
                <div className="text-center">
                  <div className="text-neon-blue">
                    {item.nutritionInfo.fat}g
                  </div>
                  <div className="text-xs text-light-gray/60">Fat</div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-light-gray mb-3">
                Dietary Info
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.dietaryInfo.map((info) => (
                  <span
                    key={info}
                    className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-sm"
                  >
                    {info}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-6">
            <button
              onClick={() => onAddToCart(item)}
              className="flex-1 py-3 rounded-lg bg-neon-blue text-white font-semibold hover:bg-neon-green transition-colors"
            >
              Add to Cart - {item.price}
            </button>
            <button
              onClick={toggleFavorite}
              className="p-3 rounded-lg border border-neon-blue/20 text-neon-blue hover:bg-neon-blue/10 transition-colors"
            >
              {isFavorite ? (
                <HeartSolid className="w-6 h-6 text-red-500" />
              ) : (
                <HeartOutline className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
