import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, PRICE_RANGES } from "../../data/products";
import { useFilter } from "../../context/FilterContext";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    selectedCategories,
    toggleCategory,
    selectedPriceRange,
    setPriceRange,
    clearFilters,
  } = useFilter();

  const handleApplyFilters = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-80 bg-dark-secondary border-l border-neon-blue/10 z-50"
          >
            <div className="p-4 border-b border-neon-blue/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-light-gray">
                  Filters
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-neon-blue hover:text-neon-blue/80"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-neon-blue hover:text-neon-blue/80"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-medium text-light-gray mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 text-neon-blue/80 hover:text-neon-blue cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="form-checkbox rounded border-neon-blue/30 text-neon-blue focus:ring-neon-blue/30 bg-transparent"
                      />
                      <span className="capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-medium text-light-gray mb-3">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label
                      key={range.label}
                      className="flex items-center space-x-2 text-neon-blue/80 hover:text-neon-blue cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="price-range"
                        checked={
                          selectedPriceRange?.min === range.min &&
                          selectedPriceRange?.max === range.max
                        }
                        onChange={() => setPriceRange(range)}
                        className="form-radio border-neon-blue/30 text-neon-blue focus:ring-neon-blue/30 bg-transparent"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neon-blue/10">
              <button
                onClick={handleApplyFilters}
                className="w-full py-3 bg-neon-blue text-white rounded-lg font-semibold hover:bg-neon-green transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
