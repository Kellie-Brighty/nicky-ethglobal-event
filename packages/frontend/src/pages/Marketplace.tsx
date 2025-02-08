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
import { useAccount, useContract, useReadContract, useProvider, Provider } from "@starknet-react/core";
import { Abi, Contract, BigNumberish } from "starknet";
import marketPlaceAbi from "./abis/marketPlaceabi.json";
import { fetchRestaurants, Restaurant } from '../contracts/restaurantData';
import { fetchAllMenuItems, MenuItems } from '../contracts/menuData';

import { shortString } from "starknet";

const decimals: BigNumberish = 18;

const CONTRACT_ADDRESS =
  "0x023be948e8a2be5eaeff47a267f7dc8a53d65e31c37aa95494dffecb677b639f";

  interface Restaurant {
    id: number;
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

  const hexToString = (hex: string): string => {
    try {
        // Remove "0x" prefix if present
        const hexString = hex.startsWith("0x") ? hex.substring(2) : hex;
        // Decode the hex string
        let str = "";
        for (let i = 0; i < hexString.length; i += 2) {
            str += String.fromCharCode(parseInt(hexString.substring(i, i + 2), 16));
        }
        return str;
    } catch (error) {
        console.error("Error converting hex to string:", error, hex);
        return ""; // Or handle the error appropriately
    }
};

  

 
  

  // Call when contract is ready
  // useEffect(() => {
  //   if (marketContract && address) {
  //     getRestaurants();
  //   }
  // }, [marketContract, address]);

  // Example function to call a write method
  // ... existing code ...

  

const isHex = (str: string): boolean => {
  return /^[0-9a-fA-F]+$/.test(str);
};

// const addRestaurant = async (restaurantData: { name: string; location: string; owner: string }) => {
//   const nethermindRpcUrl = "https://rpc.nethermind.io/sepolia-juno"; // Or your RPC URL

//   const { name, location, owner } = restaurantData;
//   const nameHex = shortString.encodeShortString(name);
//   const locationHex = shortString.encodeShortString(location);

//   try {
//       const response = await fetch(nethermindRpcUrl, {
//           method: "POST",
//           headers: {
//               "x-apikey": "07YwzEy7FrudmA77gvU3OlUsfrv6OCA6ypzbNMUJGtmbAQoxSDN1lHxVgR1htwyz", // Your API key
//               "Content-Type": "application/json",
//           },

//           body: JSON.stringify({
//             jsonrpc: "2.0",
//             method: "starknet_call",
//             params: {
//               request: {
//                 contract_address: "0x023be948e8a2be5eaeff47a267f7dc8a53d65e31c37aa95494dffecb677b639f",
//                 entry_point_selector: "0x00067cda55560dab9cb2e0a54be39fde5161cfbcaaefe7dbc3611bf92ec3fb50", // Entry point selector for add_restaurant.  Get this from your contract's ABI.
//                 calldata: [nameHex, locationHex, owner], // Pass parameters in calldata
//                 signature: [], //  If your function doesn't require a signature, leave this empty.  Otherwise, provide the signature.
//               },
//               block_id: "latest",
//             },
//             id: 1,
//           }),
          
//       });

//       if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData?.error?.message || response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("Add Restaurant Response:", data);
//       // Handle the response (transaction hash, etc.)

//   } catch (error) {
//       console.error("Error adding restaurant:", error);
//   }
// };

// const newRestaurant = {
//   name: "The Cozy Cafe",
//   location: "123 Main St, Anytown",
//   owner: "0x023be948e8a2be5eaeff47a267f7dc8a53d65e31c37aa95494dffecb677b639f", // Replace with the owner's StarkNet address (already in hex format)
// };

//addRestaurant(newRestaurant);

// ... existing code ...

useEffect(() => {
  const fetchAndTransformData = async () => {
      try {
          const restaurantsFromContract = await fetchRestaurants();
          const menuItems: MenuItem[] = restaurantsFromContract.map(restaurant => ({
              id: restaurant.id,
              name: restaurant.name,
              description: restaurant.location, 
              price: 0, 
              images: [`/images/${restaurant.imageUrlHash}.jpg`], 
              categories: [], 
              rating: 0, 
              deliveryTime: 0, 
              minimumOrder: 0, 
          }));
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
          console.log(restaurantsFromContract)
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
