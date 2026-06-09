import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MenuCategory = "Coffee" | "Food" | "Non-Coffee";

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: MenuCategory;
  hasSugar: boolean; // false = Espresso, Americano, Food
  hasMilk: boolean; // true HANYA: Caramel Latte, Matcha Latte, Chocolate, Ice Latte
  hasTemp: boolean; // false = Food
  isAvailable: boolean; // bisa di-toggle oleh admin
  description?: string;
}

// Default menu sesuai requirement
const DEFAULT_MENU: MenuItem[] = [
  // ── COFFEE ─────────────────────────────────────────────────────
  {
    id: 1,
    name: "Caramel Latte",
    price: 32000,
    image: "☕",
    category: "Coffee",
    hasSugar: true,
    hasMilk: true,
    hasTemp: true,
    isAvailable: true,
    description: "Espresso dengan caramel syrup & susu segar",
  },
  {
    id: 2,
    name: "Matcha Latte",
    price: 28000,
    image: "🍵",
    category: "Coffee",
    hasSugar: true,
    hasMilk: true,
    hasTemp: true,
    isAvailable: true,
    description: "Matcha premium Jepang dengan susu steamed",
  },
  {
    id: 3,
    name: "Chocolate",
    price: 27000,
    image: "🍫",
    category: "Coffee",
    hasSugar: true,
    hasMilk: true,
    hasTemp: true,
    isAvailable: true,
    description: "Dark chocolate blended dengan susu steamed",
  },
  {
    id: 4,
    name: "Ice Latte",
    price: 28000,
    image: "🧊",
    category: "Coffee",
    hasSugar: true,
    hasMilk: true,
    hasTemp: false,
    isAvailable: true,
    description: "Espresso dingin dengan susu fresh, selalu disajikan dingin",
  },
  {
    id: 5,
    name: "Americano",
    price: 20000,
    image: "☕",
    category: "Coffee",
    hasSugar: true,
    hasMilk: false,
    hasTemp: true,
    isAvailable: true,
    description: "Espresso double shot dengan air panas — tanpa susu",
  },
  {
    id: 6,
    name: "Espresso",
    price: 18000,
    image: "☕",
    category: "Coffee",
    hasSugar: false,
    hasMilk: false,
    hasTemp: false,
    isAvailable: true,
    description: "Single/double shot espresso murni — tanpa gula, tanpa susu",
  },
  {
    id: 7,
    name: "Affogato",
    price: 30000,
    image: "🍨",
    category: "Coffee",
    hasSugar: false,
    hasMilk: false,
    hasTemp: false,
    isAvailable: true,
    description: "Espresso panas dituang di atas es krim vanilla",
  },
  // ── NON-COFFEE ─────────────────────────────────────────────────
  {
    id: 8,
    name: "Teh Tarik",
    price: 19000,
    image: "🫖",
    category: "Non-Coffee",
    hasSugar: true,
    hasMilk: false,
    hasTemp: true,
    isAvailable: true,
    description: "Teh Ceylon dengan susu kental manis, diseduh tradisional",
  },
  // ── FOOD ───────────────────────────────────────────────────────
  {
    id: 9,
    name: "Croissant",
    price: 22000,
    image: "🥐",
    category: "Food",
    hasSugar: false,
    hasMilk: false,
    hasTemp: false,
    isAvailable: true,
    description: "Croissant butter premium, renyah & berlapis",
  },
  {
    id: 10,
    name: "Cheesecake",
    price: 28000,
    image: "🍰",
    category: "Food",
    hasSugar: false,
    hasMilk: false,
    hasTemp: false,
    isAvailable: true,
    description: "New York style cheesecake dengan saus berry",
  },
  {
    id: 11,
    name: "Tiramisu",
    price: 38000,
    image: "🍮",
    category: "Food",
    hasSugar: false,
    hasMilk: false,
    hasTemp: false,
    isAvailable: true,
    description: "Tiramisu klasik Italia dengan mascarpone & espresso",
  },
  {
    id: 12,
    name: "Sandwich",
    price: 32000,
    image: "🥪",
    category: "Food",
    hasSugar: false,
    hasMilk: false,
    hasTemp: false,
    isAvailable: true,
    description: "Club sandwich dengan ayam panggang & sayuran segar",
  },
];

interface MenuStore {
  menu: MenuItem[];
  addMenu: (item: Omit<MenuItem, "id">) => void;
  updateMenu: (id: number, updates: Partial<MenuItem>) => void;
  deleteMenu: (id: number) => void;
  toggleAvailability: (id: number) => void;
  getAvailableMenu: () => MenuItem[];
  resetToDefault: () => void;
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      menu: DEFAULT_MENU,

      addMenu: (item) =>
        set((state) => ({
          menu: [
            ...state.menu,
            { ...item, id: Math.max(...state.menu.map((m) => m.id), 0) + 1 },
          ],
        })),

      updateMenu: (id, updates) =>
        set((state) => ({
          menu: state.menu.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        })),

      deleteMenu: (id) =>
        set((state) => ({ menu: state.menu.filter((item) => item.id !== id) })),

      toggleAvailability: (id) =>
        set((state) => ({
          menu: state.menu.map((item) =>
            item.id === id ? { ...item, isAvailable: !item.isAvailable } : item,
          ),
        })),

      getAvailableMenu: () => get().menu.filter((item) => item.isAvailable),

      resetToDefault: () => set({ menu: DEFAULT_MENU }),
    }),
    { name: "menu-storage" },
  ),
);
