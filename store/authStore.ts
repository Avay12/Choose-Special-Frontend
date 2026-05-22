import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

import { User } from "@/types/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      error: null,
      setUser: (user) => set({ user }),
      checkAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.get("/users/me");
          set({ user: response.data.user, isLoading: false });
        } catch (error: any) {
          // Token invalid/expired — clear persisted user too
          set({ user: null, isLoading: false });
        }
      },
      logout: async () => {
        try {
          await api.post("/auth/logout");
          set({ user: null });
        } catch (error) {
          console.error("Logout failed", error);
          // Clear locally even if the API call fails
          set({ user: null });
        }
      },
    }),
    {
      name: "choose-special-auth", // localStorage key
      partialize: (state) => ({ user: state.user }), // only persist `user`
    },
  ),
);
