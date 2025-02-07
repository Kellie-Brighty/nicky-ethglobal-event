import { useAccount, useConnect } from "@starknet-react/core";

export const OrderButton = ({ item }) => {
  const { address } = useAccount();
  const { connect } = useConnect();

  const handleOrder = async () => {
    if (!address) {
      await connect();
      return;
    }
    // ... handle order
  };

  return (
    <button 
      onClick={handleOrder}
      className="px-4 py-2 rounded-lg bg-neon-blue text-black"
    >
      {address ? "Order Now" : "Connect to Order"}
    </button>
  );
}; 