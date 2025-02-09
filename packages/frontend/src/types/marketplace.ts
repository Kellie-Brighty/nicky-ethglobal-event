export interface MenuItem {
  id: string;
  name: string;
  image: string;
  images: string[];
  imageKey: string;
  price: string;
  rating: number;
  prepTime: number;
  minOrder: number;
  duration?: string;
  nextPayout?: string;
  memberCount?: number;
  description?: string;
  longDescription?: string;
  priceRange?: string;
  reviews?: number;
  distance?: string;
  restaurantId: string;
  categoryId: string;
  isNearby?: boolean;
  isTrending?: boolean;
  hasSpecialOffer?: boolean;
  ingredients?: string[];
  nutritionalInfo?: Record<string, string | number>;
  dietaryInfo?: string[];
  spicyLevel?: number;
} 