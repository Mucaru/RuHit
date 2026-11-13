# Ruang Hitung

Ruang Hitung adalah aplikasi latihan Matematika SD yang dirancang untuk anak yang belum terbiasa memakai teknologi. Fokusnya satu soal dan satu aksi utama setiap layar. Tidak ada akun, iklan, pelacakan, timer, atau hukuman.

## Stack dan arsitektur

- React 19 + TypeScript strict + Vite.
- **Vite native multi-page application (MPA)**, dengan navigasi memakai tautan HTML biasa dan browser history native.
- Cloudflare Workers Static Assets melalui satu direktori `dist/public`; Express dihapus.
- PWA dengan cache versi untuk halaman, JavaScript, CSS, font, ikon, dan latihan.
- Engine soal TypeScript murni, terpisah dari React UI.

### Mengapa bukan Astro pada rilis ini?

1. Vite sudah menjadi fondasi proyek dan mendukung banyak entry HTML tanpa router runtime.
2. Migrasi ini menghasilkan dokumen HTML nyata per rute, bukan simulasi `pushState`, tanpa menambah dependency framework.
3. Cloudflare tetap melayani satu direktori static assets; Astro dapat dievaluasi lagi bila kelak ada kebutuhan konten server-rendered yang terukur.

## Persyaratan

- Node.js 22 LTS atau lebih baru.
- pnpm 10.4.1 (sesuai `packageManager` dan `pnpm-lock.yaml`).

## Menjalankan lokal

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Buka alamat yang dicetak Vite (default `http://localhost:3000`). Script `dev` membuat halaman rute statis terlebih dahulu.

## Check, test, dan build

```bash
pnpm check
pnpm test
pnpm build
pnpm preview
```

`pnpm build` akan:

1. Membuat HTML entry untuk semua kelas, topik, latihan, laporan, dan privasi.
2. Menjalankan Vite multi-page build ke `dist/public`.
3. Membuat service worker dengan precache manifest yang berisi semua halaman dan aset hasil build.

## Rute

- `/` — beranda.
- `/kelas/1/` sampai `/kelas/6/` — peta topik per kelas.
- `/kelas/5/pecahan/` — contoh dan alur belajar topik.
- `/latihan/pecahan/` — latihan parametrik.
- `/latihan/penjumlahan-bersusun/` dan rute operasi lama lain — papan hitung bersusun yang dipertahankan.
- `/laporan/` — ringkasan untuk orang tua/guru dan cetak.
- `/privasi/` — informasi penyimpanan lokal.

Setiap rute dibuat sebagai file HTML statis. Navigasi menggunakan `<a href>` sehingga tombol Back/Forward browser bekerja tanpa `pushState` manual.

## Struktur penting

```text
client/
  index.html
  public/
    _headers
    .well-known/security.txt
    brand/                 # logo dan enam ekspresi maskot SVG
    icons/                 # ikon PWA PNG
    images/                # Open Graph image
    sw.js                  # service worker source
  src/
    App.tsx                # pemilih rute berbasis pathname
    components/            # brand, visual aid, keypad, papan hitung
    data/
      kurikulum.ts         # peta CP fase -> distribusi kelas -> topik
      legacy-topics.ts     # 8 aktivitas lama
    lib/
      learning/            # engine soal pure TS + checker independen
      math/                # engine operasi bersusun yang dipertahankan
      progress.ts          # schema v2, migrasi, clamp, Leitner
    screens/               # beranda, kelas, topik, latihan, laporan, privasi
    styles/                # tokens dan CSS per area/komponen
scripts/
  generate-routes.mjs      # membuat entry HTML MPA
  build-service-worker.mjs # precache manifest build
```

## Menambah topik dan generator

1. Tambahkan topik di `client/src/data/kurikulum.ts` dengan `id`, `slug`, elemen, fase, kelas usulan, tujuan pembelajaran, miskonsepsi, visual, `generatorTypes`, dan `sources`.
2. Tambahkan builder untuk `typeId` baru di `client/src/lib/learning/engine.ts`.
3. Tambahkan perhitungan independen di `independentAnswer()` — jangan memanggil formula generator dari checker.
4. Tambahkan tipe baru ke `CLASS_FIVE_QUESTION_TYPES` jika bagian dari target 40+ tipe kelas 5.
5. Tambahkan test deterministik pada `engine.test.ts`; generator dan checker harus cocok di banyak seed.
6. Jalankan `pnpm dev` atau `pnpm build`; script rute akan membuat halaman kelas/topik/latihan secara otomatis dari peta kurikulum.

CP resmi dipetakan per fase A/B/C, bukan per kelas. Pembagian ke kelas 1–6 di data adalah urutan belajar usulan dan diberi catatan agar tidak disalahartikan sebagai ATP nasional. Lihat `docs/riset-kurikulum.md`.

## Penyimpanan dan privasi

Progres disimpan hanya di `localStorage` perangkat, dengan schema `v: 2`, validasi, clamp, batas ukuran, dan migrasi dari key v1. Tidak ada data akun atau identitas. Data dapat dihapus dari pengaturan data situs di browser. Cache service worker hanya menyimpan file aplikasi, bukan progres.

CSP produksi melarang inline script dan inline style; React tidak menggunakan prop `style`. Header keamanan berada di `client/public/_headers`. File `.well-known/security.txt` berisi alamat kontak placeholder yang **harus diganti dengan alamat keamanan yang dipantau sebelum publikasi**.

## Deploy Cloudflare

```bash
pnpm build
pnpm dlx wrangler deploy
```

Konfigurasi `wrangler.jsonc` hanya menunjuk `dist/public`. Tidak ada Express server atau jalur deployment kedua. Pastikan domain produksi menggunakan HTTPS sebelum deploy; HSTS diaktifkan melalui `_headers`.

## Status verifikasi lingkungan

Jika `pnpm install` gagal karena registry tidak dapat dijangkau, jangan menganggap test/build berhasil. Setelah koneksi tersedia, jalankan urutan `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, `pnpm build`, `pnpm preview`. Audit dependency membutuhkan koneksi registry dan dijalankan dengan `pnpm audit --prod`.
