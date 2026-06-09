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

const dummyUsers: AuthUser[] = [
  { id: 1, name: "Admin Utama", email: "admin@caffeeine.id", role: "admin" },
  { id: 2, name: "Budi Kasir", email: "kasir@caffeeine.id", role: "cashier" },
];

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        await new Promise((res) => setTimeout(res, 500)); // simulasi API
        const found = dummyUsers.find((u) => u.email === email);
        if (found && password === "123456") {
          set({
            user: found,
            token: "dummy-token",
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            isLoading: false,
            error: "Email atau password salah",
          });
          throw new Error("Email atau password salah");
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
    { name: "auth-storage" },
  ),
);

export default useAuthStore;
