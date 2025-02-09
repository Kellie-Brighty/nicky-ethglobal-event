// import ReactMarkdown from "react-markdown";
// import { ImageViewer } from "./ImageViewer";
// import { FoodItemSlider } from "./chat/FoodItemSlider";
import React from "react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    imageUrl?: string;
    type?: string;
    items?: MarketplaceItemDisplay[];
  };
}

interface MarketplaceItemDisplay {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export const MarketplaceItemsCarousel: React.FC<{
  items: MarketplaceItemDisplay[];
}> = ({ items }) => {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="flex gap-4 min-w-max">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 flex-shrink-0 bg-dark-secondary rounded-lg overflow-hidden border border-neon-blue/20"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-neon-blue font-bold mb-1">{item.name}</h3>
              <p className="text-light-gray/70 text-sm mb-2 line-clamp-2">
                {item.description}
              </p>
              <p className="text-neon-green font-bold">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const renderContent = () => {
    try {
      // Try to parse JSON content for marketplace items
      const data = JSON.parse(message.content);
      if (data.items && Array.isArray(data.items)) {
        return (
          <>
            <p className="mb-4 text-light-gray">
              Here are some items I found for you:
            </p>
            <MarketplaceItemsCarousel
              items={data.items.map(
                (item: {
                  id: string;
                  name: string;
                  description: string;
                  price: string;
                  images: string[];
                }) => ({
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  price: parseFloat(item.price.replace("$", "")),
                  image: item.images[0],
                })
              )}
            />
            <p className="mt-4 text-light-gray">
              Would you like me to help you place an order for any of these
              items?
            </p>
          </>
        );
      }
    } catch {
      // If not JSON or not marketplace items, render as normal text
      return <p className="text-light-gray">{message.content}</p>;
    }
    return <p className="text-light-gray">{message.content}</p>;
  };

  return (
    <div
      className={`flex ${
        message.role === "assistant" ? "justify-start" : "justify-end"
      } mb-4`}
    >
      <div className="max-w-[80%] bg-dark-secondary rounded-lg p-4">
        {renderContent()}
      </div>
    </div>
  );
};
