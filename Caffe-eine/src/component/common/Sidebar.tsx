import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  UtensilsCrossed,
  Package,
  LogOut,
  Coffee,
  Users,
} from "lucide-react";
import useAuthStore from "@/store/authStore";

const navItems = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    roles: ["admin"],
  },
  {
    to: "/pos",
    icon: ShoppingCart,
    label: "Kasir ",
    roles: ["admin", "cashier"],
  },
  {
    to: "/kitchen",
    icon: ClipboardList,
    label: "Management Pesanan",
    roles: ["admin", "cashier"],
  },
  { to: "/report", icon: BarChart3, label: "Laporan", roles: ["admin"] },
  {
    to: "/menu-management",
    icon: UtensilsCrossed,
    label: "Menu",
    roles: ["admin"],
  },
  { to: "/employees", icon: Users, label: "Karyawan", roles: ["admin"] }, // ← BARU req #7
  { to: "/stock", icon: Package, label: "Stok", roles: ["admin"] },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleItems = navItems.filter(
    (item) => user?.role && item.roles.includes(user.role),
  );

  return (
    <aside
      style={{
        width: 228,
        minHeight: "100vh",
        backgroundColor: "#7D301F",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Coffee size={22} color="#F5EFE6" />
          </div>
          <div>
            <div
              style={{
                color: "#F5EFE6",
                fontWeight: 800,
                fontSize: 15,
                letterSpacing: 0.5,
              }}
            >
              Caffeeine
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
              POS System
            </div>
          </div>
        </div>
      </div>

      {/* User badge */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 4,
          }}
        >
          Login sebagai
        </div>
        <div style={{ color: "#F5EFE6", fontWeight: 700, fontSize: 14 }}>
          {user?.name}
        </div>
        <span
          style={{
            display: "inline-block",
            marginTop: 4,
            padding: "2px 10px",
            borderRadius: 20,
            background:
              user?.role === "admin"
                ? "rgba(220,158,107,0.3)"
                : "rgba(255,255,255,0.15)",
            color: user?.role === "admin" ? "#DC9E6B" : "rgba(255,255,255,0.8)",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {user?.role === "cashier" ? "Kasir" : "Admin"}
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 0" }}>
        {visibleItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 20px",
              color: isActive ? "#F5EFE6" : "rgba(255,255,255,0.6)",
              backgroundColor: isActive
                ? "rgba(255,255,255,0.15)"
                : "transparent",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: isActive ? 700 : 400,
              borderRight: isActive
                ? "3px solid #DC9E6B"
                : "3px solid transparent",
              transition: "all 0.12s",
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "10px 14px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            color: "rgba(255,255,255,0.75)",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );
}
