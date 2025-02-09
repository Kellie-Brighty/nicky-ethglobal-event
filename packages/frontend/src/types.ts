export interface Message {
  role: "user" | "assistant";

  content: string;

  id: string;

  timestamp: number;

  imageUrl?: string;
}

export interface FavoriteMeal {
  id: string;

  name: string;

  description?: string;

  price: string;

  image?: string;

  imageUrl?: string;

  rating?: number;

  timestamp?: number;
}

export interface OrderItem {
  id: string;

  name: string;

  price: string;

  description: string;

  imageUrl?: string;
}

export interface WalletState {
  isConnected: boolean;

  address: string | null;

  balance: string;

  chainId: number;
}
