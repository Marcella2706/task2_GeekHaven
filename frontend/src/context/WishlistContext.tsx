"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/types/product";

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlistItem: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to load wishlist from localStorage');
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleWishlistItem = (product: Product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isInWishlist = (id: number) => {
    return wishlist.some((p) => p.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlistItem, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}