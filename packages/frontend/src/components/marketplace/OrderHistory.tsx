import React from "react";
import { motion } from "framer-motion";
import { useOrders } from "../../context/OrderContext";
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";


const statusConfig = {
  preparing: {
    icon: ClockIcon,
    label: "Preparing",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400",
  },
  "on-the-way": {
    icon: TruckIcon,
    label: "On the way",
    color: "text-blue-400",
    bgColor: "bg-blue-400",
  },
  delivered: {
    icon: CheckCircleIcon,
    label: "Delivered",
    color: "text-green-400",
    bgColor: "bg-green-400",
  },
};

const OrderTracker: React.FC<{
  status: "preparing" | "on-the-way" | "delivered";
}> = ({ status }) => {
  const steps = ["preparing", "on-the-way", "delivered"];
  const currentIdx = steps.indexOf(status);

  return (
    <div className="relative mt-4">
      <div className="flex justify-between mb-2">
        {steps.map((step, idx) => {
          const config = statusConfig[step as keyof typeof statusConfig];
          const Icon = config.icon;
          const isActive = idx <= currentIdx;

          return (
            <div key={step} className="flex flex-col items-center w-1/3">
              <div
                className={`rounded-full p-2 ${
                  isActive ? config.color : "text-gray-400"
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`text-sm mt-1 ${
                  isActive ? "text-light-gray" : "text-gray-400"
                }`}
              >
                {config.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700">
        <motion.div
          className="h-full bg-neon-blue"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export const OrderHistory: React.FC = () => {
  const { orders } = useOrders();

  return (
    <div
      className="fixed right-0 top-0 h-full w-80 bg-dark-secondary border-l border-neon-blue/10 
                    shadow-2xl shadow-neon-blue/5 p-6 overflow-y-auto"
    >
      <h2 className="text-xl font-semibold text-light-gray mb-6 flex items-center gap-2">
        <ClockIcon className="w-6 h-6 text-neon-blue" />
        Order History
      </h2>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-black/20 border border-neon-blue/10"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-light-gray">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-neon-blue/60">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-neon-blue font-mono">{order.total}</span>
              </div>

              <div className="text-sm text-neon-blue/60 mb-2">
                {order.items.length} items
              </div>

              <OrderTracker status={order.status} />

              <div className="mt-4 flex items-center gap-2 text-sm text-neon-blue/60">
                <MapPinIcon className="w-4 h-4" />
                <span>{order.deliveryAddress}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-neon-blue/60">
          <ClockIcon className="w-16 h-16 mb-4 opacity-50" />
          <p>No orders yet</p>
        </div>
      )}
    </div>
  );
};
