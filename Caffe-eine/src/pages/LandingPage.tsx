// src/pages/LandingPage.tsx
import { useNavigate } from "react-router-dom";
import { Coffee, ShoppingBag, Users } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F5EFE6" }}
    >
      {/* ── NAVBAR ── */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        {/* Logo & Nama */}
        <div className="flex items-center gap-2">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="font-bold text-xl" style={{ color: "#7D301F" }}>
            Caffe-eine
          </span>
        </div>

        {/* Tombol Navigasi */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/menu")}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-gray-50"
            style={{ borderColor: "#7D301F", color: "#7D301F" }}
          >
            Lihat Menu
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#7D301F" }}
          >
            Masuk
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        {/* Ikon kopi besar */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg"
          style={{ backgroundColor: "#7D301F" }}
        >
          <Coffee size={48} color="white" />
        </div>

        {/* Judul utama */}
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ color: "#1E1E1E" }}
        >
          Selamat Datang di
          <br />
          <span style={{ color: "#7D301F" }}>Caffe-eine</span>
        </h1>

        {/* Deskripsi singkat */}
        <p className="text-gray-500 text-lg mb-10 max-w-md">
          Kopi terbaik, suasana nyaman, pengalaman tak terlupakan. Yuk pesan
          sekarang! ☕
        </p>

        {/* Tombol CTA */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3 rounded-xl text-white font-semibold text-base shadow-md transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#7D301F" }}
          >
            Jelajahi Menu
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl font-semibold text-base border-2 transition-colors hover:bg-white"
            style={{ borderColor: "#7D301F", color: "#7D301F" }}
          >
            Daftar Gratis
          </button>
        </div>

        {/* ── STATS KECIL ── */}
        <div className="flex gap-8 mt-14 flex-wrap justify-center">
          {/* Stat 1 */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#DC9E6B22" }}
            >
              <Coffee size={24} style={{ color: "#DC9E6B" }} />
            </div>
            <span className="font-bold text-xl" style={{ color: "#1E1E1E" }}>
              20+
            </span>
            <span className="text-sm text-gray-500">Menu Pilihan</span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#7D301F22" }}
            >
              <Users size={24} style={{ color: "#7D301F" }} />
            </div>
            <span className="font-bold text-xl" style={{ color: "#1E1E1E" }}>
              500+
            </span>
            <span className="text-sm text-gray-500">Pelanggan Puas</span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#22C55E22" }}
            >
              <ShoppingBag size={24} style={{ color: "#22C55E" }} />
            </div>
            <span className="font-bold text-xl" style={{ color: "#1E1E1E" }}>
              1000+
            </span>
            <span className="text-sm text-gray-500">Transaksi</span>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="text-center py-4 text-sm text-gray-400">
        © 2026 Caffe-eine Coffee Shop. All rights reserved.
      </footer>
    </div>
  );
}
