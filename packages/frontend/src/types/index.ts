export interface FavoriteMeal {
  id: string;
  name: string;
  description: string;
  timestamp: number;
  imageUrl?: string;
  price?: string;
  rating?: number;
}

export interface OrderItem extends FavoriteMeal {
  status: 'pending' | 'completed' | 'cancelled';
  orderId: string;
} 