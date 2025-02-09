import { RestaurantItem } from "./RestaurantItem";
import { MenuItem } from "../../types/marketplace";

interface MarketplaceContentProps {
  activeTab: "featured" | "popular" | "restaurants";
  items: MenuItem[];
  onItemSelect: (id: string) => void;
}

export const MarketplaceContent: React.FC<MarketplaceContentProps> = ({
  activeTab,
  items,
  onItemSelect,
}) => {
  if (!items?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-neon-blue/60">
        No items found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeTab === "restaurants" ? (
        items.map((item) => (
          <RestaurantItem key={item.id} item={item} onSelect={onItemSelect} />
        ))
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-light-gray">
            No items found
          </h2>
        </div>
      )}
    </div>
  );
};
