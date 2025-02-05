import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAccount, useBalance } from "wagmi";
import { useCart } from "../../context/CartContext";
import { useOrder } from "../../context/OrderContext";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose }) => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { items, total, clearCart } = useCart();
  const { createOrder, confirmOrder, isProcessing } = useOrder();
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const handleCheckout = async () => {
    if (!address || !deliveryAddress) return;

    try {
      createOrder(items, total);
      await confirmOrder();
      clearCart();
      onClose();
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-dark-secondary border border-neon-blue/20 rounded-xl w-full max-w-md p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neon-blue">Checkout</h2>
                <button
                  onClick={onClose}
                  className="text-neon-blue/60 hover:text-neon-blue"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-light-gray">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-neon-blue/80"
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-neon-blue/10 pt-2">
                    <div className="flex justify-between text-neon-blue font-medium">
                      <span>Total</span>
                      <span>{total}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2">
                  <label className="text-light-gray">Delivery Address</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-4 py-2 bg-dark-secondary/50 border border-neon-blue/20 rounded-lg
                             text-light-gray placeholder-neon-blue/40 focus:border-neon-blue/50
                             focus:ring-1 focus:ring-neon-blue/50"
                    rows={3}
                    placeholder="Enter your delivery address..."
                  />
                </div>

                {/* Wallet Info */}
                <div className="bg-dark-secondary/30 rounded-lg p-4 border border-neon-blue/10">
                  <div className="text-sm text-neon-blue/60">
                    <div>
                      Connected Wallet: {address?.slice(0, 6)}...
                      {address?.slice(-4)}
                    </div>
                    <div>
                      Balance: {balance?.formatted} {balance?.symbol}
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || !deliveryAddress}
                  className="w-full py-3 bg-neon-blue text-black rounded-lg font-semibold
                           hover:bg-neon-green transition-colors disabled:opacity-50
                           disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Order"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
