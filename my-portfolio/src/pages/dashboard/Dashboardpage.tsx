import React from "react";
import type { Product } from "../../types/product"; //kenapa harus pakai type

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kopi Susu Gula Aren",
    price: 25000,
    description: "Kopi susu espresso dengan gula aren murni",
    image: "url-gambar-disini.jpg", // Nanti kita ganti dengan gambar asli dari assets
    category: "Coffee",
  },
];
const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* BAGIAN KIRI: DAFTAR MENU */}
      <section className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-900">
            Caffeeine Menu ☕
          </h1>
          <p className="text-slate-500">Pilih menu untuk mulai pesanan</p>
        </header>

        {/* Grid Produk */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kita akan isi dengan ProductCard nanti */}
          <div className="h-48 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center italic text-slate-400">
            const sampleProduct = {}
            Tempat Menu Kopi...
          </div>
        </div>
      </section>

      {/* BAGIAN KANAN: RINGKASAN PESANAN */}
      <aside className="w-96 bg-white border-l border-slate-200 p-6 flex flex-col shadow-xl">
        <h2 className="text-xl font-bold mb-4">Detail Pesanan</h2>

        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
          Belum ada produk terpilih
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex justify-between mb-4 font-bold text-lg">
            <span>Total</span>
            <span>Rp 0</span>
          </div>
          <button className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all">
            Bayar Sekarang
          </button>
        </div>
      </aside>
    </div>
  );
};

export default DashboardPage;
