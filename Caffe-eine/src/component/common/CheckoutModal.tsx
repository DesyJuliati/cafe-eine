import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/component/ui/button";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: "tunai" | "non-tunai" | "barcode";
}

export default function CheckoutModal({
  isOpen,
  onClose,
  paymentMethod,
}: CheckoutModalProps) {
  const [cashInput, setCashInput] = useState(0);

  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = getTotalPrice();
  const change = cashInput - total;

  const handleCashPayment = () => {
    if (change < 0) return;
    toast.success("Pembayaran tunai berhasil! 🎉");
    clearCart();
    onClose();
  };

  const handleNonCashPayment = () => {
    toast.success("Pembayaran non-tunai berhasil! 🎉");
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="bg-cream p-6 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
      >
        {/* ====== HEADER MODAL — dengan tombol X ====== */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">Checkout</h2>
          <button
            onClick={onClose}
            className="
              w-8 h-8 rounded-lg
              flex items-center justify-center
              text-dark/40 text-lg
              hover:bg-danger/10 hover:text-danger
              transition-all duration-150
            "
          >
            ✕
          </button>
        </div>

        {/* Metode yang dipilih */}
        <p className="text-sm text-dark/60 mb-4">
          Metode:{" "}
          <strong>
            {paymentMethod === "tunai"
              ? "💵 Tunai"
              : paymentMethod === "non-tunai"
                ? "💳 Non-Tunai"
                : "📱 Barcode"}
          </strong>
        </p>

        {/* Ringkasan pesanan */}
        <div className="bg-surface rounded-xl p-4 mb-4 border border-border-soft">
          <p className="text-xs font-semibold text-dark/40 uppercase tracking-wide mb-2">
            Ringkasan Pesanan
          </p>
          <ul className="space-y-1 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.image} {item.name}
                  <span className="text-dark/40"> × {item.quantity}</span>
                </span>
                <span className="font-mono">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </span>
              </li>
            ))}
          </ul>

          {/* Garis pemisah */}
          <div className="h-px bg-border-soft my-3" />

          {/* Total */}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="font-mono text-brand text-lg">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* ====== TAMPILAN BERDASARKAN METODE ====== */}

        {/* TUNAI */}
        {paymentMethod === "tunai" && (
          <div>
            <label className="block text-sm mb-1 font-medium">
              Uang Diterima
            </label>
            <input
              type="number"
              value={cashInput === 0 ? "" : cashInput}
              onChange={(e) => setCashInput(Number(e.target.value))}
              className="
                w-full border border-border-soft
                rounded-xl px-3 py-2
                font-mono text-lg
                focus:outline-none focus:ring-2 focus:ring-brand
                bg-surface
              "
              placeholder="0"
              autoFocus
            />

            {/* Nominal cepat */}
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[10000, 20000, 50000, 100000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCashInput(amount)}
                  className="
                    py-1 rounded-lg text-xs font-mono
                    bg-surface border border-border-soft
                    text-dark/60
                    hover:border-amber hover:text-dark
                    transition-all
                  "
                >
                  {amount >= 1000 ? `${amount / 1000}rb` : amount}
                </button>
              ))}
            </div>

            {/* Kembalian */}
            {cashInput > 0 && (
              <p
                className={`text-lg font-bold mt-3 ${change >= 0 ? "text-success" : "text-danger"}`}
              >
                {change >= 0
                  ? `Kembalian: Rp ${change.toLocaleString("id-ID")}`
                  : `Kurang: Rp ${Math.abs(change).toLocaleString("id-ID")}`}
              </p>
            )}

            <Button
              className="mt-4 w-full"
              disabled={change < 0 || cashInput <= 0}
              onClick={handleCashPayment}
            >
              ✓ Konfirmasi Tunai
            </Button>
          </div>
        )}

        {/* NON-TUNAI */}
        {paymentMethod === "non-tunai" && (
          <div>
            <div className="bg-surface border border-border-soft rounded-xl p-4 mb-4 text-center">
              <p className="text-4xl mb-2">💳</p>
              <p className="text-sm text-dark/60">
                Pastikan pelanggan sudah menyelesaikan pembayaran melalui
                terminal kartu / QRIS.
              </p>
            </div>
            <Button className="w-full" onClick={handleNonCashPayment}>
              ✓ Konfirmasi Non-Tunai
            </Button>
          </div>
        )}

        {/* BARCODE */}
        {paymentMethod === "barcode" && (
          <div className="text-center">
            <div className="bg-surface border border-border-soft rounded-xl p-4 mb-4">
              <p className="text-sm text-dark/60 mb-3">
                Silakan scan barcode berikut:
              </p>
              <div
                className="
                w-48 h-16 bg-white
                border-2 border-dark rounded-md
                mx-auto mb-2
                flex items-center justify-center
                font-mono text-xs select-none
              "
              >
                ██ ░░ ███ ░ ██ ░░░ ██
              </div>
              <p className="text-xs text-dark/40">Simulasi barcode</p>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                toast.success("Barcode berhasil diproses! 🎉");
                clearCart();
                onClose();
              }}
            >
              ✓ Selesai
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
