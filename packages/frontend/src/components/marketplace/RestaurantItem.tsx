import React from "react";
import { motion } from "framer-motion";
import {
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface RestaurantItemProps {
  item: {
    id: string;
    name: string;
    image: string;
    price: string;
    rating: number;
    prepTime: number;
    minOrder: number;
    imageKey: string;
    priceRange?: string;
    reviews?: number;
    distance?: string;
  };
  onSelect: (id: string) => void;
}

const REMOTE_IMAGES: { [key: string]: string } = {
  "cyber-ramen": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
  "quantum-sushi": "https://images.unsplash.com/photo-1553621042-f6e147245754",
  "digital-dumplings":
    "https://images.unsplash.com/photo-1563245372-f21724e3856d",
  "matrix-mochi":
    "https://images.unsplash.com/photo-1631642779329-b566747b6f49",
};

export const RestaurantItem: React.FC<RestaurantItemProps> = ({
  item,
  onSelect,
}) => {
  const isRestaurant = "priceRange" in item;

  return (
    <motion.div
      layoutId={`item-${item.id}`}
      onClick={() => onSelect(item.id)}
      className="bg-dark-secondary/50 rounded-lg overflow-hidden cursor-pointer
                border border-neon-blue/10 hover:border-neon-blue/30 transition-colors"
    >
      <motion.div
        layoutId={`image-${item.id}`}
        className="aspect-video overflow-hidden"
      >
        <img
          src={REMOTE_IMAGES[item.imageKey] || REMOTE_IMAGES["cyber-ramen"]}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </motion.div>
      <div className="p-4">
        <motion.h3
          layoutId={`name-${item.id}`}
          className="text-xl font-semibold text-light-gray mb-2"
        >
          {item.name}
        </motion.h3>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1" title="Rating">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-light-gray">{item.rating}</span>
            {isRestaurant && (
              <span className="text-neon-blue/60">({item.reviews})</span>
            )}
          </div>

          {isRestaurant ? (
            <>
              <div className="flex items-center gap-1" title="Distance">
                <MapPinIcon className="w-4 h-4 text-neon-blue" />
                <span className="text-light-gray">{item.distance}</span>
              </div>
              <div className="flex items-center gap-1" title="Price Range">
                <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
                <span className="text-light-gray">{item.priceRange}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1" title="Preparation Time">
                <ClockIcon className="w-4 h-4 text-neon-blue" />
                <span className="text-light-gray">{item.prepTime} min</span>
              </div>
              <div className="flex items-center gap-1" title="Price">
                <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
                <span className="text-light-gray">{item.price}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
