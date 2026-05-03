export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
};

export const categories = ["Semua", "Kopi", "Non-Kopi", "Cemilan", "Makanan"];

export const products: Product[] = [
  //array dalam aray?
  {
    id: 1,
    name: "Espresso",
    price: 20000,
    category: "Kopi",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Americano",
    price: 22000,
    category: "Kopi",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 3,
    name: "Affogato",
    price: 39500,
    category: "Kopi",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 4,
    name: "Caramel Latte",
    price: 22000,
    category: "Kopi",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 5,
    name: "Matcha Latte",
    price: 32000,
    category: "Non-Kopi",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 6,
    name: "Coklat Ice/Hot",
    price: 33000,
    category: "Non-Kopi",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 7,
    name: "Teh Tarik",
    price: 30000,
    category: "Non-Kopi",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 8,
    name: "Croissant",
    price: 22000,
    category: "Cemilan",
    image: "contph gambar",
    isAvailable: false,
  },
  {
    id: 9,
    name: "Sandwich",
    price: 35000,
    category: "Makanan",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 10,
    name: "Tiramisu",
    price: 38000,
    category: "Cemilan",
    image: "contph gambar",
    isAvailable: true,
  },
  {
    id: 11,
    name: "Cheesecake",
    price: 42000,
    category: "Cemilan",
    image: "contph gambar",
    isAvailable: true,
  },
];

// Data Produk (products.ts)
//         ↓
// ProductCard pakai data ini
//         ↓
// ProductGrid tampilkan banyak ProductCard
//         ↓
// Kasir bisa lihat & klik produk!
