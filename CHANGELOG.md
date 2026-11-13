# Changelog

## 3.0.0
- Tema playful (`styles/playful.css`), logo berwarna, ikon topik emoji, konfeti, maskot bergerak.
- Biji jadi teman belajar (`BijiCompanion`): reaksi, tips per tipe soal, bantuan langkah demi langkah, baca keras.
- Materi pecahan 12 bab (`data/lesson-pecahan.ts`, `LessonReader`) dengan cerita, contoh, aturan, dan latihan per bab (`?focus=`).
- 6 tipe soal pecahan baru dan model visual pecahan baru (batang, pizza, kelompok).
- `solutions.ts` menghasilkan langkah penyelesaian untuk semua tipe soal.
- Perbaikan: petunjuk menampilkan teks `${...}` mentah, checker desimal koma/titik, pilihan ganda kini diacak, pecahan senilai diterima, tes papan bersusun usang.

## 2.0.0 — Ruang Hitung learning redesign

- Replaced Express/static-server deployment with native Vite MPA routes and Cloudflare static assets.
- Added phase-aligned elementary mathematics map, source tags, proposed class progression, and pedagogy notes.
- Added 52 verified class-5 question types and independent answer checker; preserved eight original long-form activities.
- Added progress schema v2, v1 migration, bounded local storage parsing, mastery records, and Leitner review scheduling.
- Added guided example / together / independent learning flow, CPA visuals, on-screen keypad, Indonesian read-aloud, parent/teacher report, and print view.
- Added original Biji mascot, wordmark, PWA icons, OG image, brand guide, privacy page, security headers, and offline service worker.
- Replaced monolithic CSS with token, layout, learning, report, and isolated legacy-board styles.
