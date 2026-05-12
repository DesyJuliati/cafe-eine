import { motion } from "framer-motion"; // ✨ FRAMER MOTION: Import motion component untuk animasi
import type { Product } from "@/data/products"; //remember tipe data sm real data asli beda yah! b
import { Button } from "@/component/ui/button";
import { Plus } from "lucide-react"; //  Lucide itu seperti "toko icon" — tinggal sebut nama, langsung dapat iconnya

interface ProductCardProps {
  product: Product;
  // "Komponen ini butuh satu data produk"
  // TypeScript akan marah kalau kamu lupa kasih data produk!

  onAddToCart: (product: Product) => void;
  // "Komponen ini butuh fungsi yang dipanggil saat tombol + ditekan"
  // (product: Product) → fungsi ini menerima data produk sebagai parameter
  // => void → fungsi ini tidak perlu return nilai apapun
}
const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Di sini kita "unpack" props
  // Daripada tulis props.product dan props.onAddToCart terus-terusan
  // Kita langsung ambil: { product, onAddToCart }

  // (4) FORMAT HARGA
  // Mengubah angka 20000 menjadi "Rp 20.000" yang mudah dibaca
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency", // format sebagai mata uang
    currency: "IDR", // mata uang Indonesia
    minimumFractionDigits: 0, // tidak perlu koma desimal (Rp 20.000 bukan Rp 20.000,00)
  }).format(product.price);
  // Hasilnya: 20000 → "Rp 20.000"

  // (5) RETURN — Tampilan kartu
  return (
    // ✨ FRAMER MOTION: Ganti <div> dengan <motion.div> untuk menambahkan animasi
    <motion.div
      // ✨ FRAMER MOTION - initial: Keadaan AWAL sebelum animasi dimulai
      // opacity: 0 = tidak terlihat (transparan penuh)
      // scale: 0.8 = ukuran 80% (lebih kecil dari normal)
      // Jadi produk mulai kecil dan tidak terlihat
      initial={{ opacity: 0, scale: 0.8 }}
      // ✨ FRAMER MOTION - animate: Keadaan AKHIR setelah animasi selesai
      // opacity: 1 = terlihat penuh
      // scale: 1 = ukuran 100% (ukuran normal)
      // Jadi produk berubah menjadi besar dan terlihat
      animate={{ opacity: 1, scale: 1 }}
      // ✨ FRAMER MOTION - transition: Pengaturan DURASI dan TIMING animasi
      // duration: 0.4 = animasi berlangsung 0.4 detik (400 milidetik)
      // ease: "easeOut" = animasi dimulai cepat, lalu melambat di akhir (terasa natural)
      transition={{ duration: 0.4, ease: "easeOut" }}
      // ✨ FRAMER MOTION - whileHover: Animasi saat MOUSE di atas produk
      // scale: 1.05 = produk membesar 5% (dari 100% menjadi 105%)
      // Ini memberikan feedback visual bahwa produk bisa diklik
      whileHover={{ scale: 1.05 }}
      // ✨ FRAMER MOTION - whileTap: Animasi saat USER KLIK produk
      // scale: 0.95 = produk mengecil 5% (dari 100% menjadi 95%)
      // Ini memberikan feedback bahwa tombol sedang ditekan
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex flex-col
        bg-surface rounded-2xl
        border border-border-soft
        overflow-hidden
        transition-all duration-200
        ${
          product.isAvailable
            ? "hover:shadow-md hover:border-amber cursor-pointer"
            : "opacity-50 cursor-not-allowed"
        }
      `}
    >
      {/* (6) BADGE "HABIS" — hanya muncul kalau isAvailable: false */}
      {!product.isAvailable && (
        <div
          className="
          absolute top-2 right-2 z-10
          bg-danger text-white
          text-xs font-bold
          px-2 py-1 rounded-full
        "
        >
          Habis
        </div>
        // absolute top-2 right-2 → posisi di pojok kanan atas kartu
        // z-10 → tampil di atas elemen lain
        // bg-danger → warna merah (#EF4444)
        // rounded-full → bentuk pill/oval
      )}

      {/* (7) AREA GAMBAR */}
      {/* Area Gambar — update bagian ini */}
      <div
        className="
  w-full h-36
  bg-surface-2
  flex items-center justify-center
  overflow-hidden
"
      >
        {product.image.startsWith("/src/assets/") ? (
          // ↑ Kalau image-nya path file gambar
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            // object-cover = gambar memenuhi kotak, tidak ada space kosong
          />
        ) : product.image === "contph gambar" ? (
          // ↑ Kalau masih placeholder
          <div className="flex flex-col items-center gap-1 text-dark/20">
            <span className="text-3xl">pict soon</span>
            <span className="text-xs">No Image</span>
          </div>
        ) : (
          // ↑ Kalau emoji
          <span className="text-4xl">{product.image}</span>
        )}
      </div>

      {/* (8) AREA INFORMASI PRODUK */}
      <div className="p-3 flex flex-col gap-2">
        {/* p-3 = padding 12px di semua sisi */}
        {/* flex flex-col gap-2 = susun vertikal dengan jarak 8px */}

        {/* Nama produk */}
        <h3
          className="
          font-semibold text-dark text-sm
          leading-tight line-clamp-2
        "
        >
          {product.name}
          {/* font-semibold = tebal tapi tidak terlalu tebal */}
          {/* text-sm = ukuran 14px */}
          {/* line-clamp-2 = maksimal 2 baris, kalau lebih dipotong dengan "..." */}
        </h3>

        {/* Harga — pakai font mono supaya angka rapi! */}
        <p className="font-mono text-amber font-medium text-sm">
          {formattedPrice}
          {/* font-mono = Roboto Mono, angka jadi rapi dan mudah dibaca */}
          {/* text-amber = warna #DC9E6B, memberikan kesan "harga" yang hangat */}
        </p>

        {/* Tombol Tambah */}
        <Button
          size="sm"
          className="w-full mt-1"
          disabled={!product.isAvailable}
          onClick={() => onAddToCart(product)}
          // disabled → tombol tidak bisa diklik kalau produk habis
          // onClick → panggil fungsi onAddToCart dan kirim data produk ini
          // () => onAddToCart(product) artinya:
          // "Ketika diklik, jalankan onAddToCart dengan data product ini"
        >
          <Plus size={14} />
          {/* Icon "+" dari Lucide, ukuran 14px */}
          Tambah
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
