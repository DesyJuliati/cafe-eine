import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: "Coffee" | "Food" | "Non-Coffee";
  quantity: number;
  sugarLevel: number; // 0 jika Espresso/Americano/Food
  temperature: "Panas" | "Dingin" | "N/A";
  milk: "Full Cream" | "Low Fat" | "Oat Milk" | "N/A"; // N/A jika tidak pakai susu
  request: string;
}

interface CartStore {
  items: CartItem[];
  customerName: string;
  tableNumber: string;
  customerType: "Dine In" | "Take Away";

  setCustomerInfo: (
    name: string,
    type: "Dine In" | "Take Away",
    table?: string,
  ) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (itemId: number) => void; // by id
  removeItemByIndex: (index: number) => void; // by index
  updateQuantity: (index: number, quantity: number) => void;
  increaseQuantity: (itemId: number) => void; // FIX: tambah method ini
  decreaseQuantity: (itemId: number) => void; // FIX: tambah method ini
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: "",
      tableNumber: "",
      customerType: "Dine In",

      setCustomerInfo: (name, type, table = "") =>
        set({ customerName: name, customerType: type, tableNumber: table }),

      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.sugarLevel === newItem.sugarLevel &&
              item.temperature === newItem.temperature &&
              item.milk === newItem.milk &&
              item.request === newItem.request,
          );
          if (existingIndex >= 0) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      removeItemByIndex: (index) =>
        set((state) => ({ items: state.items.filter((_, i) => i !== index) })),

      updateQuantity: (index, quantity) =>
        set((state) => {
          const updated = [...state.items];
          if (quantity <= 0) updated.splice(index, 1);
          else updated[index].quantity = quantity;
          return { items: updated };
        }),

      // FIX: increaseQuantity by id
      increaseQuantity: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        })),

      // FIX: decreaseQuantity by id - remove jika qty = 1
      decreaseQuantity: (itemId) =>
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          if (!item) return state;
          if (item.quantity <= 1) {
            return { items: state.items.filter((i) => i.id !== itemId) };
          }
          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i,
            ),
          };
        }),

      clearCart: () =>
        set({
          items: [],
          customerName: "",
          tableNumber: "",
          customerType: "Dine In",
        }),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "cart-storage" },
  ),
);
