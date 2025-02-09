import React, { createContext, useContext, useState } from "react";
import { MENU_ITEMS } from "../data/products";

interface FilterContextType<T> {
  selectedCategories: string[];
  selectedPriceRange: { min: number; max: number } | null;
  searchQuery: string;
  toggleCategory: (category: string) => void;
  setPriceRange: (range: { min: number; max: number } | null) => void;
  setSearchQuery: (query: string) => void;
  filteredProducts: T[];
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType<any> | undefined>(
  undefined
);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCategory = (category: string) => {
    if (category === "all") {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      return [...prev, category];
    });
  };

  const setPriceRange = (range: { min: number; max: number } | null) => {
    setSelectedPriceRange(range);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setSearchQuery("");
  };

  const filteredProducts = MENU_ITEMS.featured.filter((product) => {
    // Search query filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.categoryId);

    // Price filter
    const price = parseFloat(product.price.replace(" ETH", ""));
    const matchesPrice =
      !selectedPriceRange ||
      (price >= selectedPriceRange.min && price <= selectedPriceRange.max);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <FilterContext.Provider
      value={{
        selectedCategories,
        selectedPriceRange,
        searchQuery,
        toggleCategory,
        setPriceRange,
        setSearchQuery,
        filteredProducts,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = <T,>() => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider");
  }
  return context as FilterContextType<T>;
};
