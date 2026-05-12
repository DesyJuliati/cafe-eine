// ini main dari trolli
import { create } from "zustand";
import type { Product } from "@/data/products";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  // Tambah produk ke keranjang
  // Kalau sudah ada → naikkan quantity
  // Kalau belum ada → tambahkan sebagai item baru

  removeItem: (id: number) => void;
  // Hapus item dari keranjang berdasarkan id

  increaseQuantity: (id: number) => void;
  // Tambah quantity item +1

  decreaseQuantity: (id: number) => void;
  // Kurangi quantity item -1
  // Kalau quantity sudah 1 dan dikurangi → hapus dari keranjang

  clearCart: () => void;
  // Kosongkan seluruh keranjang
  // Dipanggil setelah pembayaran berhasil

  // COMPUTED VALUES (nilai yang dihitung otomatis):
  getTotalPrice: () => number;
  // Hitung total harga semua item
  // Contoh: Espresso(Rp20k × 2) + Americano(Rp22k × 1) = Rp62k

  getTotalItems: () => number;
  // Hitung total jumlah item
  // Contoh: Espresso(2) + Americano(1) = 3 item
};
export const useCartStore = create<CartStore>((set, get) => ({
  // "set" = fungsi untuk MENGUBAH data di store
  // "get" = fungsi untuk MEMBACA data di store saat ini

  // ---- DATA AWAL ----
  items: [],
  // Keranjang mulai kosong

  // ============================================
  // AKSI 1: addItem — Tambah produk ke keranjang
  // ============================================
  addItem: (product: Product) => {
    set((state) => {
      // "state" = kondisi store SAAT INI sebelum diubah

      // Cek apakah produk ini sudah ada di keranjang
      const existingItem = state.items.find(
        (item) => item.id === product.id,
        // .find() = cari item yang id-nya sama dengan product.id
      );

      if (existingItem) {
        // SUDAH ADA → naikkan quantity-nya saja
        return {
          items: state.items.map(
            (item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : // { ...item } = salin semua data item yang lama
                  // quantity: item.quantity + 1 = ganti quantity dengan +1
                  item,
            // Kalau bukan item ini, biarkan apa adanya
          ),
        };
      } else {
        // BELUM ADA → tambahkan sebagai item baru
        return {
          items: [
            ...state.items,
            // ...state.items = salin semua item yang sudah ada
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: 1,
              // quantity mulai dari 1
            },
          ],
        };
      }
    });
  },

  // ============================================
  // AKSI 2: removeItem — Hapus item dari keranjang
  // ============================================
  removeItem: (id: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      // .filter() = buat array baru yang TIDAK mengandung item dengan id ini
      // Artinya: "simpan semua item KECUALI yang id-nya sama"
    }));
  },

  // ============================================
  // AKSI 3: increaseQuantity — Tambah +1
  // ============================================
  increaseQuantity: (id: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    }));
  },

  // ============================================
  // AKSI 4: decreaseQuantity — Kurangi -1
  // ============================================
  decreaseQuantity: (id: number) => {
    set((state) => ({
      items: state.items
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
      // Setelah dikurangi, hapus item yang quantity-nya jadi 0
      // Jadi kalau quantity = 1 lalu dikurangi → 0 → otomatis hilang dari keranjang
    }));
  },

  // ============================================
  // AKSI 5: clearCart — Kosongkan keranjang
  // ============================================
  clearCart: () => {
    set({ items: [] });
    // Langsung set items jadi array kosong
  },

  // ============================================
  // COMPUTED 1: getTotalPrice — Hitung total harga
  // ============================================
  getTotalPrice: () => {
    const { items } = get();
    // get() = baca data store saat ini
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
      // Untuk setiap item: tambahkan (harga × jumlah) ke total
    }, 0);
    // 0 = nilai awal total sebelum dihitung
  },

  // ============================================
  // COMPUTED 2: getTotalItems — Hitung total item
  // ============================================
  getTotalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  },
}));
