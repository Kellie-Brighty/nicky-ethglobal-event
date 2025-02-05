import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "../../context/CartContext";
import { CartItemType } from "../../context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-black/20 border border-neon-blue/10">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="text-light-gray font-medium">{item.name}</h3>
        <p className="text-neon-blue/60 text-sm">{item.price}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() =>
              updateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
            className="px-2 text-neon-blue hover:bg-neon-blue/10 rounded"
          >
            -
          </button>
          <span className="text-light-gray">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-2 text-neon-blue hover:bg-neon-blue/10 rounded"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.id)}
        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};
