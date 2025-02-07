import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "../../context/OrderContext";
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  BeakerIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface OrderTrackingProps {
  isCartSidebarOpen: boolean;
  isHistorySidebarOpen: boolean;
  orderId: string;
}

const deliverySound = new Audio("/delivery-notification.mp3"); // Add a sound file to your public folder

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  isCartSidebarOpen,
  isHistorySidebarOpen,
  orderId,
}) => {
  const { orders, updateOrderStatus } = useOrders();
  const order = orders.find((o) => o.id === orderId);
  const [progress, setProgress] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (order?.status === "on-the-way") {
      const deliveryTime = Math.random() * (40000 - 20000) + 20000; // Random time between 20-40 seconds
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = (elapsed / deliveryTime) * 100;

        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsFlashing(true);
          deliverySound.play();
          setTimeout(() => {
            updateOrderStatus(orderId, "delivered");
            setIsFlashing(false);
          }, 2000);
        } else {
          setProgress(currentProgress);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [order?.status, orderId]);

  if (!order) return null;

  const steps = [
    { id: "confirmed", label: "Order Confirmed", icon: CheckCircleIcon },
    { id: "preparing", label: "Preparing", icon: BeakerIcon },
    { id: "delivering", label: "Out for Delivery", icon: TruckIcon },
    { id: "completed", label: "Delivered", icon: CheckCircleIcon },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === order.status);

  // Calculate right margin based on open sidebars
  const getRightMargin = () => {
    if (!isCartSidebarOpen && !isHistorySidebarOpen) return "0px";
    if (isCartSidebarOpen && isHistorySidebarOpen) return "640px"; // 2 * 320px
    return "320px"; // 1 * 320px
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 left-4 right-4 p-4 bg-dark-secondary/90 border border-neon-blue/10 
                 backdrop-blur-sm rounded-lg lg:left-1/2 lg:w-[600px] lg:-translate-x-1/2 
                 transition-[right] duration-300 z-50`}
      style={{
        marginRight: getRightMargin(),
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-light-gray">Order Status</h3>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-neon-blue" />
          <span className="text-sm text-neon-blue">
            ETA: {order.estimatedDeliveryTime}
          </span>
        </div>
      </div>

      <div className="relative h-20">
        {/* Track line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-700 -translate-y-1/2">
          <motion.div
            className="h-full bg-neon-blue"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Moving vehicle */}
        <AnimatePresence>
          {order.status === "on-the-way" && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              initial={{ left: "0%" }}
              animate={{ left: `${progress}%` }}
              transition={{ duration: 0.1 }}
            >
              <TruckIcon className="w-8 h-8 text-neon-blue" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start point */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <MapPinIcon className="w-6 h-6 text-neon-blue" />
        </div>

        {/* End point */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <MapPinIcon className="w-6 h-6 text-green-400" />
        </div>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <span className="text-neon-blue/60">Restaurant</span>
        <span className="text-neon-blue/60">Your Location</span>
      </div>

      {/* Status indicator */}
      <div
        className={`mt-4 text-center font-medium ${
          order.status === "delivered" ? "text-green-400" : "text-neon-blue"
        }`}
      >
        {order.status === "preparing" && "Preparing your order..."}
        {order.status === "on-the-way" && "Order on the way!"}
        {order.status === "delivered" && "Order delivered!"}
      </div>
    </motion.div>
  );
};
