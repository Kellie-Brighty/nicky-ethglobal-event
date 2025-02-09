import {
  SparklesIcon,
  FireIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { MenuItem } from "../types/marketplace";

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const MARKETPLACE_TABS = [
  {
    id: "featured",
    label: "Featured",
    icon: SparklesIcon,
  },
  {
    id: "popular",
    label: "Popular",
    icon: FireIcon,
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: BuildingStorefrontIcon,
  },
] as const;

export type MarketplaceTab = (typeof MARKETPLACE_TABS)[number];

export interface MenuItems {
  featured: MenuItem[];
  popular: MenuItem[];
  restaurants: MenuItem[];
}

export const MENU_ITEMS: MenuItems = {
  featured: [
    {
      id: "cyber-ramen-1",
      name: "Neo Tokyo Ramen",
      categoryId: "ramen",
      imageKey: "cyber-ramen",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
      images: [
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624",
        "https://images.unsplash.com/photo-1591814468924-caf88d1232e1",
        "https://images.unsplash.com/photo-1632709810780-b5a4343cebec",
      ],
      price: "$15.99",
      rating: 4.8,
      prepTime: 15,
      minOrder: 10,
      restaurantId: "cyber-kitchen-1",
      description:
        "A futuristic take on traditional ramen, featuring lab-grown meat, bioluminescent noodles, and a broth infused with rare herbs from vertical farms.",
      nutritionalInfo: {
        calories: 650,
        protein: 32,
        carbs: 75,
        fat: 22,
      },
      dietaryInfo: ["Lab Grown Meat", "Sustainable", "High Protein"],
      spicyLevel: 2,
    },
    {
      id: "quantum-sushi-1",
      name: "Quantum Sushi Platter",
      categoryId: "sushi",
      imageKey: "quantum-sushi",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754",
      images: [
        "https://images.unsplash.com/photo-1553621042-f6e147245754",
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        "https://images.unsplash.com/photo-1583623025817-d180a2221d0a",
      ],
      price: "$24.99",
      rating: 4.9,
      prepTime: 20,
      minOrder: 15,
      restaurantId: "quantum-cafe-1",
      description:
        "Experience sushi from the future with our quantum-infused rice and holographic garnish. Each piece is precision-crafted by our AI sushi master.",
      nutritionalInfo: {
        calories: 540,
        protein: 28,
        carbs: 65,
        fat: 18,
      },
      dietaryInfo: ["Sustainable Fish", "Gluten Free", "Omega-3 Rich"],
      spicyLevel: 1,
    },
    {
      id: "matrix-mochi-1",
      name: "Matrix Mochi",
      categoryId: "dessert",
      imageKey: "matrix-mochi",
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
      images: [
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb",
        "https://images.unsplash.com/photo-1574085733277-851d9d856a3a",
        "https://images.unsplash.com/photo-1574085733277-851d9d856a3a",
      ],
      price: "$12.99",
      rating: 4.7,
      prepTime: 10,
      minOrder: 5,
      restaurantId: "matrix-bistro-1",
      description:
        "Glitch in the matrix? These color-shifting mochi change flavors as you eat them. Infused with nano-flavor crystals.",
      nutritionalInfo: {
        calories: 220,
        protein: 4,
        carbs: 45,
        fat: 6,
      },
      dietaryInfo: ["Gluten Free", "Vegan", "Color Changing"],
      spicyLevel: 0,
    },
  ],
  popular: [
    {
      id: "holo-burger-1",
      name: "Holographic Burger",
      categoryId: "burger",
      imageKey: "holo-burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      images: [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90",
        "https://images.unsplash.com/photo-1550547660-d9450f859349",
      ],
      price: "$18.99",
      rating: 4.6,
      prepTime: 15,
      minOrder: 10,
      restaurantId: "cyber-kitchen-1",
      description:
        "A mind-bending burger that appears to float on your plate. Made with premium lab-grown beef and gravity-defying buns.",
      nutritionalInfo: {
        calories: 750,
        protein: 35,
        carbs: 68,
        fat: 45,
      },
      dietaryInfo: ["Lab Grown Meat", "Antigravity", "High Protein"],
      spicyLevel: 1,
    },
    {
      id: "cyber-pizza-1",
      name: "Cyberpunk Pizza",
      categoryId: "pizza",
      imageKey: "cyber-pizza",
      image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
      images: [
        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
        "https://images.unsplash.com/photo-1513104890138-7c749659a591",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
      ],
      price: "$21.99",
      rating: 4.8,
      prepTime: 25,
      minOrder: 12,
      restaurantId: "quantum-cafe-1",
      description:
        "Neon-lit pizza with LED cheese and plasma sauce. Topped with synthetic pepperoni that changes flavor with each bite.",
      nutritionalInfo: {
        calories: 880,
        protein: 42,
        carbs: 95,
        fat: 38,
      },
      dietaryInfo: ["Interactive", "Color Changing", "High Energy"],
      spicyLevel: 3,
    },
  ],
  restaurants: [
    {
      id: "cyber-kitchen-1",
      name: "Cyber Kitchen",
      categoryId: "restaurant",
      imageKey: "cyber-ramen",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
      images: [
        "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        "https://images.unsplash.com/photo-1599458252573-56ae36120de1",
        "https://images.unsplash.com/photo-1587899897387-091eeb83be27",
      ],
      price: "$$",
      rating: 4.9,
      prepTime: 25,
      minOrder: 20,
      restaurantId: "cyber-kitchen-1",
      description:
        "Experience the future of dining with our AI-powered kitchen and robotic chefs.",
      dietaryInfo: ["Lab Grown", "Sustainable", "Tech-Forward"],
      spicyLevel: 2,
    },
    {
      id: "quantum-cafe-1",
      name: "Quantum Café",
      categoryId: "restaurant",
      imageKey: "quantum-sushi",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
      images: [
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
        "https://images.unsplash.com/photo-1559304822-9eb2813c9844",
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814",
      ],
      price: "$$$",
      rating: 4.8,
      prepTime: 20,
      minOrder: 25,
      restaurantId: "quantum-cafe-1",
      description:
        "Where quantum physics meets gastronomy. Experience food in multiple states simultaneously.",
      dietaryInfo: ["Quantum Infused", "Molecular", "Experimental"],
      spicyLevel: 1,
    },
    {
      id: "matrix-bistro-1",
      name: "Matrix Bistro",
      categoryId: "restaurant",
      imageKey: "matrix-mochi",
      image: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88",
      images: [
        "https://images.unsplash.com/photo-1578474846511-04ba529f0b88",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d",
      ],
      price: "$$",
      rating: 4.7,
      prepTime: 30,
      minOrder: 15,
      restaurantId: "matrix-bistro-1",
      description:
        "Reality-bending dining experience where nothing is what it seems. Choose the red pill or blue pill menu.",
      dietaryInfo: ["Virtual Reality", "Interactive", "Mind-Bending"],
      spicyLevel: 3,
    },
  ],
};

export const PRODUCTS: MenuItem[] = MENU_ITEMS.featured;

export const CATEGORIES = [
  "all",
  "ramen",
  "sushi",
  "burger",
  "pizza",
  "dessert",
  "drinks",
];

export const PRICE_RANGES = [
  { min: 0, max: 15, label: "Under $15" },
  { min: 15, max: 30, label: "$15 - $30" },
  { min: 30, max: 50, label: "$30 - $50" },
  { min: 50, max: Infinity, label: "Over $50" },
];

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: string;
  images: string[];
  isTrending?: boolean;
  hasSpecialOffer?: boolean;
  ingredients?: string[];
  nutritionalInfo?: Record<string, string | number>;
  restaurantId: string;
  categoryId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  description: string;
  rating: number;
  deliveryTime: number;
  minimumOrder: number;
  categories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}
