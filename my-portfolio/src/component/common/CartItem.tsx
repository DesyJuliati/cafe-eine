import type { CartItem as CartItemType } from "@/store/cartStore";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
interface CartItemProps {
  item: CartItemType;
  // Komponen ini butuh satu item dari keranjang
  // Tipenya CartItemType = { id, name, price, image, quantity }
}

const CartItem = ({ item }: CartItemProps) => {
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  // Kenapa kita ambil fungsi di sini, bukan di POSPage?
  // Karena CartItem bertanggung jawab atas dirinya sendiri!
  // Setiap CartItem tahu cara mengubah quantity-nya sendiri.
  // Ini prinsip "separation of concerns" yang sudah kita pelajari!

  // Format harga subtotal item ini
  // Contoh: Espresso Rp 20.000 × 2 = Rp 40.000
  const subtotal = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(item.price * item.quantity);

  return (
    <motion.div
      // Animasi masuk dari kanan
      initial={{ opacity: 0, x: 50 }}
      // opacity: 0 = tidak terlihat
      // x: 50 = geser 50px ke kanan (di luar layar)

      animate={{ opacity: 1, x: 0 }}
      // opacity: 1 = terlihat penuh
      // x: 0 = posisi normal

      exit={{ opacity: 0, x: -50 }}
      // Animasi keluar ke kiri saat item dihapus
      // x: -50 = geser 50px ke kiri saat menghilang

      transition={{ duration: 0.2, ease: "easeOut" }}
      // Lebih cepat dari ProductCard (0.2 detik)
      // Karena ini aksi yang sering → tidak boleh terasa lambat!

      layout
      // ✨ Ini props spesial Framer Motion!
      // "layout" = kalau posisi item berubah (misalnya item di atas dihapus),
      // item lainnya bergerak dengan animasi smooth — bukan langsung loncat!

      className="
      flex items-center gap-3
      p-3 mb-2
      bg-cream rounded-xl
      border border-border-soft
      group
    "
    >
      {/* group = class khusus Tailwind */}
      {/* Fungsinya: saat div ini di-hover, semua child bisa */}
      {/* bereaksi dengan class "group-hover:..." */}

      {/* ----------------------------------------
          AREA GAMBAR — kotak kecil di kiri
          ---------------------------------------- */}
      <div
        className="
        w-12 h-12 rounded-lg
        bg-surface-2
        flex items-center justify-center
        text-xl flex-shrink-0
      "
      >
        {item.image === "contph gambar" ? "🖼️" : item.image}
        {/* flex-shrink-0 = gambar tidak menyusut meski ruang sempit */}
      </div>

      {/* ----------------------------------------
          INFO PRODUK — nama dan harga satuan
          ---------------------------------------- */}
      <div className="flex-1 min-w-0">
        {/* flex-1 = ambil semua sisa ruang */}
        {/* min-w-0 = penting! tanpa ini teks panjang bisa overflow */}

        <p className="text-sm font-semibold text-dark truncate">
          {item.name}
          {/* truncate = kalau nama terlalu panjang, potong dengan "..." */}
        </p>
        <p className="text-xs font-mono text-dark/50">
          Rp {item.price.toLocaleString("id-ID")}
          {/* Harga satuan */}
        </p>
      </div>

      {/* ----------------------------------------
          KONTROL QUANTITY — tombol +, angka, −
          ---------------------------------------- */}
      <div className="flex flex-col items-end gap-1">
        {/* Subtotal harga item ini */}
        <span className="text-sm font-mono font-bold text-dark">
          {subtotal}
        </span>

        {/* Tombol quantity */}
        <div className="flex items-center gap-1">
          {/* Tombol MINUS atau HAPUS */}
          <button
            onClick={() =>
              item.quantity === 1
                ? removeItem(item.id)
                : decreaseQuantity(item.id)
            }
            // Logika tombol kiri:
            // Kalau quantity = 1 → hapus item sepenuhnya
            // Kalau quantity > 1 → kurangi 1
            // Ini UX yang lebih baik daripada membiarkan quantity = 0!
            className="
              w-6 h-6 rounded-md
              flex items-center justify-center
              bg-surface border border-border-soft
              text-dark/50
              hover:bg-danger hover:text-white hover:border-danger
              transition-all duration-150
            "
          >
            {
              item.quantity === 1 ? (
                <Trash2 size={12} />
              ) : (
                // Kalau quantity = 1 → tampilkan icon hapus
                <Minus size={12} />
              )
              // Kalau quantity > 1 → tampilkan icon minus
            }
          </button>

          {/* Angka quantity */}
          <span
            className="
            w-6 text-center
            text-sm font-bold text-dark
          "
          >
            {item.quantity}
          </span>

          {/* Tombol PLUS */}
          <button
            onClick={() => increaseQuantity(item.id)}
            // Tambah quantity +1
            className="
              w-6 h-6 rounded-md
              flex items-center justify-center
              bg-surface border border-border-soft
              text-dark/50
              hover:bg-brand hover:text-cream hover:border-brand
              transition-all duration-150
            "
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
