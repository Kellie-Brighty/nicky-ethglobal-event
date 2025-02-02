import OpenAI from "openai";
import { ToolConfig } from "./allTools";

interface HealthTipsParams {
  category?: string; // e.g., "weight loss", "muscle gain", "general wellness"
  dietary_preference?: string; // e.g., "vegan", "keto", "vegetarian"
}

interface HealthTip {
  tip: string;
  imageUrl: string;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional food photography style image of: ${prompt}`,
      n: 1,
      size: "1024x1024",
    });

    return response.data[0].url || "";
  } catch (error) {
    console.error("Image generation error:", error);
    return "";
  }
}

export const getHealthTipsTool: ToolConfig<HealthTipsParams> = {
  definition: {
    type: "function",
    function: {
      name: "get_health_tips",
      description:
        "Get personalized health and nutrition tips with appealing visuals",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description:
              "Category of health tips (e.g., weight loss, muscle gain, general wellness)",
            enum: [
              "weight loss",
              "muscle gain",
              "general wellness",
              "nutrition",
              "meal prep",
            ],
          },
          dietary_preference: {
            type: "string",
            description: "Specific dietary preference or restriction",
            enum: [
              "vegan",
              "vegetarian",
              "keto",
              "paleo",
              "gluten-free",
              "none",
            ],
          },
        },
        required: [],
      },
    },
  },
  handler: async (params: HealthTipsParams): Promise<HealthTip> => {
    const category = params.category || "general wellness";
    const dietaryPreference = params.dietary_preference || "none";

    // Generate a relevant health tip based on parameters
    const tipResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a health and nutrition expert. Provide a concise, actionable health tip.",
        },
        {
          role: "user",
          content: `Generate a health tip for ${category} ${
            dietaryPreference !== "none"
              ? `with focus on ${dietaryPreference} diet`
              : ""
          }. Make it specific and actionable.`,
        },
      ],
    });

    const tip =
      tipResponse.choices[0]?.message?.content ||
      "Stay hydrated and eat balanced meals.";

    // Generate an image prompt based on the tip
    const imagePromptResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "Convert the health tip into a clear, visual image prompt for DALL-E.",
        },
        {
          role: "user",
          content: `Convert this health tip into a food photography prompt: "${tip}"`,
        },
      ],
    });

    const imagePrompt = imagePromptResponse.choices[0]?.message?.content || tip;
    const imageUrl = await generateImage(imagePrompt);

    return {
      tip,
      imageUrl,
    };
  },
};
