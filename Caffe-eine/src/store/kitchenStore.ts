// ============================================
// FILE: src/store/kitchenStore.ts
// ============================================
import { create } from "zustand";

export interface KitchenOrder {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerType: string;
  tableNumber?: string;
  items: Array<{
    name: string;
    quantity: number;
    sugarLevel: number;
    temperature: string;
    milk: string;
    request: string;
    category: string;
  }>;
  totalPrice: number;
  paymentMethod: string;
  status: "pending" | "processing" | "completed";
  createdAt: string;
}

interface KitchenStore {
  orders: KitchenOrder[];
  addOrder: (order: Omit<KitchenOrder, "id" | "createdAt" | "status">) => void;
  updateOrderStatus: (
    orderId: string,
    status: "processing" | "completed",
  ) => void;
  fetchOrders: () => void;
  clearCompleted: () => void;
}

const STORAGE_KEY = "kitchen_orders";

const loadOrders = (): KitchenOrder[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveOrders = (orders: KitchenOrder[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const useKitchenStore = create<KitchenStore>((set, get) => ({
  orders: loadOrders(),

  addOrder: (orderData) => {
    const newOrder: KitchenOrder = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [newOrder, ...get().orders];
    saveOrders(updated);
    set({ orders: updated });
  },

  updateOrderStatus: (orderId, status) => {
    const updated = get().orders.map((order) =>
      order.id === orderId ? { ...order, status } : order,
    );
    saveOrders(updated);
    set({ orders: updated });
  },

  fetchOrders: () => {
    set({ orders: loadOrders() });
  },

  clearCompleted: () => {
    const updated = get().orders.filter((o) => o.status !== "completed");
    saveOrders(updated);
    set({ orders: updated });
  },
}));
