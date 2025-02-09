import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterSidebar } from "../components/marketplace/FilterSidebar";
import { SearchBar } from "../components/marketplace/SearchBar";
import { MARKETPLACE_TABS, MENU_ITEMS } from "../data/products";
import { MenuItem } from "../types/marketplace";
import { TabView } from "../components/marketplace/TabView";
import { ItemsHeader } from "../components/marketplace/ItemsHeader";
import { ItemDetailModal } from "../components/marketplace/ItemDetailModal";
import { useCart } from "../context/CartContext";
import { MarketplaceHeader } from "../components/marketplace/MarketplaceHeader";
import { MarketplaceContent } from "../components/marketplace/MarketplaceContent";
import { MarketplaceSidebar } from "../components/marketplace/MarketplaceSidebar";
import { BackButton } from "../components/BackButton";
import { fetchRestaurants } from "../contracts/restaurantData";
import { fetchAllMenuItems } from "../contracts/menuData";

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "featured" | "popular" | "restaurants"
  >("featured");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<"cart" | "orders">("cart");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { items: cartItems, addItem: addToCart } = useCart();

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      images: item.images,
      imageKey: item.imageKey,
      rating: item.rating,
      prepTime: item.prepTime,
      minOrder: item.minOrder,
      restaurantId: item.restaurantId,
      categoryId: item.categoryId,
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

  useEffect(() => {
    const fetchAndTransformData = async () => {
      try {
        const restaurantsFromContract = await fetchRestaurants();
        const menuItems: MenuItem[] = restaurantsFromContract.map(
          (restaurant) => ({
            id: restaurant.id,
            name: restaurant.name,
            description: restaurant.location,
            price: "0.00",
            image: `/images/${restaurant.imageUrl}.jpg`,
            images: [`/images/${restaurant.imageUrl}.jpg`],
            imageKey: restaurant.imageUrl || "default",
            rating: 0,
            prepTime: 30,
            minOrder: 0,
            restaurantId: restaurant.id,
            categoryId: "restaurant",
          })
        );
        setMenuItems(menuItems);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };
    fetchAndTransformData();
  }, []);

  useEffect(() => {
    const fetchAndTransformData2 = async () => {
      try {
        const restaurantsFromContract = await fetchAllMenuItems();
        console.log(restaurantsFromContract);
      } catch (error) {
        console.error("Error fetching and transforming data:", error);
      }
    };
    fetchAndTransformData2();
  }, []);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

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
              items={menuItems}
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
              item={{
                ...MENU_ITEMS[activeTab].find(
                  (item) => item.id === selectedItem
                )!,
                description:
                  MENU_ITEMS[activeTab].find((item) => item.id === selectedItem)
                    ?.description || "",
                dietaryInfo:
                  MENU_ITEMS[activeTab].find((item) => item.id === selectedItem)
                    ?.dietaryInfo || [],
                spicyLevel:
                  MENU_ITEMS[activeTab].find((item) => item.id === selectedItem)
                    ?.spicyLevel || 0,
              }}
              onClose={() => setSelectedItem(null)}
              onAddToCart={() => {
                if (
                  MENU_ITEMS[activeTab].find((item) => item.id === selectedItem)
                ) {
                  handleAddToCart(
                    MENU_ITEMS[activeTab].find(
                      (item) => item.id === selectedItem
                    )!
                  );
                }
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
