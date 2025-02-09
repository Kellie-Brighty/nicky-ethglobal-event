import React, { createContext, useContext, useState, useEffect } from "react";
import { FavoriteMeal, OrderItem } from "../types";
import { MenuItem } from "../types/marketplace";
import { AddToFavoritesPrompt } from "../components/AddToFavoritesPrompt";

interface FavoritesContextType {
  favorites: FavoriteMeal[];
  addToFavorites: (meal: MenuItem) => void;
  removeFromFavorites: (id: string) => void;
  isInFavorites: (id: string) => boolean;
  showAddToFavoritesPrompt: (order: OrderItem) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<FavoriteMeal[]>([]);
  const [pendingOrder, setPendingOrder] = useState<OrderItem | null>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when updated
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (item: MenuItem) => {
    const favorite: FavoriteMeal = {
      id: item.id,
      name: item.name,
      description: item.description ?? "",
      price: item.price,
      image: item.image,
      imageUrl: item.image,
    };
    setFavorites((prev) => [...prev, favorite]);
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isInFavorites = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  const showAddToFavoritesPrompt = (order: OrderItem) => {
    setPendingOrder(order);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        showAddToFavoritesPrompt,
      }}
    >
      {children}
      {pendingOrder && (
        <AddToFavoritesPrompt
          order={pendingOrder}
          onConfirm={() => {
            addToFavorites({
              id: pendingOrder.id,
              name: pendingOrder.name,
              description: pendingOrder.description ?? "",
              price: pendingOrder.price,
              image: pendingOrder.imageUrl ?? "",
              images: [pendingOrder.imageUrl ?? ""],
              imageKey: pendingOrder.id,
              rating: 0,
              prepTime: 0,
              minOrder: 0,
              restaurantId: "",
              categoryId: "",
            });
            setPendingOrder(null);
          }}
          onCancel={() => setPendingOrder(null)}
        />
      )}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
