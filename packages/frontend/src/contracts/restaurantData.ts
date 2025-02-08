import React from "react";

interface Restaurant {
    id: string;
    name: string;
    location: string;
    contractAddress: string;
    imageUrl: string;
}



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

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
    const nethermindRpcUrl = "https://rpc.nethermind.io/sepolia-juno"; 

    try {
        const response = await fetch(nethermindRpcUrl, {
            method: "POST",
            headers: {
                "x-apikey": "07YwzEy7FrudmA77gvU3OlUsfrv6OCA6ypzbNMUJGtmbAQoxSDN1lHxVgR1htwyz",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method: "starknet_call",
                params: {
                    request: {
                        contract_address: "0x01f0f631a3837ebe4747efef168dc9ef3837513ce37c637726ff183ea3740cbb",
                        entry_point_selector: "0x034dfcc15f3c5a019a4bb83b3b0e2e26643a09df3ac75f19d511ab7b8679d2e8",
                        calldata: [],
                    },
                    block_id: "latest",
                },
                id: 1,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData?.error?.message || response.statusText}`);
        }

        const data = await response.json();
        console.log("Raw response:", data);

        if (!data.result || !Array.isArray(data.result)) {
            console.error("Unexpected response format:", data);
            return [];
        }

        const numRestaurants = parseInt(data.result[0].replace("0x", ""), 16);
        const restaurants: Restaurant[] = [];
        for (let i = 1; i < data.result.length; i += 4) {
            if (i + 3 >= data.result.length) break;

            const nameFelt = data.result[i];
            const locationFelt = data.result[i + 1];
            const contractAddressFelt = data.result[i + 2];
            const imageUrlHashFelt = data.result[i + 3];

            const name = hexToString(nameFelt);
            const location = hexToString(locationFelt);
            const contractAddress = contractAddressFelt; 
            const imageUrlHash = parseInt(imageUrlHashFelt.replace("0x", ""), 16);

            const id = (Math.floor((i - 1) / 4) + 1).toString(); 

            restaurants.push({
                id,
                name,
                location,
                contractAddress,
                imageUrl: imageUrlHash.toString(), 
            });
        }
        return restaurants;

    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return [];
    }
};

