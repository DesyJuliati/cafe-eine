# 📘 SETUP_GUIDE.md — Panduan Setup Caffeeine POS

> **Untuk: Jesslyn (Junior Developer)**
> Panduan ini ditulis dalam Bahasa Indonesia agar mudah dipahami.
> Ikuti setiap langkah secara berurutan ya! 😊

---

## 📋 Daftar Isi

1. [Setup Frontend](#bagian-1-setup-frontend)
2. [Setup Backend](#bagian-2-setup-backend)
3. [Jalankan Keduanya](#bagian-3-jalankan-keduanya)
4. [Test Login & Role](#bagian-4-test-login--role)
5. [Jalankan Screenshot](#bagian-5-jalankan-screenshot)
6. [Troubleshooting Error Umum](#bagian-6-troubleshooting-error-umum)

---

## BAGIAN 1: Setup Frontend

### Prasyarat
- Node.js versi 18+ (cek dengan `node -v`)
- npm versi 9+ (cek dengan `npm -v`)

### Langkah-langkah

**1. Masuk ke folder frontend:**
```bash
cd C:\Project\caffeeine\Caffe-eine
```

**2. Install semua dependencies:**
```bash
npm install
```

**3. Pastikan file `.env` sudah ada:**
```
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Caffeeine POS
```
> File `.env` sudah dibuat otomatis. Kalau hilang, copy dari `.env.example`.

**4. Cek struktur file yang harus ada:**
```
src/
├── pages/
│   ├── auth/login.tsx          ✅
│   ├── auth/register.tsx       ✅
│   ├── dashboard/
│   │   ├── AdminDashboard.tsx  ✅
│   │   └── KasirDashboard.tsx  ✅
│   └── pos/POSPage.tsx         ✅
├── store/
│   ├── authStore.ts            ✅
│   └── cartStore.ts            ✅
├── utils/
│   ├── api.ts                  ✅
│   └── transactionApi.ts       ✅
├── component/common/
│   ├── ProtectedRoute.tsx      ✅
│   ├── CheckoutModal.tsx       ✅
│   └── RoleAlert.tsx           ✅
└── routes/index.tsx            ✅
```

**5. Jalankan frontend (development mode):**
```bash
npm run dev
```
Frontend akan berjalan di: **http://localhost:5173**

---

## BAGIAN 2: Setup Backend

### Prasyarat
- Node.js 18+
- MySQL Server (XAMPP / Laragon / MySQL standalone)

### Langkah 2A: Siapkan MySQL

> ⚠️ **INI LANGKAH TERPENTING!** Error yang paling sering terjadi adalah MySQL belum aktif.

**1. Nyalakan MySQL:**
- **XAMPP:** Buka XAMPP Control Panel → klik **Start** di baris MySQL
- **Laragon:** Klik Start All
- **MySQL standalone:** Pastikan service MySQL berjalan

**2. Buat database:**

Buka MySQL client (bisa lewat phpMyAdmin, TablePlus, DBeaver, atau command line):
```sql
CREATE DATABASE caffeeine_db;
```
Atau lewat terminal:
```bash
mysql -u root -p
```
Lalu ketik:
```sql
CREATE DATABASE caffeeine_db;
SHOW DATABASES; -- pastikan caffeeine_db muncul
EXIT;
```

### Langkah 2B: Setup Backend Node.js

**1. Masuk ke folder backend:**
```bash
cd C:\Project\caffeeine\Caffe-eine\caffeeine-be
```

**2. Install dependencies backend:**
```bash
npm install
```

**3. Cek file `.env` backend (buat kalau belum ada):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=caffeeine_db
DB_PORT=3306
JWT_SECRET=caffeeine_secret_key_ganti_ini
PORT=3000
```
> Ganti `DB_PASS` sesuai password MySQL kamu (kalau pakai XAMPP default, biasanya kosong).

**4. Jalankan migrasi database (kalau ada):**
```bash
npm run migrate
# atau kalau tidak ada perintah migrate:
node seeders/index.js
```

**5. Jalankan backend:**
```bash
npm run dev
# atau
npm start
```
Backend akan berjalan di: **http://localhost:3000**

**6. Verifikasi backend aktif:**
Buka browser/Postman dan akses:
```
GET http://localhost:3000/api/auth/me
```
Harusnya dapat response (meski 401 Unauthorized), artinya backend aktif.

---

## BAGIAN 3: Jalankan Keduanya

Buka **2 terminal terpisah**:

**Terminal 1 — Backend:**
```bash
cd C:\Project\caffeeine\Caffe-eine\caffeeine-be
npm run dev
```
Tunggu sampai muncul: `Server running on port 3000` ✅

**Terminal 2 — Frontend:**
```bash
cd C:\Project\caffeeine\Caffe-eine
npm run dev
```
Tunggu sampai muncul: `Local: http://localhost:5173/` ✅

Buka browser dan akses: **http://localhost:5173**

---

## BAGIAN 4: Test Login & Role

### Akun Default (setelah backend berjalan)

| Role  | Email                  | Password    | Redirect Setelah Login |
|-------|------------------------|-------------|------------------------|
| Admin | admin@caffeeine.com    | password123 | `/dashboard`           |
| Kasir | kasir@caffeeine.com    | password123 | `/pos`                 |

> Kalau akun belum ada, buat lewat endpoint register atau seed database.

### Cara Test Login Admin:
1. Buka http://localhost:5173/login
2. Masukkan email: `admin@caffeeine.com`
3. Masukkan password: `password123`
4. Klik **Masuk ke Caffeeine**
5. Harus muncul toast: _"Selamat datang, Admin [nama]! 📊"_
6. Harus redirect ke `/dashboard`
7. Halaman dashboard admin harus tampil dengan stat cards dan tabel transaksi ✅

### Cara Test Login Kasir:
1. Logout terlebih dahulu (klik tombol Keluar)
2. Login dengan: `kasir@caffeeine.com` / `password123`
3. Harus muncul toast: _"Selamat datang, [nama]! ☕ Shift dimulai."_
4. Harus redirect ke `/pos`
5. Halaman POS harus tampil lengkap ✅

### Test Protected Route:
- Akses `/dashboard` tanpa login → harus redirect ke `/login`
- Login sebagai kasir, akses `/dashboard` → harus redirect ke `/unauthorized`
- Login sebagai admin, akses `/pos` → harus bisa akses ✅

### Test Logout:
- Kasir logout → toast: _"Shift selesai! Terima kasih [nama]. 💪"_
- Admin logout → toast: _"Sampai jumpa, [nama]!"_

---

## BAGIAN 5: Jalankan Screenshot

### Prasyarat
Puppeteer, concurrently, dan wait-on sudah ditambahkan ke `package.json`.
Install terlebih dahulu:

```bash
cd C:\Project\caffeeine\Caffe-eine
npm install
```

### Cara 1: Screenshot saja (frontend harus sudah running)
```bash
# Terminal 1: pastikan npm run dev sudah berjalan
# Terminal 2:
npm run screenshot
```

### Cara 2: Otomatis start frontend + screenshot
```bash
npm run screenshot:dev
```
Perintah ini akan:
1. Menjalankan `npm run dev` (Vite frontend)
2. Menunggu frontend siap di port 5173
3. Otomatis menjalankan `screenshot-loop.js`

### Hasil Screenshot
Semua screenshot tersimpan di folder:
```
C:\Project\caffeeine\Caffe-eine\screenshots\
```

File yang dihasilkan:
- `screenshot-loop-01-*.png` sampai `screenshot-loop-10-*.png` (tiap 1 detik)
- `screenshot-login-before-*.png`
- `screenshot-login-form-filled-*.png`
- `screenshot-login-after-click-*.png`
- `screenshot-pos-before-*.png`
- `screenshot-pos-after-category-click-*.png`
- `screenshot-pos-after-tambah-*.png`
- `screenshot-pos-after-checkout-modal-*.png`
- `screenshot-landing-*.png`, `screenshot-register-*.png`, dll.

---

## BAGIAN 6: Troubleshooting Error Umum

### ❌ Error: `Please install mysql package manually`
**Penyebab:** Sequelize versi lama mencari driver `mysql` bukan `mysql2`.

**Solusi:**
```bash
cd caffeeine-be
npm install mysql2
```
Lalu di `database.js` atau `config/database.js`, pastikan ada:
```js
const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');

const sequelize = new Sequelize('caffeeine_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  dialectModule: mysql2, // ← TAMBAHKAN INI
});
```

---

### ❌ Error: `TypeError: Cannot set properties of undefined (setting 'validatePassword')`
**Penyebab:** Model `User` gagal diinisialisasi karena koneksi database gagal.

**Solusi step by step:**
1. Pastikan MySQL **sudah berjalan** (buka XAMPP → MySQL → Start)
2. Pastikan database **sudah dibuat**: `CREATE DATABASE caffeeine_db;`
3. Cek password di `.env` backend sudah benar
4. Test koneksi:
```bash
node -e "
const mysql2 = require('mysql2');
const conn = mysql2.createConnection({host:'localhost',user:'root',password:'',database:'caffeeine_db'});
conn.connect(err => { console.log(err || 'Koneksi OK! ✅'); conn.end(); });
"
```

---

### ❌ Error: `ECONNREFUSED http://localhost:3000`
**Penyebab:** Backend belum berjalan.

**Solusi:**
```bash
cd C:\Project\caffeeine\Caffe-eine\caffeeine-be
npm run dev
```
Tunggu muncul `Server running on port 3000`.

---

### ❌ Error: `Network Error` / `ERR_NETWORK` di frontend
**Penyebab:** Frontend mencoba konek ke backend tapi backend mati.

**Catatan:** Frontend tetap bisa dijalankan tanpa backend untuk tampilan UI saja. Fitur login/register memerlukan backend aktif.

---

### ❌ TypeScript Error: `@/` alias tidak dikenali
**Solusi:** Pastikan `vite.config.ts` sudah ada konfigurasi alias:
```ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```

---

### ❌ Puppeteer error: `Could not find expected browser`
**Solusi:**
```bash
npx puppeteer browsers install chrome
```

---

## 📞 Urutan Prioritas Kalau Semua Error

1. ✅ Nyalakan MySQL dulu
2. ✅ Buat database `caffeeine_db`
3. ✅ Jalankan backend (`npm run dev` di folder `caffeeine-be`)
4. ✅ Jalankan frontend (`npm run dev` di folder `Caffe-eine`)
5. ✅ Test login di browser

> 💡 **Tip:** Buka DevTools browser (F12 → Console & Network tab) untuk melihat error yang lebih detail saat login/transaksi.

---

*Semangat ya, Jesslyn! Kamu bisa! ☕🚀*
