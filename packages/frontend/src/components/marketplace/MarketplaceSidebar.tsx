import { AnimatePresence } from "framer-motion";
import { Cart } from "./Cart";
import { OrdersView } from "./OrdersView";

interface MarketplaceSidebarProps {
  view: "cart" | "orders";
  onViewChange: (view: "cart" | "orders") => void;
}

export const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  view,
  onViewChange,
}) => {
  return (
    <AnimatePresence mode="wait">
      {view === "cart" ? (
        <Cart key="cart" onSwitchToOrders={() => onViewChange("orders")} />
      ) : (
        <OrdersView key="orders" onSwitchToCart={() => onViewChange("cart")} />
      )}
    </AnimatePresence>
  );
};
