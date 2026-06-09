// ============================================
// FILE: screenshot-loop.js (root of project)
// ============================================
// Puppeteer automation script untuk screenshot Caffeeine POS.
// Jalankan: node screenshot-loop.js
// Pastikan frontend sudah running di http://localhost:5173

import puppeteer from "puppeteer";
import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ── Setup path ──
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = "http://localhost:5173";
const SCREENSHOTS_DIR = join(__dirname, "screenshots");
const VIEWPORT = { width: 1440, height: 900 };

// ── Buat folder screenshots kalau belum ada ──
if (!existsSync(SCREENSHOTS_DIR)) {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  console.log("📁 Folder screenshots/ dibuat.");
}

// ── Helper: format timestamp ──
function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

// ── Helper: simpan screenshot ──
async function takeScreenshot(page, label) {
  const filename = `screenshot-${label}-${getTimestamp()}.png`;
  const filepath = join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  console.log(`📸 Screenshot disimpan: ${filename}`);
  return filepath;
}

// ── Helper: tunggu selector dengan timeout ──
async function waitAndClick(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    await page.click(selector);
    return true;
  } catch {
    console.warn(`⚠️  Selector "${selector}" tidak ditemukan dalam ${timeout}ms`);
    return false;
  }
}

// ── MAIN ──
async function main() {
  console.log("🚀 Memulai Puppeteer Screenshot Automation...");
  console.log(`📌 Target: ${BASE_URL}`);
  console.log(`📐 Viewport: ${VIEWPORT.width}×${VIEWPORT.height}\n`);

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    // ── COBA BUKA FRONTEND ──
    try {
      await page.goto(BASE_URL, { waitUntil: "networkidle2", timeout: 15000 });
    } catch {
      console.error(`\n❌ ERROR: Frontend tidak bisa diakses di ${BASE_URL}`);
      console.error("   Pastikan npm run dev sudah berjalan!\n");
      await browser.close();
      process.exit(1);
    }

    // ================================================================
    // FASE 1: Screenshot loop setiap 1 detik selama 10 detik
    // ================================================================
    console.log("── FASE 1: Screenshot loop (10 detik) ──");
    for (let i = 1; i <= 10; i++) {
      await takeScreenshot(page, `loop-${String(i).padStart(2, "0")}`);
      if (i < 10) await new Promise((r) => setTimeout(r, 1000));
    }

    // ================================================================
    // FASE 2: Screenshot interaksi — Login page
    // ================================================================
    console.log("\n── FASE 2: Interaksi Login Page ──");

    // Navigasi ke /login
    await page.goto(`${BASE_URL}/login`, {
      waitUntil: "networkidle2",
      timeout: 10000,
    });
    await new Promise((r) => setTimeout(r, 800));
    await takeScreenshot(page, "login-before");

    // Isi form login (simulasi)
    try {
      await page.waitForSelector("#email", { timeout: 5000 });
      await page.type("#email", "admin@caffeeine.com", { delay: 50 });
      await page.type("#password", "password123", { delay: 50 });
      await takeScreenshot(page, "login-form-filled");

      // Klik tombol login
      const clicked = await waitAndClick(page, "#btn-login");
      if (clicked) {
        await new Promise((r) => setTimeout(r, 2000));
        await takeScreenshot(page, "login-after-click");
      }
    } catch {
      console.warn("⚠️  Form login tidak ditemukan, skip interaksi login.");
      await takeScreenshot(page, "login-fallback");
    }

    // ================================================================
    // FASE 3: Screenshot interaksi — POS Page
    // ================================================================
    console.log("\n── FASE 3: Interaksi POS Page ──");

    await page.goto(`${BASE_URL}/pos`, {
      waitUntil: "networkidle2",
      timeout: 10000,
    });
    await new Promise((r) => setTimeout(r, 1000));
    await takeScreenshot(page, "pos-before");

    // Klik tombol category filter (tab kategori pertama)
    const categoryClicked = await waitAndClick(
      page,
      "[data-category], button[id^='category-'], .category-btn, aside button",
      3000
    );
    if (categoryClicked) {
      await new Promise((r) => setTimeout(r, 500));
      await takeScreenshot(page, "pos-after-category-click");
    }

    // Klik tombol "Tambah" pada produk pertama
    const tambahClicked = await waitAndClick(
      page,
      "button[id^='btn-tambah'], button:has(span:text('Tambah')), [data-testid='btn-tambah']",
      3000
    );
    if (tambahClicked) {
      await new Promise((r) => setTimeout(r, 500));
      await takeScreenshot(page, "pos-after-tambah");
    } else {
      // Fallback: cari semua button dan klik yang relevan
      try {
        await page.evaluate(() => {
          const buttons = [...document.querySelectorAll("button")];
          const tambahBtn = buttons.find(
            (b) =>
              b.textContent?.toLowerCase().includes("tambah") ||
              b.textContent?.toLowerCase().includes("add")
          );
          if (tambahBtn) (tambahBtn as HTMLElement).click();
        });
        await new Promise((r) => setTimeout(r, 500));
        await takeScreenshot(page, "pos-after-tambah-fallback");
      } catch {
        console.warn("⚠️  Tombol Tambah tidak ditemukan, skip.");
      }
    }

    // Klik tombol "Proses Pembayaran"
    const prosesClicked = await waitAndClick(
      page,
      "button[id='btn-proses-pembayaran'], button[id^='btn-checkout'], button[id^='btn-proses']",
      3000
    );
    if (prosesClicked) {
      await new Promise((r) => setTimeout(r, 800));
      await takeScreenshot(page, "pos-after-checkout-modal");
    } else {
      // Fallback: cari tombol checkout
      try {
        await page.evaluate(() => {
          const buttons = [...document.querySelectorAll("button")];
          const btn = buttons.find(
            (b) =>
              b.textContent?.toLowerCase().includes("pembayaran") ||
              b.textContent?.toLowerCase().includes("proses") ||
              b.textContent?.toLowerCase().includes("checkout")
          );
          if (btn) (btn as HTMLElement).click();
        });
        await new Promise((r) => setTimeout(r, 800));
        await takeScreenshot(page, "pos-after-checkout-fallback");
      } catch {
        console.warn("⚠️  Tombol Proses Pembayaran tidak ditemukan, skip.");
      }
    }

    // ================================================================
    // FASE 4: Screenshot halaman tambahan
    // ================================================================
    console.log("\n── FASE 4: Halaman Lainnya ──");

    const extraPages = [
      { path: "/", label: "landing" },
      { path: "/register", label: "register" },
      { path: "/menu", label: "menu" },
      { path: "/about", label: "about" },
      { path: "/contact", label: "contact" },
    ];

    for (const p of extraPages) {
      try {
        await page.goto(`${BASE_URL}${p.path}`, {
          waitUntil: "networkidle2",
          timeout: 8000,
        });
        await new Promise((r) => setTimeout(r, 600));
        await takeScreenshot(page, p.label);
      } catch {
        console.warn(`⚠️  Gagal screenshot halaman ${p.path}`);
      }
    }

    // ================================================================
    // SELESAI
    // ================================================================
    console.log("\n✅ Semua screenshot selesai!");
    console.log(`📂 Tersimpan di: ${SCREENSHOTS_DIR}`);
    console.log(
      `📊 Total: ${10 + (categoryClicked ? 1 : 0) + 1 + 1 + extraPages.length}+ screenshot\n`
    );
  } catch (err) {
    console.error("\n❌ Error tidak terduga:", err);
  } finally {
    if (browser) {
      await browser.close();
      console.log("🔒 Browser ditutup.");
    }
  }
}

main();
