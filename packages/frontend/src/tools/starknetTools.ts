import { uint256 } from "starknet";
import { connect } from "get-starknet";

import { ToolConfig } from "./allTools";

export const transferTool: ToolConfig = {
  definition: {
    type: "function",
    function: {
      name: "make_transfer",
      description: "Transfer ETH to another address on Starknet",
      parameters: {
        type: "object",
        properties: {
          recipient: {
            type: "string",
            description: "Recipient's Starknet address",
          },
          amount: {
            type: "string",
            description: "Amount to transfer in ETH",
          },
        },
        required: ["recipient", "amount"],
      },
    },
  },

  handler: async ({ recipient, amount }) => {
    try {
      const ETH_CONTRACT =
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"; // ETH Token Contract on StarkNet

      // Connect to StarkNet Wallet
      const starknet = await connect();
      if (!starknet) {
        throw new Error("Failed to connect to StarkNet");
      }

      await starknet.enable();
      const account = starknet.account;
      if (!account) {
        throw new Error("Please connect your wallet first");
      }

      // Convert ETH to Wei and format as Uint256
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e18)); // Convert ETH to Wei
      const amountInWei = uint256.bnToUint256(amountBigInt); // Convert to Uint256 (low, high)

      console.log("📌 Transferring ETH with params:", {
        recipient,
        amountInWei,
      });

      // ✅ Execute transaction directly from the account
      const tx = await account.execute({
        contractAddress: ETH_CONTRACT,
        entrypoint: "transfer",
        calldata: [recipient, amountInWei.low, amountInWei.high], // Correct Uint256 format
      });

      console.log("📌 Transaction Sent:", tx);

      if (!tx.transaction_hash) {
        throw new Error("Transaction failed: No hash received");
      }

      return {
        success: true,
        txHash: tx.transaction_hash,
        message: `✅ Transaction sent! View on StarkScan: https://sepolia.starkscan.co/tx/${tx.transaction_hash}`,
      };
    } catch (error: any) {
      console.error("🚨 Transfer Error:", error);
      return {
        success: false,
        error: error.message,
        details: "Please ensure your wallet is connected and funded.",
      };
    }
  },
};
