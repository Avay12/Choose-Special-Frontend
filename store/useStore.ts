import { create } from "zustand";
import { persist } from "zustand/middleware";

import { User } from "@/types/api";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  // Cart State
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;

  // Favorites State
  favorites: string[]; // Store product IDs
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Search State
  isSearchOpen: boolean;
  setSearchOpen: (isOpen: boolean) => void;

  // User State
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // User implementation
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),

      // Cart implementation
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id,
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        })),
      clearCart: () => set({ cart: [] }),
      cartTotal: () => {
        const { cart } = get();
        return cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      // Favorites implementation
      favorites: [],
      toggleFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        })),
      isFavorite: (productId) => get().favorites.includes(productId),

      // Search implementation
      isSearchOpen: false,
      setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
    }),
    {
      name: "choose-special-storage",
    },
  ),
);
