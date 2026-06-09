export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  code: string;
};

export const categories = ["Semua", "Kopi", "Non-Kopi", "Cemilan", "Makanan"];

export const products: Product[] = [
  //array dalam aray?
  {
    id: 1,
    name: "Espresso",
    price: 20000,
    category: "Kopi",
    image: "/src/assets/Espresso.png",
    isAvailable: true,
    code: "ESP",
  },
  {
    id: 2,
    name: "Americano Hot/Ice",
    price: 22000,
    category: "Kopi",
    image: "/src/assets/Americano.png",
    isAvailable: true,
    code: "AMR",
  },
  {
    id: 3,
    name: "Affogato",
    price: 39500,
    category: "Kopi",
    image: "/src/assets/Affogato.png",
    isAvailable: true,
    code: "AFT",
  },
  {
    id: 4,
    name: "Caramel Latte",
    price: 22000,
    category: "Kopi",
    image: "/src/assets/Caramel.png",
    isAvailable: true,
    code: "CRL",
  },
  {
    id: 5,
    name: "Matcha Latte",
    price: 32000,
    category: "Non-Kopi",
    image: "/src/assets/Matcha.png",
    isAvailable: true,
    code: "MCL",
  },
  {
    id: 6,
    name: "Coklat Ice/Hot",
    price: 33000,
    category: "Non-Kopi",
    image: "/src/assets/Coklat.png",
    isAvailable: true,
    code: "CKT",
  },
  {
    id: 7,
    name: "Teh Tarik",
    price: 19000,
    category: "Non-Kopi",
    image: "/src/assets/Teh.png",
    isAvailable: true,
    code: "THK",
  },
  {
    id: 8,
    name: "Croissant",
    price: 22000,
    category: "Cemilan",
    image: "/src/assets/Croissant.png",
    isAvailable: false,
    code: "CRS",
  },
  {
    id: 9,
    name: "Sandwich",
    price: 25000,
    category: "Makanan",
    image: "/src/assets/Sandwich.png",
    isAvailable: true,
    code: "SDW",
  },
  {
    id: 10,
    name: "Tiramisu",
    price: 38000,
    category: "Cemilan",
    image: "/src/assets/Tiramissu.png",
    isAvailable: true,
    code: "TMS",
  },
  {
    id: 11,
    name: "Cheesecake",
    price: 42000,
    category: "Cemilan",
    image: "/src/assets/Cheesecake.png",
    isAvailable: true,
    code: "CHK",
  },
];

// Data Produk (products.ts)
//         ↓
// ProductCard pakai data ini
//         ↓
// ProductGrid tampilkan banyak ProductCard
//         ↓
// Kasir bisa lihat & klik produk!
