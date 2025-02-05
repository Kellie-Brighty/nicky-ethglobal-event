import React from "react";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useOrders } from "../../context/OrderContext";
import { motion } from "framer-motion";

interface OrdersViewProps {
  onSwitchToCart: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onSwitchToCart }) => {
  const { orders, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading orders
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-80 bg-dark-secondary 
                 border-l border-neon-blue/10 shadow-2xl shadow-neon-blue/5 z-50"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "320px",
      }}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-neon-blue" />
            <h2 className="text-xl font-semibold text-light-gray">
              Your Orders
            </h2>
          </div>
          <button
            onClick={onSwitchToCart}
            className="px-3 py-1 rounded-lg text-sm hover:bg-neon-blue/10 text-neon-blue"
          >
            View Cart
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-dark-secondary/50 border border-neon-blue/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-light-gray font-medium">
                    Order #{orders.length - index}
                  </span>
                  <span className="text-neon-blue">{order.total}</span>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-neon-blue/60">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-light-gray">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-neon-blue/60 h-full">
              <ClockIcon className="w-16 h-16 mb-4 opacity-50" />
              <p>No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
