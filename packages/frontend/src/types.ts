export interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  imageUrl?: string;
  timestamp: number; // Unix timestamp in milliseconds
} 