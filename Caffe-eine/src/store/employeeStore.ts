import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Employee {
  id: string;
  name: string;
  role: "admin" | "cashier";
  email: string;
  phone?: string;
  joinDate: string;
  isActive: boolean;
  pin?: string;
  avatar?: string; // bisa emoji (📷) atau URL foto (data:image/...)
}

interface EmployeeStore {
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, "id" | "joinDate">) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  toggleActive: (id: string) => void;
  getByRole: (role: "admin" | "cashier") => Employee[];
}

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: "emp-001",
    name: "Admin Utama",
    role: "admin",
    email: "admin@caffeeine.id",
    phone: "08123456789",
    joinDate: "2024-01-01",
    isActive: true,
    avatar: "👑", // emoji default
  },
  {
    id: "emp-002",
    name: "Budi Santoso",
    role: "cashier",
    email: "budi@caffeeine.id",
    phone: "08234567890",
    joinDate: "2024-03-15",
    isActive: true,
    pin: "1234",
    avatar: "🧢",
  },
  {
    id: "emp-003",
    name: "Siti Rahayu",
    role: "cashier",
    email: "siti@caffeeine.id",
    phone: "08345678901",
    joinDate: "2024-06-01",
    isActive: true,
    pin: "5678",
    avatar: "👩‍💼",
  },
];

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: DEFAULT_EMPLOYEES,

      addEmployee: (emp) =>
        set((state) => ({
          employees: [
            ...state.employees,
            {
              ...emp,
              id: `emp-${Date.now()}`,
              joinDate: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      updateEmployee: (id, updates) =>
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, ...updates } : e,
          ),
        })),

      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
        })),

      toggleActive: (id) =>
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, isActive: !e.isActive } : e,
          ),
        })),

      getByRole: (role) => get().employees.filter((e) => e.role === role),
    }),
    { name: "employee-storage" },
  ),
);
