import { useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/component/common/ProductCard";
import CartItem from "@/component/common/CartItem";
import { Button } from "@/component/ui/button";
import { useCartStore } from "@/store/cartStore";
import CheckoutModal from "@/component/common/CheckoutModal";
import { AnimatePresence, motion } from "framer-motion";
const POSPage = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  // Tambahkan di dalam POSPage, setelah useState activeCategory
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Di dalam return JSX, tambahkan
  // (3) FUNGSI SEMENTARA — nanti diganti Zustand
  // Sekarang hanya console.log dulu supaya kita bisa test
  const addItem = useCartStore((state) => state.addItem);
  // Dibaca: "Dari cartStore, ambil fungsi addItem"
  const items = useCartStore((state) => state.items);
  // Ambil data items untuk cek keranjang kosong atau tidak
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const filteredProducts =
    activeCategory === "Semua"
      ? products
      : // Kalau "Semua" → tampilkan semua produk
        products.filter((p) => p.category === activeCategory);
  // Kalau kategori lain → filter yang cocok sajanpm run
  // Format harga total
  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(getTotalPrice());

  return (
    <div className="flex h-screen w-full bg-cream font-body text-dark">
      {/* Panel Kiri — sama seperti sebelumnya */}
      <aside
        className="
        w-24 bg-surface
        border-r border-border-soft
        flex flex-col items-center
        py-4 gap-2
        overflow-y-auto
      "
      >
        {/* Logo kecil di atas sidebar */}
        <div className="mb-2 text-2xl">caffe-eine</div>
        <div className="w-full h-px bg-border-soft mb-2" />
        {/* Garis pemisah — w-full = lebar penuh, h-px = tinggi 1px */}

        {/* Render semua kategori dari array categories */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            // Saat diklik → ubah activeCategory ke kategori ini
            // React akan re-render → filteredProducts berubah → grid berubah
            className={`
              w-16 h-16 rounded-2xl
              flex flex-col items-center justify-center
              text-xs font-medium
              transition-all duration-200
              ${
                activeCategory === category
                  ? "bg-brand text-cream shadow-md scale-105"
                  : // Aktif → warna brand, teks cream, sedikit membesar
                    "text-dark/50 hover:bg-cream hover:text-dark"
                // Tidak aktif → abu-abu, hover cream
              }
            `}
          >
            {/* Icon kategori */}
            <span className="text-xl mb-1">
              {category === "Semua" && "🧩"}
              {category === "Kopi" && "☕"}
              {category === "Non-Kopi" && "🍵"}
              {category === "Cemilan" && "🍿"}
              {category === "Makanan" && "🥪"}
              {/* && artinya: "kalau kondisi kiri true, tampilkan yang kanan" */}
            </span>
            {/* Nama kategori — potong kalau terlalu panjang */}
            <span className="text-center leading-tight px-1">{category}</span>
          </button>
        ))}
      </aside>

      <section className="flex-1 overflow-y-auto">
        <div className="p-6 pb-0">
          <h1 className="text-2xl font-bold text-dark">Caffe-eine</h1>
          <p className="text-sm text-dark/60 mt-1">
            Gutten morgen, Kasir! Siap melayani?
          </p>
          {/* Info kategori aktif & jumlah produk */}
          <p className="text-xs text-dark/40 mt-1">
            {activeCategory === "Semua" ? "Semua produk" : activeCategory}
            {" · "}
            {filteredProducts.length} item
            {/* Jumlah produk berubah sesuai filter! */}
          </p>
          {/* array yang ada di dalam produk */}
        </div>
        <div className="grid grid-cols-3 gap-4 p-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addItem}
              // Sekarang onAddToCart langsung pakai addItem dari store!
              // Bukan console.log lagi!
            />
          ))}
        </div>
        {/* kalautidak ada produkk ini  */}
        <div className="flex flex-col items-center justify-center h-64 text-dark/30">
          <span className="text-5xl mb-3">🔍</span>
          <p className="text-sm">Tidak ada produk di kategori ini</p>
        </div>
      </section>

      {/* Panel Kanan — Keranjang */}
      <aside
        className="
        w-96 bg-surface
        border-l border-border-soft
        p-6 flex flex-col
        shadow-xl
      "
      >
        {/* Header keranjang */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Pesanan Saat Ini</h2>
          {getTotalItems() > 0 && (
            <span className="bg-brand text-cream text-xs font-bold px-2 py-1 rounded-full">
              {getTotalItems()} item
            </span>
          )}
        </div>

        {/* Isi keranjang — kosong atau ada item */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border-soft rounded-xl text-dark/40 flex-col gap-2">
            <span className="text-4xl">🛒</span>
            <span className="text-sm">Keranjang masih kosong</span>
            <span className="text-xs">Tap produk untuk menambahkan</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {/* AnimatePresence = "perhatikan anak-anakku yang masuk & keluar" */}
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }} // Mulai: transparan, geser kanan
                  animate={{ opacity: 1, x: 0 }} // Masuk: muncul normal
                  exit={{ opacity: 0, x: -20 }} // Keluar: geser kiri & hilang
                  transition={{ duration: 0.2 }}
                >
                  <CartItem item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Total dan tombol bayar */}
        <div className="mt-4 pt-4 border-t border-border-soft">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total</span>
            <span className="font-mono font-bold text-brand">
              {formattedTotal}
            </span>
          </div>
          <Button
            size="lg"
            className="w-full"
            disabled={items.length === 0}
            onClick={() => setIsCheckoutOpen(true)}
          >
            Bayar Sekarang ({formattedTotal})
          </Button>
        </div>
      </aside>
      {/* kenapa hrs jxs ini amjik di sini sibal gara2 ini doang makan berjamjam sibaal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export { CheckoutModal };
export default POSPage;

// // User buka localhost:5173
//         ↓
// index.html → <div id="root">
//         ↓
// main.tsx → render <App /> ke dalam div#root
//         ↓
// App.tsx → cek URL "/"
//         ↓
// Cocok dengan <Route path="/" element={<POSPage />} />
//         ↓
// POSPage.tsx → render layout 2 panel
//         ↓
// index.css → aplikasikan warna Caffeeine
