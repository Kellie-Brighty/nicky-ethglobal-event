import React, { useRef, useState, useEffect } from "react";
// import { useMobileMenu } from "../../context/MobileMenuContext";
import { useFavorites } from "../../context/FavoritesContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BoltIcon,
  HeartIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../../context/ThemeContext";
import { format } from "date-fns";
import { Toast } from "../Toast";
import { LoadingSpinner } from "../LoadingSpinner";
import { OpenAI } from "openai";

import { useNavigate } from "react-router-dom";
import { Contract } from "starknet";
import { connect } from "get-starknet";

const hexToString = (hex: string): string => {
  try {
    const hexString = hex.startsWith("0x") ? hex.substring(2) : hex;
    let str = "";
    for (let i = 0; i < hexString.length; i += 2) {
      str += String.fromCharCode(parseInt(hexString.substring(i, i + 2), 16));
    }
    return str;
  } catch (error) {
    console.error("Error converting hex to string:", error, hex);
    return "";
  }
};

function feltToString(felt: bigint): string {
  let hex = felt.toString(16); // Convert BigInt to hex string

  // Ensure hex string has even length (each byte should be 2 hex characters)
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }

  // Convert hex to ASCII string
  return (
    hex
      .match(/.{1,2}/g) // Split into 2-character chunks
      ?.map((byte) => String.fromCharCode(parseInt(byte, 16))) // Convert each to char
      .join("") || ""
  ); // Join chars into a readable string
}

// TODO: Future Enhancement - Smart Contract Integration
// This implementation currently generates meal suggestions directly via AI.
// In the future, this should query the smart contract to:
// 1. Find restaurants in the Base ecosystem
// 2. Filter for meals matching the user's mood
// 3. Get real-time prices in BASE tokens
// 4. Enable direct on-chain ordering

// Add type for mood
interface Mood {
  emoji: string;
  label: string;
  color: string;
}

// Add these interfaces
interface MealSuggestion {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  emoji: string;
}

// Add this near other interfaces
interface ParsedMeal {
  name: string;
  description: string;
  price: string;
  emoji: string;
}

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-green-400" },
  { emoji: "😴", label: "Tired", color: "bg-blue-400" },
  { emoji: "😢", label: "Sad", color: "bg-purple-400" },
  { emoji: "😰", label: "Stressed", color: "bg-red-400" },
  { emoji: "😐", label: "Neutral", color: "bg-yellow-400" },
];

// Add utility function for Base price formatting

