import { Contract } from "starknet";
import { useContract } from "@starknet-react/core";

// Your contract's ABI
const restaurantABI = [
  {
    // Define your contract methods here
    // Example:
    // name: "getRestaurants",
    // type: "function",
    // inputs: [],
    // outputs: [{ name: "restaurants", type: "Restaurant[]" }]
  },
];

export function useRestaurants() {
  const { contract } = useContract({
    address: "YOUR_CONTRACT_ADDRESS",
    abi: restaurantABI,
  });

  const getRestaurants = async () => {
    if (!contract) return [];

    try {
      const restaurants = await contract.getRestaurants();
      return restaurants;
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
      return [];
    }
  };

  return {
    getRestaurants,
    contract,
  };
}
