import React, { createContext, useContext, useState, useEffect } from "react";
import { FavoriteMeal, OrderItem } from "../types";
import { AddToFavoritesPrompt } from "../components/AddToFavoritesPrompt";

interface FavoritesContextType {
  favorites: FavoriteMeal[];
  addToFavorites: (meal: FavoriteMeal) => void;
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

  const addToFavorites = (meal: FavoriteMeal) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === meal.id)) return prev;
      return [...prev, meal];
    });
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
              description: pendingOrder.description,
              timestamp: Date.now(),
              imageUrl: pendingOrder.imageUrl,
              price: pendingOrder.price,
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
