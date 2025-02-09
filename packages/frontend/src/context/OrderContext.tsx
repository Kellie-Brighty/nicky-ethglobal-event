import React, { createContext, useContext, useState } from "react";
import { CartItemType } from "./CartContext";

export interface Order {
  id: string;
  items: CartItemType[];
  total: string;
  status: "preparing" | "on-the-way" | "delivered";
  timestamp: Date;
  deliveryAddress: string;
  estimatedDeliveryTime: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItemType[], total: string) => void;
  confirmOrder: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  addOrder: (order: Order) => void;
  isProcessing: boolean;
  error: Error | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createOrder = (items: CartItemType[], total: string) => {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      items,
      total,
      status: "preparing",
      timestamp: new Date(),
      deliveryAddress: "",
      estimatedDeliveryTime: "15-20 mins",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const confirmOrder = async () => {
    setIsProcessing(true);
    try {
      // Implementation
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [...prev, order]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        confirmOrder,
        updateOrderStatus,
        addOrder,
        isProcessing,
        error,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
