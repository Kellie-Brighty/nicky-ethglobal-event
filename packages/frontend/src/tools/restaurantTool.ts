import { Contract } from "starknet";
import { connect } from "get-starknet";
import { ToolConfig } from "./allTools";

const hexToString = (hex: string): string => {
  try {
    const hexString = hex.startsWith("0x") ? hex.substring(2) : hex;
    let str = "";
    for (let i = 0; i < hexString.length; i += 2) {
      str += String.fromCharCode(parseInt(hexString.substring(i, i + 2), 16));
    }
    return str;
  } catch (error) {
    console.error("Error converting hex to string:", error, hex);
    return "";
  }
};

export const restaurantTool: ToolConfig = {
  definition: {
    type: "function",
    function: {
      name: "restaurant_service",
      description: "View restaurants, menus, place orders, and make payments",
      parameters: {
        type: "object",
        properties: {
          action: {
            type: "string",
            description:
              "Action to perform: list_restaurants, view_menu, place_order, make_payment",
          },
          restaurant_id: {
            type: "string",
            description: "Restaurant ID (required for menu/order actions)",
          },
          menu_items: {
            type: "array",
            items: { type: "string" },
            description: "List of food items to order (optional)",
          },
          total_price: {
            type: "string",
            description: "Total price of order (optional)",
          },
          order_id: {
            type: "string",
            description: "Order ID for making payment (optional)",
          },
        },
        required: ["action"],
      },
    },
  },

  handler: async ({
    action,
    restaurant_id,
    menu_items,
    total_price,
    order_id,
  }) => {
    try {
      const CONTRACT_ADDRESS =
        "0x01f0f631a3837ebe4747efef168dc9ef3837513ce37c637726ff183ea3740cbb"; // Replace with actual deployed contract
      const starknet = await connect();

      if (!starknet) throw new Error("Failed to connect to Starknet");
      await starknet.enable();
      const account = starknet.account;
      if (!account) throw new Error("Please connect your wallet first");

      const contract = new Contract(
        [
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
          {
            name: "place_order",
            type: "function",
            inputs: [
              { name: "restaurant_id", type: "core::integer::u64" },
              { name: "total_price", type: "core::integer::u64" },
              {
                name: "customer",
                type: "core::starknet::contract_address::ContractAddress",
              },
            ],
            outputs: [{ type: "(core::integer::u64, core::integer::u64)" }],
            state_mutability: "external",
          },
          {
            name: "make_payment",
            type: "function",
            inputs: [{ name: "payment_id", type: "core::integer::u64" }],
            outputs: [],
            state_mutability: "external",
          },
        ],
        CONTRACT_ADDRESS,
        account
      );

      if (action === "list_restaurants") {
        const restaurants = await contract.get_all_restaurants();
        console.log("restaurants", restaurants);
        const processedRestaurants = [] as any;
        for (let i = 1; i < restaurants.length; i += 4) {
          if (i + 3 >= restaurants.length) break;

          const nameFelt = restaurants[i];
          const locationFelt = restaurants[i + 1];
          const contractAddressFelt = restaurants[i + 2];
          const imageUrlHashFelt = restaurants[i + 3];

          const name = hexToString(nameFelt);
          const location = hexToString(locationFelt);
          const contractAddress = contractAddressFelt;
          const imageUrlHash = parseInt(imageUrlHashFelt.replace("0x", ""), 16);

          const id = (Math.floor((i - 1) / 4) + 1).toString();

          processedRestaurants.push({
            id,
            name,
            location,
            contractAddress,
            imageUrl: imageUrlHash.toString(),
          });
        }
        return { success: true, processedRestaurants };
      }

      if (action === "view_menu" && restaurant_id) {
        const menu = await contract.get_restaurant_menu(restaurant_id);
        return { success: true, menu };
      }

      if (action === "place_order" && restaurant_id && total_price) {
        const customer = account.address;
        const order = await contract.place_order(
          restaurant_id,
          total_price,
          customer
        );
        return { success: true, order_id: order[0] };
      }

      if (action === "make_payment" && order_id) {
        await contract.make_payment(order_id);
        return { success: true, message: "Payment successful" };
      }

      return { success: false, error: "Invalid action or missing parameters" };
    } catch (error: any) {
      console.error("Restaurant service error:", error);
      return { success: false, error: error.message };
    }
  },
};
