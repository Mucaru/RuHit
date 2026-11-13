# Brand guide — Ruang Hitung

## Positioning

Ruang Hitung adalah ruang latihan matematika SD yang ramah, tenang, dan terasa seperti buku kerja anak. Fokus utama setiap layar hanya satu tugas. Tidak ada timer, papan peringkat, hukuman, atau tekanan untuk menyelesaikan latihan secepat mungkin.

## Maskot: Biji

Biji adalah makhluk kecil yang tersusun dari manik-manik sempoa. Ia penasaran, sabar, berani mencoba ulang, dan tidak mempermalukan anak ketika jawaban keliru.

Enam ekspresi SVG: `happy`, `thinking`, `excited`, `almost`, `oops`, dan `celebrate`. Gerak kecil menggunakan CSS dan otomatis dikurangi ketika `prefers-reduced-motion: reduce` aktif.

### Panduan suara Biji

1. "Pelan-pelan, kita hitung bareng!"
2. "Belum tepat? Tidak apa-apa. Yuk, periksa satu langkah."
3. "Nah, kamu menemukan caranya!"

Biji tidak berkata "kamu bodoh", "gampang sekali", atau membandingkan anak dengan orang lain. Umpan balik membahas strategi, bukan karakter anak.

## Logo

- `client/public/brand/logo.svg` / `logo-light.svg`: simbol utama manik sempoa pada latar terang.
- `client/public/brand/logo-dark.svg`: simbol untuk latar gelap.
- `client/public/brand/logo-icon.svg`: simbol ringkas tanpa wordmark.
- `client/public/brand/wordmark.svg`: wordmark dan simbol dalam satu SVG.
- `client/public/favicon.svg`: versi favicon.
- Wordmark ditulis sebagai teks "ruang hitung" di komponen `Brand.tsx`.
- Logo tidak boleh diputar, diberi glow, ditempel pada gradient, atau dikecilkan hingga garis simbol tidak terbaca.

## Warna

| Token | Hex | Penggunaan |
|---|---|---|
| Paper | `#FFFAF0` | Latar buku tulis |
| Ink | `#202A2B` | Teks dan garis utama |
| Orange | `#ED6B3D` | Aksi utama dan penekanan |
| Blue | `#28799A` | Petunjuk dan navigasi |
| Green | `#357B59` | Keberhasilan dan kemajuan |
| Yellow | `#F2C85B` | Penanda, bintang, dan fokus |
| Paper white | `#FFFEFB` | Kartu dan bidang kerja |

Kontras teks normal ditargetkan minimal WCAG AA 4.5:1. Aksen tidak boleh menggantikan label teks.

## Tipografi

- DM Sans Variable: isi, label, kontrol, dan angka.
- Fraunces Variable: judul besar dan angka dekoratif kelas.
- Keduanya self-hosted dari paket Fontsource, berlisensi SIL Open Font License 1.1.

## Spacing dan komponen

- Unit dasar 4 px; jarak umum 8, 12, 16, 24, 32 px.
- Target sentuh minimum 48 × 48 px untuk kontrol utama.
- Border utama 1.5–2 px, sudut kartu 12–18 px, bayangan keras 4–5 px.
- Latar buku kotak-kotak digunakan sebagai tekstur halus, bukan dekorasi yang bersaing dengan soal.
- Maksimal satu aksi utama yang dominan pada satu layar.
- Layout mobile-first, lebar minimum 320 px, tanpa elemen penting yang hanya bisa di-hover.

## Larangan visual

Tidak menggunakan gradient hero, orb blur, glassmorphism, ikon bintang dekoratif generik, tumpukan badge, atau kartu bertingkat yang tidak menambah pemahaman. Visual harus membantu nilai tempat, pecahan, ukuran, sudut, atau data — bukan sekadar menghias.

## Update v3 — lebih playful (menggantikan "Larangan visual" di atas)

- Boleh: gradient lembut pada hero, bayangan keras berwarna, tombol kenyal, emoji sebagai ikon topik, konfeti saat jawaban benar.
- Tetap dilarang: timer, papan peringkat, hukuman, kalimat yang menilai anak, animasi yang tidak berhenti saat `prefers-reduced-motion`.
- Palet tambahan: pink `#ff7aa8`, ungu `#7c5cff`, mint `#3ecf9a`, langit `#5bc8f5`, matahari `#ffd45e`.
- Biji sebagai teman belajar: bereaksi pada jawaban, menawarkan bantuan setelah salah dua kali, menunjukkan langkah satu per satu, dan menahan jawaban akhir sampai diminta. Memakai bantuan Biji membuat soal tidak dihitung "mandiri".
