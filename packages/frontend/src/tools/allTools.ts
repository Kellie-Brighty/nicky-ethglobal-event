import { getHealthTipsTool } from "./getHealthTips";
import { getNutritionInfoTool } from "./getNutritionInfo";
import { getMarketplaceItemsTool } from "./getMarketplaceItems";

export interface ToolConfig<T = any> {
  definition: {
    type: "function";
    function: {
      name: string;
      description: string;
      parameters: {
        type: "object";
        properties: Record<string, unknown>;
        required: string[];
      };
    };
  };
  handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {
  get_health_tips: getHealthTipsTool,
  getNutritionInfo: getNutritionInfoTool,
  get_marketplace_items: getMarketplaceItemsTool,
};
