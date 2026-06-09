// ============================================
// FILE: src/pages/kitchen/KitchenPage.tsx
// ============================================
import { useEffect, useState } from "react";
import { Clock, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import AppLayout from "@/component/common/AppLayout";
import { useKitchenStore } from "@/store/kitchenStore";
import toast from "react-hot-toast";

export default function KitchenPage() {
  const { orders, fetchOrders, updateOrderStatus, clearCompleted } =
    useKitchenStore();
  const [now, setNow] = useState(new Date());

  // Polling tiap 3 detik
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
      setNow(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const pending = orders.filter((o) => o.status === "pending");
  const processing = orders.filter((o) => o.status === "processing");
  const completed = orders.filter((o) => o.status === "completed");

  const getElapsed = (createdAt: string) => {
    const diff = Math.floor(
      (now.getTime() - new Date(createdAt).getTime()) / 1000,
    );
    if (diff < 60) return `${diff}d`;
    return `${Math.floor(diff / 60)}m ${diff % 60}d`;
  };

  const handleStart = (id: string) => {
    updateOrderStatus(id, "processing");
    toast.success("Pesanan mulai diproses! 🔥");
  };

  const handleDone = (id: string) => {
    updateOrderStatus(id, "completed");
    toast.success("Pesanan selesai! ✅");
  };

  const handleClearCompleted = () => {
    clearCompleted();
    toast.success("Riwayat selesai dibersihkan");
  };

  // ── Status badge config ───────────────────────────────────
  const badge = (status: string) => {
    if (status === "pending")
      return { bg: "#FEF3E2", color: "#D97706", label: "Menunggu" };
    if (status === "processing")
      return { bg: "#DBEAFE", color: "#2563EB", label: "Diproses" };
    return { bg: "#DCFCE7", color: "#16A34A", label: "Selesai" };
  };

  return (
    <AppLayout title="Management Pesanan">
      {/* Summary Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          {
            label: "Menunggu",
            count: pending.length,
            bg: "#FEF3E2",
            color: "#D97706",
          },
          {
            label: "Diproses",
            count: processing.length,
            bg: "#DBEAFE",
            color: "#2563EB",
          },
          {
            label: "Selesai",
            count: completed.length,
            bg: "#DCFCE7",
            color: "#16A34A",
          },
          {
            label: "Total Hari Ini",
            count: orders.length,
            bg: "#F5EFE6",
            color: "#7D301F",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: s.bg,
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14, color: s.color }}>
              {s.label}
            </span>
            <span style={{ fontWeight: 800, fontSize: 30, color: s.color }}>
              {s.count}
            </span>
          </div>
        ))}
      </div>

      {/* Active Orders */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <h3
          style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1E1E1E" }}
        >
          Antrian Aktif
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#9CA3AF",
          }}
        >
          <RefreshCw size={12} />
          Auto-refresh setiap 3 detik
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 32,
        }}
      >
        {[...pending, ...processing].map((order) => {
          const b = badge(order.status);
          const elapsed = getElapsed(order.createdAt);
          return (
            <div
              key={order.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                border: `2px solid ${b.bg}`,
                borderTop: `4px solid ${b.color}`,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{ fontWeight: 800, fontSize: 15, color: "#1E1E1E" }}
                >
                  {order.invoiceNumber}
                </span>
                <span
                  style={{
                    background: b.bg,
                    color: b.color,
                    padding: "3px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {b.label}
                </span>
              </div>

              {/* Customer */}
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
                👤{" "}
                <strong style={{ color: "#1E1E1E" }}>
                  {order.customerName}
                </strong>
                {" · "}
                {order.customerType}
                {order.tableNumber && ` · Meja ${order.tableNumber}`}
              </div>

              {/* Items */}
              <div style={{ marginBottom: 12 }}>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#F9F9F9",
                      padding: "8px 12px",
                      borderRadius: 10,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#1E1E1E",
                      }}
                    >
                      {item.name} ×{item.quantity}
                    </div>
                    {(item.temperature !== "N/A" || item.sugarLevel > 0) && (
                      <div
                        style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}
                      >
                        {item.temperature !== "N/A" && `${item.temperature} · `}
                        {item.sugarLevel > 0 && `Gula ${item.sugarLevel}% · `}
                        {item.milk !== "N/A" && item.milk}
                      </div>
                    )}
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
                ))}
              </div>

              {/* Time */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "#9CA3AF",
                  marginBottom: 12,
                }}
              >
                <Clock size={12} />
                {elapsed} yang lalu ·{" "}
                {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Actions */}
              {order.status === "pending" && (
                <button
                  onClick={() => handleStart(order.id)}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    background: "#3B82F6",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  🔥 Mulai Buat
                </button>
              )}
              {order.status === "processing" && (
                <button
                  onClick={() => handleDone(order.id)}
                  style={{
                    width: "100%",
                    padding: "10px 0",
                    background: "#22C55E",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  ✅ Pesanan Selesai
                </button>
              )}
            </div>
          );
        })}

        {pending.length === 0 && processing.length === 0 && (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "48px 0",
              color: "#9CA3AF",
            }}
          >
            <CheckCircle
              size={48}
              color="#22C55E"
              style={{ marginBottom: 12 }}
            />
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              Semua pesanan selesai!
            </div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Tidak ada antrian aktif saat ini
            </div>
          </div>
        )}
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: "#6B7280",
              }}
            >
              ✅ Selesai ({completed.length})
            </h3>
            <button
              onClick={handleClearCompleted}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 8,
                border: "1px solid #E8DDD0",
                background: "#fff",
                color: "#EF4444",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Trash2 size={13} /> Bersihkan
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {completed.map((order) => (
              <div
                key={order.id}
                style={{
                  background: "#F9FFF9",
                  borderRadius: 14,
                  padding: 16,
                  border: "1px solid #86EFAC",
                  opacity: 0.85,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{ fontWeight: 700, fontSize: 14, color: "#1E1E1E" }}
                  >
                    {order.invoiceNumber}
                  </span>
                  <span
                    style={{ fontSize: 11, color: "#16A34A", fontWeight: 700 }}
                  >
                    ✅ Selesai
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  {order.customerName} · {order.customerType}
                  {order.tableNumber && ` · Meja ${order.tableNumber}`}
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
                  {order.items.length} item · Rp{" "}
                  {order.totalPrice.toLocaleString("id-ID")}
                </div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                  {new Date(order.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AppLayout>
  );
}
