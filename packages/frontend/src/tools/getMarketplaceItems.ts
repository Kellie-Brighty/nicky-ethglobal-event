import { ToolConfig } from "./allTools";
import { MENU_ITEMS, MARKETPLACE_TABS } from "../data/products";

interface MarketplaceQueryParams {
  category?: string; // e.g., "featured", "popular", "restaurants"
  mood?: string; // e.g., "happy", "tired", "stressed"
  dietary?: string; // e.g., "vegan", "gluten-free"
  priceRange?: string; // e.g., "low", "medium", "high"
}

// Add type for valid categories
type MenuCategory = keyof typeof MENU_ITEMS;

export const getMarketplaceItemsTool: ToolConfig<MarketplaceQueryParams> = {
  definition: {
    type: "function",
    function: {
      name: "get_marketplace_items",
      description:
        "Query available items and restaurants in the marketplace based on various criteria",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["featured", "popular", "restaurants"],
            description: "Category of items to search for",
          },
          mood: {
            type: "string",
            enum: ["happy", "tired", "sad", "stressed", "neutral"],
            description: "User's current mood to match food recommendations",
          },
          dietary: {
            type: "string",
            enum: ["vegan", "vegetarian", "gluten-free", "keto", "none"],
            description: "Dietary preferences or restrictions",
          },
          priceRange: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "Price range preference",
          },
        },
        required: [],
      },
    },
  },
  handler: async (params: MarketplaceQueryParams) => {
    let items = [...MENU_ITEMS.featured, ...MENU_ITEMS.popular];

    // Filter by category if specified
    if (params.category && params.category in MENU_ITEMS) {
      items = MENU_ITEMS[params.category as MenuCategory] || items;
    }

    // Filter by price range
    if (params.priceRange) {
      items = items.filter((item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        switch (params.priceRange) {
          case "low":
            return price < 15;
          case "medium":
            return price >= 15 && price < 30;
          case "high":
            return price >= 30;
          default:
            return true;
        }
      });
    }

    // Filter by dietary preferences
    if (params.dietary && params.dietary !== "none") {
      items = items.filter((item) =>
        item.dietaryInfo?.some((info) =>
          info.toLowerCase().includes(params.dietary!.toLowerCase())
        )
      );
    }

    // Sort by relevance to mood if specified
    if (params.mood) {
      items.sort((a, b) => {
        const moodKeywords = getMoodKeywords(params.mood!);
        const scoreA = calculateMoodRelevance(a, moodKeywords);
        const scoreB = calculateMoodRelevance(b, moodKeywords);
        return scoreB - scoreA;
      });
    }

    return {
      items: items.slice(0, 5), // Return top 5 most relevant items
      total: items.length,
      filters: {
        applied: {
          category: params.category,
          mood: params.mood,
          dietary: params.dietary,
          priceRange: params.priceRange,
        },
      },
    };
  },
};

// Helper function to get mood-related keywords
function getMoodKeywords(mood: string): string[] {
  const moodMap = {
    happy: ["energizing", "fresh", "vibrant", "uplifting"],
    tired: ["energizing", "protein", "caffeine", "boost"],
    sad: ["comfort", "warm", "sweet", "soothing"],
    stressed: ["calming", "soothing", "healthy", "light"],
    neutral: ["balanced", "nutritious", "fresh"],
  };
  return moodMap[mood as keyof typeof moodMap] || [];
}

// Helper function to calculate relevance score
function calculateMoodRelevance(item: any, keywords: string[]): number {
  let score = 0;
  keywords.forEach((keyword) => {
    if (item.description.toLowerCase().includes(keyword.toLowerCase())) score++;
    if (item.name.toLowerCase().includes(keyword.toLowerCase())) score += 2;
  });
  return score;
}
