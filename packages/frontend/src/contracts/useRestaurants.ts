import { useContract } from "@starknet-react/core";

const restaurantABI = [
  {
    name: "get_all_restaurants",
    type: "function",
    inputs: [],
    outputs: [
      {
        type: "core::array::Array::<(core::felt252, core::felt252, core::starknet::contract_address::ContractAddress, core::felt252)>",
      },
    ],
    state_mutability: "view",
  },
  {
    name: "get_restaurant_menu",
    type: "function",
    inputs: [{ name: "restaurant_id", type: "core::integer::u64" }],
    outputs: [
      {
        type: "core::array::Array::<(core::felt252, core::felt252, core::integer::u64, core::felt252, core::integer::u64)>",
      },
    ],
    state_mutability: "view",
  },
];

export function useRestaurants() {
  const { contract } = useContract({
    address:
      "0x01f0f631a3837ebe4747efef168dc9ef3837513ce37c637726ff183ea3740cbb",
    abi: restaurantABI,
  });

  return {
    contract,
  };
}
