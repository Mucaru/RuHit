# Changelog

## 3.0.0
- Tema playful (`styles/playful.css`), logo berwarna, ikon topik emoji, konfeti, maskot bergerak.
- Biji jadi teman belajar (`BijiCompanion`): reaksi, tips per tipe soal, bantuan langkah demi langkah, baca keras.
- Materi pecahan 12 bab (`data/lesson-pecahan.ts`, `LessonReader`) dengan cerita, contoh, aturan, dan latihan per bab (`?focus=`).
- 6 tipe soal pecahan baru dan model visual pecahan baru (batang, pizza, kelompok).
- `solutions.ts` menghasilkan langkah penyelesaian untuk semua tipe soal.
- Perbaikan: petunjuk menampilkan teks `${...}` mentah, checker desimal koma/titik, pilihan ganda kini diacak, pecahan senilai diterima, tes papan bersusun usang.

### Perapian beranda, tipografi, dan suara (14 Nov 2026)
- Menu Kelas di header jadi pemilih kelas 1-6 (`SiteHeader`), tampil juga di HP; kelas terakhir disimpan di `Progress.lastGrade` (divalidasi dan dijepit 1-6).
- Beranda: satu tombol utama, "Lanjutkan belajar" kalau sudah ada progres, "Mulai belajar" kalau belum; ringkasan statistik disembunyikan saat semuanya nol dan diganti ajakan.
- Tipografi: skala `--fs-body` 16px dan `--fs-caption` 14px, tidak ada font-size di bawah 12px (dijaga `pnpm test`), letter-spacing judul dilonggarkan.
- Maskot hero dimuat eager dengan `fetchpriority=high`; border putus-putus area maskot hero dihapus; badan `mascot-oops.svg` dan `mascot-almost.svg` tidak lagi menyatu dengan manik.
- `speak()` digabung ke `lib/speech.ts` (toSpeakable dan suara id-ID); tombol Dengarkan di `LessonReader`.
- Copy: catatan kelas, label latihan tambahan, dan lencana kelas memakai bahasa anak/orang tua.

### Soal cerita bergambar benda (16 Nov 2026, Commit 5)
- Registri benda `lib/learning/items.ts`; generator menyimpan `item`/`itemA`/`itemB` di `params`, jadi gambar tidak menebak benda dari kalimat soal.
- Visual baru (SVG, tanpa style inline): `objects` (`count-objects`, `pictogram-read`, `table-frequency`), `money` (`money-change`), `ratio` (`proportion`), `cards` (`compare-length`, `compare-weight`), `food` (`fraction-word-add/subtract`). Logika deskripsi dan tata letak ada di `lib/learning/story-visual.ts`, komponen di `components/StoryVisuals.tsx` dan `ItemIcons.tsx`.
- Hanya yang diketahui soal yang digambar. Pecahan cerita memakai dua gambar makanan terpisah (batang gabungan lama menampakkan jumlah kotak berwarna = jawaban). Kartu banding berukuran sama dengan catatan "bukan ukuran sebenarnya", karena pita atau timbangan proporsional akan menampakkan jawabannya.
- `count-objects` kini bervariasi (bola, apel, jeruk, pisang); `pictogram-read` menyebut nama buahnya di kalimat soal; `money-change` memakai apel, jeruk, atau pisang.
- Tes: sapuan semua generator (tergambar, benda ada di registri, tata letak di dalam kanvas) dan tes bahwa semua angka di gambar sudah ada di kalimat soal.

## 2.0.0 — Ruang Hitung learning redesign

- Replaced Express/static-server deployment with native Vite MPA routes and Cloudflare static assets.
- Added phase-aligned elementary mathematics map, source tags, proposed class progression, and pedagogy notes.
- Added 52 verified class-5 question types and independent answer checker; preserved eight original long-form activities.
- Added progress schema v2, v1 migration, bounded local storage parsing, mastery records, and Leitner review scheduling.
- Added guided example / together / independent learning flow, CPA visuals, on-screen keypad, Indonesian read-aloud, parent/teacher report, and print view.
- Added original Biji mascot, wordmark, PWA icons, OG image, brand guide, privacy page, security headers, and offline service worker.
- Replaced monolithic CSS with token, layout, learning, report, and isolated legacy-board styles.
