// ============================================
// FILE: src/component/common/RoleAlert.tsx
// ============================================
// Helper functions untuk toast notifikasi berdasarkan role.
// Import dan panggil sesuai event login/logout.

import toast from "react-hot-toast";
import { Coffee, BarChart2, LogOut } from "lucide-react";
import { createElement } from "react";

type Role = "admin" | "cashier" | "user";

// ===== LOGIN TOASTS =====

/**
 * Tampilkan toast selamat datang sesuai role pengguna.
 * Panggil setelah login berhasil dan role sudah tersedia.
 */
export function showLoginToast(role: Role, name: string): void {
  switch (role) {
    case "cashier":
      toast.success(`Selamat datang, ${name}! ☕ Shift dimulai.`, {
        duration: 4000,
        style: {
          background: "#7D301F",
          color: "#F5EFE6",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        icon: createElement(Coffee, { size: 18, color: "#DC9E6B" }),
      });
      break;

    case "admin":
      toast.success(`Selamat datang, Admin ${name}! 📊`, {
        duration: 4000,
        style: {
          background: "#1E1E1E",
          color: "#F5EFE6",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        icon: createElement(BarChart2, { size: 18, color: "#DC9E6B" }),
      });
      break;

    case "user":
    default:
      toast.success(`Selamat datang, ${name}! 🎉`, {
        duration: 3000,
        style: {
          background: "#F5EFE6",
          color: "#1E1E1E",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
          border: "1px solid #E8DDD0",
        },
      });
      break;
  }
}

// ===== LOGOUT TOASTS =====

/**
 * Tampilkan toast perpisahan sesuai role pengguna.
 * Panggil sebelum atau sesaat setelah logout.
 */
export function showLogoutToast(role: Role, name: string): void {
  switch (role) {
    case "cashier":
      toast(`Shift selesai! Terima kasih ${name}. 💪`, {
        duration: 3500,
        style: {
          background: "#7D301F",
          color: "#F5EFE6",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        icon: createElement(LogOut, { size: 18, color: "#DC9E6B" }),
      });
      break;

    case "admin":
      toast(`Sampai jumpa, ${name}! 👋`, {
        duration: 3000,
        style: {
          background: "#1E1E1E",
          color: "#F5EFE6",
          fontFamily: "Roboto, sans-serif",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        icon: createElement(LogOut, { size: 18, color: "#9CA3AF" }),
      });
      break;

    case "user":
    default:
      toast(`Sampai jumpa, ${name}!`, { duration: 3000 });
      break;
  }
}