export const LeftSidebar = () => {
  // const { closeMenu } = useMobileMenu();
  // const touchStart = useRef(0);
  // const threshold = 50;
  const { favorites } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (diff < -50) {
      setShowFavorites(false);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowFavorites(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Add this function inside LeftSidebar component

  // Add this function to generate image using DALL-E
  const generateMealImage = async (
    client: OpenAI,
    meal: ParsedMeal
  ): Promise<string> => {
    try {
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: `A professional food photography style image of ${meal.name}. ${meal.description}. The image should be appetizing and well-lit, on a clean background.`,
        n: 1,
        size: "1024x1024",
      });

      return response.data[0]?.url || "/images/meals/placeholder.jpg";
    } catch (error) {
      console.error(`Error generating image for ${meal.name}:`, error);
      return "/images/meals/placeholder.jpg";
    }
  };

  // Update parseMealsFromResponse to generate images

  const getMoodBasedMeals = async (mood: Mood) => {
    try {
      setIsLoading(true);

      const starknet = await connect();
      if (!starknet) throw new Error("Failed to connect to StarkNet");

      await starknet.enable();
      const account = starknet.account;
      if (!account) throw new Error("Please connect your wallet first");

      // Use restaurant service to get menu items
      const CONTRACT_ADDRESS =
        "0x01f0f631a3837ebe4747efef168dc9ef3837513ce37c637726ff183ea3740cbb";

      const contract = new Contract(
        [
          {
            name: "get_restaurant_menu",
            type: "function",
            inputs: [{ name: "restaurant_id", type: "core::integer::u64" }],
            outputs: [
              {
                type: "core::array::Array::<(core::felt252, core::felt252, core::integer::u64, core::felt252, core::integer::u64)>",
              },
            ],
            state_mutability: "view",
          },
        ],
        CONTRACT_ADDRESS,
        account
      );

      // Get menus from all restaurants (you might want to limit this)
      const restaurantIds = ["1", "2", "3"]; // Add your restaurant IDs
      const allMenus = await Promise.all(
        restaurantIds.map((id) => contract.get_restaurant_menu(id))
      );

      // Filter and transform menu items based on mood
      const moodKeywords: Record<string, string[]> = {
        Happy: ["energizing", "fresh", "vibrant", "colorful"],
        Tired: ["energizing", "protein", "healthy", "boost"],
        Sad: ["comfort", "warm", "sweet", "hearty"],
        Stressed: ["calming", "healthy", "light", "fresh"],
        Neutral: ["balanced", "nutritious", "classic"],
      };

      const keywords = moodKeywords[mood.label];

      const suggestions = await Promise.all(
        allMenus
          .flat()
          .filter((item) => {
            const description = feltToString(item[1]).toLowerCase();
            return keywords.some((keyword) => description.includes(keyword));
          })
          .map(async (item, index) => {
            const name = feltToString(item[0]);
            const description = feltToString(item[1]);
            const contractImage = hexToString(item[3].toString());

            // If contract image is empty or invalid, generate one using DALL-E
            let imageUrl = contractImage;
            if (!imageUrl || imageUrl === "") {
              const client = new OpenAI({
                apiKey: process.env.REACT_APP_OPENAI_API_KEY,
              });
              imageUrl = await generateMealImage(client, {
                name,
                description,
                price: item[2].toString(),
                emoji: "🍽️",
              });
            }

            return {
              id: index.toString(),
              name,
              description,
              price: item[2].toString(),
              imageUrl,
              emoji: "🍽️",
            };
          })
      );

      setMealSuggestions(suggestions);
    } catch (error) {
      console.error("Error getting menu items:", error);
      setToast({
        message: "Failed to fetch menu items. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSelection = async (mood: Mood) => {
    setSelectedMood(mood);
    await getMoodBasedMeals(mood);
  };

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <aside
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="h-full relative"
      >
        <div className="p-6 space-y-8 h-full overflow-y-scroll">
          {/* New Time & Mood Section */}
          <div className="border-t border-neon-blue/20 pt-6 ">
            {/* Time Display */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-neon-blue">
                {timeString}
              </h2>
              <p className="text-light-gray">
                Good {format(currentTime, "a") === "am" ? "Morning" : "Evening"}
                !
              </p>
            </div>

            {/* Mood Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-light-gray mb-4">
                How are you feeling?
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {moods.map((mood) => (
                  <motion.button
                    key={mood.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoodSelection(mood)}
                    className={`p-2 rounded-lg ${
                      selectedMood?.label === mood.label
                        ? "bg-neon-blue/20 border-2 border-neon-blue"
                        : "bg-dark-primary"
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs text-light-gray">{mood.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Meal Suggestions */}
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-semibold text-light-gray mb-4">
                  Recommended for you
                </h3>
                {isLoading ? <LoadingSpinner /> : null}
                <div className="flex overflow-x-auto gap-4 pb-4">
                  {mealSuggestions.map((meal) => (
                    <motion.div
                      key={meal.id}
                      whileHover={{ scale: 1.05 }}
                      className="flex-shrink-0 w-48 rounded-lg overflow-hidden bg-dark-secondary/50 border border-neon-blue/10 cursor-pointer"
                    >
                      <div className="relative h-32">
                        <img
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-neon-blue/10 backdrop-blur-sm flex items-center justify-center">
                          {meal.emoji}
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-light-gray">
                          {meal.name}
                        </h4>
                        <p className="text-xs text-light-gray/60 mt-1">
                          {meal.description}
                        </p>
                        <p className="text-sm text-neon-blue mt-2">
                          {meal.price}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          {/* Quick Actions Section */}
          <div className="h-full">
            <h2 className="text-lg font-semibold mb-4 text-light-gray flex items-center gap-2">
              <BoltIcon className="w-5 h-5 text-neon-blue" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button
                className="w-full px-4 py-3 text-left rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors border border-neon-blue/10 flex items-center gap-3 group"
                onClick={() => navigate("/marketplace")}
              >
                <ShoppingBagIcon className="w-5 h-5 text-neon-blue group-hover:text-neon-green transition-colors" />
                <span className="text-light-gray group-hover:text-neon-green transition-colors">
                  Go to Marketplace
                </span>
              </button>
              <button
                onClick={() => setShowFavorites(true)}
                className="w-full px-4 py-3 text-left rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors border border-neon-blue/10 flex items-center gap-3 group"
              >
                <HeartIcon className="w-5 h-5 text-neon-blue group-hover:text-neon-green transition-colors" />
                <span className="text-light-gray group-hover:text-neon-green transition-colors">
                  View Favorites ({favorites.length})
                </span>
              </button>
            </div>
          </div>
          {/* Animated Favorites Modal */}
          <AnimatePresence>
            {showFavorites && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                {/* Animated blur background */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                  onClick={() => setShowFavorites(false)}
                />

                <motion.div
                  className="bg-dark-secondary/90 backdrop-blur-md p-6 rounded-2xl max-w-md w-full border border-neon-blue/20 shadow-2xl shadow-neon-blue/20 relative"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <motion.h2
                      className="text-2xl font-bold text-neon-blue"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Your Favorites
                    </motion.h2>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowFavorites(false)}
                      className="p-2 rounded-full hover:bg-neon-blue/10"
                    >
                      <XMarkIcon className="w-6 h-6 text-neon-blue" />
                    </motion.button>
                  </div>

                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {favorites.length > 0 ? (
                      favorites.map((favorite, index) => (
                        <motion.div
                          key={favorite.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * (index + 1) }}
                          className="p-4 rounded-lg bg-black/50 border border-neon-blue/10 hover:border-neon-blue/30 transition-colors backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-4">
                            {favorite.imageUrl && (
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={favorite.imageUrl}
                                alt={favorite.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <h3 className="font-medium text-light-gray">
                                {favorite.name}
                              </h3>
                              <p className="text-neon-blue">{favorite.price}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-light-gray/60 py-8"
                      >
                        No favorites yet. Start adding some meals! ✨
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Preferences Section */}
          {/* <div>
            <h2 className="text-lg font-semibold mb-4 text-light-gray flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="w-5 h-5 text-neon-blue" />
              Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-dark-secondary/50 border border-neon-blue/10">
                <span className="text-light-gray">Dietary Restrictions</span>
                <button className="text-neon-blue hover:text-neon-green transition-colors">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-dark-secondary/50 border border-neon-blue/10">
                <span className="text-light-gray">Cuisine Preferences</span>
                <button className="text-neon-blue hover:text-neon-green transition-colors">
                  Edit
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </aside>

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LeftSidebar;
