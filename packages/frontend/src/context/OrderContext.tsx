import React, { createContext, useContext, useState } from "react";
import { Product } from "../types";
import { CartItemType } from "./CartContext";

interface Order {
  id: string;
  items: CartItemType[];
  total: string;
  status: "preparing" | "on-the-way" | "delivered";
  timestamp: Date;
  deliveryAddress: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItemType[], total: string) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (items: CartItemType[], total: string) => {
    const newOrder: Order = {
      id: `ORD${Math.random().toString(36).substr(2, 9)}`,
      items,
      total,
      status: "preparing",
      timestamp: new Date(),
      deliveryAddress: "123 Cyber Street, Neo City", // You can make this dynamic
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Simulate order progress
    setTimeout(() => {
      updateOrderStatus(newOrder.id, "on-the-way");
      setTimeout(() => {
        updateOrderStatus(newOrder.id, "delivered");
      }, 10000);
    }, 5000);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
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
