import { Minus, Plus, Trash2 } from "lucide-react";
import { Emoji } from "react-emoji-render";
import { useCartStore, type CartItem as CartItemType } from "@/store/cartStore";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(item.price * item.quantity);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-soft last:border-b-0">
      {/* Gambar / Emoji produk dengan react-emoji */}
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream flex-shrink-0 flex items-center justify-center text-xl">
        <Emoji text={item.image} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-xs text-dark/50 font-mono">{formattedPrice}</p>
        {item.temperature !== "N/A" ||
        item.sugarLevel > 0 ||
        item.milk !== "N/A" ? (
          <p className="text-xs text-dark/40 mt-0.5">
            {item.temperature !== "N/A" && `${item.temperature} · `}
            {item.sugarLevel > 0 && `Gula ${item.sugarLevel}% · `}
            {item.milk !== "N/A" && item.milk}
          </p>
        ) : null}
        {item.request && (
          <p className="text-xs italic text-amber-600 mt-0.5">
            📝 {item.request}
          </p>
        )}
      </div>

      {/* Quantity control */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            if (item.quantity === 1) {
              removeItem(item.id);
            } else {
              decreaseQuantity(item.id);
            }
          }}
          className="w-7 h-7 rounded-full border border-border-soft flex items-center justify-center text-xs hover:bg-cream transition-colors"
        >
          {item.quantity === 1 ? (
            <Trash2 size={14} className="text-red-500" />
          ) : (
            <Minus size={14} />
          )}
        </button>
        <span className="w-7 text-center text-sm font-mono font-bold">
          {item.quantity}
        </span>
        <button
          onClick={() => increaseQuantity(item.id)}
          className="w-7 h-7 rounded-full border border-border-soft flex items-center justify-center text-xs hover:bg-cream transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
