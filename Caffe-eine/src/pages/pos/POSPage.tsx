import { useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "@/component/common/ProductCard";
import CartItem from "@/component/common/CartItem";
import { Button } from "@/component/ui/button";
import { useCartStore } from "@/store/cartStore";
import CheckoutModal from "@/component/common/CheckoutModal";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/data/products";
import toast from "react-hot-toast";
import TopBar from "@/component/common/TopBar";
import {
  LayoutGrid,
  Coffee,
  GlassWater,
  Cookie,
  UtensilsCrossed,
} from "lucide-react";

const POSPage = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 👇 State baru untuk metode pembayaran
  const [paymentMethod, setPaymentMethod] = useState<
    "tunai" | "non-tunai" | "barcode"
  >("tunai");

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast(`${product.image} ${product.name} ditambahkan!`, {
      icon: "✅",
      style: { fontWeight: "500" },
    });
  };

  const filteredProducts =
    activeCategory === "Semua"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const formattedTotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(getTotalPrice());

  const categoryIconMap: Record<string, React.ReactNode> = {
    Semua: <LayoutGrid size={22} />,
    Kopi: <Coffee size={22} />,
    "Non-Kopi": <GlassWater size={22} />,
    Cemilan: <Cookie size={22} />,
    Makanan: <UtensilsCrossed size={22} />,
  };

  return (
    // Ganti dari "flex" jadi "flex flex-col"
    // Supaya TopBar di atas, konten di bawah
    <div className="flex flex-col h-screen w-full bg-cream font-body text-dark">
      {/* TOPBAR — paling atas */}
      <TopBar />

      {/* KONTEN — 3 panel di bawah TopBar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar kiri — SAMA SEPERTI SEBELUMNYA */}
        <aside className="w-24 bg-surface border-r border-border-soft flex flex-col items-center py-4 gap-2 overflow-y-auto">
          {/* Hapus logo dari sidebar karena sudah ada di TopBar */}
          <div className="w-full h-px bg-border-soft mb-2" />

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
              w-16 h-16 rounded-2xl
              flex flex-col items-center justify-center
              text-xs font-medium
              transition-all duration-200
              ${
                activeCategory === category
                  ? "bg-brand text-cream shadow-md scale-105"
                  : "text-dark/50 hover:bg-cream hover:text-dark"
              }
            `}
            >
              <span className="mb-1">{categoryIconMap[category]}</span>
              <span className="text-center leading-tight px-1">{category}</span>
            </button>
          ))}
        </aside>

        {/* Panel tengah — produk */}
        <section className="flex-1 overflow-y-auto">
          <div className="p-6 pb-4">
            <h1 className="text-2xl font-bold text-dark">Selamat Datang! </h1>
            <p className="text-xs text-dark/40 mt-1">
              {activeCategory === "Semua" ? "Semua produk" : activeCategory}
              {" · "}
              {filteredProducts.length} item
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 px-6 pb-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-dark/30">
              <span className="text-5xl mb-3">↻</span>
              <p className="text-sm">Tidak ada produk di kategori ini</p>
            </div>
          )}
        </section>

        {/* Panel kanan — keranjang */}
        <aside className="w-96 bg-surface border-l border-border-soft p-6 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Pesanan Saat Ini</h2>
            {getTotalItems() > 0 && (
              <span className="bg-brand text-cream text-xs font-bold px-2 py-1 rounded-full">
                {getTotalItems()} item
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border-soft rounded-xl text-dark/40 flex-col gap-2">
              <span className="text-4xl">🛒</span>
              <span className="text-sm">Keranjang masih kosong</span>
              <span className="text-xs">Tap produk untuk menambahkan</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CartItem item={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Metode Pembayaran */}
          <div className="mb-4 mt-4">
            <p className="text-xs font-semibold mb-2 text-dark/60">
              Metode Pembayaran
            </p>
            <div className="flex gap-2">
              {(["tunai", "non-tunai", "barcode"] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`
                  flex-1 py-2 px-3 rounded-xl
                  text-sm font-medium
                  transition-all duration-200 border-2
                  ${
                    paymentMethod === method
                      ? "border-brand bg-brand text-cream shadow-md"
                      : "border-border-soft bg-cream text-dark hover:bg-amber/20"
                  }
                `}
                >
                  {method === "tunai" && " Tunai"}
                  {method === "non-tunai" && " Non-Tunai"}
                  {method === "barcode" && " ▩ Barcode"}
                </button>
              ))}
            </div>
          </div>

          {/* Total + Tombol Bayar */}
          <div className="pt-4 border-t border-border-soft">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-mono font-bold text-brand text-lg">
                {formattedTotal}
              </span>
            </div>
            <Button
              size="lg"
              className="w-full"
              disabled={items.length === 0}
              onClick={() => setIsCheckoutOpen(true)}
            >
              Proses Pembayaran ({formattedTotal})
            </Button>
          </div>
        </aside>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            paymentMethod={paymentMethod}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default POSPage;
