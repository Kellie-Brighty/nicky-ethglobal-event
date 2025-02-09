import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Restaurant } from "../../data/products";
import { MenuItem } from "../../types/marketplace";
import { PRODUCTS } from "../../data/products";
import { TabView, type Tab } from "./TabView";
import { ProductCard } from "./ProductCard";
import { ProductDetail } from "./ProductDetail";

interface RestaurantViewProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export const RestaurantView: React.FC<RestaurantViewProps> = ({
  restaurant,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(
    restaurant.categories[0].id
  );
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const categoryTabs: Tab[] = restaurant.categories.map((cat) => ({
    id: cat.id,
    label: cat.name,
  }));

  const restaurantProducts = PRODUCTS.filter(
    (product: MenuItem) =>
      product.restaurantId === restaurant.id &&
      product.categoryId === activeCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onBack}
            className="mb-4 px-4 py-2 text-neon-blue border border-neon-blue/20 
                     rounded-lg hover:bg-neon-blue/10 transition-colors"
          >
            ← Back to Restaurants
          </button>
          <h2 className="text-2xl font-bold text-light-gray">
            {restaurant.name}
          </h2>
          <p className="text-neon-blue/60">{restaurant.description}</p>
        </div>
        <div className="flex items-center gap-4 text-neon-blue/60">
          <span>⭐ {restaurant.rating}</span>
          <span>🕒 {restaurant.deliveryTime} min</span>
          <span>💰 Min {restaurant.minimumOrder}</span>
        </div>
      </div>

      <TabView
        tabs={categoryTabs}
        activeTab={activeCategory}
        onTabChange={(id: string) => setActiveCategory(id)}
        showLocationFilter={false}
      />

      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {restaurantProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => setSelectedProduct(product)}
            />
          ))}
        </motion.div>
      </LayoutGroup>

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
