import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthRole = "admin" | "cashier";

export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  role: AuthRole;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          const response = await fetch(
            "https://demo-api-three-pied.vercel.app/api/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
                password,
              }),
            },
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || "Email atau password salah");
          }

          set({
            user: result.user,
            token: result.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Terjadi kesalahan",
          });

          throw error;
        }
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);

export default useAuthStore;
