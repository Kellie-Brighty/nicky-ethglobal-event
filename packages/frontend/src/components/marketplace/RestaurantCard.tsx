import React from "react";
import { motion } from "framer-motion";
import {
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { Restaurant } from "../../data/products";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(restaurant)}
      className="bg-dark-secondary/50 rounded-lg overflow-hidden border border-neon-blue/10 
                hover:border-neon-blue/30 transition-colors cursor-pointer"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-light-gray mb-1">
          {restaurant.name}
        </h3>
        <p className="text-sm text-neon-blue/60 mb-3">
          {restaurant.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-light-gray">{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4 text-neon-blue" />
            <span className="text-light-gray">
              {restaurant.deliveryTime} min
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CurrencyDollarIcon className="w-4 h-4 text-green-400" />
            <span className="text-light-gray">
              Min {restaurant.minimumOrder}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {restaurant.categories.map((category) => (
            <span
              key={category.id}
              className="px-2 py-1 text-xs rounded-full bg-neon-blue/10 text-neon-blue"
            >
              {category.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
