import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Printer,
  Download,
  ArrowLeft,
  Edit2,
  Trash2,
} from "lucide-react";
import AppLayout from "@/component/common/AppLayout";
import { useCartStore } from "@/store/cartStore";
import { useKitchenStore } from "@/store/kitchenStore";
import toast from "react-hot-toast";

const generateInvoice = () =>
  `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;

export default function PaymentPage() {
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const {
    items: cart,
    customerName,
    customerType,
    tableNumber,
    getTotalPrice,
    removeItemByIndex,
    updateQuantity,
    clearCart,
  } = useCartStore();

  const { addOrder } = useKitchenStore();

  const [method, setMethod] = useState<"Tunai" | "QRIS" | "Debit">("Tunai");
  const [cash, setCash] = useState("");
  const [paid, setPaid] = useState(false);
  const [invoice, setInvoice] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [isEditing, setIsEditing] = useState(false); // req #2: mode edit

  const total = getTotalPrice();
  const tax = Math.round(total * 0.1);
  const grandTotal = total + tax;
  const change = method === "Tunai" ? (Number(cash) || 0) - grandTotal : 0;
  const canPay = method !== "Tunai" || Number(cash) >= grandTotal;

  const handlePayment = () => {
    if (!canPay) {
      toast.error("Uang tidak cukup!");
      return;
    }
    if (cart.length === 0) {
      toast.error("Keranjang kosong!");
      navigate("/pos");
      return;
    }

    const inv = generateInvoice();
    const now = new Date().toLocaleString("id-ID");
    setInvoice(inv);
    setPaidAt(now);

    addOrder({
      invoiceNumber: inv,
      customerName: customerName || "Guest",
      customerType,
      tableNumber,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        sugarLevel: item.sugarLevel,
        temperature: item.temperature,
        milk: item.milk,
        request: item.request,
        category: item.category,
      })),
      totalPrice: grandTotal,
      paymentMethod: method,
    });

    clearCart();
    setPaid(true);
    toast.success("Pembayaran berhasil! Pesanan dikirim ke dapur.");
  };

  const handlePrint = () => {
    const content = receiptRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    win.document.write(`<html><head><title>Struk</title>
      <style>body{font-family:'Courier New',monospace;font-size:12px;padding:16px;max-width:300px;margin:0 auto}</style>
      </head><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  // ── SUCCESS PAGE ───────────────────────────────────────────────
  if (paid) {
    return (
      <AppLayout title="Pembayaran Berhasil">
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <CheckCircle size={40} color="#22C55E" />
            </div>
            <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>
              Pembayaran Berhasil!
            </h2>
            <p style={{ color: "#6B7280", margin: 0 }}>
              Pesanan dikirim ke Management Dapur
            </p>
          </div>

          <div
            ref={receiptRef}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #E8DDD0",
              marginBottom: 16,
              fontFamily: "'Roboto Mono',monospace",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#7D301F" }}>
                ☕ CAFFEEINE POS
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>
                Kafe Kamu yang Paling Kece
              </div>
              <hr
                style={{ borderTop: "1px dashed #E8DDD0", margin: "12px 0" }}
              />
              <div style={{ fontSize: 12 }}>
                No: <strong>{invoice}</strong>
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{paidAt}</div>
            </div>
            <div style={{ fontSize: 13, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6B7280" }}>Pelanggan</span>
                <span style={{ fontWeight: 600 }}>
                  {customerName || "Guest"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6B7280" }}>Tipe</span>
                <span style={{ fontWeight: 600 }}>
                  {customerType}
                  {tableNumber ? ` · Meja ${tableNumber}` : ""}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6B7280" }}>Bayar via</span>
                <span style={{ fontWeight: 600 }}>{method}</span>
              </div>
            </div>
            <hr style={{ borderTop: "1px dashed #E8DDD0", margin: "12px 0" }} />
            <div style={{ fontSize: 13, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                Item Pesanan:
              </div>
              <p
                style={{ color: "#9CA3AF", fontSize: 12, textAlign: "center" }}
              >
                — (tersimpan di dapur) —
              </p>
            </div>
            <hr style={{ borderTop: "1px dashed #E8DDD0", margin: "12px 0" }} />
            <div style={{ fontSize: 13 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ color: "#6B7280" }}>Subtotal</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ color: "#6B7280" }}>Tax (10%)</span>
                <span>Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#7D301F",
                  marginTop: 8,
                }}
              >
                <span>TOTAL</span>
                <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>
              {method === "Tunai" && Number(cash) > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    color: "#22C55E",
                    marginTop: 4,
                  }}
                >
                  <span>Kembalian</span>
                  <span>Rp {change.toLocaleString("id-ID")}</span>
                </div>
              )}
            </div>
            <hr
              style={{ borderTop: "1px dashed #E8DDD0", margin: "16px 0 8px" }}
            />
            <div
              style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF" }}
            >
              Terima kasih sudah berkunjung!
              <br />
              See you next time ☕
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button onClick={handlePrint} style={outlineBtn}>
              <Printer size={16} /> Print Struk
            </button>
            <button onClick={handlePrint} style={outlineBtn}>
              <Download size={16} /> Simpan PDF
            </button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => navigate("/pos")}
              style={{ flex: 1, ...solidBtn }}
            >
              + Pesanan Baru
            </button>
            <button
              onClick={() => navigate("/kitchen")}
              style={{
                flex: 1,
                ...solidBtn,
                background: "#fff",
                color: "#7D301F",
                border: "2px solid #7D301F",
              }}
            >
              Lihat Management
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── PAYMENT PAGE ───────────────────────────────────────────────
  return (
    <AppLayout title="Pembayaran">
      <div style={{ maxWidth: 580, margin: "0 auto" }}>
        {/* Tombol Kembali / Edit — REQ #2 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => navigate("/pos")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #E8DDD0",
              color: "#6B7280",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            <ArrowLeft size={16} /> Kembali ke POS
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 12,
              background: isEditing ? "#7D301F" : "#F5EFE6",
              border: "1px solid #E8DDD0",
              color: isEditing ? "#fff" : "#7D301F",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            <Edit2 size={16} /> {isEditing ? "Selesai Edit" : "Edit Pesanan"}
          </button>
        </div>

        {/* Ringkasan Pesanan */}
        <div style={cardSt}>
          <h3 style={secTitle}>🧾 Ringkasan Pesanan</h3>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            {customerName || "Guest"} · {customerType}
            {tableNumber ? ` · Meja ${tableNumber}` : ""}
          </div>

          {cart.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9CA3AF" }}>
              Kosong —{" "}
              <span
                onClick={() => navigate("/pos")}
                style={{ color: "#7D301F", cursor: "pointer", fontWeight: 600 }}
              >
                kembali ke POS
              </span>
            </p>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                style={{ padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                    <span style={{ color: "#9CA3AF" }}> ×{item.quantity}</span>
                    <div
                      style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}
                    >
                      {item.temperature !== "N/A" && `${item.temperature} · `}
                      {item.sugarLevel > 0 && `Gula ${item.sugarLevel}% · `}
                      {item.milk !== "N/A" && item.milk}
                    </div>
                    {item.request && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#DC9E6B",
                          fontStyle: "italic",
                        }}
                      >
                        📝 {item.request}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                    {/* Edit mode: tampil tombol hapus & qty */}
                    {isEditing && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          style={{ ...miniBtn, background: "#F3F4F6" }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          style={{
                            ...miniBtn,
                            background: "#7D301F",
                            color: "#fff",
                            border: "none",
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItemByIndex(idx)}
                          style={{
                            ...miniBtn,
                            background: "#FEE2E2",
                            color: "#EF4444",
                            border: "none",
                          }}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#6B7280",
                marginBottom: 4,
              }}
            >
              <span>Subtotal</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#6B7280",
                marginBottom: 8,
              }}
            >
              <span>Tax (10%)</span>
              <span>Rp {tax.toLocaleString("id-ID")}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: 800,
                fontSize: 20,
                color: "#7D301F",
              }}
            >
              <span>Total</span>
              <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Metode Pembayaran */}
        <div style={cardSt}>
          <h3 style={secTitle}>💳 Metode Pembayaran</h3>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {(["Tunai", "QRIS", "Debit"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                style={toggleBtnPay(method === m)}
              >
                {m === "Tunai"
                  ? "💵 Tunai"
                  : m === "QRIS"
                    ? "📱 QRIS"
                    : "💳 Debit"}
              </button>
            ))}
          </div>

          {method === "Tunai" && (
            <div>
              <label style={lbl2}>Jumlah Uang Diterima</label>
              <input
                type="number"
                placeholder="0"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #E8DDD0",
                  fontSize: 18,
                  fontWeight: 700,
                  outline: "none",
                  boxSizing: "border-box" as const,
                }}
              />
              {Number(cash) > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    padding: 14,
                    borderRadius: 12,
                    background: change >= 0 ? "#DCFCE7" : "#FEE2E2",
                    color: change >= 0 ? "#16A34A" : "#DC2626",
                    fontWeight: 700,
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  {change >= 0
                    ? `Kembalian: Rp ${change.toLocaleString("id-ID")}`
                    : `Kurang: Rp ${Math.abs(change).toLocaleString("id-ID")}`}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {[50000, 100000, 150000, 200000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setCash(String(amt))}
                    style={{
                      flex: 1,
                      padding: "8px 0",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1px solid #E8DDD0",
                      background: Number(cash) === amt ? "#F5EFE6" : "#F9F9F9",
                      cursor: "pointer",
                      color: "#1E1E1E",
                    }}
                  >
                    {(amt / 1000).toFixed(0)}rb
                  </button>
                ))}
              </div>
            </div>
          )}
          {method === "QRIS" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div
                style={{
                  width: 160,
                  height: 160,
                  background: "#F3F4F6",
                  borderRadius: 12,
                  margin: "0 auto 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 60,
                }}
              >
                📱
              </div>
              <p style={{ color: "#6B7280", fontSize: 14 }}>
                Scan QRIS untuk membayar
              </p>
              <p
                style={{
                  fontWeight: 800,
                  color: "#7D301F",
                  fontSize: 20,
                  margin: 0,
                }}
              >
                Rp {grandTotal.toLocaleString("id-ID")}
              </p>
            </div>
          )}
          {method === "Debit" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 60, marginBottom: 12 }}>💳</div>
              <p style={{ color: "#6B7280", fontSize: 14 }}>
                Tempelkan atau gesek kartu debit
              </p>
              <p
                style={{
                  fontWeight: 800,
                  color: "#7D301F",
                  fontSize: 20,
                  margin: 0,
                }}
              >
                Rp {grandTotal.toLocaleString("id-ID")}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handlePayment}
          disabled={!canPay || cart.length === 0}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 14,
            fontWeight: 700,
            fontSize: 17,
            background: canPay && cart.length > 0 ? "#7D301F" : "#D1D5DB",
            color: "#fff",
            border: "none",
            cursor: canPay && cart.length > 0 ? "pointer" : "not-allowed",
          }}
        >
          ✅ Proses Pembayaran — Rp {grandTotal.toLocaleString("id-ID")}
        </button>
      </div>
    </AppLayout>
  );
}

// ── Style helpers ──────────────────────────────────────────
const cardSt: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 24,
  border: "1px solid #E8DDD0",
  marginBottom: 20,
};
const secTitle: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: 16,
  fontWeight: 700,
  color: "#1E1E1E",
};
const lbl2: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#1E1E1E",
  marginBottom: 8,
};
const toggleBtnPay = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: "11px 0",
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 14,
  border: "2px solid",
  borderColor: active ? "#7D301F" : "#E8DDD0",
  background: active ? "#7D301F" : "#fff",
  color: active ? "#fff" : "#6B7280",
  cursor: "pointer",
});
const solidBtn: React.CSSProperties = {
  padding: "12px 0",
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 15,
  background: "#7D301F",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};
const outlineBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px 0",
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 14,
  background: "#F5EFE6",
  color: "#7D301F",
  border: "1px solid #E8DDD0",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
};
const miniBtn: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 6,
  border: "1px solid #E8DDD0",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
  fontWeight: 700,
};
