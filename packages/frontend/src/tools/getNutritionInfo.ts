import { ToolConfig } from "./allTools";

interface NutritionInfoParams {
  food_item: string;
  portion_size?: string;
}

export const getNutritionInfoTool: ToolConfig<NutritionInfoParams> = {
  definition: {
    type: "function",
    function: {
      name: "get_nutrition_info",
      description: "Get detailed nutritional information for a food item",
      parameters: {
        type: "object",
        properties: {
          food_item: {
            type: "string",
            description: "Name of the food item",
          },
          portion_size: {
            type: "string",
            description: "Portion size (e.g., '100g', '1 cup')",
          },
        },
        required: ["food_item"],
      },
    },
  },
  handler: async (params: NutritionInfoParams) => {
    // Here you would integrate with a nutrition API
    // For now, returning mock data
    return {
      food_item: params.food_item,
      portion: params.portion_size || "100g",
      nutrients: {
        calories: "120 kcal",
        protein: "5g",
        carbs: "25g",
        fat: "2g",
        fiber: "3g",
      },
      health_rating: "Good",
      recommendations: "Good source of fiber and complex carbohydrates",
    };
  },
};
