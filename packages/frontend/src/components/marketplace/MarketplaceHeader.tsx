import {
  FunnelIcon,
  ShoppingCartIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MarketplaceHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleFilter: () => void;
  sidebarView: "cart" | "orders";
  setSidebarView: (view: "cart" | "orders") => void;
  cartItemsCount: number;
  tabs: Tab[];
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  activeTab,
  setActiveTab,
  toggleFilter,
  sidebarView,
  setSidebarView,
  cartItemsCount,
  tabs,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <div className="flex gap-4">
          {tabs?.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                  ${
                    activeTab === tab.id
                      ? "bg-neon-blue text-black"
                      : "text-neon-blue hover:bg-neon-blue/10"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={toggleFilter}
          className="p-2 rounded-lg hover:bg-neon-blue/10 text-neon-blue"
        >
          <FunnelIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSidebarView("cart")}
          className={`p-2 rounded-lg relative ${
            sidebarView === "cart"
              ? "text-neon-blue bg-neon-blue/10"
              : "text-neon-blue/60 hover:bg-neon-blue/10"
          }`}
        >
          <ShoppingCartIcon className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-neon-blue text-black w-5 h-5 
                           rounded-full text-xs flex items-center justify-center font-medium"
            >
              {cartItemsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setSidebarView("orders")}
          className={`p-2 rounded-lg ${
            sidebarView === "orders"
              ? "text-neon-blue bg-neon-blue/10"
              : "text-neon-blue/60 hover:bg-neon-blue/10"
          }`}
        >
          <ClockIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
