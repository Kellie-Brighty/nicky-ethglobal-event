import React, { useState, useEffect } from "react";
import {
  FunnelIcon,
  ShoppingCartIcon,
  ChevronRightIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  FireIcon,
  SparklesIcon,
  Square3Stack3DIcon,
  StarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { ProductGrid } from "../components/marketplace/ProductGrid";
import { Cart } from "../components/marketplace/Cart";
import { FilterSidebar } from "../components/marketplace/FilterSidebar";
import { SearchBar } from "../components/marketplace/SearchBar";
import { OrderHistory } from "../components/marketplace/OrderHistory";
import { OrderTracking } from "../components/marketplace/OrderTracking";
import { RestaurantCard } from "../components/marketplace/RestaurantCard";
import { MARKETPLACE_TABS, MENU_ITEMS } from "../data/products";
import type { MenuItem } from "../data/products";
import { TabView } from "../components/marketplace/TabView";
import { RestaurantView } from "../components/marketplace/RestaurantView";
import type { IconType } from "react-icon";
import { ItemsHeader } from "../components/marketplace/ItemsHeader";
import { RestaurantItem } from "../components/marketplace/RestaurantItem";
import { ItemDetailModal } from "../components/marketplace/ItemDetailModal";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { OrdersView } from "../components/marketplace/OrdersView";
import { MarketplaceHeader } from "../components/marketplace/MarketplaceHeader";
import { MarketplaceContent } from "../components/marketplace/MarketplaceContent";
import { MarketplaceSidebar } from "../components/marketplace/MarketplaceSidebar";
import { BackButton } from "../components/BackButton";

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "featured" | "popular" | "restaurants"
  >("featured");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<"cart" | "orders">("cart");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { items: cartItems, addItem: addToCart } = useCart();
  const { addOrder } = useOrders();

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.images?.[0] || "",
      description: item.description,
    });
    setSidebarView("cart"); // Switch to cart view when adding items
  };

  const handleItemSelect = (itemId: string) => {
    const item = MENU_ITEMS[activeTab].find((item) => item.id === itemId);
    if (item) {
      setSelectedItem(itemId);
    }
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      <div className="p-4 flex items-center gap-4">
        <BackButton />
        <h1 className="text-2xl font-bold text-neon-blue">Marketplace</h1>
      </div>
      <motion.div className="flex flex-col h-full bg-black lg:flex-row" layout>
        <motion.div
          className="flex-1 p-6"
          layout
          style={{
            width: "100%",
            marginRight: "320px",
            transition: "margin-right 0.3s ease-in-out",
          }}
        >
          <MarketplaceHeader
            activeTab={activeTab}
            setActiveTab={(tab) =>
              setActiveTab(tab as "featured" | "popular" | "restaurants")
            }
            toggleFilter={() => setIsFilterOpen((prev) => !prev)}
            sidebarView={sidebarView}
            setSidebarView={setSidebarView}
            cartItemsCount={cartItems.length}
            tabs={MARKETPLACE_TABS}
          />

          <SearchBar />

          <TabView
            tabs={MARKETPLACE_TABS}
            activeTab={activeTab}
            onTabChange={(tabId) =>
              setActiveTab(tabId as "featured" | "popular" | "restaurants")
            }
            showLocationFilter={true}
          />

          <div className="p-4 lg:p-6 overflow-y-auto h-[calc(100vh-200px)]">
            <ItemsHeader
              title={
                activeTab === "featured"
                  ? "Featured Items"
                  : activeTab === "popular"
                  ? "Popular Restaurants"
                  : "All Restaurants"
              }
            />
            <MarketplaceContent
              activeTab={activeTab}
              items={MENU_ITEMS[activeTab]}
              onItemSelect={handleItemSelect}
            />
          </div>
        </motion.div>

        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        <MarketplaceSidebar view={sidebarView} onViewChange={setSidebarView} />

        {/* Item Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <ItemDetailModal
              item={
                MENU_ITEMS[activeTab].find((item) => item.id === selectedItem)!
              }
              onClose={() => setSelectedItem(null)}
              onAddToCart={(item) => {
                handleAddToCart(item);
                setSelectedItem(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Marketplace;
