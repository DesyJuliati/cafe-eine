// src/pages/dashboard/DashboardPage.tsx
import { useNavigate } from "react-router-dom";
import {
  BarChart2,
  ShoppingBag,
  Users,
  TrendingUp,
  LogOut,
  Coffee,
  ArrowRight,
  Receipt,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Fungsi logout
  const handleLogout = () => {
    logout();
    toast.success("Sampai jumpa! 👋");
    navigate("/login");
  };

  // Data statistik (nanti bisa dari backend)
  const stats = [
    {
      label: "Total Transaksi",
      value: "128",
      icon: <Receipt size={22} />,
      color: "#7D301F",
      bg: "#7D301F15",
    },
    {
      label: "Pendapatan Hari Ini",
      value: "Rp 2.4jt",
      icon: <TrendingUp size={22} />,
      color: "#22C55E",
      bg: "#22C55E15",
    },
    {
      label: "Total Pelanggan",
      value: "87",
      icon: <Users size={22} />,
      color: "#DC9E6B",
      bg: "#DC9E6B15",
    },
    {
      label: "Menu Terjual",
      value: "342",
      icon: <BarChart2 size={22} />,
      color: "#3B82F6",
      bg: "#3B82F615",
    },
  ];

  // Data transaksi terakhir (nanti dari backend)
  const recentTransactions = [
    {
      id: "2026-ESP-001",
      item: "Espresso x2",
      total: "Rp 44.000",
      status: "Selesai",
      time: "09:12",
    },
    {
      id: "2026-SDW-002",
      item: "Sandwich x1",
      total: "Rp 35.000",
      status: "Selesai",
      time: "09:45",
    },
    {
      id: "2026-LAT-003",
      item: "Latte x3",
      total: "Rp 72.000",
      status: "Proses",
      time: "10:03",
    },
    {
      id: "2026-CAP-004",
      item: "Cappuccino x1",
      total: "Rp 28.000",
      status: "Selesai",
      time: "10:20",
    },
    {
      id: "2026-ESP-005",
      item: "Espresso x1",
      total: "Rp 22.000",
      status: "Batal",
      time: "10:35",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5EFE6" }}>
      {/* ══════════════════════════════
          TOPBAR
      ══════════════════════════════ */}
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        {/* Kiri: Logo + Judul */}
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-9 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <h1 className="font-bold text-base" style={{ color: "#7D301F" }}>
              Caffe-eine Dashboard
            </h1>
            <p className="text-xs text-gray-400">
              Halo, {user?.name ?? "Admin"} 👋
            </p>
          </div>
        </div>

        {/* Kanan: Aksi */}
        <div className="flex items-center gap-3">
          {/* Badge role */}
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold text-white capitalize hidden sm:block"
            style={{ backgroundColor: "#DC9E6B" }}
          >
            {user?.role ?? "user"}
          </span>

          {/* Tombol ke POS — hanya tampil kalau admin */}
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/pos")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#7D301F" }}
            >
              <Coffee size={15} />
              <span className="hidden sm:block">Buka POS</span>
            </button>
          )}

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Keluar</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════
          KONTEN
      ══════════════════════════════ */}
      <main className="p-6 max-w-6xl mx-auto">
        {/* Judul + Tanggal */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "#1E1E1E" }}>
            Ringkasan Hari Ini
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* ── KARTU STATISTIK ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "#1E1E1E" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── GRAFIK + TRANSAKSI ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grafik Bar Sederhana */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold" style={{ color: "#1E1E1E" }}>
                Transaksi 7 Hari Terakhir
              </h3>
              <span className="text-xs text-gray-400">Per hari</span>
            </div>
            <div className="flex items-end gap-2 h-36">
              {[
                { h: 40, day: "Sen" },
                { h: 65, day: "Sel" },
                { h: 50, day: "Rab" },
                { h: 80, day: "Kam" },
                { h: 55, day: "Jum" },
                { h: 90, day: "Sab" },
                { h: 70, day: "Min" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${item.h}%`,
                      backgroundColor: i === 5 ? "#7D301F" : "#DC9E6B",
                      opacity: 0.85,
                    }}
                  />
                  <span className="text-xs text-gray-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabel Transaksi Terakhir */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold" style={{ color: "#1E1E1E" }}>
                Transaksi Terakhir
              </h3>
              <button
                className="text-xs flex items-center gap-1 hover:underline"
                style={{ color: "#7D301F" }}
              >
                Lihat semua <ArrowRight size={12} />
              </button>
            </div>

            {/* List transaksi */}
            <div className="flex flex-col gap-3">
              {recentTransactions.map((trx) => (
                <div
                  key={trx.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  {/* Kiri: ID + Item */}
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#1E1E1E" }}
                    >
                      {trx.item}
                    </p>
                    <p className="text-xs text-gray-400">
                      {trx.id} · {trx.time}
                    </p>
                  </div>

                  {/* Kanan: Total + Status */}
                  <div className="text-right">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#DC9E6B" }}
                    >
                      {trx.total}
                    </p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor:
                          trx.status === "Selesai"
                            ? "#22C55E15"
                            : trx.status === "Proses"
                              ? "#3B82F615"
                              : "#EF444415",
                        color:
                          trx.status === "Selesai"
                            ? "#22C55E"
                            : trx.status === "Proses"
                              ? "#3B82F6"
                              : "#EF4444",
                      }}
                    >
                      {trx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SHORTCUT MENU (kalau admin) ── */}
        {user?.role === "admin" && (
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold mb-4" style={{ color: "#1E1E1E" }}>
              Akses Cepat
            </h3>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate("/pos")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#7D301F" }}
              >
                <Coffee size={16} /> Buka POS Kasir
              </button>
              <button
                onClick={() => navigate("/menu")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50"
                style={{ borderColor: "#DC9E6B", color: "#DC9E6B" }}
              >
                <ShoppingBag size={16} /> Kelola Menu
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
