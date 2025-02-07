import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { CartItem } from "./CartItem";

interface CartProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOrderComplete?: () => void;
  onSwitchToOrders?: () => void;
}

export const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  onOrderComplete,
  onSwitchToOrders,
}) => {
  const { items, total, clearCart, addItem, removeItem } = useCart();
  const { addOrder } = useOrders();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const numericTotal =
    typeof total === "string"
      ? parseFloat(total.replace(/[^0-9.-]+/g, ""))
      : total;

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addOrder(items, `$${numericTotal.toFixed(2)}`);
      setCheckoutSuccess(true);
      setTimeout(() => {
        clearCart();
        setCheckoutSuccess(false);
        setIsCheckingOut(false);
        if (onOrderComplete) onOrderComplete();
      }, 2000);
    } catch (error) {
      console.error("Checkout failed:", error);
      // Handle error state
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    // Update quantity logic
  };

  const cartContent = (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon className="w-6 h-6 text-neon-blue" />
          <h2 className="text-xl font-semibold text-light-gray">Your Cart</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neon-blue/10 text-neon-blue/60 
                     hover:text-neon-blue"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {checkoutSuccess ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center"
        >
          <CheckCircleIcon className="w-16 h-16 text-green-400 mb-4" />
          <h3 className="text-xl font-semibold text-light-gray mb-2">
            Order Confirmed!
          </h3>
          <p className="text-neon-blue/60">Thank you for your purchase</p>
        </motion.div>
      ) : items.length > 0 ? (
        <>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 border-t border-neon-blue/10 pt-4">
            <div className="flex justify-between mb-4">
              <span className="text-light-gray">Total</span>
              <span className="text-neon-blue font-mono">
                ${numericTotal.toFixed(2)}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-3 rounded-lg font-semibold transition-colors relative overflow-hidden
                  ${
                    isCheckingOut
                      ? "bg-neon-blue/50 text-black/50 cursor-not-allowed"
                      : "bg-neon-blue text-white hover:bg-neon-green"
                  }`}
              >
                {isCheckingOut && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-full bg-neon-blue/20 absolute top-0 left-0 rounded-lg"
                    transition={{ duration: 1.5, ease: "linear" }}
                  />
                )}
                <span className="relative z-10">
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </span>
              </button>
              <button
                onClick={clearCart}
                disabled={isCheckingOut}
                className="w-full py-3 rounded-lg border border-neon-blue/20 text-neon-blue 
                         hover:bg-neon-blue/10 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-neon-blue/60">
          <ShoppingCartIcon className="w-16 h-16 mb-4 opacity-50" />
          <p>Your cart is empty</p>
        </div>
      )}
    </div>
  );

  // Desktop sidebar version
  if (isOpen === undefined) {
    return (
      <div
        className="hidden lg:block fixed right-0 top-0 h-full w-80 bg-dark-secondary 
                     border-l border-neon-blue/10 shadow-2xl shadow-neon-blue/5"
      >
        {cartContent}
      </div>
    );
  }

  // Mobile overlay version
  return (
    <AnimatePresence>
      {isOpen && (
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
          {cartContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
