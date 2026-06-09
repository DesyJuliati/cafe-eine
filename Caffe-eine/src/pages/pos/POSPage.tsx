import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, MessageSquare } from "lucide-react";
import { Emoji } from "react-emoji-render";
import AppLayout from "@/component/common/AppLayout";
import { useCartStore } from "@/store/cartStore";
import { useMenuStore } from "@/store/menuStore";
import type { CartItem } from "@/store/cartStore";
import type { MenuItem } from "@/store/menuStore";
import toast from "react-hot-toast";

type Category = "Coffee" | "Food" | "Non-Coffee";
const categories: ("Semua" | Category)[] = [
  "Semua",
  "Coffee",
  "Non-Coffee",
  "Food",
];

export default function POSPage() {
  const navigate = useNavigate();

  const { getAvailableMenu } = useMenuStore();
  const menuItems = getAvailableMenu();

  const {
    items: cart,
    customerName,
    customerType,
    tableNumber,
    setCustomerInfo,
    addItem,
    removeItemByIndex,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [sugarLevel, setSugarLevel] = useState(50);
  const [temperature, setTemperature] = useState<"Panas" | "Dingin">("Panas");
  const [milk, setMilk] = useState<"Full Cream" | "Low Fat" | "Oat Milk">(
    "Full Cream",
  );
  const [request, setRequest] = useState("");
  const [activeCategory, setActiveCategory] = useState<"Semua" | Category>(
    "Semua",
  );

  const [localName, setLocalName] = useState(customerName);
  const [localType, setLocalType] = useState<"Dine In" | "Take Away">(
    customerType,
  );
  const [localTable, setLocalTable] = useState(tableNumber);

  const filteredMenu =
    activeCategory === "Semua"
      ? menuItems
      : menuItems.filter((m) => m.category === activeCategory);

  const total = getTotalPrice();
  const tax = Math.round(total * 0.1);
  const grandTotal = total + tax;

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItem(item);
    setSugarLevel(item.hasSugar ? 50 : 0);
    setTemperature("Panas");
    setMilk("Full Cream");
    setRequest("");
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const cartItem: Omit<CartItem, "quantity"> = {
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      image: selectedItem.image,
      category: selectedItem.category,
      sugarLevel: selectedItem.hasSugar ? sugarLevel : 0,
      temperature: selectedItem.hasTemp ? temperature : "N/A",
      milk: selectedItem.hasMilk ? milk : "N/A",
      request: request.trim(),
    };

    addItem(cartItem);
    setSelectedItem(null);
    toast.success(`${selectedItem.name} ditambahkan! ☕`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong!");
      return;
    }
    setCustomerInfo(localName || "Guest", localType, localTable);
    navigate("/payment");
  };

  return (
    <AppLayout title="Kasir">
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}
      >
        {/* ─── LEFT PANEL ─────────────────────────────────────────── */}
        <div>
          {/* Customer Info */}
          <div style={card}>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {(["Dine In", "Take Away"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setLocalType(t)}
                  style={toggleBtn(localType === t)}
                >
                  {t === "Dine In" ? "🪑 Dine In" : "🛍️ Take Away"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                placeholder="Nama pelanggan"
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                style={inputSt}
              />
              {localType === "Dine In" && (
                <input
                  placeholder="No. Meja"
                  value={localTable}
                  onChange={(e) => setLocalTable(e.target.value)}
                  style={{ ...inputSt, width: 90, flex: "none" }}
                />
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 13,
                  border: "1px solid",
                  borderColor: activeCategory === cat ? "#7D301F" : "#E8DDD0",
                  backgroundColor: activeCategory === cat ? "#7D301F" : "#fff",
                  color: activeCategory === cat ? "#fff" : "#6B7280",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {filteredMenu.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  style={{
                    background: isSelected ? "#7D301F" : "#fff",
                    borderRadius: 14,
                    border: `2px solid ${isSelected ? "#7D301F" : "#E8DDD0"}`,
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.15s",
                  }}
                >
                  {/* ✅ Emoji pakai <Emoji> */}
                  <div
                    style={{
                      width: "100%",
                      height: 110,
                      background: isSelected ? "rgba(0,0,0,0.15)" : "#F5EFE6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 48,
                    }}
                  >
                    <Emoji text={item.image} />
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 14,
                        color: isSelected ? "#fff" : "#1E1E1E",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: isSelected ? "rgba(255,255,255,0.8)" : "#DC9E6B",
                        fontWeight: 600,
                        marginTop: 2,
                      }}
                    >
                      Rp {item.price.toLocaleString("id-ID")}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: isSelected ? "rgba(255,255,255,0.6)" : "#9CA3AF",
                        marginTop: 2,
                      }}
                    >
                      {item.category}
                      {!item.hasMilk &&
                        item.category !== "Food" &&
                        ` · Tanpa Susu`}
                      {!item.hasSugar &&
                        item.category !== "Food" &&
                        ` · Tanpa Gula`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Customization Panel */}
          {selectedItem && (
            <div
              style={{ ...card, border: "2px solid #7D301F", marginTop: 16 }}
            >
              <h3
                style={{ margin: "0 0 16px", color: "#7D301F", fontSize: 15 }}
              >
                ⚙️ Kustomisasi — <strong>{selectedItem.name}</strong>
              </h3>

              {selectedItem.hasSugar && (
                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>
                    🍬 Level Gula:{" "}
                    <strong style={{ color: "#7D301F" }}>{sugarLevel}%</strong>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={10}
                    value={sugarLevel}
                    onChange={(e) => setSugarLevel(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#7D301F" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 10,
                      color: "#9CA3AF",
                    }}
                  >
                    <span>0% Tanpa gula</span>
                    <span>50% Normal</span>
                    <span>100% Extra manis</span>
                  </div>
                </div>
              )}

              {selectedItem.hasTemp && (
                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>🌡️ Suhu</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["Panas", "Dingin"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTemperature(t)}
                        style={toggleBtn(temperature === t)}
                      >
                        {t === "Panas" ? "🔥 Panas" : "🧊 Dingin"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!selectedItem.hasTemp &&
                selectedItem.category !== "Food" &&
                selectedItem.name !== "Espresso" &&
                selectedItem.name !== "Affogato" && (
                  <div
                    style={{
                      marginBottom: 16,
                      padding: "10px 14px",
                      background: "#EFF6FF",
                      borderRadius: 10,
                      fontSize: 13,
                      color: "#3B82F6",
                    }}
                  >
                    🧊 Menu ini selalu disajikan <strong>Dingin</strong>
                  </div>
                )}

              {selectedItem.hasMilk && (
                <div style={{ marginBottom: 16 }}>
                  <label style={lbl}>🥛 Jenis Susu</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(["Full Cream", "Low Fat", "Oat Milk"] as const).map(
                      (m) => (
                        <button
                          key={m}
                          onClick={() => setMilk(m)}
                          style={{ ...toggleBtn(milk === m), fontSize: 12 }}
                        >
                          {m}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>
                  <MessageSquare
                    size={14}
                    style={{ display: "inline", marginRight: 6 }}
                  />
                  Request Khusus{" "}
                  <span
                    style={{ color: "#9CA3AF", fontWeight: 400, fontSize: 11 }}
                  >
                    (opsional)
                  </span>
                </label>
                <input
                  placeholder={
                    selectedItem.category === "Food"
                      ? "cth: extra keju, tidak pakai gula halus..."
                      : "cth: extra shot, less ice, no foam..."
                  }
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  style={{ ...inputSt, fontSize: 13 }}
                />
              </div>

              <button onClick={handleAddToCart} style={primaryBtn}>
                + Tambah ke Pesanan
              </button>
            </div>
          )}
        </div>

        {/* ─── RIGHT PANEL — CART ─────────────────────────────────── */}
        <div
          style={{
            ...card,
            position: "sticky",
            top: 20,
            height: "fit-content",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <ShoppingCart size={20} color="#7D301F" />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              Pesanan{" "}
              <span style={{ color: "#DC9E6B" }}>({getTotalItems()} item)</span>
            </h3>
          </div>

          {cart.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#9CA3AF",
                padding: "40px 0",
                fontSize: 14,
              }}
            >
              ☕<br />
              Belum ada pesanan.
              <br />
              Pilih menu di sebelah kiri.
            </div>
          ) : (
            <>
              <div style={{ maxHeight: 340, overflowY: "auto" }}>
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid #F3F4F6",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#9CA3AF",
                            marginTop: 2,
                          }}
                        >
                          {item.temperature !== "N/A" &&
                            `${item.temperature} · `}
                          {item.sugarLevel > 0 && `Gula ${item.sugarLevel}% · `}
                          {item.milk !== "N/A" && item.milk}
                        </div>
                        {item.request && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#DC9E6B",
                              fontStyle: "italic",
                              marginTop: 2,
                            }}
                          >
                            📝 {item.request}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItemByIndex(idx)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#EF4444",
                          padding: 4,
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          style={qtyBtn}
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          style={{
                            fontWeight: 700,
                            minWidth: 20,
                            textAlign: "center",
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          style={{
                            ...qtyBtn,
                            background: "#7D301F",
                            border: "none",
                            color: "#fff",
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#7D301F",
                          fontSize: 14,
                        }}
                      >
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "2px solid #E8DDD0",
                }}
              >
                <div style={row}>
                  <span style={{ color: "#6B7280", fontSize: 14 }}>
                    Subtotal
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
                <div style={{ ...row, marginTop: 4 }}>
                  <span style={{ color: "#6B7280", fontSize: 14 }}>
                    Tax (10%)
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    Rp {tax.toLocaleString("id-ID")}
                  </span>
                </div>
                <div
                  style={{
                    ...row,
                    marginTop: 10,
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#7D301F",
                  }}
                >
                  <span>Total</span>
                  <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  style={{
                    ...primaryBtn,
                    marginTop: 14,
                    width: "100%",
                    padding: "14px 0",
                    fontSize: 16,
                  }}
                >
                  💳 Bayar Sekarang
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// ── Style helpers ──────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  border: "1px solid #E8DDD0",
  marginBottom: 16,
};
const inputSt: React.CSSProperties = {
  flex: 1,
  padding: "9px 14px",
  borderRadius: 10,
  border: "1px solid #E8DDD0",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#1E1E1E",
  marginBottom: 8,
};
const toggleBtn = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: "8px 0",
  borderRadius: 10,
  fontWeight: 600,
  fontSize: 13,
  border: "2px solid",
  borderColor: active ? "#7D301F" : "#E8DDD0",
  backgroundColor: active ? "#7D301F" : "#fff",
  color: active ? "#fff" : "#6B7280",
  cursor: "pointer",
});
const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "12px 0",
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 15,
  background: "#7D301F",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};
const qtyBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: "1px solid #E8DDD0",
  backgroundColor: "#fff",
  color: "#1E1E1E",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
