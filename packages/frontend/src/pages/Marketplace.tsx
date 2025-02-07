import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilterSidebar } from "../components/marketplace/FilterSidebar";
import { SearchBar } from "../components/marketplace/SearchBar";
import { MARKETPLACE_TABS, MENU_ITEMS } from "../data/products";
import type { MenuItem } from "../data/products";
import { TabView } from "../components/marketplace/TabView";
import { ItemsHeader } from "../components/marketplace/ItemsHeader";
import { ItemDetailModal } from "../components/marketplace/ItemDetailModal";
import { useCart } from "../context/CartContext";
import { MarketplaceHeader } from "../components/marketplace/MarketplaceHeader";
import { MarketplaceContent } from "../components/marketplace/MarketplaceContent";
import { MarketplaceSidebar } from "../components/marketplace/MarketplaceSidebar";
import { BackButton } from "../components/BackButton";
import { useAccount, useContract, useProvider } from "@starknet-react/core";
import { Abi, Contract, BigNumberish } from "starknet";
import marketPlaceAbi from "./abis/marketPlaceabi.json";
import { shortString } from "starknet";
const decimals: BigNumberish = 18;

const CONTRACT_ADDRESS =
  "0x023be948e8a2be5eaeff47a267f7dc8a53d65e31c37aa95494dffecb677b639f";

interface Restaurant {
  id: BigNumberish;
  orderCount: BigNumberish;
  address: string;
  name: string;
  location: string;
  owner: string;
}

export const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "featured" | "popular" | "restaurants"
  >("featured");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<"cart" | "orders">("cart");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { items: cartItems, addItem: addToCart } = useCart();
  // const { addOrder } = useOrders();
  const { address, account } = useAccount();
  const [abi, setAbi] = useState<Abi | undefined>(undefined);
  const { provider } = useProvider();
  // const { contract } = useContract({ abi, address: CONTRACT_ADDRESS });
  const marketContract = new Contract(
    marketPlaceAbi,
    CONTRACT_ADDRESS,
    account
  );

  async function getAbi() {
    try {
      const classInfo = await provider.getClassAt(CONTRACT_ADDRESS);
      setAbi(classInfo.abi);
      console.log("abi", classInfo, CONTRACT_ADDRESS);
    } catch (error) {
      console.error("Error fetching ABI:", error);
    }
  }

  useEffect(() => {
    if (address) {
      getAbi();
    }
  }, [address]);

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

  const getRestaurants = async () => {
    if (!marketContract) return;

    try {
      const response = await marketContract.get_all_restaurants();
      console.log("Raw response:", response);

      // Parse the response array based on the contract's structure
      const restaurants = response.map((restaurant: any) => {
        // Convert BigNumberish values to readable format
        const id = Number(restaurant[0]);
        const orderCount = Number(restaurant[1]);
        // Convert felt252 address to hex string
        const address = "0x" + BigInt(restaurant[2]).toString(16);
        // Decode any shortStrings (if your contract returns them)
        const name = shortString.decodeShortString(restaurant[3] || "");
        const location = shortString.decodeShortString(restaurant[4] || "");
        const owner = "0x" + BigInt(restaurant[5] || 0).toString(16);

        return {
          id,
          orderCount,
          address,
          name: name || `Restaurant #${id}`,
          location: location || "Unknown Location",
          owner,
        };
      });

      console.log("Parsed restaurants:", restaurants);
      return restaurants;
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return [];
    }
  };

  // Call when contract is ready
  useEffect(() => {
    if (marketContract && address) {
      getRestaurants();
    }
  }, [marketContract, address]);

  // Example function to call a write method
  const addRestaurant = async (restaurantData: any) => {
    if (!marketContract) return;

    try {
      // Call contract function
      const response = await marketContract.add_restaurant(restaurantData);
      await response.wait(); // Wait for transaction
      console.log("Restaurant added:", response);
    } catch (error) {
      console.error("Error adding restaurant:", error);
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
