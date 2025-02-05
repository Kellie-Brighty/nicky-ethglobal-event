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
import { ThreadManager } from "../../utils/threadManager";

import { createAssistant } from "../../openai_folder/createAssistant";

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
  image: string;
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
  { emoji: "😔", label: "Sad", color: "bg-purple-400" },
  { emoji: "😤", label: "Stressed", color: "bg-red-400" },
  { emoji: "🤔", label: "Neutral", color: "bg-yellow-400" },
];

// Add utility function for Base price formatting
const formatBasePrice = (priceUSD: string): string => {
  // Remove '$' and convert to number
  const usdAmount = parseFloat(priceUSD.replace("$", ""));
  // Approximate BASE/USD rate (this should ideally come from an oracle)
  const baseRate = 0.00047; // Example rate
  const baseAmount = usdAmount * baseRate;
  return `${baseAmount.toFixed(4)} BASE`;
};

export const LeftSidebar = () => {
  // const { closeMenu } = useMobileMenu();
  // const touchStart = useRef(0);
  // const threshold = 50;
  const { favorites } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  // const navigate = useNavigate();
  // const { theme } = useTheme();


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
  const getMoodBasedPrompt = (mood: Mood): string => {
    const prompts: Record<string, string> = {
      Happy:
        "I'm feeling happy and energetic! What meals would keep my good mood going?",
      Tired:
        "I'm feeling tired and need an energy boost. What meals would help?",
      Sad: "I'm feeling down today. What comfort food might cheer me up?",
      Stressed:
        "I'm stressed and need calming foods. What would you recommend?",
      Neutral: "I'm looking for balanced meal options. What would you suggest?",
    };
    return prompts[mood.label] || prompts.Neutral;
  };

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
  const parseMealsFromResponse = async (
    response: string,
    client: OpenAI
  ): Promise<MealSuggestion[]> => {
    try {
      const jsonMatch =
        response.match(/```json\n([\s\S]*?)\n```/) ||
        response.match(/\[([\s\S]*?)\]/);
      const jsonStr = jsonMatch ? jsonMatch[1] : response;

      const meals: ParsedMeal[] = JSON.parse(jsonStr);

      // Generate images for all meals in parallel
      const mealsWithImages = await Promise.all(
        meals.map(async (meal, index) => {
          const imageUrl = await generateMealImage(client, meal);
          return {
            id: `meal-${index}`,
            name: meal.name,
            description: meal.description,
            image: imageUrl,
            // Convert USD price to BASE
            price: formatBasePrice(meal.price),
            emoji: meal.emoji,
          };
        })
      );

      return mealsWithImages;
    } catch (error) {
      console.error("Error parsing meals:", error);
      return [];
    }
  };

  // Update handleMoodSelection to use async parseMealsFromResponse
  const handleMoodSelection = async (mood: Mood) => {
    setSelectedMood(mood);
    setIsLoading(true);
    setMealSuggestions([]);

    try {
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      // Create assistant
      const assistant = await createAssistant(client);

      const prompt = getMoodBasedPrompt(mood);
      const systemMessage = `Based on the user's mood, suggest 3-4 meals. Format your response as a JSON array of objects, each with: name, description, price, and an appropriate emoji. Example: [{"name": "Energy Bowl", "description": "Fresh quinoa bowl with avocado", "price": "$14.99", "emoji": "🥗"}]`;

      // Create thread and add messages
      const thread = await client.beta.threads.create();
      await client.beta.threads.messages.create(thread.id, {
        role: "user",
        content: prompt,
      });

      // Create and run with the new assistant
      const run = await client.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
        instructions: systemMessage,
      });

      const response = await ThreadManager.waitForResponse(
        client,
        thread.id,
        run.id
      );
      const suggestions = await parseMealsFromResponse(response, client);

      setMealSuggestions(suggestions);
      setToast({
        message: "Got your personalized suggestions!",
        type: "success",
      });
    } catch (error) {
      console.error("Error getting meal suggestions:", error);
      setToast({
        message: "Could not get meal suggestions. Try again?",
        type: "error",
      });

      // Fallback suggestions
      setMealSuggestions([
        {
          id: "fallback-1",
          name: "Comfort Bowl",
          description: "A warm, nourishing bowl of goodness",
          image: "/images/meals/comfort-bowl.jpg",
          price: "0.0061 BASE", // Updated from $12.99
          emoji: "🍜",
        },
        {
          id: "fallback-2",
          name: "Energy Plate",
          description: "Fresh ingredients to boost your mood",
          image: "/images/meals/energy-plate.jpg",
          price: "0.0070 BASE", // Updated from $14.99
          emoji: "🥗",
        },
        {
          id: "fallback-3",
          name: "Sweet Treat",
          description: "A delightful dessert to lift your spirits",
          image: "/images/meals/sweet-treat.jpg",
          price: "0.0042 BASE", // Updated from $8.99
          emoji: "🍰",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
                {format(currentTime, "h:mm a")}
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
                          src={meal.image}
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
              <button className="w-full px-4 py-3 text-left rounded-lg bg-dark-secondary/50 hover:bg-dark-secondary transition-colors border border-neon-blue/10 flex items-center gap-3 group">
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
