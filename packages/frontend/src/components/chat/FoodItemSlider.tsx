import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useRef } from "react";

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  dietaryInfo?: string[];
}

interface FoodItemSliderProps {
  items: FoodItem[];
  onOrderClick: (item: FoodItem) => void;
}

export const FoodItemSlider = ({ items, onOrderClick }: FoodItemSliderProps) => {
  const [_, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setScrollPosition(containerRef.current.scrollLeft + scrollAmount);
    }
  };

  return (
    <div className="relative w-full my-4 group">
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="flex-none w-72 snap-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-dark-secondary rounded-lg overflow-hidden border border-neon-blue/10 hover:border-neon-blue/30 transition-all">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-neon-blue mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-light-gray/60 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-neon-green font-mono">{item.price}</span>
                  <button
                    onClick={() => onOrderClick(item)}
                    className="px-4 py-2 rounded-lg bg-neon-blue/10 hover:bg-neon-blue text-neon-blue hover:text-black transition-colors"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
}; 