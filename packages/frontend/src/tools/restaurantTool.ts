import { Contract, uint256 } from "starknet";
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

function feltToString(felt: bigint): string {
  let hex = felt.toString(16);
  if (hex.length % 2 !== 0) {
    hex = "0" + hex;
  }
  return (
    hex
      .match(/.{1,2}/g)
      ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join("") || ""
  );
}

interface Restaurant {
  0: bigint;
  1: bigint;
  2: bigint;
  3: bigint;
}

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
              "Action to perform: list_restaurants, view_menu, place_order, make_payment, get_last_uncompleted_payment",
          },
          restaurant_id: {
            type: "string",
            description: "Restaurant ID (required for menu/order actions)",
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

  handler: async ({ action, restaurant_id, total_price, order_id }) => {
    try {
      const CONTRACT_ADDRESS =
        "0x061a028d99c6e950a806fc70e3988831d7296475beedc5d9493b6fe403c182e3"; // Replace with actual deployed contract
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
          {
            name: "get_last_uncompleted_payment",
            type: "function",
            inputs: [
              {
                name: "customer",
                type: "core::starknet::contract_address::ContractAddress",
              },
            ],
            outputs: [
              { type: "core::option::Option::<(core::integer::u64,)>" },
            ],
            state_mutability: "view",
          },
        ],
        CONTRACT_ADDRESS,
        account
      );

      if (action === "list_restaurants") {
        const restaurants = await contract.get_all_restaurants();
        console.log("restaurants", restaurants);

        const processedRestaurants = restaurants.map(
          (restaurant: Restaurant, index: number) => {
            return {
              id: (index + 1).toString(),
              name: feltToString(restaurant[0]),
              location: feltToString(restaurant[1]),
              contractAddress: `0x${restaurant[2].toString(16)}`,
              imageUrl: hexToString(restaurant[3].toString()),
            };
          }
        );

        return { success: true, processedRestaurants };
      }

      if (action === "view_menu" && restaurant_id) {
        try {
          const restaurantIdBigInt = BigInt(restaurant_id); // Convert to BigInt if necessary

          const menuItems = await contract.get_restaurant_menu(
            restaurantIdBigInt
          );
          console.log("Raw menu items:", menuItems);

          const processedMenu = menuItems.map((item: any) => ({
            // id: item[0].toString(),
            name: feltToString(item[0]),
            description: item[1].toString(),
            price: feltToString(item[2]),
            imageUrl: hexToString(item[3].toString()),
          }));

          return { success: true, menu: processedMenu };
        } catch (error: any) {
          console.error("Error fetching menu:", error);
          return {
            success: false,
            error: "Failed to fetch menu. Please try again.",
          };
        }
      }

      if (action === "place_order" && restaurant_id && total_price) {
        try {
          const restaurantIdBigInt = BigInt(restaurant_id);
          const amountBigInt = BigInt(
            Math.floor(parseFloat(total_price) * 1e18)
          ); // Convert ETH to Wei
          const amountInWei = uint256.bnToUint256(amountBigInt);

          // Check for existing unpaid order
          const unpaidOrder = await contract.get_last_uncompleted_payment(
            account.address
          );

          if (unpaidOrder && unpaidOrder[0] !== undefined) {
            console.log("Unpaid order found:", unpaidOrder[0]);
            return {
              success: false,
              message: "You have an unpaid order",
              order_id: unpaidOrder[0],
            };
          }

          // No unpaid order, place a new one
          const orderData = await contract.place_order(
            restaurantIdBigInt,
            amountInWei.low,
            account.address
          );

          return { success: true, orderData };
        } catch (error) {
          console.error("Error placing order:", error);
          return { success: false, error: "Failed to place order" };
        }
      }

      if (action === "make_payment") {
        try {
          // Step 1: Get the last uncompleted payment
          const lastPayment = await contract.get_last_uncompleted_payment(
            account.address
          );
          const lastPaymentHex = `0x${lastPayment.toString(16)}`; // Convert to hex
          console.log("lastPayment", lastPayment); // Original BigInt
          console.log("lastPaymentHex", lastPaymentHex); // Hex representation

          // Now you can use lastPaymentHex or parse it back to a number if needed
          const paymentId = parseInt(lastPaymentHex, 16);
          console.log("paymentId", paymentId);

          // Step 2: Make the payment with the extracted order ID
          await contract.make_payment(lastPaymentHex);

          return { success: true, message: "Payment successful" };
        } catch (error) {
          console.error("Error making payment:", error);
          return { success: false, error: "Failed to process payment" };
        }
      }

      return {
        success: false,
        message: "Invalid action or missing parameters",
      };
    } catch (error) {
      console.error("Handler error:", error);
      return { success: false, error: "Internal error occurred" };
    }
  },
};
