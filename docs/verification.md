# Verification log

Tanggal: 2026-11-14 (rilis 3.0.0: beranda, tipografi, suara)

Catatan jujur: sandbox tempat perubahan ini ditulis tidak punya dependensi terpasang, jadi `pnpm check`, `pnpm test`, dan `pnpm build` **belum dijalankan**. Bagian "Belum dijalankan" harus diisi dengan hasil nyata dari mesin kamu sebelum rilis.

## Sudah dijalankan (2026-11-14)

1. **Audit font-size** pada `client/src/styles/*.css` dan `client/public/404.css` (deklarasi dengan nilai px/rem/em polos):

   | Rentang | Sebelum | Sesudah |
   |---|---|---|
   | di bawah 12px | 44 | **0** |
   | 12 sampai 13,99px | 61 | 0 |
   | 14 sampai 15,99px (caption, plus teks papan bersusun) | 50 | 80 |
   | 16px ke atas | 77 | 158 |

   Jumlah sesudah lebih besar enam karena aturan baru (menu kelas, ajakan beranda, token). Em relatif di `boards.css` kini `max(Xem, var(--fs-caption))`. Token: `--fs-body: 16px`, `--fs-caption: 14px` di `tokens.css`.
2. **Letter-spacing judul**: h1 dari -.045em ke -.01em, h2 dari -.035em ke -.005em, nama merek dari -.06em dan -.03em ke -.01em. Tracking lebar (.10 sampai .14em) pada label huruf kapital jadi .06em. Tidak ada `word-spacing` khusus.
3. **Enam SVG maskot** diparse sebagai XML dan dicek warna badan terhadap warna manik. `mascot-oops.svg` (badan biru = manik kiri biru) dan `mascot-almost.svg` (badan kuning = manik kanan kuning) bertabrakan; keduanya kini berbadan oranye seperti ekspresi lain. Keenam ekspresi: tidak ada tabrakan, manik digambar setelah badan.
4. **Penjaga tipografi** di `scripts/verify-static.mjs`: `node --check` lolos; blok penjaganya dijalankan terpisah, lolos pada CSS sekarang dan gagal dengan pesan jelas saat sengaja disisipi `font-size: 11px`.
5. `package.json` valid dan berversi 3.0.0.

## Belum dijalankan (isi hasilnya)

```bash
corepack prepare pnpm@10.4.1 --activate
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm preview
```

| Perintah | Hasil nyata |
|---|---|
| `pnpm check` | ___ |
| `pnpm test` (jumlah tes, sebelumnya 228) | ___ |
| `pnpm build` | ___ |
| Lighthouse mobile beranda (Performa, Aksesibilitas, LCP, CLS) | ___ |
| Uji di HP Android asli | ___ |

## Mengukur Lighthouse mobile

1. `pnpm build && pnpm preview`, lalu buka alamat yang tertera di Chrome **jendela Incognito** tanpa ekstensi.
2. DevTools (F12) > Lighthouse > Mode: Navigation, Device: **Mobile**, centang Performance dan Accessibility, klik Analyze.
3. Jalankan 3 kali dan catat median. Lighthouse mobile sudah mensimulasikan 4G lambat dan CPU 4x lebih lambat.
4. Target: LCP di bawah 2,5 dtk, CLS di bawah 0,1, Aksesibilitas 100. Cek LCP element di laporan (kemungkinan judul h1, bukan maskot).
5. Ukur lagi di situs yang sudah dideploy dengan PageSpeed Insights, karena `pnpm preview` tidak memakai CDN Cloudflare.

## Uji di HP Android asli

1. Deploy preview, buka dari HP (atau Chrome remote debugging: HP lewat USB, `chrome://inspect` di laptop).
2. Pakai HP paling lambat yang ada, jaringan seluler biasa, dan ukuran font sistem "Besar".
3. Cek: menu Kelas terbuka dan semua tombol muat di layar 320 sampai 360px; tombol utama beranda satu-satunya; tombol Dengarkan bersuara Indonesia di Chrome Android (di HP tanpa suara id-ID tombol tetap jalan dengan suara bawaan).
4. Mode pesawat setelah kunjungan pertama: beranda dan latihan harus tetap terbuka (PWA).
5. Aktifkan "Hapus animasi" di Aksesibilitas Android: maskot harus diam.

## Titik layout yang perlu dilihat langsung (belum diperiksa di browser)

Teks kecil yang naik ke 14 sampai 16px: sel nilai tempat, label garis bilangan dan grafik, `.fm-group small`, `.guide-steps`, kartu kelas 3 kolom di HP, papan perkalian (`.mc-carry`), header di layar 320px.

## Catatan terbuka

- `client/public/.well-known/security.txt` masih berisi placeholder `GANTI-DENGAN-EMAIL-ANDA`. Isi kontak asli sebelum rilis publik; `pnpm test` akan mengingatkan.
