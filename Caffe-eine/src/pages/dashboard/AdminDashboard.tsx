// ============================================
// FILE: src/pages/dashboard/AdminDashboard.tsx
// ============================================
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/component/common/AppLayout";

const stats = [
  {
    label: "Penjualan Hari Ini",
    value: "Rp 1.240.000",
    icon: TrendingUp,
    color: "#22C55E",
    bg: "#DCFCE7",
  },
  {
    label: "Total Transaksi",
    value: "34 Pesanan",
    icon: ShoppingBag,
    color: "#7D301F",
    bg: "#FDECEA",
  },
  {
    label: "Pelanggan Aktif",
    value: "28 Orang",
    icon: Users,
    color: "#DC9E6B",
    bg: "#FEF3E2",
  },
  {
    label: "Menu Terjual",
    value: "87 Item",
    icon: Coffee,
    color: "#3B82F6",
    bg: "#DBEAFE",
  },
];

const bestSellers = [
  { rank: 1, name: "Caramel Latte", sold: 24, revenue: "Rp 288.000" },
  { rank: 2, name: "Espresso Shot", sold: 18, revenue: "Rp 162.000" },
  { rank: 3, name: "Cappuccino", sold: 15, revenue: "Rp 187.500" },
  { rank: 4, name: "Matcha Latte", sold: 12, revenue: "Rp 168.000" },
  { rank: 5, name: "Cold Brew", sold: 10, revenue: "Rp 150.000" },
];

const recentOrders = [
  {
    id: "#001",
    customer: "Meja 3",
    items: "Latte + Croissant",
    total: "Rp 62.000",
    status: "Selesai",
    time: "10:32",
  },
  {
    id: "#002",
    customer: "Take Away",
    items: "Espresso x2",
    total: "Rp 36.000",
    status: "Diproses",
    time: "10:45",
  },
  {
    id: "#003",
    customer: "Meja 1",
    items: "Cappuccino + Cake",
    total: "Rp 58.000",
    status: "Menunggu",
    time: "10:51",
  },
  {
    id: "#004",
    customer: "Meja 5",
    items: "Cold Brew x3",
    total: "Rp 45.000",
    status: "Selesai",
    time: "11:02",
  },
];

const statusColor: Record<string, { bg: string; color: string }> = {
  Selesai: { bg: "#DCFCE7", color: "#16A34A" },
  Diproses: { bg: "#FEF3E2", color: "#D97706" },
  Menunggu: { bg: "#DBEAFE", color: "#2563EB" },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <AppLayout title="Dashboard">
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: "20px 24px",
              border: "1px solid #E8DDD0",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: s.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 2 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1E1E1E" }}>
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {[
          {
            label: "+ Transaksi Baru",
            to: "/pos",
            bg: "#7D301F",
            color: "#fff",
          },
          {
            label: "🍳 Lihat Dapur",
            to: "/kitchen",
            bg: "#FFFFFF",
            color: "#7D301F",
          },
          {
            label: "📊 Lihat Laporan",
            to: "/report",
            bg: "#FFFFFF",
            color: "#7D301F",
          },
        ].map((btn) => (
          <button
            key={btn.to}
            onClick={() => navigate(btn.to)}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              backgroundColor: btn.bg,
              color: btn.color,
              border: btn.bg === "#FFFFFF" ? "1px solid #E8DDD0" : "none",
              cursor: "pointer",
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Best Sellers */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            border: "1px solid #E8DDD0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "#1E1E1E",
              }}
            >
              🏆 Best Seller Hari Ini
            </h3>
          </div>
          {bestSellers.map((item) => (
            <div
              key={item.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: item.rank === 1 ? "#FEF3E2" : "#F5EFE6",
                  color: item.rank === 1 ? "#D97706" : "#7D301F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {item.rank}
              </span>
              <span style={{ flex: 1, fontSize: 14, color: "#1E1E1E" }}>
                {item.name}
              </span>
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                {item.sold} terjual
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#7D301F" }}>
                {item.revenue}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 24,
            border: "1px solid #E8DDD0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "#1E1E1E",
              }}
            >
              🧾 Pesanan Terbaru
            </h3>
            <button
              onClick={() => navigate("/pos")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                color: "#7D301F",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Lihat semua <ArrowRight size={14} />
            </button>
          </div>
          {recentOrders.map((order) => (
            <div
              key={order.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: "#1E1E1E" }}
                >
                  {order.customer}
                </div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>
                  {order.items}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#7D301F" }}
                >
                  {order.total}
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                  {order.time}
                </div>
              </div>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  backgroundColor: statusColor[order.status]?.bg,
                  color: statusColor[order.status]?.color,
                }}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
