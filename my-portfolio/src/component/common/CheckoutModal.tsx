import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "../ui/button";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const [cashInput, setCashInput] = useState<number>(0);
  // Nominal uang yang diinput kasir
  // <number> = TypeScript tahu ini pasti angka, bukan string

  const [isSuccess, setIsSuccess] = useState(false);
  // false = tampilan normal (form input)
  // true  = tampilan sukses (setelah bayar dikonfirmasi)

  // ---- ZUSTAND STORE ----
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalPrice = getTotalPrice();
  // Simpan ke variabel supaya mudah dipakai berkali-kali

  // ---- KALKULASI KEMBALIAN ----
  const change = cashInput - totalPrice;
  // Contoh: kasir input 100.000, total 75.000
  // kembalian = 100.000 - 75.000 = 25.000
  // Kalau cashInput = 0, kembalian = -75.000 (negatif = belum cukup)

  // ---- FORMAT RUPIAH ----
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
    // Fungsi ini kita buat sendiri supaya bisa dipakai berkali-kali
    // di dalam modal ini tanpa menulis ulang terus!
  };

  // ---- HANDLER KONFIRMASI BAYAR ----
  const handleConfirm = () => {
    if (cashInput < totalPrice) return;
    // Kalau uang tidak cukup → tidak lakukan apapun
    // "return" = keluar dari fungsi sebelum lanjut

    setIsSuccess(true);
    // Ubah tampilan jadi "sukses"
  };

  // ---- HANDLER TUTUP MODAL ----
  const handleClose = () => {
    setCashInput(0);
    // Reset input uang ke 0
    setIsSuccess(false);
    // Reset tampilan sukses
    onClose();
    // Panggil fungsi onClose dari POSPage
    // supaya isOpen di POSPage berubah jadi false
  };

  // ---- HANDLER TRANSAKSI BARU ----
  const handleNewTransaction = () => {
    clearCart();
    // Kosongkan keranjang di Zustand
    handleClose();
    // Tutup modal + reset semua state
  };

  // ---- KALAU MODAL TERTUTUP → TIDAK RENDER APAPUN ----
  if (!isOpen) return null;
  // Ini penting untuk performa!
  // Kalau modal tidak terbuka, tidak perlu render apapun

  // ============================================
  // TAMPILAN
  // ============================================
  return (
    // OVERLAY — background gelap di belakang modal
    <div className="fixed inset-0 z-50 bg-dark/60..." onClick={handleClose}>
      {/* KOTAK MODAL — mencegah klik di dalam modal menutup modal */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        // Mulai tidak terlihat, geser 50px ke bawah, sedikit kecil

        animate={{ opacity: 1, y: 0, scale: 1 }}
        // Bergerak ke posisi normal

        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        // Keluar ke bawah saat ditutup

        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==========================================
            KONDISI 1 — TAMPILAN SUKSES
            Muncul setelah kasir konfirmasi bayar
            ========================================== */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            {/* Icon centang hijau besar */}
            <div
              className="
              w-20 h-20 rounded-full
              bg-success/10
              flex items-center justify-center
            "
            >
              <CheckCircle2 size={48} className="text-success" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-dark">
                Pembayaran Berhasil!
              </h2>
              <p className="text-dark/60 text-sm mt-1">Transaksi selesai</p>
            </div>

            {/* Info kembalian */}
            <div
              className="
              w-full bg-success/10
              rounded-xl p-4
              border border-success/20
            "
            >
              <p className="text-sm text-dark/60">Kembalian</p>
              <p className="text-3xl font-bold font-mono text-success">
                {formatRupiah(change)}
              </p>
            </div>

            {/* Tombol transaksi baru */}
            <Button className="w-full" size="lg" onClick={handleNewTransaction}>
              + Transaksi Baru
            </Button>
          </div>
        ) : (
          /* ==========================================
             KONDISI 2 — TAMPILAN FORM PEMBAYARAN
             Tampilan default saat modal dibuka
             ========================================== */
          <>
            {/* <> = Fragment — wrapper tak terlihat */}
            {/* Kita butuh ini karena JSX hanya boleh punya 1 root element */}

            {/* HEADER MODAL */}
            <div
              className="
              flex items-center justify-between
              p-6 border-b border-border-soft
            "
            >
              <h2 className="text-xl font-bold text-dark">
                💳 Konfirmasi Pembayaran
              </h2>
              {/* Tombol X untuk tutup modal */}
              <button
                onClick={handleClose}
                className="
                  w-8 h-8 rounded-lg
                  flex items-center justify-center
                  text-dark/40
                  hover:bg-cream hover:text-dark
                  transition-all
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY MODAL */}
            <div className="p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              {" "}
              {/* ada yg di ganti sm q jd 9 */}
              {/* RINGKASAN PESANAN */}
              <div className="bg-cream rounded-xl p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-dark/40 uppercase tracking-wide">
                  Ringkasan Pesanan
                </p>

                {/* List item yang dipesan */}
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-dark/70">
                      {item.name}
                      <span className="text-dark/40"> × {item.quantity}</span>
                    </span>
                    <span className="font-mono font-medium">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                {/* Garis pemisah */}
                <div className="h-px bg-border-soft mt-1" />

                {/* Total */}
                <div className="flex justify-between">
                  <span className="font-bold text-dark">Total</span>
                  <span className="font-mono font-bold text-brand text-lg">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>
              {/* INPUT UANG DITERIMA */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-dark">
                  Uang Diterima
                </label>
                <div className="relative">
                  {/* Label "Rp" di kiri input */}
                  <span
                    className="
                    absolute left-3 top-1/2 -translate-y-1/2
                    text-dark/40 font-mono text-sm
                  "
                  >
                    Rp
                  </span>
                  <input
                    type="number"
                    value={cashInput === 0 ? "" : cashInput}
                    // Kalau 0 → tampilkan kosong (bukan angka 0)
                    // Kalau ada angka → tampilkan angkanya
                    onChange={(e) => setCashInput(Number(e.target.value))}
                    // Setiap kasir ketik → update cashInput
                    // Number() = ubah string dari input jadi angka
                    placeholder="0"
                    className="
                      w-full pl-10 pr-4 py-3
                      bg-cream border border-border-soft
                      rounded-xl font-mono text-lg
                      outline-none
                      focus:border-brand focus:ring-2 focus:ring-brand/20
                      transition-all
                    "
                    // focus:border-brand = border jadi warna brand saat diklik
                    // focus:ring-2 = efek glow tipis saat diklik
                    autoFocus
                    // autoFocus = input langsung aktif saat modal dibuka
                    // Kasir tidak perlu klik dulu!
                  />
                </div>

                {/* Quick amount buttons — shortcut nominal umum */}
                <div className="grid grid-cols-4 gap-2">
                  {[10000, 20000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setCashInput(amount)}
                      // Klik → langsung set cashInput ke nominal ini
                      className="
                        py-2 px-1 rounded-lg text-xs font-mono
                        bg-cream border border-border-soft
                        text-dark/60
                        hover:border-amber hover:text-dark
                        transition-all
                      "
                    >
                      {amount >= 1000 ? `${amount / 1000}rb` : amount}
                      {/* Tampilkan "10rb", "20rb", "50rb", "100rb" */}
                      {/* Lebih singkat dan mudah dibaca kasir! */}
                    </button>
                  ))}
                </div>
              </div>
              {/* KEMBALIAN — hanya tampil kalau cashInput > 0 */}
              {cashInput > 0 && (
                <div
                  className={`
                  rounded-xl p-4
                  border
                  ${
                    change >= 0
                      ? "bg-success/10 border-success/20"
                      : // Uang cukup → hijau
                        "bg-danger/10 border-danger/20"
                    // Uang kurang → merah
                  }
                `}
                >
                  <p className="text-xs text-dark/40">
                    {change >= 0 ? "Kembalian" : "Kekurangan"}
                  </p>
                  <p
                    className={`
                    text-2xl font-bold font-mono
                    ${change >= 0 ? "text-success" : "text-danger"}
                  `}
                  >
                    {formatRupiah(Math.abs(change))}
                    {/* Math.abs() = nilai absolut (hapus tanda minus) */}
                    {/* Kita tampilkan angkanya saja, warna yang kasih tahu */}
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER MODAL — tombol aksi */}
            <div
              className="
              flex gap-3 p-6
              border-t border-border-soft
            "
            >
              {/* Tombol Batal */}
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Batal
              </Button>

              {/* Tombol Konfirmasi */}
              <Button
                className="flex-2 flex-grow-[2]"
                onClick={handleConfirm}
                disabled={cashInput < totalPrice}
                // Tombol dikunci kalau uang belum cukup!
              >
                ✓ Konfirmasi Bayar
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutModal;
