// ============================================
// FILE: src/pages/dashboard/KasirDashboard.tsx
// ============================================
import { useNavigate } from "react-router-dom";
import {
  Coffee,
  LogOut,
  Clock,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Play,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

// ===== TYPES =====
interface ShiftStat {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

// ===== ANIMATIONS =====
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ===== KOMPONEN UTAMA =====
export default function KasirDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [shiftStart] = useState(new Date());

  // Update jam setiap detik
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    const name = user?.name ?? "Kasir";
    logout();
    toast.success(`Shift selesai! Terima kasih ${name}. 💪`, {
      style: { background: "#7D301F", color: "#fff" },
      iconTheme: { primary: "#DC9E6B", secondary: "#7D301F" },
    });
    navigate("/login");
  };

  const shiftDuration = () => {
    const diff = Math.floor((currentTime.getTime() - shiftStart.getTime()) / 1000);
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const stats: ShiftStat[] = [
    {
      label: "Transaksi Shift Ini",
      value: "24",
      icon: <ShoppingBag size={20} />,
      color: "#7D301F",
      bg: "#7D301F18",
    },
    {
      label: "Total Penjualan",
      value: "Rp 680rb",
      icon: <TrendingUp size={20} />,
      color: "#22C55E",
      bg: "#22C55E18",
    },
    {
      label: "Item Terjual",
      value: "57",
      icon: <Coffee size={20} />,
      color: "#DC9E6B",
      bg: "#DC9E6B18",
    },
  ];

  // Menu items terlaris hari ini
  const topItems = [
    { name: "Espresso", qty: 18, pct: 90 },
    { name: "Latte", qty: 14, pct: 70 },
    { name: "Cappuccino", qty: 11, pct: 55 },
    { name: "Croissant", qty: 9, pct: 45 },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5EFE6" }}>
      {/* ══════════════════════════════
          TOPBAR
      ══════════════════════════════ */}
      <header
        className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-20"
        style={{ borderBottom: "1px solid #E8DDD0" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "#7D301F" }}
          >
            <Coffee size={18} color="#fff" />
          </div>
          <div>
            <h1
              className="font-bold text-sm"
              style={{ color: "#7D301F", fontFamily: "Roboto, sans-serif" }}
            >
              Caffeeine POS
            </h1>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>
              Selamat bekerja, {user?.name ?? "Kasir"} ☕
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live clock */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium"
            style={{ backgroundColor: "#F5EFE6", color: "#7D301F" }}
          >
            <Clock size={12} />
            {currentTime.toLocaleTimeString("id-ID")}
          </div>
          <span
            className="hidden sm:block px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: "#DC9E6B" }}
          >
            Kasir
          </span>
          <button
            id="btn-kasir-logout"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-red-50 hover:text-red-500"
            style={{ color: "#6B7280" }}
          >
            <LogOut size={14} />
            <span className="hidden sm:block">Keluar</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════
          KONTEN
      ══════════════════════════════ */}
      <main className="p-6 max-w-4xl mx-auto">
        {/* Welcome Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-7 mb-7 relative overflow-hidden"
          style={{ backgroundColor: "#7D301F" }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
            style={{ backgroundColor: "#DC9E6B" }}
          />
          <div
            className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full opacity-10"
            style={{ backgroundColor: "#F5EFE6" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "rgba(245,239,230,0.7)" }}
              >
                Shift Aktif ·{" "}
                <span style={{ color: "#DC9E6B" }}>{shiftDuration()}</span>
              </p>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "#F5EFE6", fontFamily: "Roboto, sans-serif" }}
              >
                Selamat Datang,
                <br />
                {user?.name ?? "Kasir"}! ☕
              </h2>
              <p
                className="text-sm leading-relaxed max-w-sm"
                style={{ color: "rgba(245,239,230,0.7)" }}
              >
                Shift kamu dimulai pukul{" "}
                <span style={{ color: "#DC9E6B" }}>
                  {shiftStart.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                . Semangat melayani pelanggan hari ini!
              </p>
            </div>

            {/* CTA ke POS */}
            <button
              id="btn-kasir-open-pos"
              onClick={() => navigate("/pos")}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg flex-shrink-0"
              style={{ backgroundColor: "#F5EFE6", color: "#7D301F" }}
            >
              <Play size={16} />
              Mulai Transaksi
            </button>
          </div>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p
                  className="text-xl font-bold"
                  style={{
                    color: "#1E1E1E",
                    fontFamily: "Roboto Mono, monospace",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── GRID: Top Items + Quick Actions ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Menu Terlaris */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3
              className="font-semibold text-sm mb-4"
              style={{ color: "#1E1E1E" }}
            >
              Menu Terlaris Hari Ini
            </h3>
            <div className="flex flex-col gap-4">
              {topItems.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm" style={{ color: "#1E1E1E" }}>
                      {i + 1}. {item.name}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: "#DC9E6B",
                        fontFamily: "Roboto Mono, monospace",
                      }}
                    >
                      {item.qty} pcs
                    </span>
                  </div>
                  <div
                    className="w-full h-1.5 rounded-full"
                    style={{ backgroundColor: "#F5EFE6" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: i === 0 ? "#7D301F" : "#DC9E6B" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions + Info Shift */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-4"
          >
            {/* Aksi Cepat */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3
                className="font-semibold text-sm mb-4"
                style={{ color: "#1E1E1E" }}
              >
                Aksi Cepat
              </h3>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => navigate("/pos")}
                  className="flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: "#7D301F", color: "#F5EFE6" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Coffee size={16} />
                    <span className="text-sm font-medium">Buka Kasir POS</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => navigate("/menu")}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all hover:bg-amber-50 active:scale-[0.98]"
                  style={{ borderColor: "#DC9E6B", color: "#DC9E6B" }}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag size={16} />
                    <span className="text-sm font-medium">Lihat Menu</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Info Shift */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#F5EFE6", border: "1px solid #E8DDD0" }}
            >
              <h3
                className="font-semibold text-sm mb-3"
                style={{ color: "#1E1E1E" }}
              >
                Info Shift
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Nama Kasir", value: user?.name ?? "-" },
                  {
                    label: "Mulai Shift",
                    value: shiftStart.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                  {
                    label: "Durasi",
                    value: shiftDuration(),
                    mono: true,
                  },
                  {
                    label: "Tanggal",
                    value: new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      {item.label}
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: "#1E1E1E",
                        fontFamily: item.mono
                          ? "Roboto Mono, monospace"
                          : "Roboto, sans-serif",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
