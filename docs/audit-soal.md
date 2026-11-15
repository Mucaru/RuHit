# Audit soal RuHit

Dibangkitkan otomatis oleh `pnpm audit:soal`. 188 kombinasi (tipe x topik x kelas), 5640 soal contoh, 5 tingkat kesulitan x 6 seed. Seed tetap, jadi hasilnya bisa diulang.

Ini temuan HEURISTIK dari data dan hasil membaca kode: bukan bukti bug sampai dilihat di layar. Tidak ada kode soal yang diubah.

## 1. Ringkasan

- Kombinasi tanpa temuan apa pun: **34** dari 188

| Tingkat | Kode | Jumlah soal | Kombinasi terdampak | Contoh |
|---|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 1740 | 58 | chart: tanpa values/counts: diagram memakai data bawaan [3, 5, 2] |
| tinggi | `VISUAL-HANYA-SATU` | 930 | 31 | visual nilai tempat hanya menggambar a=12, bilangan b=11 tidak tampil |
| tinggi | `BATANG-SEMPIT` | 240 | 8 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat  |
| tinggi | `PILIHAN-GANDA-SAMA` | 87 | 6 | pilihan duplikat [16 – 15 – 10 \| 10 – 15 – 16 \| 10 – 15 – 16] |
| sedang | `SOAL-MONOTON` | 390 | 13 | hanya 2 soal berbeda dari 30 percobaan |
| sedang | `VISUAL-PECAHAN-DEFAULT` | 270 | 7 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |
| sedang | `VISUAL-TIDAK-TAMPIL` | 60 | 2 | angle: VisualAid memakai ilustrasi CSS statis; AngleVisual (SVG sesuai derajat) tidak dipakai, jadi besar sudu |
| sedang | `PETUNJUK-BOCOR` | 22 | 4 | petunjuk 1/2 sudah menyebut jawaban "100" |
| sedang | `SOAL-BOCOR` | 4 | 2 | soal sudah memuat jawaban "2/5" |
| rendah | `ANGKA-TANPA-TITIK` | 140 | 6 | angka 4 digit tanpa pemisah ribuan: Urutkan dari yang terkecil: 789, 4062, 7627. |
| rendah | `KESULITAN-TIDAK-NAIK` | 81 | 80 | angka terbesar rata-rata level 0 = 20, level 4 = 20 |

## 2. Temuan dari membaca kode (berlaku global)

1. **Urutan tabel nilai tempat terbalik.** `PlaceValue` memakai `.reverse()` dan tidak membaliknya lagi, jadi 1.058 tampil sebagai 8, 5, 0, 1 (satuan paling kiri). Cara baca angka di buku adalah ribuan paling kiri.
2. **Garis bilangan tidak proporsional.** Titik-titiknya disebar rata (`flex: 1`) berapa pun nilainya, padahal teksnya meminta anak memperhatikan letak nilai.
3. **Kode mati.** `AngleVisual` dan `VolumeVisual` didefinisikan tapi tidak dipanggil `VisualAid`.
4. **Batang pecahan bercaption tanpa label** terjepit di kolom `auto` (CSS `.fm-row`), tampil sebagai garis hitam. Terlihat di screenshot soal 5/8 + 1/8.

## 3. Per tipe soal

### Topik: Bilangan sampai 20 (`bilangan-20`)

#### `count-objects` kelas 1

30 soal dibangkitkan, 25 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `chart`: Ada 5 bola merah dan 8 bola biru. Berapa jumlah bola semuanya?
  - params: `{"a":5,"b":8,"values":[5,8]}`
  - jawaban: `13`
  - petunjuk: 1) Gabungkan dua kelompok bola. 2) Mulai hitung dari kelompok yang lebih besar. 3) Jumlahkan banyak bola merah dan biru.
  - penjelasan: 5 bola merah ditambah 8 bola biru sama dengan 13 bola.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Ada 5 bola merah dan 6 bola biru. Berapa jumlah bola semuanya?
  - params: `{"a":5,"b":6,"values":[5,6]}`
  - jawaban: `11`
  - petunjuk: 1) Gabungkan dua kelompok bola. 2) Mulai hitung dari kelompok yang lebih besar. 3) Jumlahkan banyak bola merah dan biru.
  - penjelasan: 5 bola merah ditambah 6 bola biru sama dengan 11 bola.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Ada 6 bola merah dan 8 bola biru. Berapa jumlah bola semuanya?
  - params: `{"a":6,"b":8,"values":[6,8]}`
  - jawaban: `14`
  - petunjuk: 1) Gabungkan dua kelompok bola. 2) Mulai hitung dari kelompok yang lebih besar. 3) Jumlahkan banyak bola merah dan biru.
  - penjelasan: 6 bola merah ditambah 8 bola biru sama dengan 14 bola.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `compare-whole` kelas 1

30 soal dibangkitkan, 28 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=12, bilangan b=11 tidak tampil |

- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 12 atau B: 11?
  - params: `{"a":12,"b":11}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 12 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 12 atau B: 13?
  - params: `{"a":12,"b":13}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 13 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 12 atau B: 18?
  - params: `{"a":12,"b":18}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 18 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Tambah dan kurang sampai 20 (`operasi-dasar-a`)

#### `add-whole` kelas 1

30 soal dibangkitkan, 28 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=11, bilangan b=18 tidak tampil |

- **Contoh** visual `place-value`: Hitung 11 + 18.
  - params: `{"a":11,"b":18}`
  - jawaban: `29`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 11 + 18 = 29.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 17 + 13.
  - params: `{"a":17,"b":13}`
  - jawaban: `30`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 17 + 13 = 30.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 17 + 10.
  - params: `{"a":17,"b":10}`
  - jawaban: `27`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 17 + 10 = 27.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `add-whole` kelas 2

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=10, bilangan b=17 tidak tampil |

- **Contoh** visual `place-value`: Hitung 10 + 17.
  - params: `{"a":10,"b":17}`
  - jawaban: `27`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 10 + 17 = 27.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 17 + 11.
  - params: `{"a":17,"b":11}`
  - jawaban: `28`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 17 + 11 = 28.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 49 + 19.
  - params: `{"a":49,"b":19}`
  - jawaban: `68`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 49 + 19 = 68.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `subtract-whole` kelas 1

30 soal dibangkitkan, 18 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=20, bilangan b=11 tidak tampil |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 20, level 4 = 20 |

- **Contoh** visual `place-value`: Hitung 20 − 11.
  - params: `{"a":20,"b":11}`
  - jawaban: `9`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 20 dikurangi 11 sama dengan 9.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 20 − 19.
  - params: `{"a":20,"b":19}`
  - jawaban: `1`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 20 dikurangi 19 sama dengan 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 20 − 5.
  - params: `{"a":20,"b":5}`
  - jawaban: `15`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 20 dikurangi 5 sama dengan 15.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `subtract-whole` kelas 2

30 soal dibangkitkan, 21 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=20, bilangan b=15 tidak tampil |

- **Contoh** visual `place-value`: Hitung 20 − 15.
  - params: `{"a":20,"b":15}`
  - jawaban: `5`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 20 dikurangi 15 sama dengan 5.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 20 − 19.
  - params: `{"a":20,"b":19}`
  - jawaban: `1`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 20 dikurangi 19 sama dengan 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 176 − 10.
  - params: `{"a":176,"b":10}`
  - jawaban: `166`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 176 dikurangi 10 sama dengan 166.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Setengah dan seperempat (`pecahan-awal`)

#### `fraction-half-quarter` kelas 2

30 soal dibangkitkan, 2 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 2 soal berbeda dari 30 percobaan |

- **Contoh** visual `fraction-bar`: Satu dari 4 bagian sama besar disebut pecahan apa?
  - params: `{"numerator":1,"denominator":4}`
  - pilihan: `1/2`, `1/3`, `1/4`
  - jawaban: `1/4`
  - petunjuk: 1) Perhatikan berapa bagian sama besar seluruh benda. 2) Angka bawah menunjukkan jumlah semua bagian. 3) Satu bagian dari 4 bagian ditulis 1/4.
  - penjelasan: Satu dari 4 bagian sama besar ditulis 1/4.
  - langkah Biji: Hitung seluruh bagian > Ambil satu bagian > Tulis > Jawabanmu
- **Contoh** visual `fraction-bar`: Satu dari 4 bagian sama besar disebut pecahan apa?
  - params: `{"numerator":1,"denominator":4}`
  - pilihan: `1/4`, `1/3`, `1/2`
  - jawaban: `1/4`
  - petunjuk: 1) Perhatikan berapa bagian sama besar seluruh benda. 2) Angka bawah menunjukkan jumlah semua bagian. 3) Satu bagian dari 4 bagian ditulis 1/4.
  - penjelasan: Satu dari 4 bagian sama besar ditulis 1/4.
  - langkah Biji: Hitung seluruh bagian > Ambil satu bagian > Tulis > Jawabanmu
- **Contoh** visual `fraction-bar`: Satu dari 4 bagian sama besar disebut pecahan apa?
  - params: `{"numerator":1,"denominator":4}`
  - pilihan: `1/3`, `1/2`, `1/4`
  - jawaban: `1/4`
  - petunjuk: 1) Perhatikan berapa bagian sama besar seluruh benda. 2) Angka bawah menunjukkan jumlah semua bagian. 3) Satu bagian dari 4 bagian ditulis 1/4.
  - penjelasan: Satu dari 4 bagian sama besar ditulis 1/4.
  - langkah Biji: Hitung seluruh bagian > Ambil satu bagian > Tulis > Jawabanmu

### Topik: Pola gambar dan bentuk (`pola-gambar`)

#### `pattern-shape` kelas 1

30 soal dibangkitkan, 6 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 6 soal berbeda dari 30 percobaan |

- **Contoh** visual `pattern`: Perhatikan pola: persegi, lingkaran, persegi, lingkaran, ... Bentuk berikutnya?
  - params: `{"first":"persegi","second":"lingkaran"}`
  - pilihan: `persegi`, `persegi panjang`, `lingkaran`
  - jawaban: `persegi`
  - petunjuk: 1) Perhatikan dua bentuk yang berulang. 2) Pola kembali ke bentuk pertama setelah bentuk kedua. 3) Bentuk berikutnya adalah persegi.
  - penjelasan: Pola bergantian antara persegi dan lingkaran, jadi berikutnya persegi.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `pattern`: Perhatikan pola: lingkaran, segitiga, lingkaran, segitiga, ... Bentuk berikutnya?
  - params: `{"first":"lingkaran","second":"segitiga"}`
  - pilihan: `segitiga`, `persegi panjang`, `lingkaran`
  - jawaban: `lingkaran`
  - petunjuk: 1) Perhatikan dua bentuk yang berulang. 2) Pola kembali ke bentuk pertama setelah bentuk kedua. 3) Bentuk berikutnya adalah lingkaran.
  - penjelasan: Pola bergantian antara lingkaran dan segitiga, jadi berikutnya lingkaran.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `pattern`: Perhatikan pola: persegi, segitiga, persegi, segitiga, ... Bentuk berikutnya?
  - params: `{"first":"persegi","second":"segitiga"}`
  - pilihan: `segitiga`, `persegi panjang`, `persegi`
  - jawaban: `persegi`
  - petunjuk: 1) Perhatikan dua bentuk yang berulang. 2) Pola kembali ke bentuk pertama setelah bentuk kedua. 3) Bentuk berikutnya adalah persegi.
  - penjelasan: Pola bergantian antara persegi dan segitiga, jadi berikutnya persegi.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `pattern-shape` kelas 2

30 soal dibangkitkan, 6 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 6 soal berbeda dari 30 percobaan |

- **Contoh** visual `pattern`: Perhatikan pola: lingkaran, persegi, lingkaran, persegi, ... Bentuk berikutnya?
  - params: `{"first":"lingkaran","second":"persegi"}`
  - pilihan: `lingkaran`, `persegi panjang`, `persegi`
  - jawaban: `lingkaran`
  - petunjuk: 1) Perhatikan dua bentuk yang berulang. 2) Pola kembali ke bentuk pertama setelah bentuk kedua. 3) Bentuk berikutnya adalah lingkaran.
  - penjelasan: Pola bergantian antara lingkaran dan persegi, jadi berikutnya lingkaran.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `pattern`: Perhatikan pola: segitiga, lingkaran, segitiga, lingkaran, ... Bentuk berikutnya?
  - params: `{"first":"segitiga","second":"lingkaran"}`
  - pilihan: `lingkaran`, `persegi panjang`, `segitiga`
  - jawaban: `segitiga`
  - petunjuk: 1) Perhatikan dua bentuk yang berulang. 2) Pola kembali ke bentuk pertama setelah bentuk kedua. 3) Bentuk berikutnya adalah segitiga.
  - penjelasan: Pola bergantian antara segitiga dan lingkaran, jadi berikutnya segitiga.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `pattern`: Perhatikan pola: persegi, segitiga, persegi, segitiga, ... Bentuk berikutnya?
  - params: `{"first":"persegi","second":"segitiga"}`
  - pilihan: `segitiga`, `persegi panjang`, `persegi`
  - jawaban: `persegi`
  - petunjuk: 1) Perhatikan dua bentuk yang berulang. 2) Pola kembali ke bentuk pertama setelah bentuk kedua. 3) Bentuk berikutnya adalah persegi.
  - penjelasan: Pola bergantian antara persegi dan segitiga, jadi berikutnya persegi.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Membandingkan ukuran (`ukur-awal`)

#### `compare-length` kelas 1

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | chart: tanpa values/counts: diagram memakai data bawaan [3, 5, 2] |

- **Contoh** visual `chart`: Pita A panjangnya 67 cm dan pita B 45 cm. Pita mana yang lebih panjang?
  - params: `{"a":67,"b":45}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Perhatikan satuan kedua pita. 2) Bandingkan angka panjangnya. 3) Pilih pita dengan ukuran sentimeter lebih besar.
  - penjelasan: Pita A lebih panjang karena ukurannya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pita A panjangnya 90 cm dan pita B 39 cm. Pita mana yang lebih panjang?
  - params: `{"a":90,"b":39}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Perhatikan satuan kedua pita. 2) Bandingkan angka panjangnya. 3) Pilih pita dengan ukuran sentimeter lebih besar.
  - penjelasan: Pita A lebih panjang karena ukurannya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pita A panjangnya 50 cm dan pita B 64 cm. Pita mana yang lebih panjang?
  - params: `{"a":50,"b":64}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Perhatikan satuan kedua pita. 2) Bandingkan angka panjangnya. 3) Pilih pita dengan ukuran sentimeter lebih besar.
  - penjelasan: Pita B lebih panjang karena ukurannya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `compare-length` kelas 2

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | chart: tanpa values/counts: diagram memakai data bawaan [3, 5, 2] |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 79, level 4 = 60 |

- **Contoh** visual `chart`: Pita A panjangnya 88 cm dan pita B 72 cm. Pita mana yang lebih panjang?
  - params: `{"a":88,"b":72}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Perhatikan satuan kedua pita. 2) Bandingkan angka panjangnya. 3) Pilih pita dengan ukuran sentimeter lebih besar.
  - penjelasan: Pita A lebih panjang karena ukurannya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pita A panjangnya 46 cm dan pita B 90 cm. Pita mana yang lebih panjang?
  - params: `{"a":46,"b":90}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Perhatikan satuan kedua pita. 2) Bandingkan angka panjangnya. 3) Pilih pita dengan ukuran sentimeter lebih besar.
  - penjelasan: Pita B lebih panjang karena ukurannya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pita A panjangnya 35 cm dan pita B 32 cm. Pita mana yang lebih panjang?
  - params: `{"a":35,"b":32}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Perhatikan satuan kedua pita. 2) Bandingkan angka panjangnya. 3) Pilih pita dengan ukuran sentimeter lebih besar.
  - penjelasan: Pita A lebih panjang karena ukurannya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `compare-weight` kelas 1

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | chart: tanpa values/counts: diagram memakai data bawaan [3, 5, 2] |

- **Contoh** visual `chart`: Karung A beratnya 4 kg dan karung B 8 kg. Karung mana yang lebih berat?
  - params: `{"a":4,"b":8}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua berat memakai satuan kilogram. 2) Bandingkan angka kilogram. 3) Pilih angka yang lebih besar.
  - penjelasan: Karung B lebih berat karena jumlah kilogramnya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Karung A beratnya 17 kg dan karung B 12 kg. Karung mana yang lebih berat?
  - params: `{"a":17,"b":12}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Kedua berat memakai satuan kilogram. 2) Bandingkan angka kilogram. 3) Pilih angka yang lebih besar.
  - penjelasan: Karung A lebih berat karena jumlah kilogramnya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Karung A beratnya 14 kg dan karung B 1 kg. Karung mana yang lebih berat?
  - params: `{"a":14,"b":1}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Kedua berat memakai satuan kilogram. 2) Bandingkan angka kilogram. 3) Pilih angka yang lebih besar.
  - penjelasan: Karung A lebih berat karena jumlah kilogramnya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `compare-weight` kelas 2

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | chart: tanpa values/counts: diagram memakai data bawaan [3, 5, 2] |

- **Contoh** visual `chart`: Karung A beratnya 5 kg dan karung B 20 kg. Karung mana yang lebih berat?
  - params: `{"a":5,"b":20}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua berat memakai satuan kilogram. 2) Bandingkan angka kilogram. 3) Pilih angka yang lebih besar.
  - penjelasan: Karung B lebih berat karena jumlah kilogramnya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Karung A beratnya 13 kg dan karung B 20 kg. Karung mana yang lebih berat?
  - params: `{"a":13,"b":20}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua berat memakai satuan kilogram. 2) Bandingkan angka kilogram. 3) Pilih angka yang lebih besar.
  - penjelasan: Karung B lebih berat karena jumlah kilogramnya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Karung A beratnya 5 kg dan karung B 13 kg. Karung mana yang lebih berat?
  - params: `{"a":5,"b":13}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua berat memakai satuan kilogram. 2) Bandingkan angka kilogram. 3) Pilih angka yang lebih besar.
  - penjelasan: Karung B lebih berat karena jumlah kilogramnya lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `compare-duration` kelas 1

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 78, level 4 = 70 |

- **Contoh** visual `number-line`: Kegiatan A berlangsung 38 menit dan kegiatan B 89 menit. Kegiatan mana yang lebih lama?
  - params: `{"a":38,"b":89}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua durasi memakai satuan menit. 2) Bandingkan jumlah menitnya. 3) Durasi dengan menit lebih besar berlangsung lebih lama.
  - penjelasan: Kegiatan B berlangsung lebih lama karena jumlah menitnya lebih banyak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Kegiatan A berlangsung 88 menit dan kegiatan B 18 menit. Kegiatan mana yang lebih lama?
  - params: `{"a":88,"b":18}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Kedua durasi memakai satuan menit. 2) Bandingkan jumlah menitnya. 3) Durasi dengan menit lebih besar berlangsung lebih lama.
  - penjelasan: Kegiatan A berlangsung lebih lama karena jumlah menitnya lebih banyak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Kegiatan A berlangsung 29 menit dan kegiatan B 59 menit. Kegiatan mana yang lebih lama?
  - params: `{"a":29,"b":59}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua durasi memakai satuan menit. 2) Bandingkan jumlah menitnya. 3) Durasi dengan menit lebih besar berlangsung lebih lama.
  - penjelasan: Kegiatan B berlangsung lebih lama karena jumlah menitnya lebih banyak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `compare-duration` kelas 2

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 72, level 4 = 66 |

- **Contoh** visual `number-line`: Kegiatan A berlangsung 12 menit dan kegiatan B 53 menit. Kegiatan mana yang lebih lama?
  - params: `{"a":12,"b":53}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua durasi memakai satuan menit. 2) Bandingkan jumlah menitnya. 3) Durasi dengan menit lebih besar berlangsung lebih lama.
  - penjelasan: Kegiatan B berlangsung lebih lama karena jumlah menitnya lebih banyak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Kegiatan A berlangsung 39 menit dan kegiatan B 43 menit. Kegiatan mana yang lebih lama?
  - params: `{"a":39,"b":43}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua durasi memakai satuan menit. 2) Bandingkan jumlah menitnya. 3) Durasi dengan menit lebih besar berlangsung lebih lama.
  - penjelasan: Kegiatan B berlangsung lebih lama karena jumlah menitnya lebih banyak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Kegiatan A berlangsung 40 menit dan kegiatan B 85 menit. Kegiatan mana yang lebih lama?
  - params: `{"a":40,"b":85}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Kedua durasi memakai satuan menit. 2) Bandingkan jumlah menitnya. 3) Durasi dengan menit lebih besar berlangsung lebih lama.
  - penjelasan: Kegiatan B berlangsung lebih lama karena jumlah menitnya lebih banyak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Bangun datar dan ruang (`bangun-a`)

#### `shape-recognition` kelas 1

30 soal dibangkitkan, 3 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 3 soal berbeda dari 30 percobaan |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 4, level 4 = 4 |

- **Contoh** visual `shape`: Bangun datar yang memiliki 4 sisi lurus disebut apa?
  - params: `{"sides":4}`
  - pilihan: `segilima`, `segitiga`, `persegi`
  - jawaban: `persegi`
  - petunjuk: 1) Hitung garis tepi yang membentuk bangun. 2) Setiap garis tepi adalah satu sisi. 3) Bangun dengan 4 sisi disebut persegi.
  - penjelasan: persegi memiliki 4 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `shape`: Bangun datar yang memiliki 5 sisi lurus disebut apa?
  - params: `{"sides":5}`
  - pilihan: `segilima`, `segitiga`, `persegi`
  - jawaban: `segilima`
  - petunjuk: 1) Hitung garis tepi yang membentuk bangun. 2) Setiap garis tepi adalah satu sisi. 3) Bangun dengan 5 sisi disebut segilima.
  - penjelasan: segilima memiliki 5 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `shape`: Bangun datar yang memiliki 3 sisi lurus disebut apa?
  - params: `{"sides":3}`
  - pilihan: `persegi`, `segilima`, `segitiga`
  - jawaban: `segitiga`
  - petunjuk: 1) Hitung garis tepi yang membentuk bangun. 2) Setiap garis tepi adalah satu sisi. 3) Bangun dengan 3 sisi disebut segitiga.
  - penjelasan: segitiga memiliki 3 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `shape-recognition` kelas 2

30 soal dibangkitkan, 3 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 3 soal berbeda dari 30 percobaan |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 4, level 4 = 4 |

- **Contoh** visual `shape`: Bangun datar yang memiliki 5 sisi lurus disebut apa?
  - params: `{"sides":5}`
  - pilihan: `segilima`, `segitiga`, `persegi`
  - jawaban: `segilima`
  - petunjuk: 1) Hitung garis tepi yang membentuk bangun. 2) Setiap garis tepi adalah satu sisi. 3) Bangun dengan 5 sisi disebut segilima.
  - penjelasan: segilima memiliki 5 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `shape`: Bangun datar yang memiliki 5 sisi lurus disebut apa?
  - params: `{"sides":5}`
  - pilihan: `segilima`, `persegi`, `segitiga`
  - jawaban: `segilima`
  - petunjuk: 1) Hitung garis tepi yang membentuk bangun. 2) Setiap garis tepi adalah satu sisi. 3) Bangun dengan 5 sisi disebut segilima.
  - penjelasan: segilima memiliki 5 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `shape`: Bangun datar yang memiliki 3 sisi lurus disebut apa?
  - params: `{"sides":3}`
  - pilihan: `segilima`, `persegi`, `segitiga`
  - jawaban: `segitiga`
  - petunjuk: 1) Hitung garis tepi yang membentuk bangun. 2) Setiap garis tepi adalah satu sisi. 3) Bangun dengan 3 sisi disebut segitiga.
  - penjelasan: segitiga memiliki 3 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `position-objects` kelas 1

30 soal dibangkitkan, 4 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 4 soal berbeda dari 30 percobaan |

- **Contoh** visual `position`: Bola berada di sebelah bawah kotak. Di mana posisi bola terhadap kotak?
  - params: `{"position":"bawah"}`
  - pilihan: `atas`, `bawah`, `kiri`, `kanan`
  - jawaban: `bawah`
  - petunjuk: 1) Perhatikan letak bola terhadap kotak. 2) Gunakan kata posisi yang sesuai. 3) Posisi bola adalah bawah.
  - penjelasan: Bola berada di sebelah bawah kotak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `position`: Bola berada di sebelah bawah kotak. Di mana posisi bola terhadap kotak?
  - params: `{"position":"bawah"}`
  - pilihan: `kiri`, `bawah`, `atas`, `kanan`
  - jawaban: `bawah`
  - petunjuk: 1) Perhatikan letak bola terhadap kotak. 2) Gunakan kata posisi yang sesuai. 3) Posisi bola adalah bawah.
  - penjelasan: Bola berada di sebelah bawah kotak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `position`: Bola berada di sebelah kiri kotak. Di mana posisi bola terhadap kotak?
  - params: `{"position":"kiri"}`
  - pilihan: `kanan`, `bawah`, `atas`, `kiri`
  - jawaban: `kiri`
  - petunjuk: 1) Perhatikan letak bola terhadap kotak. 2) Gunakan kata posisi yang sesuai. 3) Posisi bola adalah kiri.
  - penjelasan: Bola berada di sebelah kiri kotak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `position-objects` kelas 2

30 soal dibangkitkan, 4 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 4 soal berbeda dari 30 percobaan |

- **Contoh** visual `position`: Bola berada di sebelah atas kotak. Di mana posisi bola terhadap kotak?
  - params: `{"position":"atas"}`
  - pilihan: `kiri`, `kanan`, `bawah`, `atas`
  - jawaban: `atas`
  - petunjuk: 1) Perhatikan letak bola terhadap kotak. 2) Gunakan kata posisi yang sesuai. 3) Posisi bola adalah atas.
  - penjelasan: Bola berada di sebelah atas kotak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `position`: Bola berada di sebelah bawah kotak. Di mana posisi bola terhadap kotak?
  - params: `{"position":"bawah"}`
  - pilihan: `kiri`, `atas`, `kanan`, `bawah`
  - jawaban: `bawah`
  - petunjuk: 1) Perhatikan letak bola terhadap kotak. 2) Gunakan kata posisi yang sesuai. 3) Posisi bola adalah bawah.
  - penjelasan: Bola berada di sebelah bawah kotak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `position`: Bola berada di sebelah atas kotak. Di mana posisi bola terhadap kotak?
  - params: `{"position":"atas"}`
  - pilihan: `kanan`, `bawah`, `atas`, `kiri`
  - jawaban: `atas`
  - petunjuk: 1) Perhatikan letak bola terhadap kotak. 2) Gunakan kata posisi yang sesuai. 3) Posisi bola adalah atas.
  - penjelasan: Bola berada di sebelah atas kotak.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Mengelompokkan data (`data-awal`)

#### `tally-read` kelas 2

30 soal dibangkitkan, 10 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `tally`: Turus pada papan pilihan menunjukkan 5 suara. Berapa jumlah suara yang tercatat?
  - params: `{"count":5,"values":[5]}`
  - jawaban: `5`
  - petunjuk: 1) Hitung setiap garis turus. 2) Satu kelompok lima turus tetap bernilai lima. 3) Jumlah suara yang tercatat 5.
  - penjelasan: Jumlah turus yang tercatat adalah 5 suara.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `tally`: Turus pada papan pilihan menunjukkan 6 suara. Berapa jumlah suara yang tercatat?
  - params: `{"count":6,"values":[6]}`
  - jawaban: `6`
  - petunjuk: 1) Hitung setiap garis turus. 2) Satu kelompok lima turus tetap bernilai lima. 3) Jumlah suara yang tercatat 6.
  - penjelasan: Jumlah turus yang tercatat adalah 6 suara.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `tally`: Turus pada papan pilihan menunjukkan 9 suara. Berapa jumlah suara yang tercatat?
  - params: `{"count":9,"values":[9]}`
  - jawaban: `9`
  - petunjuk: 1) Hitung setiap garis turus. 2) Satu kelompok lima turus tetap bernilai lima. 3) Jumlah suara yang tercatat 9.
  - penjelasan: Jumlah turus yang tercatat adalah 9 suara.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `pictogram-read` kelas 2

30 soal dibangkitkan, 25 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 5 kg. Ada 2, 3, dan 4 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":5,"counts":[2,3,4]}`
  - jawaban: `45`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 9. Setiap gambar bernilai 5, jadi total 45.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 5 kg. Ada 2, 1, dan 1 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":5,"counts":[2,1,1]}`
  - jawaban: `20`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 4. Setiap gambar bernilai 5, jadi total 20.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 5 kg. Ada 1, 3, dan 2 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":5,"counts":[1,3,2]}`
  - jawaban: `30`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 6. Setiap gambar bernilai 5, jadi total 30.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Bilangan sampai 10.000 (`bilangan-10000`)

#### `whole-place-value` kelas 3

30 soal dibangkitkan, 29 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `place-value`: Pada bilangan 88, berapa nilai angka 8?
  - params: `{"value":88,"position":1}`
  - jawaban: `80`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 10, jadi nilainya 80.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 3.268, berapa nilai angka 8?
  - params: `{"value":3268,"position":0}`
  - jawaban: `8`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 1, jadi nilainya 8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 2.180, berapa nilai angka 0?
  - params: `{"value":2180,"position":0}`
  - jawaban: `0`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 1, jadi nilainya 0.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-place-value` kelas 4

30 soal dibangkitkan, 30 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `place-value`: Pada bilangan 3.005, berapa nilai angka 0?
  - params: `{"value":3005,"position":2}`
  - jawaban: `0`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 100, jadi nilainya 0.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 2.795, berapa nilai angka 7?
  - params: `{"value":2795,"position":2}`
  - jawaban: `700`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 100, jadi nilainya 700.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 815.131, berapa nilai angka 5?
  - params: `{"value":815131,"position":3}`
  - jawaban: `5000`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 1.000, jadi nilainya 5.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-compose` kelas 3

30 soal dibangkitkan, 29 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `place-value`: Susun bilangan dari 0 ratusan, 1 puluhan, dan 9 satuan.
  - params: `{"thousands":0,"hundreds":0,"tens":1,"ones":9,"value":19}`
  - jawaban: `19`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Susun bilangan dari 1 ratusan, 5 puluhan, dan 9 satuan.
  - params: `{"thousands":0,"hundreds":1,"tens":5,"ones":9,"value":159}`
  - jawaban: `159`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Susun bilangan dari 3 ratusan, 6 puluhan, dan 9 satuan.
  - params: `{"thousands":0,"hundreds":3,"tens":6,"ones":9,"value":369}`
  - jawaban: `369`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-compose` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 7 |

- **Contoh** visual `place-value`: Susun bilangan dari 7 ratusan, 0 puluhan, dan 5 satuan.
  - params: `{"thousands":0,"hundreds":7,"tens":0,"ones":5,"value":705}`
  - jawaban: `705`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Susun bilangan dari 6 ratusan, 3 puluhan, dan 6 satuan.
  - params: `{"thousands":0,"hundreds":6,"tens":3,"ones":6,"value":636}`
  - jawaban: `636`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Susun bilangan dari 5 ribuan, 2 ratusan, 2 puluhan, dan 8 satuan.
  - params: `{"thousands":5,"hundreds":2,"tens":2,"ones":8,"value":5228}`
  - jawaban: `5228`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-compare` kelas 3

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=20, bilangan b=11 tidak tampil |

- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 20 atau B: 11?
  - params: `{"a":20,"b":11}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 20 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 2.089 atau B: 2.064?
  - params: `{"a":2089,"b":2064}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 2.089 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 4.176 atau B: 9.175?
  - params: `{"a":4176,"b":9175}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 9.175 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-compare` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=8415, bilangan b=5514 tidak tampil |

- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 8.415 atau B: 5.514?
  - params: `{"a":8415,"b":5514}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 8.415 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 6.531 atau B: 1.911?
  - params: `{"a":6531,"b":1911}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 6.531 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 80.164 atau B: 10.798?
  - params: `{"a":80164,"b":10798}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 80.164 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-order` kelas 3

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `PILIHAN-GANDA-SAMA` | 12 | pilihan duplikat [16 – 15 – 10 \| 10 – 15 – 16 \| 10 – 15 – 16] |
| rendah | `ANGKA-TANPA-TITIK` | 18 | angka 4 digit tanpa pemisah ribuan: Urutkan dari yang terkecil: 789, 4062, 7627. |

- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 18, 12, 20.
  - params: `{"values":[18,12,20]}`
  - pilihan: `20 – 18 – 12`, `12 – 18 – 20`, `18 – 12 – 20`
  - jawaban: `12 – 18 – 20`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 12 – 18 – 20.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 789, 4062, 7627.
  - params: `{"values":[789,4062,7627]}`
  - pilihan: `789 – 4062 – 7627`, `789 – 4062 – 7627`, `7627 – 4062 – 789`
  - jawaban: `789 – 4062 – 7627`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 789 – 4062 – 7627.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 7521, 975, 903.
  - params: `{"values":[7521,975,903]}`
  - pilihan: `903 – 975 – 7521`, `7521 – 975 – 903`, `7521 – 975 – 903`
  - jawaban: `903 – 975 – 7521`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 903 – 975 – 7521.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-order` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `PILIHAN-GANDA-SAMA` | 12 | pilihan duplikat [2441 – 3730 – 6744 \| 2441 – 3730 – 6744 \| 6744 – 3730 – 2441] |
| rendah | `ANGKA-TANPA-TITIK` | 30 | angka 4 digit tanpa pemisah ribuan: Urutkan dari yang terkecil: 7948, 9011, 6905. |

- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 7948, 9011, 6905.
  - params: `{"values":[7948,9011,6905]}`
  - pilihan: `7948 – 9011 – 6905`, `9011 – 7948 – 6905`, `6905 – 7948 – 9011`
  - jawaban: `6905 – 7948 – 9011`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 6905 – 7948 – 9011.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 8727, 2936, 8945.
  - params: `{"values":[8727,2936,8945]}`
  - pilihan: `8727 – 2936 – 8945`, `8945 – 8727 – 2936`, `2936 – 8727 – 8945`
  - jawaban: `2936 – 8727 – 8945`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 2936 – 8727 – 8945.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 49695, 49429, 36662.
  - params: `{"values":[49695,49429,36662]}`
  - pilihan: `49695 – 49429 – 36662`, `36662 – 49429 – 49695`, `49695 – 49429 – 36662`
  - jawaban: `36662 – 49429 – 49695`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 36662 – 49429 – 49695.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Operasi bilangan (`operasi-b`)

#### `whole-add` kelas 3

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=13, bilangan b=18 tidak tampil |

- **Contoh** visual `place-value`: Hitung 13 + 18.
  - params: `{"a":13,"b":18}`
  - jawaban: `31`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 13 + 18 = 31.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 252 + 393.
  - params: `{"a":252,"b":393}`
  - jawaban: `645`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 252 + 393 = 645.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 509 + 825.
  - params: `{"a":509,"b":825}`
  - jawaban: `1334`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 509 + 825 = 1.334.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-add` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=701, bilangan b=598 tidak tampil |

- **Contoh** visual `place-value`: Hitung 701 + 598.
  - params: `{"a":701,"b":598}`
  - jawaban: `1299`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 701 + 598 = 1.299.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 338 + 831.
  - params: `{"a":338,"b":831}`
  - jawaban: `1169`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 338 + 831 = 1.169.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 74.083 + 55.777.
  - params: `{"a":74083,"b":55777}`
  - jawaban: `129860`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 74.083 + 55.777 = 129.860.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-subtract` kelas 3

30 soal dibangkitkan, 27 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=20, bilangan b=14 tidak tampil |

- **Contoh** visual `place-value`: Hitung 20 − 14.
  - params: `{"a":20,"b":14}`
  - jawaban: `6`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 20 dikurangi 14 sama dengan 6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 458 − 434.
  - params: `{"a":458,"b":434}`
  - jawaban: `24`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 458 dikurangi 434 sama dengan 24.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 753 − 679.
  - params: `{"a":753,"b":679}`
  - jawaban: `74`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 753 dikurangi 679 sama dengan 74.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-subtract` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=780, bilangan b=678 tidak tampil |

- **Contoh** visual `place-value`: Hitung 780 − 678.
  - params: `{"a":780,"b":678}`
  - jawaban: `102`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 780 dikurangi 678 sama dengan 102.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 767 − 87.
  - params: `{"a":767,"b":87}`
  - jawaban: `680`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 767 dikurangi 87 sama dengan 680.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 2.169 − 907.
  - params: `{"a":2169,"b":907}`
  - jawaban: `1262`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 2.169 dikurangi 907 sama dengan 1.262.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-multiply` kelas 3

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=51, bilangan b=10 tidak tampil |

- **Contoh** visual `place-value`: Hitung 51 × 10.
  - params: `{"a":51,"b":10}`
  - jawaban: `510`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 51 dikali 10 sama dengan 510.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 75 × 12.
  - params: `{"a":75,"b":12}`
  - jawaban: `900`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 75 dikali 12 sama dengan 900.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 84 × 11.
  - params: `{"a":84,"b":11}`
  - jawaban: `924`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 84 dikali 11 sama dengan 924.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-multiply` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=63, bilangan b=11 tidak tampil |

- **Contoh** visual `place-value`: Hitung 63 × 11.
  - params: `{"a":63,"b":11}`
  - jawaban: `693`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 63 dikali 11 sama dengan 693.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 64 × 2.
  - params: `{"a":64,"b":2}`
  - jawaban: `128`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 64 dikali 2 sama dengan 128.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 662 × 10.
  - params: `{"a":662,"b":10}`
  - jawaban: `6620`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 662 dikali 10 sama dengan 6.620.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-divide` kelas 3

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | place-value: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 565, level 4 = 358 |

- **Contoh** visual `place-value`: Hitung 644 ÷ 7.
  - params: `{"dividend":644,"divisor":7}`
  - jawaban: `92`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 644 dibagi 7 sama dengan 92.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 136 ÷ 4.
  - params: `{"dividend":136,"divisor":4}`
  - jawaban: `34`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 136 dibagi 4 sama dengan 34.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 207 ÷ 9.
  - params: `{"dividend":207,"divisor":9}`
  - jawaban: `23`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 207 dibagi 9 sama dengan 23.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-divide` kelas 4

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | place-value: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |

- **Contoh** visual `place-value`: Hitung 800 ÷ 10.
  - params: `{"dividend":800,"divisor":10}`
  - jawaban: `80`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 800 dibagi 10 sama dengan 80.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 153 ÷ 3.
  - params: `{"dividend":153,"divisor":3}`
  - jawaban: `51`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 153 dibagi 3 sama dengan 51.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 1.740 ÷ 5.
  - params: `{"dividend":1740,"divisor":5}`
  - jawaban: `348`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 1.740 dibagi 5 sama dengan 348.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Faktor dan kelipatan (`faktor-kelipatan`)

#### `factor-list` kelas 4

30 soal dibangkitkan, 20 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 25, level 4 = 21 |

- **Contoh** visual `number-line`: Tuliskan semua faktor dari 15, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":15}`
  - jawaban: `1, 3, 5, 15`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 15.
  - penjelasan: Faktor 15 adalah bilangan yang membagi 15 tanpa sisa: 1, 3, 5, 15.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tuliskan semua faktor dari 27, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":27}`
  - jawaban: `1, 3, 9, 27`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 27.
  - penjelasan: Faktor 27 adalah bilangan yang membagi 27 tanpa sisa: 1, 3, 9, 27.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tuliskan semua faktor dari 17, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":17}`
  - jawaban: `1, 17`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 17.
  - penjelasan: Faktor 17 adalah bilangan yang membagi 17 tanpa sisa: 1, 17.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `prime-check` kelas 4

30 soal dibangkitkan, 24 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |

- **Contoh** visual `number-line`: Apakah 16 bilangan prima?
  - params: `{"n":16}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Bukan`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 16 memiliki faktor selain 1 dan dirinya sendiri.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Apakah 11 bilangan prima?
  - params: `{"n":11}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Ya`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 11 hanya punya dua faktor: 1 dan 11.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Apakah 33 bilangan prima?
  - params: `{"n":33}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Bukan`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 33 memiliki faktor selain 1 dan dirinya sendiri.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Pecahan sederhana (`pecahan-b`)

#### `fraction-identify` kelas 3

30 soal dibangkitkan, 12 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 6, level 4 = 5 |

- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 6 bagian sama besar. Ada 5 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":5,"d":6}`
  - jawaban: `5/6`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 5, seluruh bagian ada 6. Jadi pecahannya 5/6.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu
- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 5 bagian sama besar. Ada 2 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":2,"d":5}`
  - jawaban: `2/5`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 2, seluruh bagian ada 5. Jadi pecahannya 2/5.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu
- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 5 bagian sama besar. Ada 3 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":3,"d":5}`
  - jawaban: `3/5`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 3, seluruh bagian ada 5. Jadi pecahannya 3/5.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu

#### `fraction-identify` kelas 4

30 soal dibangkitkan, 12 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 8 bagian sama besar. Ada 7 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":7,"d":8}`
  - jawaban: `7/8`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 7, seluruh bagian ada 8. Jadi pecahannya 7/8.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu
- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 5 bagian sama besar. Ada 4 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":4,"d":5}`
  - jawaban: `4/5`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 4, seluruh bagian ada 5. Jadi pecahannya 4/5.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu
- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 8 bagian sama besar. Ada 1 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":1,"d":8}`
  - jawaban: `1/8`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 1, seluruh bagian ada 8. Jadi pecahannya 1/8.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu

#### `fraction-compare` kelas 3

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 8 |

- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 2/8 atau B: 3/5?
  - params: `{"a":2,"b":8,"c":3,"d":5}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 2 × 5 = 10, sedangkan 3 × 8 = 24.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 4/7 atau B: 2/4?
  - params: `{"a":4,"b":7,"c":2,"d":4}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 4 × 4 = 16, sedangkan 2 × 7 = 14.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 3/8 atau B: 3/5?
  - params: `{"a":3,"b":8,"c":3,"d":5}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 3 × 5 = 15, sedangkan 3 × 8 = 24.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu

#### `fraction-compare` kelas 4

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 6 |

- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 1/7 atau B: 3/6?
  - params: `{"a":1,"b":7,"c":3,"d":6}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 1 × 6 = 6, sedangkan 3 × 7 = 21.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 5/7 atau B: 2/7?
  - params: `{"a":5,"b":7,"c":2,"d":7}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 5 × 7 = 35, sedangkan 2 × 7 = 14.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 4/7 atau B: 5/6?
  - params: `{"a":4,"b":7,"c":5,"d":6}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 4 × 6 = 24, sedangkan 5 × 7 = 35.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu

#### `fraction-equivalent` kelas 3

30 soal dibangkitkan, 20 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Pecahan senilai: 2/3 = ?/9. Berapa angka yang hilang?
  - params: `{"n":2,"d":3,"factor":3}`
  - jawaban: `6`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 2 dengan 3.
  - penjelasan: Pembilang dan penyebut dikali 3, jadi pembilang baru 6.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan senilai: 4/5 = ?/15. Berapa angka yang hilang?
  - params: `{"n":4,"d":5,"factor":3}`
  - jawaban: `12`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 4 dengan 3.
  - penjelasan: Pembilang dan penyebut dikali 3, jadi pembilang baru 12.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan senilai: 3/6 = ?/12. Berapa angka yang hilang?
  - params: `{"n":3,"d":6,"factor":2}`
  - jawaban: `6`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 3 dengan 2.
  - penjelasan: Pembilang dan penyebut dikali 2, jadi pembilang baru 6.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu

#### `fraction-equivalent` kelas 4

30 soal dibangkitkan, 20 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Pecahan senilai: 2/4 = ?/16. Berapa angka yang hilang?
  - params: `{"n":2,"d":4,"factor":4}`
  - jawaban: `8`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 2 dengan 4.
  - penjelasan: Pembilang dan penyebut dikali 4, jadi pembilang baru 8.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan senilai: 2/4 = ?/8. Berapa angka yang hilang?
  - params: `{"n":2,"d":4,"factor":2}`
  - jawaban: `4`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 2 dengan 2.
  - penjelasan: Pembilang dan penyebut dikali 2, jadi pembilang baru 4.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan senilai: 3/4 = ?/16. Berapa angka yang hilang?
  - params: `{"n":3,"d":4,"factor":4}`
  - jawaban: `12`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 3 dengan 4.
  - penjelasan: Pembilang dan penyebut dikali 4, jadi pembilang baru 12.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu

#### `fraction-simplify` kelas 3

30 soal dibangkitkan, 26 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 33, level 4 = 22 |

- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 8/12.
  - params: `{"n":8,"d":12}`
  - jawaban: `2/3`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 8/32.
  - params: `{"n":8,"d":32}`
  - jawaban: `1/4`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 16/20.
  - params: `{"n":16,"d":20}`
  - jawaban: `4/5`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu

#### `fraction-simplify` kelas 4

30 soal dibangkitkan, 23 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 8/12.
  - params: `{"n":8,"d":12}`
  - jawaban: `2/3`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 12/32.
  - params: `{"n":12,"d":32}`
  - jawaban: `3/8`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 6/27.
  - params: `{"n":6,"d":27}`
  - jawaban: `2/9`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu

### Topik: Desimal dan persen dasar (`desimal-persen-b`)

#### `decimal-compare` kelas 4

30 soal dibangkitkan, 26 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 7, level 4 = 7 |

- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,6 atau 0,8?
  - params: `{"a":6,"c":8}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,7 atau 0,8?
  - params: `{"a":7,"c":8}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,4 atau 0,6?
  - params: `{"a":4,"c":6}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-place` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | place-value: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 52, level 4 = 49 |

- **Contoh** visual `place-value`: Pada bilangan 81,6, berapa nilai angka persepuluhannya?
  - params: `{"whole":81,"tenths":6}`
  - jawaban: `0,6`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 6 berada di tempat persepuluhan, nilainya 0,6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 64,4, berapa nilai angka persepuluhannya?
  - params: `{"whole":64,"tenths":4}`
  - jawaban: `0,4`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 4 berada di tempat persepuluhan, nilainya 0,4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 70,8, berapa nilai angka persepuluhannya?
  - params: `{"whole":70,"tenths":8}`
  - jawaban: `0,8`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 8 berada di tempat persepuluhan, nilainya 0,8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `fraction-percent` kelas 4

30 soal dibangkitkan, 8 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |

- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/5?
  - params: `{"n":1,"d":5}`
  - jawaban: `20%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/5 setara dengan 20 dari 100, yaitu 20%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/2?
  - params: `{"n":1,"d":2}`
  - jawaban: `50%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/2 setara dengan 50 dari 100, yaitu 50%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/10?
  - params: `{"n":1,"d":10}`
  - jawaban: `10%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/10 setara dengan 10 dari 100, yaitu 10%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu

### Topik: Pola bilangan dasar (`pola-b`)

#### `pattern-additive` kelas 3

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |

- **Contoh** visual `number-line`: Pola: 16, 18, 20, ... Angka berikutnya?
  - params: `{"start":16,"step":2}`
  - jawaban: `22`
  - petunjuk: 1) Cari selisih dua suku yang berdekatan. 2) Periksa apakah selisihnya tetap. 3) Tambahkan selisih itu pada suku terakhir.
  - penjelasan: Setiap suku bertambah 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Pola: 20, 23, 26, ... Angka berikutnya?
  - params: `{"start":20,"step":3}`
  - jawaban: `29`
  - petunjuk: 1) Cari selisih dua suku yang berdekatan. 2) Periksa apakah selisihnya tetap. 3) Tambahkan selisih itu pada suku terakhir.
  - penjelasan: Setiap suku bertambah 3.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Pola: 9, 11, 13, ... Angka berikutnya?
  - params: `{"start":9,"step":2}`
  - jawaban: `15`
  - petunjuk: 1) Cari selisih dua suku yang berdekatan. 2) Periksa apakah selisihnya tetap. 3) Tambahkan selisih itu pada suku terakhir.
  - penjelasan: Setiap suku bertambah 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `pattern-additive` kelas 4

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 26, level 4 = 21 |

- **Contoh** visual `number-line`: Pola: 13, 19, 25, ... Angka berikutnya?
  - params: `{"start":13,"step":6}`
  - jawaban: `31`
  - petunjuk: 1) Cari selisih dua suku yang berdekatan. 2) Periksa apakah selisihnya tetap. 3) Tambahkan selisih itu pada suku terakhir.
  - penjelasan: Setiap suku bertambah 6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Pola: 11, 14, 17, ... Angka berikutnya?
  - params: `{"start":11,"step":3}`
  - jawaban: `20`
  - petunjuk: 1) Cari selisih dua suku yang berdekatan. 2) Periksa apakah selisihnya tetap. 3) Tambahkan selisih itu pada suku terakhir.
  - penjelasan: Setiap suku bertambah 3.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Pola: 20, 24, 28, ... Angka berikutnya?
  - params: `{"start":20,"step":4}`
  - jawaban: `32`
  - petunjuk: 1) Cari selisih dua suku yang berdekatan. 2) Periksa apakah selisihnya tetap. 3) Tambahkan selisih itu pada suku terakhir.
  - penjelasan: Setiap suku bertambah 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `missing-add-sub` kelas 3

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=29, bilangan b=81 tidak tampil |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 103, level 4 = 74 |

- **Contoh** visual `blocks`: Lengkapi kalimat: 29 + □ = 110.
  - params: `{"a":29,"b":81,"sum":110}`
  - jawaban: `81`
  - petunjuk: 1) Cari bilangan yang jika ditambah menghasilkan jumlah itu. 2) Gunakan pengurangan untuk mencari nilai yang hilang. 3) Kurangi hasil dengan bilangan yang sudah diketahui.
  - penjelasan: Gunakan operasi kebalikan: 110 − 29 = 81.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Lengkapi kalimat: 35 + □ = 62.
  - params: `{"a":35,"b":27,"sum":62}`
  - jawaban: `27`
  - petunjuk: 1) Cari bilangan yang jika ditambah menghasilkan jumlah itu. 2) Gunakan pengurangan untuk mencari nilai yang hilang. 3) Kurangi hasil dengan bilangan yang sudah diketahui.
  - penjelasan: Gunakan operasi kebalikan: 62 − 35 = 27.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Lengkapi kalimat: 34 + □ = 109.
  - params: `{"a":34,"b":75,"sum":109}`
  - jawaban: `75`
  - petunjuk: 1) Cari bilangan yang jika ditambah menghasilkan jumlah itu. 2) Gunakan pengurangan untuk mencari nilai yang hilang. 3) Kurangi hasil dengan bilangan yang sudah diketahui.
  - penjelasan: Gunakan operasi kebalikan: 109 − 34 = 75.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `missing-add-sub` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=69, bilangan b=45 tidak tampil |

- **Contoh** visual `blocks`: Lengkapi kalimat: 69 + □ = 114.
  - params: `{"a":69,"b":45,"sum":114}`
  - jawaban: `45`
  - petunjuk: 1) Cari bilangan yang jika ditambah menghasilkan jumlah itu. 2) Gunakan pengurangan untuk mencari nilai yang hilang. 3) Kurangi hasil dengan bilangan yang sudah diketahui.
  - penjelasan: Gunakan operasi kebalikan: 114 − 69 = 45.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Lengkapi kalimat: 19 + □ = 55.
  - params: `{"a":19,"b":36,"sum":55}`
  - jawaban: `36`
  - petunjuk: 1) Cari bilangan yang jika ditambah menghasilkan jumlah itu. 2) Gunakan pengurangan untuk mencari nilai yang hilang. 3) Kurangi hasil dengan bilangan yang sudah diketahui.
  - penjelasan: Gunakan operasi kebalikan: 55 − 19 = 36.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Lengkapi kalimat: 60 + □ = 146.
  - params: `{"a":60,"b":86,"sum":146}`
  - jawaban: `86`
  - petunjuk: 1) Cari bilangan yang jika ditambah menghasilkan jumlah itu. 2) Gunakan pengurangan untuk mencari nilai yang hilang. 3) Kurangi hasil dengan bilangan yang sudah diketahui.
  - penjelasan: Gunakan operasi kebalikan: 146 − 60 = 86.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Panjang, berat, luas, dan volume (`ukur-b`)

#### `length-convert` kelas 3

30 soal dibangkitkan, 11 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| sedang | `PETUNJUK-BOCOR` | 3 | petunjuk 1/2 sudah menyebut jawaban "100" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 5 |

- **Contoh** visual `blocks`: 4 meter sama dengan berapa sentimeter?
  - params: `{"meters":4}`
  - jawaban: `400`
  - petunjuk: 1) Ingat hubungan meter dan sentimeter. 2) Setiap 1 meter terdiri dari 100 cm. 3) Kalikan jumlah meter dengan 100.
  - penjelasan: Satu meter sama dengan 100 sentimeter.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: 4 meter sama dengan berapa sentimeter?
  - params: `{"meters":4}`
  - jawaban: `400`
  - petunjuk: 1) Ingat hubungan meter dan sentimeter. 2) Setiap 1 meter terdiri dari 100 cm. 3) Kalikan jumlah meter dengan 100.
  - penjelasan: Satu meter sama dengan 100 sentimeter.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: 3 meter sama dengan berapa sentimeter?
  - params: `{"meters":3}`
  - jawaban: `300`
  - petunjuk: 1) Ingat hubungan meter dan sentimeter. 2) Setiap 1 meter terdiri dari 100 cm. 3) Kalikan jumlah meter dengan 100.
  - penjelasan: Satu meter sama dengan 100 sentimeter.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `length-convert` kelas 4

30 soal dibangkitkan, 10 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| sedang | `PETUNJUK-BOCOR` | 2 | petunjuk 1/2 sudah menyebut jawaban "100" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 9, level 4 = 5 |

- **Contoh** visual `blocks`: 11 meter sama dengan berapa sentimeter?
  - params: `{"meters":11}`
  - jawaban: `1100`
  - petunjuk: 1) Ingat hubungan meter dan sentimeter. 2) Setiap 1 meter terdiri dari 100 cm. 3) Kalikan jumlah meter dengan 100.
  - penjelasan: Satu meter sama dengan 100 sentimeter.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: 9 meter sama dengan berapa sentimeter?
  - params: `{"meters":9}`
  - jawaban: `900`
  - petunjuk: 1) Ingat hubungan meter dan sentimeter. 2) Setiap 1 meter terdiri dari 100 cm. 3) Kalikan jumlah meter dengan 100.
  - penjelasan: Satu meter sama dengan 100 sentimeter.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: 4 meter sama dengan berapa sentimeter?
  - params: `{"meters":4}`
  - jawaban: `400`
  - petunjuk: 1) Ingat hubungan meter dan sentimeter. 2) Setiap 1 meter terdiri dari 100 cm. 3) Kalikan jumlah meter dengan 100.
  - penjelasan: Satu meter sama dengan 100 sentimeter.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `mass-convert` kelas 3

30 soal dibangkitkan, 9 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |

- **Contoh** visual `blocks`: 1 kilogram sama dengan berapa gram?
  - params: `{"kg":1}`
  - jawaban: `1000`
  - petunjuk: 1) Ingat hubungan kilogram dan gram. 2) Setiap 1 kilogram terdiri dari 1.000 gram. 3) Kalikan kilogram dengan 1.000.
  - penjelasan: Satu kilogram sama dengan 1.000 gram.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: 9 kilogram sama dengan berapa gram?
  - params: `{"kg":9}`
  - jawaban: `9000`
  - petunjuk: 1) Ingat hubungan kilogram dan gram. 2) Setiap 1 kilogram terdiri dari 1.000 gram. 3) Kalikan kilogram dengan 1.000.
  - penjelasan: Satu kilogram sama dengan 1.000 gram.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: 6 kilogram sama dengan berapa gram?
  - params: `{"kg":6}`
  - jawaban: `6000`
  - petunjuk: 1) Ingat hubungan kilogram dan gram. 2) Setiap 1 kilogram terdiri dari 1.000 gram. 3) Kalikan kilogram dengan 1.000.
  - penjelasan: Satu kilogram sama dengan 1.000 gram.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `mass-convert` kelas 4

30 soal dibangkitkan, 9 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 4, level 4 = 3 |

- **Contoh** visual `blocks`: 3 kilogram sama dengan berapa gram?
  - params: `{"kg":3}`
  - jawaban: `3000`
  - petunjuk: 1) Ingat hubungan kilogram dan gram. 2) Setiap 1 kilogram terdiri dari 1.000 gram. 3) Kalikan kilogram dengan 1.000.
  - penjelasan: Satu kilogram sama dengan 1.000 gram.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: 6 kilogram sama dengan berapa gram?
  - params: `{"kg":6}`
  - jawaban: `6000`
  - petunjuk: 1) Ingat hubungan kilogram dan gram. 2) Setiap 1 kilogram terdiri dari 1.000 gram. 3) Kalikan kilogram dengan 1.000.
  - penjelasan: Satu kilogram sama dengan 1.000 gram.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: 3 kilogram sama dengan berapa gram?
  - params: `{"kg":3}`
  - jawaban: `3000`
  - petunjuk: 1) Ingat hubungan kilogram dan gram. 2) Setiap 1 kilogram terdiri dari 1.000 gram. 3) Kalikan kilogram dengan 1.000.
  - penjelasan: Satu kilogram sama dengan 1.000 gram.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `volume-unit-cubes` kelas 3

30 soal dibangkitkan, 24 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |

- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 2 panjang, 4 lebar, dan 2 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":2,"width":4,"height":2}`
  - jawaban: `16`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 2 × 4 × 2 = 16.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 4 panjang, 5 lebar, dan 4 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":4,"width":5,"height":4}`
  - jawaban: `80`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 4 × 5 × 4 = 80.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 5 panjang, 4 lebar, dan 3 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":5,"width":4,"height":3}`
  - jawaban: `60`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 5 × 4 × 3 = 60.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `volume-unit-cubes` kelas 4

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 6, level 4 = 4 |

- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 6 panjang, 2 lebar, dan 4 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":6,"width":2,"height":4}`
  - jawaban: `48`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 6 × 2 × 4 = 48.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 2 panjang, 5 lebar, dan 2 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":2,"width":5,"height":2}`
  - jawaban: `20`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 2 × 5 × 2 = 20.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 2 panjang, 2 lebar, dan 3 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":2,"width":2,"height":3}`
  - jawaban: `12`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 2 × 2 × 3 = 12.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Ciri bangun datar (`geometri-b`)

#### `shape-properties` kelas 3

30 soal dibangkitkan, 4 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 4 soal berbeda dari 30 percobaan |

- **Contoh** visual `shape`: Berapa banyak sisi lurus pada segiempat?
  - params: `{"sides":4}`
  - jawaban: `4`
  - petunjuk: 1) Telusuri garis tepi bangun. 2) Hitung setiap sisi satu kali. 3) Jumlahkan semua sisi lurus.
  - penjelasan: segiempat memiliki 4 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `shape`: Berapa banyak sisi lurus pada segienam?
  - params: `{"sides":6}`
  - jawaban: `6`
  - petunjuk: 1) Telusuri garis tepi bangun. 2) Hitung setiap sisi satu kali. 3) Jumlahkan semua sisi lurus.
  - penjelasan: segienam memiliki 6 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `shape`: Berapa banyak sisi lurus pada segitiga?
  - params: `{"sides":3}`
  - jawaban: `3`
  - petunjuk: 1) Telusuri garis tepi bangun. 2) Hitung setiap sisi satu kali. 3) Jumlahkan semua sisi lurus.
  - penjelasan: segitiga memiliki 3 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `shape-properties` kelas 4

30 soal dibangkitkan, 4 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `SOAL-MONOTON` | 30 | hanya 4 soal berbeda dari 30 percobaan |

- **Contoh** visual `shape`: Berapa banyak sisi lurus pada segitiga?
  - params: `{"sides":3}`
  - jawaban: `3`
  - petunjuk: 1) Telusuri garis tepi bangun. 2) Hitung setiap sisi satu kali. 3) Jumlahkan semua sisi lurus.
  - penjelasan: segitiga memiliki 3 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `shape`: Berapa banyak sisi lurus pada segilima?
  - params: `{"sides":5}`
  - jawaban: `5`
  - petunjuk: 1) Telusuri garis tepi bangun. 2) Hitung setiap sisi satu kali. 3) Jumlahkan semua sisi lurus.
  - penjelasan: segilima memiliki 5 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `shape`: Berapa banyak sisi lurus pada segitiga?
  - params: `{"sides":3}`
  - jawaban: `3`
  - petunjuk: 1) Telusuri garis tepi bangun. 2) Hitung setiap sisi satu kali. 3) Jumlahkan semua sisi lurus.
  - penjelasan: segitiga memiliki 3 sisi lurus.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `compose-shapes` kelas 3

30 soal dibangkitkan, 15 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `grid`: Beberapa petak disusun menjadi persegi panjang dengan 5 baris dan 3 kolom. Berapa petak yang membentuk bangun itu?
  - params: `{"rows":5,"columns":3}`
  - jawaban: `15`
  - petunjuk: 1) Hitung petak pada satu baris. 2) Lihat berapa baris yang disusun. 3) Kalikan banyak baris dengan banyak kolom.
  - penjelasan: Jumlah petak = 5 × 3 = 15.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Beberapa petak disusun menjadi persegi panjang dengan 3 baris dan 6 kolom. Berapa petak yang membentuk bangun itu?
  - params: `{"rows":3,"columns":6}`
  - jawaban: `18`
  - petunjuk: 1) Hitung petak pada satu baris. 2) Lihat berapa baris yang disusun. 3) Kalikan banyak baris dengan banyak kolom.
  - penjelasan: Jumlah petak = 3 × 6 = 18.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Beberapa petak disusun menjadi persegi panjang dengan 2 baris dan 6 kolom. Berapa petak yang membentuk bangun itu?
  - params: `{"rows":2,"columns":6}`
  - jawaban: `12`
  - petunjuk: 1) Hitung petak pada satu baris. 2) Lihat berapa baris yang disusun. 3) Kalikan banyak baris dengan banyak kolom.
  - penjelasan: Jumlah petak = 2 × 6 = 12.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `compose-shapes` kelas 4

30 soal dibangkitkan, 16 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `grid`: Beberapa petak disusun menjadi persegi panjang dengan 4 baris dan 2 kolom. Berapa petak yang membentuk bangun itu?
  - params: `{"rows":4,"columns":2}`
  - jawaban: `8`
  - petunjuk: 1) Hitung petak pada satu baris. 2) Lihat berapa baris yang disusun. 3) Kalikan banyak baris dengan banyak kolom.
  - penjelasan: Jumlah petak = 4 × 2 = 8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Beberapa petak disusun menjadi persegi panjang dengan 5 baris dan 4 kolom. Berapa petak yang membentuk bangun itu?
  - params: `{"rows":5,"columns":4}`
  - jawaban: `20`
  - petunjuk: 1) Hitung petak pada satu baris. 2) Lihat berapa baris yang disusun. 3) Kalikan banyak baris dengan banyak kolom.
  - penjelasan: Jumlah petak = 5 × 4 = 20.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Beberapa petak disusun menjadi persegi panjang dengan 2 baris dan 6 kolom. Berapa petak yang membentuk bangun itu?
  - params: `{"rows":2,"columns":6}`
  - jawaban: `12`
  - petunjuk: 1) Hitung petak pada satu baris. 2) Lihat berapa baris yang disusun. 3) Kalikan banyak baris dengan banyak kolom.
  - penjelasan: Jumlah petak = 2 × 6 = 12.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Tabel dan diagram (`data-b`)

#### `table-frequency` kelas 3

30 soal dibangkitkan, 29 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `chart`: Data buah di pasar: Apel 5 kg, Jeruk 3 kg, Pisang 4 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[5,3,4],"index":2}`
  - jawaban: `12`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Data buah di pasar: Apel 4 kg, Jeruk 9 kg, Pisang 8 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[4,9,8],"index":2}`
  - jawaban: `21`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Data buah di pasar: Apel 3 kg, Jeruk 8 kg, Pisang 3 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[3,8,3],"index":0}`
  - jawaban: `14`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `table-frequency` kelas 4

30 soal dibangkitkan, 30 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `chart`: Data buah di pasar: Apel 5 kg, Jeruk 4 kg, Pisang 4 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[5,4,4],"index":1}`
  - jawaban: `13`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Data buah di pasar: Apel 7 kg, Jeruk 4 kg, Pisang 9 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[7,4,9],"index":2}`
  - jawaban: `20`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Data buah di pasar: Apel 3 kg, Jeruk 3 kg, Pisang 2 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[3,3,2],"index":1}`
  - jawaban: `8`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `bar-chart-read` kelas 3

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 11, level 4 = 10 |

- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 4, hari 2 7, hari 3 12. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[4,7,12]}`
  - jawaban: `8`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 12 − data terkecil 4 = 8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 5, hari 2 3, hari 3 9. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[5,3,9]}`
  - jawaban: `6`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 9 − data terkecil 3 = 6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 2, hari 2 6, hari 3 12. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[2,6,12]}`
  - jawaban: `10`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 12 − data terkecil 2 = 10.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `bar-chart-read` kelas 4

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 10, level 4 = 7 |

- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 8, hari 2 9, hari 3 5. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[8,9,5]}`
  - jawaban: `4`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 9 − data terkecil 5 = 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 10, hari 2 7, hari 3 11. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[10,7,11]}`
  - jawaban: `4`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 11 − data terkecil 7 = 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 2, hari 2 3, hari 3 6. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[2,3,6]}`
  - jawaban: `4`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 6 − data terkecil 2 = 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `pictogram-read` kelas 3

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 5, level 4 = 4 |

- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 5 kg. Ada 1, 3, dan 3 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":5,"counts":[1,3,3]}`
  - jawaban: `35`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 7. Setiap gambar bernilai 5, jadi total 35.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 2 kg. Ada 2, 4, dan 1 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":2,"counts":[2,4,1]}`
  - jawaban: `14`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 7. Setiap gambar bernilai 2, jadi total 14.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 2 kg. Ada 2, 2, dan 1 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":2,"counts":[2,2,1]}`
  - jawaban: `10`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 5. Setiap gambar bernilai 2, jadi total 10.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `pictogram-read` kelas 4

30 soal dibangkitkan, 27 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 5, level 4 = 4 |

- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 5 kg. Ada 3, 1, dan 3 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":5,"counts":[3,1,3]}`
  - jawaban: `35`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 7. Setiap gambar bernilai 5, jadi total 35.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 5 kg. Ada 3, 4, dan 1 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":5,"counts":[3,4,1]}`
  - jawaban: `40`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 8. Setiap gambar bernilai 5, jadi total 40.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 2 kg. Ada 2, 2, dan 4 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":2,"counts":[2,2,4]}`
  - jawaban: `16`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 8. Setiap gambar bernilai 2, jadi total 16.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Bilangan besar dan uang (`bilangan-besar`)

#### `whole-place-value` kelas 5

30 soal dibangkitkan, 30 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `place-value`: Pada bilangan 8.420, berapa nilai angka 4?
  - params: `{"value":8420,"position":2}`
  - jawaban: `400`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 100, jadi nilainya 400.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 608.369, berapa nilai angka 0?
  - params: `{"value":608369,"position":4}`
  - jawaban: `0`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 10.000, jadi nilainya 0.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 892.082, berapa nilai angka 8?
  - params: `{"value":892082,"position":1}`
  - jawaban: `80`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 10, jadi nilainya 80.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-place-value` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 627828, level 4 = 539381 |

- **Contoh** visual `place-value`: Pada bilangan 335.415, berapa nilai angka 4?
  - params: `{"value":335415,"position":2}`
  - jawaban: `400`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 100, jadi nilainya 400.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 480.201, berapa nilai angka 0?
  - params: `{"value":480201,"position":3}`
  - jawaban: `0`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 1.000, jadi nilainya 0.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 120.486, berapa nilai angka 6?
  - params: `{"value":120486,"position":0}`
  - jawaban: `6`
  - petunjuk: 1) Cari posisi angka dari kanan. 2) Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya. 3) Kalikan angka tersebut dengan nilai tempatnya.
  - penjelasan: Angka itu berada di tempat 1, jadi nilainya 6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-compose` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 9, level 4 = 6 |

- **Contoh** visual `place-value`: Susun bilangan dari 9 ratusan, 4 puluhan, dan 5 satuan.
  - params: `{"thousands":0,"hundreds":9,"tens":4,"ones":5,"value":945}`
  - jawaban: `945`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Susun bilangan dari 2 ribuan, 2 ratusan, 7 puluhan, dan 6 satuan.
  - params: `{"thousands":2,"hundreds":2,"tens":7,"ones":6,"value":2276}`
  - jawaban: `2276`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Susun bilangan dari 2 ribuan, 8 ratusan, 0 puluhan, dan 9 satuan.
  - params: `{"thousands":2,"hundreds":8,"tens":0,"ones":9,"value":2809}`
  - jawaban: `2809`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-compose` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 9, level 4 = 8 |

- **Contoh** visual `place-value`: Susun bilangan dari 5 ribuan, 8 ratusan, 2 puluhan, dan 7 satuan.
  - params: `{"thousands":5,"hundreds":8,"tens":2,"ones":7,"value":5827}`
  - jawaban: `5827`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Susun bilangan dari 8 ribuan, 1 ratusan, 0 puluhan, dan 6 satuan.
  - params: `{"thousands":8,"hundreds":1,"tens":0,"ones":6,"value":8106}`
  - jawaban: `8106`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Susun bilangan dari 8 ribuan, 2 ratusan, 1 puluhan, dan 9 satuan.
  - params: `{"thousands":8,"hundreds":2,"tens":1,"ones":9,"value":8219}`
  - jawaban: `8219`
  - petunjuk: 1) Tuliskan nilai tiap tempat. 2) Ribuan diikuti ratusan, puluhan, lalu satuan. 3) Jumlahkan semua nilai tempat.
  - penjelasan: Gabungkan nilai setiap tempat dari kiri ke kanan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-compare` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=6605, bilangan b=2113 tidak tampil |

- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 6.605 atau B: 2.113?
  - params: `{"a":6605,"b":2113}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 6.605 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 69.470 atau B: 34.943?
  - params: `{"a":69470,"b":34943}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 69.470 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 53.496 atau B: 90.428?
  - params: `{"a":53496,"b":90428}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 90.428 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-compare` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=63745, bilangan b=10358 tidak tampil |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 70993, level 4 = 52370 |

- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 63.745 atau B: 10.358?
  - params: `{"a":63745,"b":10358}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 63.745 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 457 atau B: 33.025?
  - params: `{"a":457,"b":33025}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 33.025 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Bilangan mana yang lebih besar? A: 22.013 atau B: 12.871?
  - params: `{"a":22013,"b":12871}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bandingkan banyak digit terlebih dahulu. 2) Jika digitnya sama banyak, bandingkan dari tempat terbesar. 3) Pilih A jika angka pertama lebih besar, selain itu pilih B.
  - penjelasan: 22.013 lebih besar.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-order` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `PILIHAN-GANDA-SAMA` | 6 | pilihan duplikat [5753 – 7523 – 8440 \| 8440 – 7523 – 5753 \| 5753 – 7523 – 8440] |
| rendah | `ANGKA-TANPA-TITIK` | 30 | angka 4 digit tanpa pemisah ribuan: Urutkan dari yang terkecil: 5804, 5037, 6395. |

- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 5804, 5037, 6395.
  - params: `{"values":[5804,5037,6395]}`
  - pilihan: `5804 – 5037 – 6395`, `5037 – 5804 – 6395`, `6395 – 5804 – 5037`
  - jawaban: `5037 – 5804 – 6395`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 5037 – 5804 – 6395.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 57702, 43605, 56187.
  - params: `{"values":[57702,43605,56187]}`
  - pilihan: `57702 – 43605 – 56187`, `57702 – 56187 – 43605`, `43605 – 56187 – 57702`
  - jawaban: `43605 – 56187 – 57702`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 43605 – 56187 – 57702.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 27964, 83788, 88146.
  - params: `{"values":[27964,83788,88146]}`
  - pilihan: `27964 – 83788 – 88146`, `27964 – 83788 – 88146`, `88146 – 83788 – 27964`
  - jawaban: `27964 – 83788 – 88146`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 27964 – 83788 – 88146.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-order` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `PILIHAN-GANDA-SAMA` | 11 | pilihan duplikat [44077 – 55721 – 73815 \| 44077 – 55721 – 73815 \| 73815 – 55721 – 44077] |
| rendah | `ANGKA-TANPA-TITIK` | 30 | angka 4 digit tanpa pemisah ribuan: Urutkan dari yang terkecil: 14690, 94647, 35281. |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 80707, level 4 = 73639 |

- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 14690, 94647, 35281.
  - params: `{"values":[14690,94647,35281]}`
  - pilihan: `14690 – 94647 – 35281`, `14690 – 35281 – 94647`, `94647 – 35281 – 14690`
  - jawaban: `14690 – 35281 – 94647`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 14690 – 35281 – 94647.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 8599, 29352, 53775.
  - params: `{"values":[8599,29352,53775]}`
  - pilihan: `8599 – 29352 – 53775`, `53775 – 29352 – 8599`, `8599 – 29352 – 53775`
  - jawaban: `8599 – 29352 – 53775`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 8599 – 29352 – 53775.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan dari yang terkecil: 96818, 92981, 50928.
  - params: `{"values":[96818,92981,50928]}`
  - pilihan: `96818 – 92981 – 50928`, `50928 – 92981 – 96818`, `96818 – 92981 – 50928`
  - jawaban: `50928 – 92981 – 96818`
  - petunjuk: 1) Perhatikan jumlah digit. 2) Bandingkan nilai tempat dari kiri. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutan yang benar: 50928 – 92981 – 96818.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `money-change` kelas 5

30 soal dibangkitkan, 26 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 75000, level 4 = 66667 |

- **Contoh** visual `blocks`: Di pasar, harga 1 kg jeruk Rp95.000. Kamu membayar Rp120.000. Berapa kembaliannya?
  - params: `{"price":95000,"paid":120000}`
  - jawaban: `25000`
  - petunjuk: 1) Cari selisih uang yang dibayar dan harga. 2) Kurangi harga dari uang pembayaran. 3) Kembalian adalah uang dibayar dikurangi harga.
  - penjelasan: Kembalian = uang dibayar − harga = Rp25.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Di pasar, harga 1 kg jeruk Rp35.000. Kamu membayar Rp50.000. Berapa kembaliannya?
  - params: `{"price":35000,"paid":50000}`
  - jawaban: `15000`
  - petunjuk: 1) Cari selisih uang yang dibayar dan harga. 2) Kurangi harga dari uang pembayaran. 3) Kembalian adalah uang dibayar dikurangi harga.
  - penjelasan: Kembalian = uang dibayar − harga = Rp15.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Di pasar, harga 1 kg jeruk Rp45.000. Kamu membayar Rp70.000. Berapa kembaliannya?
  - params: `{"price":45000,"paid":70000}`
  - jawaban: `25000`
  - petunjuk: 1) Cari selisih uang yang dibayar dan harga. 2) Kurangi harga dari uang pembayaran. 3) Kembalian adalah uang dibayar dikurangi harga.
  - penjelasan: Kembalian = uang dibayar − harga = Rp25.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `money-change` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |

- **Contoh** visual `blocks`: Di pasar, harga 1 kg jeruk Rp17.000. Kamu membayar Rp40.000. Berapa kembaliannya?
  - params: `{"price":17000,"paid":40000}`
  - jawaban: `23000`
  - petunjuk: 1) Cari selisih uang yang dibayar dan harga. 2) Kurangi harga dari uang pembayaran. 3) Kembalian adalah uang dibayar dikurangi harga.
  - penjelasan: Kembalian = uang dibayar − harga = Rp23.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Di pasar, harga 1 kg jeruk Rp40.000. Kamu membayar Rp70.000. Berapa kembaliannya?
  - params: `{"price":40000,"paid":70000}`
  - jawaban: `30000`
  - petunjuk: 1) Cari selisih uang yang dibayar dan harga. 2) Kurangi harga dari uang pembayaran. 3) Kembalian adalah uang dibayar dikurangi harga.
  - penjelasan: Kembalian = uang dibayar − harga = Rp30.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Di pasar, harga 1 kg jeruk Rp70.000. Kamu membayar Rp70.000. Berapa kembaliannya?
  - params: `{"price":70000,"paid":70000}`
  - jawaban: `0`
  - petunjuk: 1) Cari selisih uang yang dibayar dan harga. 2) Kurangi harga dari uang pembayaran. 3) Kembalian adalah uang dibayar dikurangi harga.
  - penjelasan: Kembalian = uang dibayar − harga = Rp0.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Operasi bilangan besar (`operasi-besar`)

#### `whole-add` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=998, bilangan b=216 tidak tampil |

- **Contoh** visual `place-value`: Hitung 998 + 216.
  - params: `{"a":998,"b":216}`
  - jawaban: `1214`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 998 + 216 = 1.214.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 40.084 + 95.095.
  - params: `{"a":40084,"b":95095}`
  - jawaban: `135179`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 40.084 + 95.095 = 135.179.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 8.432 + 90.420.
  - params: `{"a":8432,"b":90420}`
  - jawaban: `98852`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 8.432 + 90.420 = 98.852.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-add` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=93602, bilangan b=42528 tidak tampil |

- **Contoh** visual `place-value`: Hitung 93.602 + 42.528.
  - params: `{"a":93602,"b":42528}`
  - jawaban: `136130`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 93.602 + 42.528 = 136.130.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 83.679 + 85.900.
  - params: `{"a":83679,"b":85900}`
  - jawaban: `169579`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 83.679 + 85.900 = 169.579.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 89.553 + 93.146.
  - params: `{"a":89553,"b":93146}`
  - jawaban: `182699`
  - petunjuk: 1) Sejajarkan satuan dengan satuan. 2) Kerjakan dari kanan ke kiri dan perhatikan simpanan. 3) Jumlahkan kedua bilangan sesuai nilai tempat.
  - penjelasan: 89.553 + 93.146 = 182.699.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-subtract` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=754, bilangan b=736 tidak tampil |

- **Contoh** visual `place-value`: Hitung 754 − 736.
  - params: `{"a":754,"b":736}`
  - jawaban: `18`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 754 dikurangi 736 sama dengan 18.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 50.509 − 29.025.
  - params: `{"a":50509,"b":29025}`
  - jawaban: `21484`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 50.509 dikurangi 29.025 sama dengan 21.484.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 69.994 − 56.367.
  - params: `{"a":69994,"b":56367}`
  - jawaban: `13627`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 69.994 dikurangi 56.367 sama dengan 13.627.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-subtract` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=44013, bilangan b=22433 tidak tampil |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 43773, level 4 = 42176 |

- **Contoh** visual `place-value`: Hitung 44.013 − 22.433.
  - params: `{"a":44013,"b":22433}`
  - jawaban: `21580`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 44.013 dikurangi 22.433 sama dengan 21.580.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 60.043 − 28.639.
  - params: `{"a":60043,"b":28639}`
  - jawaban: `31404`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 60.043 dikurangi 28.639 sama dengan 31.404.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 77.494 − 52.768.
  - params: `{"a":77494,"b":52768}`
  - jawaban: `24726`
  - petunjuk: 1) Sejajarkan angka berdasarkan nilai tempat. 2) Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri. 3) Kurangkan dari kanan ke kiri.
  - penjelasan: 77.494 dikurangi 52.768 sama dengan 24.726.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-multiply` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=90, bilangan b=6 tidak tampil |

- **Contoh** visual `place-value`: Hitung 90 × 6.
  - params: `{"a":90,"b":6}`
  - jawaban: `540`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 90 dikali 6 sama dengan 540.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 605 × 5.
  - params: `{"a":605,"b":5}`
  - jawaban: `3025`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 605 dikali 5 sama dengan 3.025.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 951 × 8.
  - params: `{"a":951,"b":8}`
  - jawaban: `7608`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 951 dikali 8 sama dengan 7.608.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-multiply` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=16, bilangan b=10 tidak tampil |

- **Contoh** visual `place-value`: Hitung 16 × 10.
  - params: `{"a":16,"b":10}`
  - jawaban: `160`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 16 dikali 10 sama dengan 160.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 947 × 5.
  - params: `{"a":947,"b":5}`
  - jawaban: `4735`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 947 dikali 5 sama dengan 4.735.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 827 × 6.
  - params: `{"a":827,"b":6}`
  - jawaban: `4962`
  - petunjuk: 1) Pikirkan sebagai penjumlahan berulang. 2) Kalikan mulai dari satuan. 3) Perhatikan nilai tempat dan simpanan.
  - penjelasan: 827 dikali 6 sama dengan 4.962.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-divide` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | place-value: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |

- **Contoh** visual `place-value`: Hitung 60 ÷ 2.
  - params: `{"dividend":60,"divisor":2}`
  - jawaban: `30`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 60 dibagi 2 sama dengan 30.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 3.655 ÷ 5.
  - params: `{"dividend":3655,"divisor":5}`
  - jawaban: `731`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 3.655 dibagi 5 sama dengan 731.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 1.584 ÷ 6.
  - params: `{"dividend":1584,"divisor":6}`
  - jawaban: `264`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 1.584 dibagi 6 sama dengan 264.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `whole-divide` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | place-value: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 3968, level 4 = 3826 |

- **Contoh** visual `place-value`: Hitung 2.000 ÷ 5.
  - params: `{"dividend":2000,"divisor":5}`
  - jawaban: `400`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 2.000 dibagi 5 sama dengan 400.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 6.468 ÷ 7.
  - params: `{"dividend":6468,"divisor":7}`
  - jawaban: `924`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 6.468 dibagi 7 sama dengan 924.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 3.927 ÷ 11.
  - params: `{"dividend":3927,"divisor":11}`
  - jawaban: `357`
  - petunjuk: 1) Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi. 2) Tentukan berapa kelompok berisi pembagi. 3) Kalikan hasil bagi dengan pembagi untuk memeriksa.
  - penjelasan: 3.927 dibagi 11 sama dengan 357.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: FPB dan KPK (`fpb-kpk`)

#### `factor-list` kelas 5

30 soal dibangkitkan, 19 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 27, level 4 = 24 |

- **Contoh** visual `number-line`: Tuliskan semua faktor dari 37, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":37}`
  - jawaban: `1, 37`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 37.
  - penjelasan: Faktor 37 adalah bilangan yang membagi 37 tanpa sisa: 1, 37.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tuliskan semua faktor dari 15, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":15}`
  - jawaban: `1, 3, 5, 15`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 15.
  - penjelasan: Faktor 15 adalah bilangan yang membagi 15 tanpa sisa: 1, 3, 5, 15.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tuliskan semua faktor dari 16, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":16}`
  - jawaban: `1, 2, 4, 8, 16`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 16.
  - penjelasan: Faktor 16 adalah bilangan yang membagi 16 tanpa sisa: 1, 2, 4, 8, 16.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `factor-list` kelas 6

30 soal dibangkitkan, 19 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |

- **Contoh** visual `number-line`: Tuliskan semua faktor dari 45, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":45}`
  - jawaban: `1, 3, 5, 9, 15, 45`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 45.
  - penjelasan: Faktor 45 adalah bilangan yang membagi 45 tanpa sisa: 1, 3, 5, 9, 15, 45.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tuliskan semua faktor dari 34, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":34}`
  - jawaban: `1, 2, 17, 34`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 34.
  - penjelasan: Faktor 34 adalah bilangan yang membagi 34 tanpa sisa: 1, 2, 17, 34.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tuliskan semua faktor dari 43, urut dari kecil. Pisahkan dengan koma.
  - params: `{"n":43}`
  - jawaban: `1, 43`
  - petunjuk: 1) Coba bagi dengan 1, 2, 3, dan seterusnya. 2) Faktor selalu membagi habis bilangan. 3) Periksa pasangan perkalian yang hasilnya tepat 43.
  - penjelasan: Faktor 43 adalah bilangan yang membagi 43 tanpa sisa: 1, 43.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `prime-check` kelas 5

30 soal dibangkitkan, 24 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 40, level 4 = 26 |

- **Contoh** visual `number-line`: Apakah 46 bilangan prima?
  - params: `{"n":46}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Bukan`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 46 memiliki faktor selain 1 dan dirinya sendiri.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Apakah 45 bilangan prima?
  - params: `{"n":45}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Bukan`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 45 memiliki faktor selain 1 dan dirinya sendiri.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Apakah 45 bilangan prima?
  - params: `{"n":45}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Bukan`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 45 memiliki faktor selain 1 dan dirinya sendiri.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `prime-check` kelas 6

30 soal dibangkitkan, 23 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |

- **Contoh** visual `number-line`: Apakah 29 bilangan prima?
  - params: `{"n":29}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Ya`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 29 hanya punya dua faktor: 1 dan 29.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Apakah 23 bilangan prima?
  - params: `{"n":23}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Ya`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 23 hanya punya dua faktor: 1 dan 23.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Apakah 26 bilangan prima?
  - params: `{"n":26}`
  - pilihan: `Ya`, `Bukan`
  - jawaban: `Bukan`
  - petunjuk: 1) Bilangan prima punya tepat dua faktor. 2) Coba bagi dengan bilangan kecil selain 1. 3) Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.
  - penjelasan: 26 memiliki faktor selain 1 dan dirinya sendiri.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `gcd` kelas 5

30 soal dibangkitkan, 30 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `number-line`: Tentukan FPB dari 26 dan 21.
  - params: `{"a":26,"b":21}`
  - jawaban: `1`
  - petunjuk: 1) Tuliskan faktor dari kedua bilangan. 2) Cari faktor yang muncul di kedua daftar. 3) Pilih faktor persekutuan yang paling besar.
  - penjelasan: Faktor terbesar yang membagi keduanya adalah 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tentukan FPB dari 21 dan 29.
  - params: `{"a":21,"b":29}`
  - jawaban: `1`
  - petunjuk: 1) Tuliskan faktor dari kedua bilangan. 2) Cari faktor yang muncul di kedua daftar. 3) Pilih faktor persekutuan yang paling besar.
  - penjelasan: Faktor terbesar yang membagi keduanya adalah 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tentukan FPB dari 41 dan 47.
  - params: `{"a":41,"b":47}`
  - jawaban: `1`
  - petunjuk: 1) Tuliskan faktor dari kedua bilangan. 2) Cari faktor yang muncul di kedua daftar. 3) Pilih faktor persekutuan yang paling besar.
  - penjelasan: Faktor terbesar yang membagi keduanya adalah 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `gcd` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 33, level 4 = 33 |

- **Contoh** visual `number-line`: Tentukan FPB dari 24 dan 14.
  - params: `{"a":24,"b":14}`
  - jawaban: `2`
  - petunjuk: 1) Tuliskan faktor dari kedua bilangan. 2) Cari faktor yang muncul di kedua daftar. 3) Pilih faktor persekutuan yang paling besar.
  - penjelasan: Faktor terbesar yang membagi keduanya adalah 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tentukan FPB dari 13 dan 44.
  - params: `{"a":13,"b":44}`
  - jawaban: `1`
  - petunjuk: 1) Tuliskan faktor dari kedua bilangan. 2) Cari faktor yang muncul di kedua daftar. 3) Pilih faktor persekutuan yang paling besar.
  - penjelasan: Faktor terbesar yang membagi keduanya adalah 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tentukan FPB dari 43 dan 46.
  - params: `{"a":43,"b":46}`
  - jawaban: `1`
  - petunjuk: 1) Tuliskan faktor dari kedua bilangan. 2) Cari faktor yang muncul di kedua daftar. 3) Pilih faktor persekutuan yang paling besar.
  - penjelasan: Faktor terbesar yang membagi keduanya adalah 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `lcm` kelas 5

30 soal dibangkitkan, 28 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `number-line`: Tentukan KPK dari 11 dan 11.
  - params: `{"a":11,"b":11}`
  - jawaban: `11`
  - petunjuk: 1) Tuliskan beberapa kelipatan dari masing-masing bilangan. 2) Cari angka yang muncul di kedua daftar. 3) Pilih kelipatan bersama yang paling kecil.
  - penjelasan: Kelipatan persekutuan terkecil dari 11 dan 11 adalah 11.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tentukan KPK dari 3 dan 11.
  - params: `{"a":3,"b":11}`
  - jawaban: `33`
  - petunjuk: 1) Tuliskan beberapa kelipatan dari masing-masing bilangan. 2) Cari angka yang muncul di kedua daftar. 3) Pilih kelipatan bersama yang paling kecil.
  - penjelasan: Kelipatan persekutuan terkecil dari 3 dan 11 adalah 33.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tentukan KPK dari 4 dan 9.
  - params: `{"a":4,"b":9}`
  - jawaban: `36`
  - petunjuk: 1) Tuliskan beberapa kelipatan dari masing-masing bilangan. 2) Cari angka yang muncul di kedua daftar. 3) Pilih kelipatan bersama yang paling kecil.
  - penjelasan: Kelipatan persekutuan terkecil dari 4 dan 9 adalah 36.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `lcm` kelas 6

30 soal dibangkitkan, 24 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 11, level 4 = 9 |

- **Contoh** visual `number-line`: Tentukan KPK dari 11 dan 9.
  - params: `{"a":11,"b":9}`
  - jawaban: `99`
  - petunjuk: 1) Tuliskan beberapa kelipatan dari masing-masing bilangan. 2) Cari angka yang muncul di kedua daftar. 3) Pilih kelipatan bersama yang paling kecil.
  - penjelasan: Kelipatan persekutuan terkecil dari 11 dan 9 adalah 99.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tentukan KPK dari 7 dan 12.
  - params: `{"a":7,"b":12}`
  - jawaban: `84`
  - petunjuk: 1) Tuliskan beberapa kelipatan dari masing-masing bilangan. 2) Cari angka yang muncul di kedua daftar. 3) Pilih kelipatan bersama yang paling kecil.
  - penjelasan: Kelipatan persekutuan terkecil dari 7 dan 12 adalah 84.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Tentukan KPK dari 9 dan 8.
  - params: `{"a":9,"b":8}`
  - jawaban: `72`
  - petunjuk: 1) Tuliskan beberapa kelipatan dari masing-masing bilangan. 2) Cari angka yang muncul di kedua daftar. 3) Pilih kelipatan bersama yang paling kecil.
  - penjelasan: Kelipatan persekutuan terkecil dari 9 dan 8 adalah 72.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Pecahan dan operasinya (`pecahan-operasi`)

#### `fraction-identify` kelas 5

30 soal dibangkitkan, 11 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 6, level 4 = 5 |

- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 8 bagian sama besar. Ada 1 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":1,"d":8}`
  - jawaban: `1/8`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 1, seluruh bagian ada 8. Jadi pecahannya 1/8.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu
- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 4 bagian sama besar. Ada 1 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":1,"d":4}`
  - jawaban: `1/4`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 1, seluruh bagian ada 4. Jadi pecahannya 1/4.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu
- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 5 bagian sama besar. Ada 1 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":1,"d":5}`
  - jawaban: `1/5`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 1, seluruh bagian ada 5. Jadi pecahannya 1/5.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu

#### `fraction-identify` kelas 6

30 soal dibangkitkan, 12 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 4 bagian sama besar. Ada 3 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":3,"d":4}`
  - jawaban: `3/4`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 3, seluruh bagian ada 4. Jadi pecahannya 3/4.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu
- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 6 bagian sama besar. Ada 1 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":1,"d":6}`
  - jawaban: `1/6`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 1, seluruh bagian ada 6. Jadi pecahannya 1/6.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu
- **Contoh** visual `fraction-bar`: Sebuah batang dibagi menjadi 4 bagian sama besar. Ada 3 bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?
  - params: `{"n":3,"d":4}`
  - jawaban: `3/4`
  - petunjuk: 1) Hitung dulu ada berapa bagian seluruhnya. 2) Angka bawah (penyebut) = jumlah seluruh bagian sama besar. 3) Angka atas (pembilang) = jumlah bagian yang diarsir.
  - penjelasan: Bagian yang diarsir ada 3, seluruh bagian ada 4. Jadi pecahannya 3/4.
  - langkah Biji: Hitung semua bagiannya > Hitung bagian yang diarsir > Tulis pecahannya > Jawabanmu

#### `fraction-compare` kelas 5

30 soal dibangkitkan, 30 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 5/7 atau B: 2/5?
  - params: `{"a":5,"b":7,"c":2,"d":5}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 5 × 5 = 25, sedangkan 2 × 7 = 14.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 1/7 atau B: 2/3?
  - params: `{"a":1,"b":7,"c":2,"d":3}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 1 × 3 = 3, sedangkan 2 × 7 = 14.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 2/5 atau B: 2/4?
  - params: `{"a":2,"b":5,"c":2,"d":4}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 2 × 4 = 8, sedangkan 2 × 5 = 10.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu

#### `fraction-compare` kelas 6

30 soal dibangkitkan, 28 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 4/5 atau B: 1/8?
  - params: `{"a":4,"b":5,"c":1,"d":8}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 4 × 8 = 32, sedangkan 1 × 5 = 5.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 5/8 atau B: 2/5?
  - params: `{"a":5,"b":8,"c":2,"d":5}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 5 × 5 = 25, sedangkan 2 × 8 = 16.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan mana yang lebih besar? A: 2/4 atau B: 3/5?
  - params: `{"a":2,"b":4,"c":3,"d":5}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Bayangkan dua bar pecahan dengan ukuran utuh yang sama. 2) Samakan penyebut atau bandingkan hasil kali silang. 3) Pilih pecahan dengan nilai lebih besar.
  - penjelasan: Kalikan silang: 2 × 5 = 10, sedangkan 3 × 4 = 12.
  - langkah Biji: Penyebutnya beda > Samakan penyebut > Ubah kedua pecahan > Lihat pembilangnya > Jawabanmu

#### `fraction-order` kelas 5

30 soal dibangkitkan, 28 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `PILIHAN-GANDA-SAMA` | 21 | pilihan duplikat [1/10 – 4/10 – 9/10 \| 1/10 – 4/10 – 9/10 \| 9/10 – 4/10 – 1/10] |

- **Contoh** visual `fraction-bar`: Urutkan dari terkecil: 1/10, 4/10, 9/10.
  - params: `{"nums":[1,4,9],"d":10}`
  - pilihan: `1/10 – 4/10 – 9/10`, `1/10 – 4/10 – 9/10`, `9/10 – 4/10 – 1/10`
  - jawaban: `1/10 – 4/10 – 9/10`
  - petunjuk: 1) Semua pecahan memiliki penyebut sama. 2) Bandingkan pembilangnya. 3) Urutkan pembilang dari kecil ke besar.
  - penjelasan: Penyebut sama, jadi urutkan pembilangnya: 1/10 – 4/10 – 9/10.
  - langkah Biji: Lihat penyebut > Bandingkan pembilang > Urutkan > Jawabanmu
- **Contoh** visual `fraction-bar`: Urutkan dari terkecil: 8/10, 1/10, 9/10.
  - params: `{"nums":[8,1,9],"d":10}`
  - pilihan: `1/10 – 8/10 – 9/10`, `9/10 – 8/10 – 1/10`, `8/10 – 1/10 – 9/10`
  - jawaban: `1/10 – 8/10 – 9/10`
  - petunjuk: 1) Semua pecahan memiliki penyebut sama. 2) Bandingkan pembilangnya. 3) Urutkan pembilang dari kecil ke besar.
  - penjelasan: Penyebut sama, jadi urutkan pembilangnya: 1/10 – 8/10 – 9/10.
  - langkah Biji: Lihat penyebut > Bandingkan pembilang > Urutkan > Jawabanmu
- **Contoh** visual `fraction-bar`: Urutkan dari terkecil: 9/10, 3/10, 1/10.
  - params: `{"nums":[9,3,1],"d":10}`
  - pilihan: `1/10 – 3/10 – 9/10`, `9/10 – 3/10 – 1/10`, `9/10 – 3/10 – 1/10`
  - jawaban: `1/10 – 3/10 – 9/10`
  - petunjuk: 1) Semua pecahan memiliki penyebut sama. 2) Bandingkan pembilangnya. 3) Urutkan pembilang dari kecil ke besar.
  - penjelasan: Penyebut sama, jadi urutkan pembilangnya: 1/10 – 3/10 – 9/10.
  - langkah Biji: Lihat penyebut > Bandingkan pembilang > Urutkan > Jawabanmu

#### `fraction-order` kelas 6

30 soal dibangkitkan, 19 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `PILIHAN-GANDA-SAMA` | 25 | pilihan duplikat [5/6 – 2/6 – 1/6 \| 5/6 – 2/6 – 1/6 \| 1/6 – 2/6 – 5/6] |

- **Contoh** visual `fraction-bar`: Urutkan dari terkecil: 2/4, 1/4, 3/4.
  - params: `{"nums":[2,1,3],"d":4}`
  - pilihan: `3/4 – 2/4 – 1/4`, `2/4 – 1/4 – 3/4`, `1/4 – 2/4 – 3/4`
  - jawaban: `1/4 – 2/4 – 3/4`
  - petunjuk: 1) Semua pecahan memiliki penyebut sama. 2) Bandingkan pembilangnya. 3) Urutkan pembilang dari kecil ke besar.
  - penjelasan: Penyebut sama, jadi urutkan pembilangnya: 1/4 – 2/4 – 3/4.
  - langkah Biji: Lihat penyebut > Bandingkan pembilang > Urutkan > Jawabanmu
- **Contoh** visual `fraction-bar`: Urutkan dari terkecil: 2/10, 1/10, 9/10.
  - params: `{"nums":[2,1,9],"d":10}`
  - pilihan: `1/10 – 2/10 – 9/10`, `9/10 – 2/10 – 1/10`, `2/10 – 1/10 – 9/10`
  - jawaban: `1/10 – 2/10 – 9/10`
  - petunjuk: 1) Semua pecahan memiliki penyebut sama. 2) Bandingkan pembilangnya. 3) Urutkan pembilang dari kecil ke besar.
  - penjelasan: Penyebut sama, jadi urutkan pembilangnya: 1/10 – 2/10 – 9/10.
  - langkah Biji: Lihat penyebut > Bandingkan pembilang > Urutkan > Jawabanmu
- **Contoh** visual `fraction-bar`: Urutkan dari terkecil: 1/8, 6/8, 7/8.
  - params: `{"nums":[1,6,7],"d":8}`
  - pilihan: `7/8 – 6/8 – 1/8`, `1/8 – 6/8 – 7/8`, `1/8 – 6/8 – 7/8`
  - jawaban: `1/8 – 6/8 – 7/8`
  - petunjuk: 1) Semua pecahan memiliki penyebut sama. 2) Bandingkan pembilangnya. 3) Urutkan pembilang dari kecil ke besar.
  - penjelasan: Penyebut sama, jadi urutkan pembilangnya: 1/8 – 6/8 – 7/8.
  - langkah Biji: Lihat penyebut > Bandingkan pembilang > Urutkan > Jawabanmu

#### `fraction-equivalent` kelas 5

30 soal dibangkitkan, 22 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 14, level 4 = 13 |

- **Contoh** visual `fraction-bar`: Pecahan senilai: 2/6 = ?/24. Berapa angka yang hilang?
  - params: `{"n":2,"d":6,"factor":4}`
  - jawaban: `8`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 2 dengan 4.
  - penjelasan: Pembilang dan penyebut dikali 4, jadi pembilang baru 8.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan senilai: 4/5 = ?/10. Berapa angka yang hilang?
  - params: `{"n":4,"d":5,"factor":2}`
  - jawaban: `8`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 4 dengan 2.
  - penjelasan: Pembilang dan penyebut dikali 2, jadi pembilang baru 8.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan senilai: 2/5 = ?/20. Berapa angka yang hilang?
  - params: `{"n":2,"d":5,"factor":4}`
  - jawaban: `8`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 2 dengan 4.
  - penjelasan: Pembilang dan penyebut dikali 4, jadi pembilang baru 8.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu

#### `fraction-equivalent` kelas 6

30 soal dibangkitkan, 21 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Pecahan senilai: 1/5 = ?/10. Berapa angka yang hilang?
  - params: `{"n":1,"d":5,"factor":2}`
  - jawaban: `2`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 1 dengan 2.
  - penjelasan: Pembilang dan penyebut dikali 2, jadi pembilang baru 2.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan senilai: 3/5 = ?/15. Berapa angka yang hilang?
  - params: `{"n":3,"d":5,"factor":3}`
  - jawaban: `9`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 3 dengan 3.
  - penjelasan: Pembilang dan penyebut dikali 3, jadi pembilang baru 9.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Pecahan senilai: 4/6 = ?/18. Berapa angka yang hilang?
  - params: `{"n":4,"d":6,"factor":3}`
  - jawaban: `12`
  - petunjuk: 1) Pecahan senilai memiliki nilai yang sama. 2) Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu. 3) Kalikan 4 dengan 3.
  - penjelasan: Pembilang dan penyebut dikali 3, jadi pembilang baru 12.
  - langkah Biji: Lihat penyebutnya > Cari kali berapa > Atas ikut dikali > Hasil > Jawabanmu

#### `fraction-simplify` kelas 5

30 soal dibangkitkan, 26 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 33, level 4 = 26 |

- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 28/40.
  - params: `{"n":28,"d":40}`
  - jawaban: `7/10`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 25/50.
  - params: `{"n":25,"d":50}`
  - jawaban: `1/2`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 18/30.
  - params: `{"n":18,"d":30}`
  - jawaban: `3/5`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu

#### `fraction-simplify` kelas 6

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 30, level 4 = 20 |

- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 8/12.
  - params: `{"n":8,"d":12}`
  - jawaban: `2/3`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 20/45.
  - params: `{"n":20,"d":45}`
  - jawaban: `4/9`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu
- **Contoh** visual `fraction-bar`: Sederhanakan pecahan 9/21.
  - params: `{"n":9,"d":21}`
  - jawaban: `3/7`
  - petunjuk: 1) Cari bilangan yang dapat membagi pembilang dan penyebut. 2) Bagi keduanya dengan bilangan yang sama. 3) Ulangi sampai tidak ada faktor persekutuan selain 1.
  - penjelasan: Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.
  - langkah Biji: Cari pembagi bersama > Bagi atas > Bagi bawah > Hasil > Jawabanmu

#### `fraction-add-same` kelas 5

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `BATANG-SEMPIT` | 30 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8) |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 7, level 4 = 7 |

- **Contoh** visual `fraction-bar`: Hitung 2/10 + 7/10.
  - params: `{"a":2,"b":7,"d":10}`
  - jawaban: `9/10`
  - petunjuk: 1) Penyebut kedua pecahan sama. 2) Ukuran potongannya sama, jadi jumlahkan pembilang. 3) Penyebut tetap, pembilang dijumlahkan.
  - penjelasan: Penyebut tetap 10; jumlahkan pembilang: 2 + 7 = 9.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 4/8 + 4/8.
  - params: `{"a":4,"b":4,"d":8}`
  - jawaban: `1`
  - petunjuk: 1) Penyebut kedua pecahan sama. 2) Ukuran potongannya sama, jadi jumlahkan pembilang. 3) Penyebut tetap, pembilang dijumlahkan.
  - penjelasan: Penyebut tetap 8; jumlahkan pembilang: 4 + 4 = 8.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Sederhanakan > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/8 + 1/8.
  - params: `{"a":3,"b":1,"d":8}`
  - jawaban: `1/2`
  - petunjuk: 1) Penyebut kedua pecahan sama. 2) Ukuran potongannya sama, jadi jumlahkan pembilang. 3) Penyebut tetap, pembilang dijumlahkan.
  - penjelasan: Penyebut tetap 8; jumlahkan pembilang: 3 + 1 = 4.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Sederhanakan > Jawabanmu

#### `fraction-add-same` kelas 6

30 soal dibangkitkan, 26 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `BATANG-SEMPIT` | 30 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8) |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 7, level 4 = 6 |

- **Contoh** visual `fraction-bar`: Hitung 5/9 + 2/9.
  - params: `{"a":5,"b":2,"d":9}`
  - jawaban: `7/9`
  - petunjuk: 1) Penyebut kedua pecahan sama. 2) Ukuran potongannya sama, jadi jumlahkan pembilang. 3) Penyebut tetap, pembilang dijumlahkan.
  - penjelasan: Penyebut tetap 9; jumlahkan pembilang: 5 + 2 = 7.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 4/9 + 5/9.
  - params: `{"a":4,"b":5,"d":9}`
  - jawaban: `1`
  - petunjuk: 1) Penyebut kedua pecahan sama. 2) Ukuran potongannya sama, jadi jumlahkan pembilang. 3) Penyebut tetap, pembilang dijumlahkan.
  - penjelasan: Penyebut tetap 9; jumlahkan pembilang: 4 + 5 = 9.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Sederhanakan > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/5 + 1/5.
  - params: `{"a":3,"b":1,"d":5}`
  - jawaban: `4/5`
  - petunjuk: 1) Penyebut kedua pecahan sama. 2) Ukuran potongannya sama, jadi jumlahkan pembilang. 3) Penyebut tetap, pembilang dijumlahkan.
  - penjelasan: Penyebut tetap 5; jumlahkan pembilang: 3 + 1 = 4.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu

#### `fraction-word-add` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `BATANG-SEMPIT` | 30 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8) |

- **Contoh** visual `fraction-bar`: Ibu membuat satu kue yang dibagi jadi 6 bagian sama besar. Dewi makan 2/6 bagian dan Citra makan 3/6 bagian. Berapa bagian kue yang sudah dimakan?
  - params: `{"a":2,"b":3,"d":6}`
  - jawaban: `5/6`
  - petunjuk: 1) Cerita ini meminta kita menggabungkan dua bagian. Operasinya penjumlahan. 2) Penyebutnya sama, jadi tinggal jumlahkan pembilang. 3) Tulis hasilnya dengan penyebut yang sama.
  - penjelasan: Dimakan 2 potong + 3 potong = 5 potong dari 6 potong, yaitu 5/6.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Ibu membuat satu roti panjang yang dibagi jadi 7 bagian sama besar. Adi makan 3/7 bagian dan Budi makan 3/7 bagian. Berapa bagian roti panjang yang sudah dimakan?
  - params: `{"a":3,"b":3,"d":7}`
  - jawaban: `6/7`
  - petunjuk: 1) Cerita ini meminta kita menggabungkan dua bagian. Operasinya penjumlahan. 2) Penyebutnya sama, jadi tinggal jumlahkan pembilang. 3) Tulis hasilnya dengan penyebut yang sama.
  - penjelasan: Dimakan 3 potong + 3 potong = 6 potong dari 7 potong, yaitu 6/7.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Ibu membuat satu pizza yang dibagi jadi 7 bagian sama besar. Fani makan 4/7 bagian dan Hana makan 1/7 bagian. Berapa bagian pizza yang sudah dimakan?
  - params: `{"a":4,"b":1,"d":7}`
  - jawaban: `5/7`
  - petunjuk: 1) Cerita ini meminta kita menggabungkan dua bagian. Operasinya penjumlahan. 2) Penyebutnya sama, jadi tinggal jumlahkan pembilang. 3) Tulis hasilnya dengan penyebut yang sama.
  - penjelasan: Dimakan 4 potong + 1 potong = 5 potong dari 7 potong, yaitu 5/7.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu

#### `fraction-word-add` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `BATANG-SEMPIT` | 30 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8) |

- **Contoh** visual `fraction-bar`: Ibu membuat satu kue yang dibagi jadi 8 bagian sama besar. Gita makan 6/8 bagian dan Hana makan 1/8 bagian. Berapa bagian kue yang sudah dimakan?
  - params: `{"a":6,"b":1,"d":8}`
  - jawaban: `7/8`
  - petunjuk: 1) Cerita ini meminta kita menggabungkan dua bagian. Operasinya penjumlahan. 2) Penyebutnya sama, jadi tinggal jumlahkan pembilang. 3) Tulis hasilnya dengan penyebut yang sama.
  - penjelasan: Dimakan 6 potong + 1 potong = 7 potong dari 8 potong, yaitu 7/8.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Ibu membuat satu semangka yang dibagi jadi 10 bagian sama besar. Citra makan 4/10 bagian dan Eko makan 5/10 bagian. Berapa bagian semangka yang sudah dimakan?
  - params: `{"a":4,"b":5,"d":10}`
  - jawaban: `9/10`
  - petunjuk: 1) Cerita ini meminta kita menggabungkan dua bagian. Operasinya penjumlahan. 2) Penyebutnya sama, jadi tinggal jumlahkan pembilang. 3) Tulis hasilnya dengan penyebut yang sama.
  - penjelasan: Dimakan 4 potong + 5 potong = 9 potong dari 10 potong, yaitu 9/10.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Ibu membuat satu kue yang dibagi jadi 10 bagian sama besar. Adi makan 8/10 bagian dan Dewi makan 1/10 bagian. Berapa bagian kue yang sudah dimakan?
  - params: `{"a":8,"b":1,"d":10}`
  - jawaban: `9/10`
  - petunjuk: 1) Cerita ini meminta kita menggabungkan dua bagian. Operasinya penjumlahan. 2) Penyebutnya sama, jadi tinggal jumlahkan pembilang. 3) Tulis hasilnya dengan penyebut yang sama.
  - penjelasan: Dimakan 8 potong + 1 potong = 9 potong dari 10 potong, yaitu 9/10.
  - langkah Biji: Lihat penyebutnya > Jumlahkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu

#### `fraction-subtract-same` kelas 5

30 soal dibangkitkan, 24 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `BATANG-SEMPIT` | 30 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8) |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 8 |

- **Contoh** visual `fraction-bar`: Hitung 4/8 − 2/8.
  - params: `{"a":4,"b":2,"d":8}`
  - jawaban: `1/4`
  - petunjuk: 1) Lihat penyebutnya. Kalau sama, potongannya sama besar. 2) Kurangkan pembilangnya saja. 3) Penyebut tidak berubah. Sederhanakan kalau bisa.
  - penjelasan: Penyebut sama (8), jadi kurangkan pembilangnya: 4 − 2 = 2. Hasilnya 2/8, lalu disederhanakan menjadi 1/4.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Sederhanakan > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/10 − 2/10.
  - params: `{"a":3,"b":2,"d":10}`
  - jawaban: `1/10`
  - petunjuk: 1) Lihat penyebutnya. Kalau sama, potongannya sama besar. 2) Kurangkan pembilangnya saja. 3) Penyebut tidak berubah. Sederhanakan kalau bisa.
  - penjelasan: Penyebut sama (10), jadi kurangkan pembilangnya: 3 − 2 = 1. Hasilnya 1/10.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/5 − 1/5.
  - params: `{"a":3,"b":1,"d":5}`
  - jawaban: `2/5`
  - petunjuk: 1) Lihat penyebutnya. Kalau sama, potongannya sama besar. 2) Kurangkan pembilangnya saja. 3) Penyebut tidak berubah. Sederhanakan kalau bisa.
  - penjelasan: Penyebut sama (5), jadi kurangkan pembilangnya: 3 − 1 = 2. Hasilnya 2/5.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu

#### `fraction-subtract-same` kelas 6

30 soal dibangkitkan, 21 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `BATANG-SEMPIT` | 30 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8) |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 7, level 4 = 6 |

- **Contoh** visual `fraction-bar`: Hitung 4/6 − 3/6.
  - params: `{"a":4,"b":3,"d":6}`
  - jawaban: `1/6`
  - petunjuk: 1) Lihat penyebutnya. Kalau sama, potongannya sama besar. 2) Kurangkan pembilangnya saja. 3) Penyebut tidak berubah. Sederhanakan kalau bisa.
  - penjelasan: Penyebut sama (6), jadi kurangkan pembilangnya: 4 − 3 = 1. Hasilnya 1/6.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/5 − 1/5.
  - params: `{"a":3,"b":1,"d":5}`
  - jawaban: `2/5`
  - petunjuk: 1) Lihat penyebutnya. Kalau sama, potongannya sama besar. 2) Kurangkan pembilangnya saja. 3) Penyebut tidak berubah. Sederhanakan kalau bisa.
  - penjelasan: Penyebut sama (5), jadi kurangkan pembilangnya: 3 − 1 = 2. Hasilnya 2/5.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 8/9 − 1/9.
  - params: `{"a":8,"b":1,"d":9}`
  - jawaban: `7/9`
  - petunjuk: 1) Lihat penyebutnya. Kalau sama, potongannya sama besar. 2) Kurangkan pembilangnya saja. 3) Penyebut tidak berubah. Sederhanakan kalau bisa.
  - penjelasan: Penyebut sama (9), jadi kurangkan pembilangnya: 8 − 1 = 7. Hasilnya 7/9.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu

#### `fraction-word-subtract` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `BATANG-SEMPIT` | 30 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8) |
| sedang | `SOAL-BOCOR` | 2 | soal sudah memuat jawaban "2/5" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 6 |

- **Contoh** visual `fraction-bar`: Di piring ada 4/8 bagian cokelat batang. Fani memakan 3/8 bagian. Berapa bagian cokelat batang yang tersisa di piring?
  - params: `{"a":4,"b":3,"d":8}`
  - jawaban: `1/8`
  - petunjuk: 1) Kata "tersisa" berarti kita mengurangi. 2) Penyebutnya sama, kurangkan pembilangnya saja. 3) Penyebut tetap sama.
  - penjelasan: Tersisa 4 potong − 3 potong = 1 potong dari 8 potong, yaitu 1/8.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Di piring ada 6/8 bagian kue. Hana memakan 5/8 bagian. Berapa bagian kue yang tersisa di piring?
  - params: `{"a":6,"b":5,"d":8}`
  - jawaban: `1/8`
  - petunjuk: 1) Kata "tersisa" berarti kita mengurangi. 2) Penyebutnya sama, kurangkan pembilangnya saja. 3) Penyebut tetap sama.
  - penjelasan: Tersisa 6 potong − 5 potong = 1 potong dari 8 potong, yaitu 1/8.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Di piring ada 3/6 bagian pizza. Eko memakan 2/6 bagian. Berapa bagian pizza yang tersisa di piring?
  - params: `{"a":3,"b":2,"d":6}`
  - jawaban: `1/6`
  - petunjuk: 1) Kata "tersisa" berarti kita mengurangi. 2) Penyebutnya sama, kurangkan pembilangnya saja. 3) Penyebut tetap sama.
  - penjelasan: Tersisa 3 potong − 2 potong = 1 potong dari 6 potong, yaitu 1/6.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu

#### `fraction-word-subtract` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `BATANG-SEMPIT` | 30 | batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8) |
| sedang | `SOAL-BOCOR` | 2 | soal sudah memuat jawaban "3/10" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 9, level 4 = 7 |

- **Contoh** visual `fraction-bar`: Di piring ada 5/7 bagian pizza. Adi memakan 2/7 bagian. Berapa bagian pizza yang tersisa di piring?
  - params: `{"a":5,"b":2,"d":7}`
  - jawaban: `3/7`
  - petunjuk: 1) Kata "tersisa" berarti kita mengurangi. 2) Penyebutnya sama, kurangkan pembilangnya saja. 3) Penyebut tetap sama.
  - penjelasan: Tersisa 5 potong − 2 potong = 3 potong dari 7 potong, yaitu 3/7.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Di piring ada 4/9 bagian cokelat batang. Citra memakan 3/9 bagian. Berapa bagian cokelat batang yang tersisa di piring?
  - params: `{"a":4,"b":3,"d":9}`
  - jawaban: `1/9`
  - petunjuk: 1) Kata "tersisa" berarti kita mengurangi. 2) Penyebutnya sama, kurangkan pembilangnya saja. 3) Penyebut tetap sama.
  - penjelasan: Tersisa 4 potong − 3 potong = 1 potong dari 9 potong, yaitu 1/9.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Di piring ada 3/7 bagian cokelat batang. Gita memakan 1/7 bagian. Berapa bagian cokelat batang yang tersisa di piring?
  - params: `{"a":3,"b":1,"d":7}`
  - jawaban: `2/7`
  - petunjuk: 1) Kata "tersisa" berarti kita mengurangi. 2) Penyebutnya sama, kurangkan pembilangnya saja. 3) Penyebut tetap sama.
  - penjelasan: Tersisa 3 potong − 1 potong = 2 potong dari 7 potong, yaitu 2/7.
  - langkah Biji: Lihat penyebutnya > Kurangkan pembilang > Penyebut tetap > Cek lagi > Jawabanmu

#### `fraction-add-different` kelas 5

30 soal dibangkitkan, 25 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Hitung 2/4 + 2/6.
  - params: `{"a":2,"d1":4,"b":2,"d2":6}`
  - jawaban: `5/6`
  - petunjuk: 1) Penyebut berbeda, artinya ukuran potongannya juga berbeda. 2) Ubah keduanya jadi pecahan senilai dengan penyebut yang sama. 3) Setelah penyebutnya sama, jumlahkan pembilangnya. Penyebut tetap.
  - penjelasan: Samakan penyebut terlebih dahulu, lalu jumlahkan pembilangnya.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Jumlahkan > Sederhanakan > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 1/4 + 1/3.
  - params: `{"a":1,"d1":4,"b":1,"d2":3}`
  - jawaban: `7/12`
  - petunjuk: 1) Penyebut berbeda, artinya ukuran potongannya juga berbeda. 2) Ubah keduanya jadi pecahan senilai dengan penyebut yang sama. 3) Setelah penyebutnya sama, jumlahkan pembilangnya. Penyebut tetap.
  - penjelasan: Samakan penyebut terlebih dahulu, lalu jumlahkan pembilangnya.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Jumlahkan > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/6 + 2/5.
  - params: `{"a":3,"d1":6,"b":2,"d2":5}`
  - jawaban: `9/10`
  - petunjuk: 1) Penyebut berbeda, artinya ukuran potongannya juga berbeda. 2) Ubah keduanya jadi pecahan senilai dengan penyebut yang sama. 3) Setelah penyebutnya sama, jumlahkan pembilangnya. Penyebut tetap.
  - penjelasan: Samakan penyebut terlebih dahulu, lalu jumlahkan pembilangnya.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Jumlahkan > Sederhanakan > Jawabanmu

#### `fraction-add-different` kelas 6

30 soal dibangkitkan, 19 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 5, level 4 = 5 |

- **Contoh** visual `fraction-bar`: Hitung 1/2 + 2/6.
  - params: `{"a":1,"d1":2,"b":2,"d2":6}`
  - jawaban: `5/6`
  - petunjuk: 1) Penyebut berbeda, artinya ukuran potongannya juga berbeda. 2) Ubah keduanya jadi pecahan senilai dengan penyebut yang sama. 3) Setelah penyebutnya sama, jumlahkan pembilangnya. Penyebut tetap.
  - penjelasan: Samakan penyebut terlebih dahulu, lalu jumlahkan pembilangnya.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Jumlahkan > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/5 + 1/3.
  - params: `{"a":3,"d1":5,"b":1,"d2":3}`
  - jawaban: `14/15`
  - petunjuk: 1) Penyebut berbeda, artinya ukuran potongannya juga berbeda. 2) Ubah keduanya jadi pecahan senilai dengan penyebut yang sama. 3) Setelah penyebutnya sama, jumlahkan pembilangnya. Penyebut tetap.
  - penjelasan: Samakan penyebut terlebih dahulu, lalu jumlahkan pembilangnya.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Jumlahkan > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 1/2 + 2/5.
  - params: `{"a":1,"d1":2,"b":2,"d2":5}`
  - jawaban: `9/10`
  - petunjuk: 1) Penyebut berbeda, artinya ukuran potongannya juga berbeda. 2) Ubah keduanya jadi pecahan senilai dengan penyebut yang sama. 3) Setelah penyebutnya sama, jumlahkan pembilangnya. Penyebut tetap.
  - penjelasan: Samakan penyebut terlebih dahulu, lalu jumlahkan pembilangnya.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Jumlahkan > Cek lagi > Jawabanmu

#### `fraction-subtract-different` kelas 5

30 soal dibangkitkan, 23 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Hitung 4/6 − 1/2.
  - params: `{"a":4,"d1":6,"b":1,"d2":2}`
  - jawaban: `1/6`
  - petunjuk: 1) Pastikan pecahan pertama lebih besar. 2) Samakan penyebut dengan pecahan senilai. 3) Kurangkan pembilang dan pertahankan penyebut yang sama.
  - penjelasan: Samakan penyebut, lalu kurangkan pembilang.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Kurangkan > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/5 − 1/2.
  - params: `{"a":3,"d1":5,"b":1,"d2":2}`
  - jawaban: `1/10`
  - petunjuk: 1) Pastikan pecahan pertama lebih besar. 2) Samakan penyebut dengan pecahan senilai. 3) Kurangkan pembilang dan pertahankan penyebut yang sama.
  - penjelasan: Samakan penyebut, lalu kurangkan pembilang.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Kurangkan > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 4/5 − 2/4.
  - params: `{"a":4,"d1":5,"b":2,"d2":4}`
  - jawaban: `3/10`
  - petunjuk: 1) Pastikan pecahan pertama lebih besar. 2) Samakan penyebut dengan pecahan senilai. 3) Kurangkan pembilang dan pertahankan penyebut yang sama.
  - penjelasan: Samakan penyebut, lalu kurangkan pembilang.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Kurangkan > Sederhanakan > Jawabanmu

#### `fraction-subtract-different` kelas 6

30 soal dibangkitkan, 23 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Hitung 3/5 − 1/3.
  - params: `{"a":3,"d1":5,"b":1,"d2":3}`
  - jawaban: `4/15`
  - petunjuk: 1) Pastikan pecahan pertama lebih besar. 2) Samakan penyebut dengan pecahan senilai. 3) Kurangkan pembilang dan pertahankan penyebut yang sama.
  - penjelasan: Samakan penyebut, lalu kurangkan pembilang.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Kurangkan > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 4/5 − 2/4.
  - params: `{"a":4,"d1":5,"b":2,"d2":4}`
  - jawaban: `3/10`
  - petunjuk: 1) Pastikan pecahan pertama lebih besar. 2) Samakan penyebut dengan pecahan senilai. 3) Kurangkan pembilang dan pertahankan penyebut yang sama.
  - penjelasan: Samakan penyebut, lalu kurangkan pembilang.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Kurangkan > Sederhanakan > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 3/6 − 1/3.
  - params: `{"a":3,"d1":6,"b":1,"d2":3}`
  - jawaban: `1/6`
  - petunjuk: 1) Pastikan pecahan pertama lebih besar. 2) Samakan penyebut dengan pecahan senilai. 3) Kurangkan pembilang dan pertahankan penyebut yang sama.
  - penjelasan: Samakan penyebut, lalu kurangkan pembilang.
  - langkah Biji: Penyebutnya beda > Cari penyebut yang sama > Ubah pecahan pertama > Ubah pecahan kedua > Kurangkan > Cek lagi > Jawabanmu

#### `fraction-improper-to-mixed` kelas 5

30 soal dibangkitkan, 23 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 13, level 4 = 12 |

- **Contoh** visual `fraction-bar`: Ubah 25/6 menjadi pecahan campuran.
  - params: `{"n":25,"d":6,"w":4,"r":1}`
  - pilihan: `4 1/6`, `5 1/6`, `4 6/1`
  - jawaban: `4 1/6`
  - petunjuk: 1) Pembilang lebih besar dari penyebut, artinya lebih dari 1 utuh. 2) Bagi 25 dengan 6. Hasil baginya adalah bilangan utuh. 3) Sisa pembagian menjadi pembilang baru. Penyebut tetap.
  - penjelasan: 25 ÷ 6 = 4 sisa 1. Jadi 25/6 = 4 1/6.
  - langkah Biji: Cek ukurannya > Bagi > Sisa jadi pecahan > Gabungkan > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 15/4 menjadi pecahan campuran.
  - params: `{"n":15,"d":4,"w":3,"r":3}`
  - pilihan: `3 4/3`, `4 3/4`, `3 3/4`
  - jawaban: `3 3/4`
  - petunjuk: 1) Pembilang lebih besar dari penyebut, artinya lebih dari 1 utuh. 2) Bagi 15 dengan 4. Hasil baginya adalah bilangan utuh. 3) Sisa pembagian menjadi pembilang baru. Penyebut tetap.
  - penjelasan: 15 ÷ 4 = 3 sisa 3. Jadi 15/4 = 3 3/4.
  - langkah Biji: Cek ukurannya > Bagi > Sisa jadi pecahan > Gabungkan > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 19/5 menjadi pecahan campuran.
  - params: `{"n":19,"d":5,"w":3,"r":4}`
  - pilihan: `4 4/5`, `3 4/5`, `3 5/4`
  - jawaban: `3 4/5`
  - petunjuk: 1) Pembilang lebih besar dari penyebut, artinya lebih dari 1 utuh. 2) Bagi 19 dengan 5. Hasil baginya adalah bilangan utuh. 3) Sisa pembagian menjadi pembilang baru. Penyebut tetap.
  - penjelasan: 19 ÷ 5 = 3 sisa 4. Jadi 19/5 = 3 4/5.
  - langkah Biji: Cek ukurannya > Bagi > Sisa jadi pecahan > Gabungkan > Jawabanmu

#### `fraction-improper-to-mixed` kelas 6

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 10, level 4 = 7 |

- **Contoh** visual `fraction-bar`: Ubah 7/2 menjadi pecahan campuran.
  - params: `{"n":7,"d":2,"w":3,"r":1}`
  - pilihan: `4 1/2`, `3 2/1`, `3 1/2`
  - jawaban: `3 1/2`
  - petunjuk: 1) Pembilang lebih besar dari penyebut, artinya lebih dari 1 utuh. 2) Bagi 7 dengan 2. Hasil baginya adalah bilangan utuh. 3) Sisa pembagian menjadi pembilang baru. Penyebut tetap.
  - penjelasan: 7 ÷ 2 = 3 sisa 1. Jadi 7/2 = 3 1/2.
  - langkah Biji: Cek ukurannya > Bagi > Sisa jadi pecahan > Gabungkan > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 26/6 menjadi pecahan campuran.
  - params: `{"n":26,"d":6,"w":4,"r":2}`
  - pilihan: `4 6/2`, `4 2/6`, `5 2/6`
  - jawaban: `4 2/6`
  - petunjuk: 1) Pembilang lebih besar dari penyebut, artinya lebih dari 1 utuh. 2) Bagi 26 dengan 6. Hasil baginya adalah bilangan utuh. 3) Sisa pembagian menjadi pembilang baru. Penyebut tetap.
  - penjelasan: 26 ÷ 6 = 4 sisa 2. Jadi 26/6 = 4 2/6.
  - langkah Biji: Cek ukurannya > Bagi > Sisa jadi pecahan > Gabungkan > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 10/3 menjadi pecahan campuran.
  - params: `{"n":10,"d":3,"w":3,"r":1}`
  - pilihan: `3 3/1`, `4 1/3`, `3 1/3`
  - jawaban: `3 1/3`
  - petunjuk: 1) Pembilang lebih besar dari penyebut, artinya lebih dari 1 utuh. 2) Bagi 10 dengan 3. Hasil baginya adalah bilangan utuh. 3) Sisa pembagian menjadi pembilang baru. Penyebut tetap.
  - penjelasan: 10 ÷ 3 = 3 sisa 1. Jadi 10/3 = 3 1/3.
  - langkah Biji: Cek ukurannya > Bagi > Sisa jadi pecahan > Gabungkan > Jawabanmu

#### `fraction-mixed-to-improper` kelas 5

30 soal dibangkitkan, 21 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 4, level 4 = 4 |

- **Contoh** visual `fraction-bar`: Ubah 3 4/6 menjadi pecahan biasa (pembilangnya lebih besar dari penyebut).
  - params: `{"w":3,"n":4,"d":6}`
  - jawaban: `22/6`
  - petunjuk: 1) 1 utuh sama dengan 6/6. Ubah bagian utuhnya jadi potongan. 2) Kalikan bilangan utuh 3 dengan penyebut 6. 3) Tambahkan pembilang 4. Penyebut tetap 6.
  - penjelasan: 3 utuh = 3 × 6 = 18 potong. Tambah 4 potong = 22 potong. Jadi 22/6.
  - langkah Biji: Ubah utuh jadi potongan > Tambah sisa potongan > Penyebut tetap > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 4 2/5 menjadi pecahan biasa (pembilangnya lebih besar dari penyebut).
  - params: `{"w":4,"n":2,"d":5}`
  - jawaban: `22/5`
  - petunjuk: 1) 1 utuh sama dengan 5/5. Ubah bagian utuhnya jadi potongan. 2) Kalikan bilangan utuh 4 dengan penyebut 5. 3) Tambahkan pembilang 2. Penyebut tetap 5.
  - penjelasan: 4 utuh = 4 × 5 = 20 potong. Tambah 2 potong = 22 potong. Jadi 22/5.
  - langkah Biji: Ubah utuh jadi potongan > Tambah sisa potongan > Penyebut tetap > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 2 1/5 menjadi pecahan biasa (pembilangnya lebih besar dari penyebut).
  - params: `{"w":2,"n":1,"d":5}`
  - jawaban: `11/5`
  - petunjuk: 1) 1 utuh sama dengan 5/5. Ubah bagian utuhnya jadi potongan. 2) Kalikan bilangan utuh 2 dengan penyebut 5. 3) Tambahkan pembilang 1. Penyebut tetap 5.
  - penjelasan: 2 utuh = 2 × 5 = 10 potong. Tambah 1 potong = 11 potong. Jadi 11/5.
  - langkah Biji: Ubah utuh jadi potongan > Tambah sisa potongan > Penyebut tetap > Jawabanmu

#### `fraction-mixed-to-improper` kelas 6

30 soal dibangkitkan, 22 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 5, level 4 = 4 |

- **Contoh** visual `fraction-bar`: Ubah 1 1/3 menjadi pecahan biasa (pembilangnya lebih besar dari penyebut).
  - params: `{"w":1,"n":1,"d":3}`
  - jawaban: `4/3`
  - petunjuk: 1) 1 utuh sama dengan 3/3. Ubah bagian utuhnya jadi potongan. 2) Kalikan bilangan utuh 1 dengan penyebut 3. 3) Tambahkan pembilang 1. Penyebut tetap 3.
  - penjelasan: 1 utuh = 1 × 3 = 3 potong. Tambah 1 potong = 4 potong. Jadi 4/3.
  - langkah Biji: Ubah utuh jadi potongan > Tambah sisa potongan > Penyebut tetap > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 3 1/4 menjadi pecahan biasa (pembilangnya lebih besar dari penyebut).
  - params: `{"w":3,"n":1,"d":4}`
  - jawaban: `13/4`
  - petunjuk: 1) 1 utuh sama dengan 4/4. Ubah bagian utuhnya jadi potongan. 2) Kalikan bilangan utuh 3 dengan penyebut 4. 3) Tambahkan pembilang 1. Penyebut tetap 4.
  - penjelasan: 3 utuh = 3 × 4 = 12 potong. Tambah 1 potong = 13 potong. Jadi 13/4.
  - langkah Biji: Ubah utuh jadi potongan > Tambah sisa potongan > Penyebut tetap > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 2 1/4 menjadi pecahan biasa (pembilangnya lebih besar dari penyebut).
  - params: `{"w":2,"n":1,"d":4}`
  - jawaban: `9/4`
  - petunjuk: 1) 1 utuh sama dengan 4/4. Ubah bagian utuhnya jadi potongan. 2) Kalikan bilangan utuh 2 dengan penyebut 4. 3) Tambahkan pembilang 1. Penyebut tetap 4.
  - penjelasan: 2 utuh = 2 × 4 = 8 potong. Tambah 1 potong = 9 potong. Jadi 9/4.
  - langkah Biji: Ubah utuh jadi potongan > Tambah sisa potongan > Penyebut tetap > Jawabanmu

#### `fraction-multiply-whole` kelas 5

30 soal dibangkitkan, 27 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Hitung 5 × 4/6.
  - params: `{"n":4,"d":6,"whole":5}`
  - jawaban: `10/3`
  - petunjuk: 1) Pahami sebagai 5 kelompok dari pecahan yang sama. 2) Kalikan bilangan asli dengan pembilang. 3) Penyebut tetap, lalu sederhanakan jika bisa.
  - penjelasan: Kalikan bilangan asli dengan pembilang: 5 × 4 = 20.
  - langkah Biji: Bayangkan berulang > Kalikan pembilang > Penyebut tetap > Sederhanakan > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 4 × 2/7.
  - params: `{"n":2,"d":7,"whole":4}`
  - jawaban: `8/7`
  - petunjuk: 1) Pahami sebagai 4 kelompok dari pecahan yang sama. 2) Kalikan bilangan asli dengan pembilang. 3) Penyebut tetap, lalu sederhanakan jika bisa.
  - penjelasan: Kalikan bilangan asli dengan pembilang: 4 × 2 = 8.
  - langkah Biji: Bayangkan berulang > Kalikan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 4 × 3/4.
  - params: `{"n":3,"d":4,"whole":4}`
  - jawaban: `3`
  - petunjuk: 1) Pahami sebagai 4 kelompok dari pecahan yang sama. 2) Kalikan bilangan asli dengan pembilang. 3) Penyebut tetap, lalu sederhanakan jika bisa.
  - penjelasan: Kalikan bilangan asli dengan pembilang: 4 × 3 = 12.
  - langkah Biji: Bayangkan berulang > Kalikan pembilang > Penyebut tetap > Sederhanakan > Jawabanmu

#### `fraction-multiply-whole` kelas 6

30 soal dibangkitkan, 27 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Hitung 3 × 1/5.
  - params: `{"n":1,"d":5,"whole":3}`
  - jawaban: `3/5`
  - petunjuk: 1) Pahami sebagai 3 kelompok dari pecahan yang sama. 2) Kalikan bilangan asli dengan pembilang. 3) Penyebut tetap, lalu sederhanakan jika bisa.
  - penjelasan: Kalikan bilangan asli dengan pembilang: 3 × 1 = 3.
  - langkah Biji: Bayangkan berulang > Kalikan pembilang > Penyebut tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 2 × 3/8.
  - params: `{"n":3,"d":8,"whole":2}`
  - jawaban: `3/4`
  - petunjuk: 1) Pahami sebagai 2 kelompok dari pecahan yang sama. 2) Kalikan bilangan asli dengan pembilang. 3) Penyebut tetap, lalu sederhanakan jika bisa.
  - penjelasan: Kalikan bilangan asli dengan pembilang: 2 × 3 = 6.
  - langkah Biji: Bayangkan berulang > Kalikan pembilang > Penyebut tetap > Sederhanakan > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 2 × 1/6.
  - params: `{"n":1,"d":6,"whole":2}`
  - jawaban: `1/3`
  - petunjuk: 1) Pahami sebagai 2 kelompok dari pecahan yang sama. 2) Kalikan bilangan asli dengan pembilang. 3) Penyebut tetap, lalu sederhanakan jika bisa.
  - penjelasan: Kalikan bilangan asli dengan pembilang: 2 × 1 = 2.
  - langkah Biji: Bayangkan berulang > Kalikan pembilang > Penyebut tetap > Sederhanakan > Jawabanmu

#### `fraction-divide-whole` kelas 5

30 soal dibangkitkan, 21 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Hitung 1/2 ÷ 3.
  - params: `{"n":1,"d":2,"whole":3}`
  - jawaban: `1/6`
  - petunjuk: 1) Membagi menjadi lebih banyak bagian membuat tiap bagian lebih kecil. 2) Kalikan penyebut dengan bilangan pembagi. 3) Pembilang tetap, penyebut dikali 3.
  - penjelasan: Membagi pecahan dengan bilangan asli sama dengan mengalikan penyebut dengan 3.
  - langkah Biji: Bayangkan membagi rata > Potongan makin kecil > Pembilang tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 1/2 ÷ 4.
  - params: `{"n":1,"d":2,"whole":4}`
  - jawaban: `1/8`
  - petunjuk: 1) Membagi menjadi lebih banyak bagian membuat tiap bagian lebih kecil. 2) Kalikan penyebut dengan bilangan pembagi. 3) Pembilang tetap, penyebut dikali 4.
  - penjelasan: Membagi pecahan dengan bilangan asli sama dengan mengalikan penyebut dengan 4.
  - langkah Biji: Bayangkan membagi rata > Potongan makin kecil > Pembilang tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 4/8 ÷ 4.
  - params: `{"n":4,"d":8,"whole":4}`
  - jawaban: `1/8`
  - petunjuk: 1) Membagi menjadi lebih banyak bagian membuat tiap bagian lebih kecil. 2) Kalikan penyebut dengan bilangan pembagi. 3) Pembilang tetap, penyebut dikali 4.
  - penjelasan: Membagi pecahan dengan bilangan asli sama dengan mengalikan penyebut dengan 4.
  - langkah Biji: Bayangkan membagi rata > Potongan makin kecil > Pembilang tetap > Sederhanakan > Jawabanmu

#### `fraction-divide-whole` kelas 6

30 soal dibangkitkan, 26 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Hitung 4/7 ÷ 3.
  - params: `{"n":4,"d":7,"whole":3}`
  - jawaban: `4/21`
  - petunjuk: 1) Membagi menjadi lebih banyak bagian membuat tiap bagian lebih kecil. 2) Kalikan penyebut dengan bilangan pembagi. 3) Pembilang tetap, penyebut dikali 3.
  - penjelasan: Membagi pecahan dengan bilangan asli sama dengan mengalikan penyebut dengan 3.
  - langkah Biji: Bayangkan membagi rata > Potongan makin kecil > Pembilang tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 5/6 ÷ 4.
  - params: `{"n":5,"d":6,"whole":4}`
  - jawaban: `5/24`
  - petunjuk: 1) Membagi menjadi lebih banyak bagian membuat tiap bagian lebih kecil. 2) Kalikan penyebut dengan bilangan pembagi. 3) Pembilang tetap, penyebut dikali 4.
  - penjelasan: Membagi pecahan dengan bilangan asli sama dengan mengalikan penyebut dengan 4.
  - langkah Biji: Bayangkan membagi rata > Potongan makin kecil > Pembilang tetap > Cek lagi > Jawabanmu
- **Contoh** visual `fraction-bar`: Hitung 4/8 ÷ 3.
  - params: `{"n":4,"d":8,"whole":3}`
  - jawaban: `1/6`
  - petunjuk: 1) Membagi menjadi lebih banyak bagian membuat tiap bagian lebih kecil. 2) Kalikan penyebut dengan bilangan pembagi. 3) Pembilang tetap, penyebut dikali 3.
  - penjelasan: Membagi pecahan dengan bilangan asli sama dengan mengalikan penyebut dengan 3.
  - langkah Biji: Bayangkan membagi rata > Potongan makin kecil > Pembilang tetap > Sederhanakan > Jawabanmu

#### `fraction-of-quantity` kelas 5

30 soal dibangkitkan, 26 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Dari 12 anak yang menonton pertandingan sepak bola, 1/3 memakai jersey merah. Berapa anak yang memakai jersey merah?
  - params: `{"n":1,"d":3,"total":12}`
  - jawaban: `4`
  - petunjuk: 1) Bagi jumlah benda menjadi 3 kelompok sama banyak. 2) Cari isi satu kelompok terlebih dahulu. 3) Ambil 1 kelompok.
  - penjelasan: Satu bagian berisi 4 benda; 1 bagian berisi 4 benda.
  - langkah Biji: Bagi jadi kelompok > Isi satu kelompok > Ambil sesuai pembilang > Jawabanmu
- **Contoh** visual `fraction-bar`: Dari 18 anak yang menonton pertandingan sepak bola, 1/2 memakai jersey merah. Berapa anak yang memakai jersey merah?
  - params: `{"n":1,"d":2,"total":18}`
  - jawaban: `9`
  - petunjuk: 1) Bagi jumlah benda menjadi 2 kelompok sama banyak. 2) Cari isi satu kelompok terlebih dahulu. 3) Ambil 1 kelompok.
  - penjelasan: Satu bagian berisi 9 benda; 1 bagian berisi 9 benda.
  - langkah Biji: Bagi jadi kelompok > Isi satu kelompok > Ambil sesuai pembilang > Jawabanmu
- **Contoh** visual `fraction-bar`: Dari 20 anak yang menonton pertandingan sepak bola, 1/2 memakai jersey merah. Berapa anak yang memakai jersey merah?
  - params: `{"n":1,"d":2,"total":20}`
  - jawaban: `10`
  - petunjuk: 1) Bagi jumlah benda menjadi 2 kelompok sama banyak. 2) Cari isi satu kelompok terlebih dahulu. 3) Ambil 1 kelompok.
  - penjelasan: Satu bagian berisi 10 benda; 1 bagian berisi 10 benda.
  - langkah Biji: Bagi jadi kelompok > Isi satu kelompok > Ambil sesuai pembilang > Jawabanmu

#### `fraction-of-quantity` kelas 6

30 soal dibangkitkan, 26 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `fraction-bar`: Dari 35 anak yang menonton pertandingan sepak bola, 3/5 memakai jersey merah. Berapa anak yang memakai jersey merah?
  - params: `{"n":3,"d":5,"total":35}`
  - jawaban: `21`
  - petunjuk: 1) Bagi jumlah benda menjadi 5 kelompok sama banyak. 2) Cari isi satu kelompok terlebih dahulu. 3) Ambil 3 kelompok.
  - penjelasan: Satu bagian berisi 7 benda; 3 bagian berisi 21 benda.
  - langkah Biji: Bagi jadi kelompok > Isi satu kelompok > Ambil sesuai pembilang > Jawabanmu
- **Contoh** visual `fraction-bar`: Dari 21 anak yang menonton pertandingan sepak bola, 2/3 memakai jersey merah. Berapa anak yang memakai jersey merah?
  - params: `{"n":2,"d":3,"total":21}`
  - jawaban: `14`
  - petunjuk: 1) Bagi jumlah benda menjadi 3 kelompok sama banyak. 2) Cari isi satu kelompok terlebih dahulu. 3) Ambil 2 kelompok.
  - penjelasan: Satu bagian berisi 7 benda; 2 bagian berisi 14 benda.
  - langkah Biji: Bagi jadi kelompok > Isi satu kelompok > Ambil sesuai pembilang > Jawabanmu
- **Contoh** visual `fraction-bar`: Dari 20 anak yang menonton pertandingan sepak bola, 1/4 memakai jersey merah. Berapa anak yang memakai jersey merah?
  - params: `{"n":1,"d":4,"total":20}`
  - jawaban: `5`
  - petunjuk: 1) Bagi jumlah benda menjadi 4 kelompok sama banyak. 2) Cari isi satu kelompok terlebih dahulu. 3) Ambil 1 kelompok.
  - penjelasan: Satu bagian berisi 5 benda; 1 bagian berisi 5 benda.
  - langkah Biji: Bagi jadi kelompok > Isi satu kelompok > Ambil sesuai pembilang > Jawabanmu

#### `fraction-to-decimal` kelas 5

30 soal dibangkitkan, 11 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 5, level 4 = 4 |

- **Contoh** visual `number-line`: Ubah 6/10 menjadi desimal.
  - params: `{"n":6,"d":10}`
  - jawaban: `0,6`
  - petunjuk: 1) Pecahan berarti pembilang dibagi penyebut. 2) Lakukan pembagian pembilang dengan penyebut. 3) Tulis hasil desimal menggunakan koma.
  - penjelasan: 6 dibagi 10 sama dengan 0,6.
  - langkah Biji: Ubah penyebut jadi 10 atau 100 > Kalikan atas dan bawah > Tulis sebagai desimal > Jawabanmu
- **Contoh** visual `number-line`: Ubah 1/2 menjadi desimal.
  - params: `{"n":1,"d":2}`
  - jawaban: `0,5`
  - petunjuk: 1) Pecahan berarti pembilang dibagi penyebut. 2) Lakukan pembagian pembilang dengan penyebut. 3) Tulis hasil desimal menggunakan koma.
  - penjelasan: 1 dibagi 2 sama dengan 0,5.
  - langkah Biji: Ubah penyebut jadi 10 atau 100 > Kalikan atas dan bawah > Tulis sebagai desimal > Jawabanmu
- **Contoh** visual `number-line`: Ubah 2/5 menjadi desimal.
  - params: `{"n":2,"d":5}`
  - jawaban: `0,4`
  - petunjuk: 1) Pecahan berarti pembilang dibagi penyebut. 2) Lakukan pembagian pembilang dengan penyebut. 3) Tulis hasil desimal menggunakan koma.
  - penjelasan: 2 dibagi 5 sama dengan 0,4.
  - langkah Biji: Ubah penyebut jadi 10 atau 100 > Kalikan atas dan bawah > Tulis sebagai desimal > Jawabanmu

#### `fraction-to-decimal` kelas 6

30 soal dibangkitkan, 15 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |

- **Contoh** visual `number-line`: Ubah 3/4 menjadi desimal.
  - params: `{"n":3,"d":4}`
  - jawaban: `0,75`
  - petunjuk: 1) Pecahan berarti pembilang dibagi penyebut. 2) Lakukan pembagian pembilang dengan penyebut. 3) Tulis hasil desimal menggunakan koma.
  - penjelasan: 3 dibagi 4 sama dengan 0,75.
  - langkah Biji: Ubah penyebut jadi 10 atau 100 > Kalikan atas dan bawah > Tulis sebagai desimal > Jawabanmu
- **Contoh** visual `number-line`: Ubah 2/4 menjadi desimal.
  - params: `{"n":2,"d":4}`
  - jawaban: `0,5`
  - petunjuk: 1) Pecahan berarti pembilang dibagi penyebut. 2) Lakukan pembagian pembilang dengan penyebut. 3) Tulis hasil desimal menggunakan koma.
  - penjelasan: 2 dibagi 4 sama dengan 0,5.
  - langkah Biji: Ubah penyebut jadi 10 atau 100 > Kalikan atas dan bawah > Tulis sebagai desimal > Jawabanmu
- **Contoh** visual `number-line`: Ubah 1/4 menjadi desimal.
  - params: `{"n":1,"d":4}`
  - jawaban: `0,25`
  - petunjuk: 1) Pecahan berarti pembilang dibagi penyebut. 2) Lakukan pembagian pembilang dengan penyebut. 3) Tulis hasil desimal menggunakan koma.
  - penjelasan: 1 dibagi 4 sama dengan 0,25.
  - langkah Biji: Ubah penyebut jadi 10 atau 100 > Kalikan atas dan bawah > Tulis sebagai desimal > Jawabanmu

#### `fraction-percent` kelas 5

30 soal dibangkitkan, 8 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |

- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 3/5?
  - params: `{"n":3,"d":5}`
  - jawaban: `60%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 3/5 setara dengan 60 dari 100, yaitu 60%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/5?
  - params: `{"n":1,"d":5}`
  - jawaban: `20%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/5 setara dengan 20 dari 100, yaitu 20%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/10?
  - params: `{"n":1,"d":10}`
  - jawaban: `10%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/10 setara dengan 10 dari 100, yaitu 10%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu

#### `fraction-percent` kelas 6

30 soal dibangkitkan, 8 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 7, level 4 = 4 |

- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 2/5?
  - params: `{"n":2,"d":5}`
  - jawaban: `40%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 2/5 setara dengan 40 dari 100, yaitu 40%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 4/5?
  - params: `{"n":4,"d":5}`
  - jawaban: `80%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 4/5 setara dengan 80 dari 100, yaitu 80%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/2?
  - params: `{"n":1,"d":2}`
  - jawaban: `50%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/2 setara dengan 50 dari 100, yaitu 50%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu

### Topik: Bilangan desimal (`desimal`)

#### `decimal-compare` kelas 5

30 soal dibangkitkan, 24 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |

- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,1 atau 0,6?
  - params: `{"a":1,"c":6}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,3 atau 0,9?
  - params: `{"a":3,"c":9}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,7 atau 0,6?
  - params: `{"a":7,"c":6}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-compare` kelas 6

30 soal dibangkitkan, 23 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 5 |

- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,2 atau 0,9?
  - params: `{"a":2,"c":9}`
  - pilihan: `A`, `B`
  - jawaban: `B`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,8 atau 0,7?
  - params: `{"a":8,"c":7}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Bilangan desimal mana yang lebih besar: 0,2 atau 0,1?
  - params: `{"a":2,"c":1}`
  - pilihan: `A`, `B`
  - jawaban: `A`
  - petunjuk: 1) Lihat angka di tempat persepuluhan. 2) Bandingkan angka setelah koma. 3) Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.
  - penjelasan: Bandingkan nilai persepuluhannya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-order` kelas 5

30 soal dibangkitkan, 28 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 7 |

- **Contoh** visual `number-line`: Urutkan desimal berikut dari terkecil: 0,6, 0,5, 0,4.
  - params: `{"values":[4,5,6]}`
  - pilihan: `0,6 – 0,5 – 0,4`, `0,4 – 0,5 – 0,6`, `0,5 – 0,4 – 0,6`
  - jawaban: `0,4 – 0,5 – 0,6`
  - petunjuk: 1) Semua bilangan punya satu angka di belakang koma. 2) Bandingkan angka persepuluhan. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutannya 0,4 – 0,5 – 0,6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan desimal berikut dari terkecil: 0,4, 0,3, 0,2.
  - params: `{"values":[2,3,4]}`
  - pilihan: `0,3 – 0,2 – 0,4`, `0,4 – 0,3 – 0,2`, `0,2 – 0,3 – 0,4`
  - jawaban: `0,2 – 0,3 – 0,4`
  - petunjuk: 1) Semua bilangan punya satu angka di belakang koma. 2) Bandingkan angka persepuluhan. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutannya 0,2 – 0,3 – 0,4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan desimal berikut dari terkecil: 0,2, 0,3, 0,8.
  - params: `{"values":[2,3,8]}`
  - pilihan: `0,2 – 0,3 – 0,8`, `0,8 – 0,3 – 0,2`, `0,3 – 0,2 – 0,8`
  - jawaban: `0,2 – 0,3 – 0,8`
  - petunjuk: 1) Semua bilangan punya satu angka di belakang koma. 2) Bandingkan angka persepuluhan. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutannya 0,2 – 0,3 – 0,8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-order` kelas 6

30 soal dibangkitkan, 28 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `number-line`: Urutkan desimal berikut dari terkecil: 0,7, 0,6, 0,5.
  - params: `{"values":[5,6,7]}`
  - pilihan: `0,5 – 0,6 – 0,7`, `0,7 – 0,6 – 0,5`, `0,6 – 0,5 – 0,7`
  - jawaban: `0,5 – 0,6 – 0,7`
  - petunjuk: 1) Semua bilangan punya satu angka di belakang koma. 2) Bandingkan angka persepuluhan. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutannya 0,5 – 0,6 – 0,7.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan desimal berikut dari terkecil: 0,8, 0,5, 0,4.
  - params: `{"values":[4,5,8]}`
  - pilihan: `0,5 – 0,4 – 0,8`, `0,8 – 0,5 – 0,4`, `0,4 – 0,5 – 0,8`
  - jawaban: `0,4 – 0,5 – 0,8`
  - petunjuk: 1) Semua bilangan punya satu angka di belakang koma. 2) Bandingkan angka persepuluhan. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutannya 0,4 – 0,5 – 0,8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Urutkan desimal berikut dari terkecil: 0,6, 0,1, 0,4.
  - params: `{"values":[1,4,6]}`
  - pilihan: `0,6 – 0,4 – 0,1`, `0,1 – 0,4 – 0,6`, `0,4 – 0,1 – 0,6`
  - jawaban: `0,1 – 0,4 – 0,6`
  - petunjuk: 1) Semua bilangan punya satu angka di belakang koma. 2) Bandingkan angka persepuluhan. 3) Susun dari nilai paling kecil ke paling besar.
  - penjelasan: Urutannya 0,1 – 0,4 – 0,6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-place` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | place-value: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 68, level 4 = 51 |

- **Contoh** visual `place-value`: Pada bilangan 78,8, berapa nilai angka persepuluhannya?
  - params: `{"whole":78,"tenths":8}`
  - jawaban: `0,8`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 8 berada di tempat persepuluhan, nilainya 0,8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 86,4, berapa nilai angka persepuluhannya?
  - params: `{"whole":86,"tenths":4}`
  - jawaban: `0,4`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 4 berada di tempat persepuluhan, nilainya 0,4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 25,9, berapa nilai angka persepuluhannya?
  - params: `{"whole":25,"tenths":9}`
  - jawaban: `0,9`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 9 berada di tempat persepuluhan, nilainya 0,9.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-place` kelas 6

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | place-value: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 60, level 4 = 53 |

- **Contoh** visual `place-value`: Pada bilangan 32,2, berapa nilai angka persepuluhannya?
  - params: `{"whole":32,"tenths":2}`
  - jawaban: `0,2`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 2 berada di tempat persepuluhan, nilainya 0,2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 82,4, berapa nilai angka persepuluhannya?
  - params: `{"whole":82,"tenths":4}`
  - jawaban: `0,4`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 4 berada di tempat persepuluhan, nilainya 0,4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Pada bilangan 83,2, berapa nilai angka persepuluhannya?
  - params: `{"whole":83,"tenths":2}`
  - jawaban: `0,2`
  - petunjuk: 1) Perhatikan angka setelah koma. 2) Tempat pertama setelah koma adalah persepuluhan. 3) Nilai angka itu adalah angka × 0,1.
  - penjelasan: Angka 2 berada di tempat persepuluhan, nilainya 0,2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-add` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=12, bilangan b=88 tidak tampil |

- **Contoh** visual `place-value`: Hitung 1,2 + 8,8.
  - params: `{"a":12,"b":88}`
  - jawaban: `10,0`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Jumlahkan angka persepuluhan. 3) Jika hasil persepuluhan 10 atau lebih, tukar 10 persepuluhan menjadi 1 satuan.
  - penjelasan: Sejajarkan koma, lalu jumlahkan nilai persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 3,6 + 2,2.
  - params: `{"a":36,"b":22}`
  - jawaban: `5,8`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Jumlahkan angka persepuluhan. 3) Jika hasil persepuluhan 10 atau lebih, tukar 10 persepuluhan menjadi 1 satuan.
  - penjelasan: Sejajarkan koma, lalu jumlahkan nilai persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 2,3 + 9,8.
  - params: `{"a":23,"b":98}`
  - jawaban: `12,1`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Jumlahkan angka persepuluhan. 3) Jika hasil persepuluhan 10 atau lebih, tukar 10 persepuluhan menjadi 1 satuan.
  - penjelasan: Sejajarkan koma, lalu jumlahkan nilai persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-add` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=56, bilangan b=78 tidak tampil |

- **Contoh** visual `place-value`: Hitung 5,6 + 7,8.
  - params: `{"a":56,"b":78}`
  - jawaban: `13,4`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Jumlahkan angka persepuluhan. 3) Jika hasil persepuluhan 10 atau lebih, tukar 10 persepuluhan menjadi 1 satuan.
  - penjelasan: Sejajarkan koma, lalu jumlahkan nilai persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 8,8 + 7,4.
  - params: `{"a":88,"b":74}`
  - jawaban: `16,2`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Jumlahkan angka persepuluhan. 3) Jika hasil persepuluhan 10 atau lebih, tukar 10 persepuluhan menjadi 1 satuan.
  - penjelasan: Sejajarkan koma, lalu jumlahkan nilai persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 1,7 + 9,0.
  - params: `{"a":17,"b":90}`
  - jawaban: `10,7`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Jumlahkan angka persepuluhan. 3) Jika hasil persepuluhan 10 atau lebih, tukar 10 persepuluhan menjadi 1 satuan.
  - penjelasan: Sejajarkan koma, lalu jumlahkan nilai persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-subtract` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=46, bilangan b=1 tidak tampil |

- **Contoh** visual `place-value`: Hitung 4,6 − 0,1.
  - params: `{"a":46,"b":1}`
  - jawaban: `4,5`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Kurangkan dari tempat persepuluhan. 3) Jika perlu, tukar satu satuan menjadi sepuluh persepuluhan.
  - penjelasan: Sejajarkan koma, lalu kurangkan persepuluhan dan satuan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 9,2 − 0,1.
  - params: `{"a":92,"b":1}`
  - jawaban: `9,1`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Kurangkan dari tempat persepuluhan. 3) Jika perlu, tukar satu satuan menjadi sepuluh persepuluhan.
  - penjelasan: Sejajarkan koma, lalu kurangkan persepuluhan dan satuan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 3,4 − 1,0.
  - params: `{"a":34,"b":10}`
  - jawaban: `2,4`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Kurangkan dari tempat persepuluhan. 3) Jika perlu, tukar satu satuan menjadi sepuluh persepuluhan.
  - penjelasan: Sejajarkan koma, lalu kurangkan persepuluhan dan satuan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-subtract` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=92, bilangan b=46 tidak tampil |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 7, level 4 = 7 |

- **Contoh** visual `place-value`: Hitung 9,2 − 4,6.
  - params: `{"a":92,"b":46}`
  - jawaban: `4,6`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Kurangkan dari tempat persepuluhan. 3) Jika perlu, tukar satu satuan menjadi sepuluh persepuluhan.
  - penjelasan: Sejajarkan koma, lalu kurangkan persepuluhan dan satuan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 9,7 − 1,4.
  - params: `{"a":97,"b":14}`
  - jawaban: `8,3`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Kurangkan dari tempat persepuluhan. 3) Jika perlu, tukar satu satuan menjadi sepuluh persepuluhan.
  - penjelasan: Sejajarkan koma, lalu kurangkan persepuluhan dan satuan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `place-value`: Hitung 8,5 − 1,6.
  - params: `{"a":85,"b":16}`
  - jawaban: `6,9`
  - petunjuk: 1) Tulis koma pada posisi yang sama. 2) Kurangkan dari tempat persepuluhan. 3) Jika perlu, tukar satu satuan menjadi sepuluh persepuluhan.
  - penjelasan: Sejajarkan koma, lalu kurangkan persepuluhan dan satuan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-to-fraction` kelas 5

30 soal dibangkitkan, 28 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |

- **Contoh** visual `fraction-bar`: Ubah 5,2 menjadi pecahan campuran.
  - params: `{"whole":5,"tenths":2}`
  - pilihan: `5 2/9`, `5 2/100`, `5 2/10`
  - jawaban: `5 2/10`
  - petunjuk: 1) Pisahkan bagian satuan dan persepuluhan. 2) Angka setelah koma menjadi pembilang. 3) Penyebut persepuluhan adalah 10.
  - penjelasan: 5,2 berarti 5 satuan dan 2 persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 3,6 menjadi pecahan campuran.
  - params: `{"whole":3,"tenths":6}`
  - pilihan: `3 6/100`, `3 6/9`, `3 6/10`
  - jawaban: `3 6/10`
  - petunjuk: 1) Pisahkan bagian satuan dan persepuluhan. 2) Angka setelah koma menjadi pembilang. 3) Penyebut persepuluhan adalah 10.
  - penjelasan: 3,6 berarti 3 satuan dan 6 persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 4,9 menjadi pecahan campuran.
  - params: `{"whole":4,"tenths":9}`
  - pilihan: `4 9/10`, `4 9/9`, `4 9/100`
  - jawaban: `4 9/10`
  - petunjuk: 1) Pisahkan bagian satuan dan persepuluhan. 2) Angka setelah koma menjadi pembilang. 3) Penyebut persepuluhan adalah 10.
  - penjelasan: 4,9 berarti 4 satuan dan 9 persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `decimal-to-fraction` kelas 6

30 soal dibangkitkan, 23 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 7, level 4 = 6 |

- **Contoh** visual `fraction-bar`: Ubah 2,6 menjadi pecahan campuran.
  - params: `{"whole":2,"tenths":6}`
  - pilihan: `2 6/100`, `2 6/10`, `2 6/9`
  - jawaban: `2 6/10`
  - petunjuk: 1) Pisahkan bagian satuan dan persepuluhan. 2) Angka setelah koma menjadi pembilang. 3) Penyebut persepuluhan adalah 10.
  - penjelasan: 2,6 berarti 2 satuan dan 6 persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 8,7 menjadi pecahan campuran.
  - params: `{"whole":8,"tenths":7}`
  - pilihan: `8 7/9`, `8 7/100`, `8 7/10`
  - jawaban: `8 7/10`
  - petunjuk: 1) Pisahkan bagian satuan dan persepuluhan. 2) Angka setelah koma menjadi pembilang. 3) Penyebut persepuluhan adalah 10.
  - penjelasan: 8,7 berarti 8 satuan dan 7 persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Ubah 7,8 menjadi pecahan campuran.
  - params: `{"whole":7,"tenths":8}`
  - pilihan: `7 8/9`, `7 8/100`, `7 8/10`
  - jawaban: `7 8/10`
  - petunjuk: 1) Pisahkan bagian satuan dan persepuluhan. 2) Angka setelah koma menjadi pembilang. 3) Penyebut persepuluhan adalah 10.
  - penjelasan: 7,8 berarti 7 satuan dan 8 persepuluhan.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Persen (penguatan) (`persen-penguatan`)

#### `fraction-percent` kelas 5

30 soal dibangkitkan, 8 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |

- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 3/5?
  - params: `{"n":3,"d":5}`
  - jawaban: `60%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 3/5 setara dengan 60 dari 100, yaitu 60%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/5?
  - params: `{"n":1,"d":5}`
  - jawaban: `20%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/5 setara dengan 20 dari 100, yaitu 20%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/10?
  - params: `{"n":1,"d":10}`
  - jawaban: `10%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/10 setara dengan 10 dari 100, yaitu 10%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu

#### `fraction-percent` kelas 6

30 soal dibangkitkan, 8 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 7, level 4 = 4 |

- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 2/5?
  - params: `{"n":2,"d":5}`
  - jawaban: `40%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 2/5 setara dengan 40 dari 100, yaitu 40%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 4/5?
  - params: `{"n":4,"d":5}`
  - jawaban: `80%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 4/5 setara dengan 80 dari 100, yaitu 80%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa persen dari pecahan 1/2?
  - params: `{"n":1,"d":2}`
  - jawaban: `50%`
  - petunjuk: 1) Persen berarti per seratus. 2) Ubah pecahan menjadi penyebut 100. 3) Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.
  - penjelasan: 1/2 setara dengan 50 dari 100, yaitu 50%.
  - langkah Biji: Ingat arti persen > Ubah penyebut jadi 100 > Tulis persen > Jawabanmu

#### `percent-of-number` kelas 5

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |
| rendah | `ANGKA-TANPA-TITIK` | 16 | angka 4 digit tanpa pemisah ribuan: Berapa 20% dari 1500? |

- **Contoh** visual `fraction-bar`: Berapa 20% dari 1500?
  - params: `{"p":20,"total":1500}`
  - jawaban: `300`
  - petunjuk: 1) Ubah persen menjadi pecahan per 100. 2) Cari 10%, 25%, atau setengahnya jika membantu. 3) Kalikan bilangan dengan persen lalu bagi 100.
  - penjelasan: 20% berarti 20/100 dari 1500.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa 25% dari 2000?
  - params: `{"p":25,"total":2000}`
  - jawaban: `500`
  - petunjuk: 1) Ubah persen menjadi pecahan per 100. 2) Cari 10%, 25%, atau setengahnya jika membantu. 3) Kalikan bilangan dengan persen lalu bagi 100.
  - penjelasan: 25% berarti 25/100 dari 2000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa 50% dari 1800?
  - params: `{"p":50,"total":1800}`
  - jawaban: `900`
  - petunjuk: 1) Ubah persen menjadi pecahan per 100. 2) Cari 10%, 25%, atau setengahnya jika membantu. 3) Kalikan bilangan dengan persen lalu bagi 100.
  - penjelasan: 50% berarti 50/100 dari 1800.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `percent-of-number` kelas 6

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| sedang | `VISUAL-PECAHAN-DEFAULT` | 30 | tipe ini jatuh ke cabang default FractionModel (satu batang saja) |
| rendah | `ANGKA-TANPA-TITIK` | 16 | angka 4 digit tanpa pemisah ribuan: Berapa 50% dari 1200? |

- **Contoh** visual `fraction-bar`: Berapa 20% dari 200?
  - params: `{"p":20,"total":200}`
  - jawaban: `40`
  - petunjuk: 1) Ubah persen menjadi pecahan per 100. 2) Cari 10%, 25%, atau setengahnya jika membantu. 3) Kalikan bilangan dengan persen lalu bagi 100.
  - penjelasan: 20% berarti 20/100 dari 200.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa 10% dari 1600?
  - params: `{"p":10,"total":1600}`
  - jawaban: `160`
  - petunjuk: 1) Ubah persen menjadi pecahan per 100. 2) Cari 10%, 25%, atau setengahnya jika membantu. 3) Kalikan bilangan dengan persen lalu bagi 100.
  - penjelasan: 10% berarti 10/100 dari 1600.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `fraction-bar`: Berapa 75% dari 800?
  - params: `{"p":75,"total":800}`
  - jawaban: `600`
  - petunjuk: 1) Ubah persen menjadi pecahan per 100. 2) Cari 10%, 25%, atau setengahnya jika membantu. 3) Kalikan bilangan dengan persen lalu bagi 100.
  - penjelasan: 75% berarti 75/100 dari 800.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Rasio dan proporsi (`rasio-proporsi`)

#### `ratio-simplify` kelas 5

30 soal dibangkitkan, 28 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=16, bilangan b=24 tidak tampil |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 23, level 4 = 18 |

- **Contoh** visual `blocks`: Sederhanakan rasio 16:24.
  - params: `{"a":16,"b":24}`
  - jawaban: `2:3`
  - petunjuk: 1) Cari faktor persekutuan kedua bilangan. 2) Bagi kedua bagian dengan bilangan yang sama. 3) Rasio sederhana tidak memiliki faktor persekutuan selain 1.
  - penjelasan: Bagi kedua bagian rasio dengan FPB-nya, yaitu 8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Sederhanakan rasio 9:9.
  - params: `{"a":9,"b":9}`
  - jawaban: `1:1`
  - petunjuk: 1) Cari faktor persekutuan kedua bilangan. 2) Bagi kedua bagian dengan bilangan yang sama. 3) Rasio sederhana tidak memiliki faktor persekutuan selain 1.
  - penjelasan: Bagi kedua bagian rasio dengan FPB-nya, yaitu 9.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Sederhanakan rasio 4:16.
  - params: `{"a":4,"b":16}`
  - jawaban: `1:4`
  - petunjuk: 1) Cari faktor persekutuan kedua bilangan. 2) Bagi kedua bagian dengan bilangan yang sama. 3) Rasio sederhana tidak memiliki faktor persekutuan selain 1.
  - penjelasan: Bagi kedua bagian rasio dengan FPB-nya, yaitu 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `ratio-simplify` kelas 6

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=8, bilangan b=16 tidak tampil |

- **Contoh** visual `blocks`: Sederhanakan rasio 8:16.
  - params: `{"a":8,"b":16}`
  - jawaban: `1:2`
  - petunjuk: 1) Cari faktor persekutuan kedua bilangan. 2) Bagi kedua bagian dengan bilangan yang sama. 3) Rasio sederhana tidak memiliki faktor persekutuan selain 1.
  - penjelasan: Bagi kedua bagian rasio dengan FPB-nya, yaitu 8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Sederhanakan rasio 4:8.
  - params: `{"a":4,"b":8}`
  - jawaban: `1:2`
  - petunjuk: 1) Cari faktor persekutuan kedua bilangan. 2) Bagi kedua bagian dengan bilangan yang sama. 3) Rasio sederhana tidak memiliki faktor persekutuan selain 1.
  - penjelasan: Bagi kedua bagian rasio dengan FPB-nya, yaitu 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Sederhanakan rasio 15:20.
  - params: `{"a":15,"b":20}`
  - jawaban: `3:4`
  - petunjuk: 1) Cari faktor persekutuan kedua bilangan. 2) Bagi kedua bagian dengan bilangan yang sama. 3) Rasio sederhana tidak memiliki faktor persekutuan selain 1.
  - penjelasan: Bagi kedua bagian rasio dengan FPB-nya, yaitu 5.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `unit-rate` kelas 5

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |

- **Contoh** visual `blocks`: Di kios pasar, 6 bungkus kerupuk harganya Rp36.000. Berapa harga satu bungkus?
  - params: `{"unit":6,"rate":6000,"total":36000}`
  - jawaban: `6000`
  - petunjuk: 1) Cari harga untuk satu benda. 2) Bagi total harga dengan banyak benda. 3) Gunakan pembagian untuk mendapatkan nilai per satuan.
  - penjelasan: Harga satu buku = Rp36.000 ÷ 6 = Rp6.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Di kios pasar, 2 bungkus kerupuk harganya Rp26.000. Berapa harga satu bungkus?
  - params: `{"unit":2,"rate":13000,"total":26000}`
  - jawaban: `13000`
  - petunjuk: 1) Cari harga untuk satu benda. 2) Bagi total harga dengan banyak benda. 3) Gunakan pembagian untuk mendapatkan nilai per satuan.
  - penjelasan: Harga satu buku = Rp26.000 ÷ 2 = Rp13.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Di kios pasar, 11 bungkus kerupuk harganya Rp44.000. Berapa harga satu bungkus?
  - params: `{"unit":11,"rate":4000,"total":44000}`
  - jawaban: `4000`
  - petunjuk: 1) Cari harga untuk satu benda. 2) Bagi total harga dengan banyak benda. 3) Gunakan pembagian untuk mendapatkan nilai per satuan.
  - penjelasan: Harga satu buku = Rp44.000 ÷ 11 = Rp4.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `unit-rate` kelas 6

30 soal dibangkitkan, 26 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |

- **Contoh** visual `blocks`: Di kios pasar, 5 bungkus kerupuk harganya Rp35.000. Berapa harga satu bungkus?
  - params: `{"unit":5,"rate":7000,"total":35000}`
  - jawaban: `7000`
  - petunjuk: 1) Cari harga untuk satu benda. 2) Bagi total harga dengan banyak benda. 3) Gunakan pembagian untuk mendapatkan nilai per satuan.
  - penjelasan: Harga satu buku = Rp35.000 ÷ 5 = Rp7.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Di kios pasar, 12 bungkus kerupuk harganya Rp204.000. Berapa harga satu bungkus?
  - params: `{"unit":12,"rate":17000,"total":204000}`
  - jawaban: `17000`
  - petunjuk: 1) Cari harga untuk satu benda. 2) Bagi total harga dengan banyak benda. 3) Gunakan pembagian untuk mendapatkan nilai per satuan.
  - penjelasan: Harga satu buku = Rp204.000 ÷ 12 = Rp17.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Di kios pasar, 11 bungkus kerupuk harganya Rp198.000. Berapa harga satu bungkus?
  - params: `{"unit":11,"rate":18000,"total":198000}`
  - jawaban: `18000`
  - petunjuk: 1) Cari harga untuk satu benda. 2) Bagi total harga dengan banyak benda. 3) Gunakan pembagian untuk mendapatkan nilai per satuan.
  - penjelasan: Harga satu buku = Rp198.000 ÷ 11 = Rp18.000.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `proportion` kelas 5

30 soal dibangkitkan, 23 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=2, bilangan b=6 tidak tampil |

- **Contoh** visual `blocks`: Resep sirup memakai 2 sendok sirup untuk 6 gelas air. Jika sirupnya 8 sendok, berapa gelas air yang diperlukan agar rasanya tetap sama?
  - params: `{"a":2,"b":6,"k":4}`
  - jawaban: `24`
  - petunjuk: 1) Rasio harus tetap setara. 2) Perhatikan faktor pengali dari 2 ke 8. 3) Kalikan 6 dengan faktor yang sama.
  - penjelasan: Bagian pertama dikali 4, jadi bagian kedua juga dikali 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Resep sirup memakai 5 sendok sirup untuk 2 gelas air. Jika sirupnya 20 sendok, berapa gelas air yang diperlukan agar rasanya tetap sama?
  - params: `{"a":5,"b":2,"k":4}`
  - jawaban: `8`
  - petunjuk: 1) Rasio harus tetap setara. 2) Perhatikan faktor pengali dari 5 ke 20. 3) Kalikan 2 dengan faktor yang sama.
  - penjelasan: Bagian pertama dikali 4, jadi bagian kedua juga dikali 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Resep sirup memakai 4 sendok sirup untuk 6 gelas air. Jika sirupnya 20 sendok, berapa gelas air yang diperlukan agar rasanya tetap sama?
  - params: `{"a":4,"b":6,"k":5}`
  - jawaban: `30`
  - petunjuk: 1) Rasio harus tetap setara. 2) Perhatikan faktor pengali dari 4 ke 20. 3) Kalikan 6 dengan faktor yang sama.
  - penjelasan: Bagian pertama dikali 5, jadi bagian kedua juga dikali 5.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `proportion` kelas 6

30 soal dibangkitkan, 22 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-HANYA-SATU` | 30 | visual nilai tempat hanya menggambar a=2, bilangan b=3 tidak tampil |

- **Contoh** visual `blocks`: Resep sirup memakai 2 sendok sirup untuk 3 gelas air. Jika sirupnya 4 sendok, berapa gelas air yang diperlukan agar rasanya tetap sama?
  - params: `{"a":2,"b":3,"k":2}`
  - jawaban: `6`
  - petunjuk: 1) Rasio harus tetap setara. 2) Perhatikan faktor pengali dari 2 ke 4. 3) Kalikan 3 dengan faktor yang sama.
  - penjelasan: Bagian pertama dikali 2, jadi bagian kedua juga dikali 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Resep sirup memakai 5 sendok sirup untuk 5 gelas air. Jika sirupnya 25 sendok, berapa gelas air yang diperlukan agar rasanya tetap sama?
  - params: `{"a":5,"b":5,"k":5}`
  - jawaban: `25`
  - petunjuk: 1) Rasio harus tetap setara. 2) Perhatikan faktor pengali dari 5 ke 25. 3) Kalikan 5 dengan faktor yang sama.
  - penjelasan: Bagian pertama dikali 5, jadi bagian kedua juga dikali 5.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Resep sirup memakai 4 sendok sirup untuk 2 gelas air. Jika sirupnya 8 sendok, berapa gelas air yang diperlukan agar rasanya tetap sama?
  - params: `{"a":4,"b":2,"k":2}`
  - jawaban: `4`
  - petunjuk: 1) Rasio harus tetap setara. 2) Perhatikan faktor pengali dari 4 ke 8. 3) Kalikan 2 dengan faktor yang sama.
  - penjelasan: Bagian pertama dikali 2, jadi bagian kedua juga dikali 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Pola dan nilai yang belum diketahui (`pola-proporsional`)

#### `pattern-multiplicative` kelas 5

30 soal dibangkitkan, 17 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 74, level 4 = 54 |

- **Contoh** visual `number-line`: Pola: 9, 27, 81, ... Angka berikutnya berapa?
  - params: `{"start":9,"factor":3,"current":81}`
  - jawaban: `243`
  - petunjuk: 1) Bandingkan suku pertama dan kedua. 2) Cari bilangan pengali yang sama. 3) Kalikan suku terakhir dengan 3.
  - penjelasan: Setiap suku dikali 3.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Pola: 6, 24, 96, ... Angka berikutnya berapa?
  - params: `{"start":6,"factor":4,"current":96}`
  - jawaban: `384`
  - petunjuk: 1) Bandingkan suku pertama dan kedua. 2) Cari bilangan pengali yang sama. 3) Kalikan suku terakhir dengan 4.
  - penjelasan: Setiap suku dikali 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Pola: 6, 12, 24, ... Angka berikutnya berapa?
  - params: `{"start":6,"factor":2,"current":24}`
  - jawaban: `48`
  - petunjuk: 1) Bandingkan suku pertama dan kedua. 2) Cari bilangan pengali yang sama. 3) Kalikan suku terakhir dengan 2.
  - penjelasan: Setiap suku dikali 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `pattern-multiplicative` kelas 6

30 soal dibangkitkan, 18 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 52, level 4 = 45 |

- **Contoh** visual `number-line`: Pola: 5, 10, 20, ... Angka berikutnya berapa?
  - params: `{"start":5,"factor":2,"current":20}`
  - jawaban: `40`
  - petunjuk: 1) Bandingkan suku pertama dan kedua. 2) Cari bilangan pengali yang sama. 3) Kalikan suku terakhir dengan 2.
  - penjelasan: Setiap suku dikali 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Pola: 6, 18, 54, ... Angka berikutnya berapa?
  - params: `{"start":6,"factor":3,"current":54}`
  - jawaban: `162`
  - petunjuk: 1) Bandingkan suku pertama dan kedua. 2) Cari bilangan pengali yang sama. 3) Kalikan suku terakhir dengan 3.
  - penjelasan: Setiap suku dikali 3.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Pola: 2, 4, 8, ... Angka berikutnya berapa?
  - params: `{"start":2,"factor":2,"current":8}`
  - jawaban: `16`
  - petunjuk: 1) Bandingkan suku pertama dan kedua. 2) Cari bilangan pengali yang sama. 3) Kalikan suku terakhir dengan 2.
  - penjelasan: Setiap suku dikali 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `missing-multiply-divide` kelas 5

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 75, level 4 = 51 |

- **Contoh** visual `blocks`: Lengkapi: 11 × □ = 44.
  - params: `{"factor":11,"product":44}`
  - jawaban: `4`
  - petunjuk: 1) Gunakan operasi kebalikan. 2) Jika perkalian diketahui hasilnya, gunakan pembagian. 3) Bagi 44 dengan 11.
  - penjelasan: Bilangan yang hilang adalah 44 ÷ 11 = 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Lengkapi: 8 × □ = 96.
  - params: `{"factor":8,"product":96}`
  - jawaban: `12`
  - petunjuk: 1) Gunakan operasi kebalikan. 2) Jika perkalian diketahui hasilnya, gunakan pembagian. 3) Bagi 96 dengan 8.
  - penjelasan: Bilangan yang hilang adalah 96 ÷ 8 = 12.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Lengkapi: 7 × □ = 14.
  - params: `{"factor":7,"product":14}`
  - jawaban: `2`
  - petunjuk: 1) Gunakan operasi kebalikan. 2) Jika perkalian diketahui hasilnya, gunakan pembagian. 3) Bagi 14 dengan 7.
  - penjelasan: Bilangan yang hilang adalah 14 ÷ 7 = 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `missing-multiply-divide` kelas 6

30 soal dibangkitkan, 28 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 70, level 4 = 53 |

- **Contoh** visual `blocks`: Lengkapi: 3 × □ = 42.
  - params: `{"factor":3,"product":42}`
  - jawaban: `14`
  - petunjuk: 1) Gunakan operasi kebalikan. 2) Jika perkalian diketahui hasilnya, gunakan pembagian. 3) Bagi 42 dengan 3.
  - penjelasan: Bilangan yang hilang adalah 42 ÷ 3 = 14.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Lengkapi: 12 × □ = 24.
  - params: `{"factor":12,"product":24}`
  - jawaban: `2`
  - petunjuk: 1) Gunakan operasi kebalikan. 2) Jika perkalian diketahui hasilnya, gunakan pembagian. 3) Bagi 24 dengan 12.
  - penjelasan: Bilangan yang hilang adalah 24 ÷ 12 = 2.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Lengkapi: 12 × □ = 60.
  - params: `{"factor":12,"product":60}`
  - jawaban: `5`
  - petunjuk: 1) Gunakan operasi kebalikan. 2) Jika perkalian diketahui hasilnya, gunakan pembagian. 3) Bagi 60 dengan 12.
  - penjelasan: Bilangan yang hilang adalah 60 ÷ 12 = 5.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Keliling dan luas (`keliling-luas`)

#### `perimeter-square` kelas 5

30 soal dibangkitkan, 14 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |

- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 11 cm. Berapa kelilingnya?
  - params: `{"side":11}`
  - jawaban: `44`
  - petunjuk: 1) Keliling adalah panjang seluruh sisi luar. 2) Persegi memiliki empat sisi sama panjang. 3) Kalikan panjang sisi dengan 4.
  - penjelasan: Keliling persegi = 4 × sisi = 44 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 4 cm. Berapa kelilingnya?
  - params: `{"side":4}`
  - jawaban: `16`
  - petunjuk: 1) Keliling adalah panjang seluruh sisi luar. 2) Persegi memiliki empat sisi sama panjang. 3) Kalikan panjang sisi dengan 4.
  - penjelasan: Keliling persegi = 4 × sisi = 16 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 19 cm. Berapa kelilingnya?
  - params: `{"side":19}`
  - jawaban: `76`
  - petunjuk: 1) Keliling adalah panjang seluruh sisi luar. 2) Persegi memiliki empat sisi sama panjang. 3) Kalikan panjang sisi dengan 4.
  - penjelasan: Keliling persegi = 4 × sisi = 76 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `perimeter-square` kelas 6

30 soal dibangkitkan, 15 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 11, level 4 = 8 |

- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 16 cm. Berapa kelilingnya?
  - params: `{"side":16}`
  - jawaban: `64`
  - petunjuk: 1) Keliling adalah panjang seluruh sisi luar. 2) Persegi memiliki empat sisi sama panjang. 3) Kalikan panjang sisi dengan 4.
  - penjelasan: Keliling persegi = 4 × sisi = 64 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 4 cm. Berapa kelilingnya?
  - params: `{"side":4}`
  - jawaban: `16`
  - petunjuk: 1) Keliling adalah panjang seluruh sisi luar. 2) Persegi memiliki empat sisi sama panjang. 3) Kalikan panjang sisi dengan 4.
  - penjelasan: Keliling persegi = 4 × sisi = 16 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 3 cm. Berapa kelilingnya?
  - params: `{"side":3}`
  - jawaban: `12`
  - petunjuk: 1) Keliling adalah panjang seluruh sisi luar. 2) Persegi memiliki empat sisi sama panjang. 3) Kalikan panjang sisi dengan 4.
  - penjelasan: Keliling persegi = 4 × sisi = 12 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `perimeter-rectangle` kelas 5

30 soal dibangkitkan, 27 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 14, level 4 = 14 |

- **Contoh** visual `grid`: Persegi panjang berukuran 7 cm × 4 cm. Berapa kelilingnya?
  - params: `{"length":7,"width":4}`
  - jawaban: `22`
  - petunjuk: 1) Keliling mengikuti seluruh tepi bangun. 2) Jumlahkan panjang dan lebar, lalu kalikan dua. 3) Gunakan 2 × (p + l).
  - penjelasan: Keliling = 2 × (panjang + lebar) = 22 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Persegi panjang berukuran 20 cm × 3 cm. Berapa kelilingnya?
  - params: `{"length":20,"width":3}`
  - jawaban: `46`
  - petunjuk: 1) Keliling mengikuti seluruh tepi bangun. 2) Jumlahkan panjang dan lebar, lalu kalikan dua. 3) Gunakan 2 × (p + l).
  - penjelasan: Keliling = 2 × (panjang + lebar) = 46 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Persegi panjang berukuran 15 cm × 5 cm. Berapa kelilingnya?
  - params: `{"length":15,"width":5}`
  - jawaban: `40`
  - petunjuk: 1) Keliling mengikuti seluruh tepi bangun. 2) Jumlahkan panjang dan lebar, lalu kalikan dua. 3) Gunakan 2 × (p + l).
  - penjelasan: Keliling = 2 × (panjang + lebar) = 40 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `perimeter-rectangle` kelas 6

30 soal dibangkitkan, 27 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 14, level 4 = 12 |

- **Contoh** visual `grid`: Persegi panjang berukuran 15 cm × 13 cm. Berapa kelilingnya?
  - params: `{"length":15,"width":13}`
  - jawaban: `56`
  - petunjuk: 1) Keliling mengikuti seluruh tepi bangun. 2) Jumlahkan panjang dan lebar, lalu kalikan dua. 3) Gunakan 2 × (p + l).
  - penjelasan: Keliling = 2 × (panjang + lebar) = 56 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Persegi panjang berukuran 6 cm × 3 cm. Berapa kelilingnya?
  - params: `{"length":6,"width":3}`
  - jawaban: `18`
  - petunjuk: 1) Keliling mengikuti seluruh tepi bangun. 2) Jumlahkan panjang dan lebar, lalu kalikan dua. 3) Gunakan 2 × (p + l).
  - penjelasan: Keliling = 2 × (panjang + lebar) = 18 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Persegi panjang berukuran 10 cm × 2 cm. Berapa kelilingnya?
  - params: `{"length":10,"width":2}`
  - jawaban: `24`
  - petunjuk: 1) Keliling mengikuti seluruh tepi bangun. 2) Jumlahkan panjang dan lebar, lalu kalikan dua. 3) Gunakan 2 × (p + l).
  - penjelasan: Keliling = 2 × (panjang + lebar) = 24 cm.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `perimeter-triangle` kelas 5

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 11, level 4 = 8 |

- **Contoh** visual `grid`: Segitiga memiliki sisi 5 cm, 10 cm, dan 9 cm. Berapa kelilingnya?
  - params: `{"a":5,"b":10,"c":9}`
  - jawaban: `24`
  - petunjuk: 1) Keliling berarti seluruh sisi luar. 2) Segitiga memiliki tiga sisi. 3) Jumlahkan ketiga panjang sisi.
  - penjelasan: Keliling segitiga adalah jumlah panjang ketiga sisinya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Segitiga memiliki sisi 10 cm, 9 cm, dan 12 cm. Berapa kelilingnya?
  - params: `{"a":10,"b":9,"c":12}`
  - jawaban: `31`
  - petunjuk: 1) Keliling berarti seluruh sisi luar. 2) Segitiga memiliki tiga sisi. 3) Jumlahkan ketiga panjang sisi.
  - penjelasan: Keliling segitiga adalah jumlah panjang ketiga sisinya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Segitiga memiliki sisi 7 cm, 8 cm, dan 8 cm. Berapa kelilingnya?
  - params: `{"a":7,"b":8,"c":8}`
  - jawaban: `23`
  - petunjuk: 1) Keliling berarti seluruh sisi luar. 2) Segitiga memiliki tiga sisi. 3) Jumlahkan ketiga panjang sisi.
  - penjelasan: Keliling segitiga adalah jumlah panjang ketiga sisinya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `perimeter-triangle` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |

- **Contoh** visual `grid`: Segitiga memiliki sisi 5 cm, 6 cm, dan 5 cm. Berapa kelilingnya?
  - params: `{"a":5,"b":6,"c":5}`
  - jawaban: `16`
  - petunjuk: 1) Keliling berarti seluruh sisi luar. 2) Segitiga memiliki tiga sisi. 3) Jumlahkan ketiga panjang sisi.
  - penjelasan: Keliling segitiga adalah jumlah panjang ketiga sisinya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Segitiga memiliki sisi 4 cm, 10 cm, dan 12 cm. Berapa kelilingnya?
  - params: `{"a":4,"b":10,"c":12}`
  - jawaban: `26`
  - petunjuk: 1) Keliling berarti seluruh sisi luar. 2) Segitiga memiliki tiga sisi. 3) Jumlahkan ketiga panjang sisi.
  - penjelasan: Keliling segitiga adalah jumlah panjang ketiga sisinya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Segitiga memiliki sisi 8 cm, 6 cm, dan 6 cm. Berapa kelilingnya?
  - params: `{"a":8,"b":6,"c":6}`
  - jawaban: `20`
  - petunjuk: 1) Keliling berarti seluruh sisi luar. 2) Segitiga memiliki tiga sisi. 3) Jumlahkan ketiga panjang sisi.
  - penjelasan: Keliling segitiga adalah jumlah panjang ketiga sisinya.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `area-square` kelas 5

30 soal dibangkitkan, 11 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |

- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 12 cm. Berapa luasnya?
  - params: `{"side":12}`
  - jawaban: `144`
  - petunjuk: 1) Luas mengukur bagian dalam bangun. 2) Bayangkan petak satuan yang menutupi persegi. 3) Kalikan sisi dengan sisi.
  - penjelasan: Luas persegi = sisi × sisi = 144 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 8 cm. Berapa luasnya?
  - params: `{"side":8}`
  - jawaban: `64`
  - petunjuk: 1) Luas mengukur bagian dalam bangun. 2) Bayangkan petak satuan yang menutupi persegi. 3) Kalikan sisi dengan sisi.
  - penjelasan: Luas persegi = sisi × sisi = 64 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 10 cm. Berapa luasnya?
  - params: `{"side":10}`
  - jawaban: `100`
  - petunjuk: 1) Luas mengukur bagian dalam bangun. 2) Bayangkan petak satuan yang menutupi persegi. 3) Kalikan sisi dengan sisi.
  - penjelasan: Luas persegi = sisi × sisi = 100 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `area-square` kelas 6

30 soal dibangkitkan, 11 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |

- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 6 cm. Berapa luasnya?
  - params: `{"side":6}`
  - jawaban: `36`
  - petunjuk: 1) Luas mengukur bagian dalam bangun. 2) Bayangkan petak satuan yang menutupi persegi. 3) Kalikan sisi dengan sisi.
  - penjelasan: Luas persegi = sisi × sisi = 36 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 3 cm. Berapa luasnya?
  - params: `{"side":3}`
  - jawaban: `9`
  - petunjuk: 1) Luas mengukur bagian dalam bangun. 2) Bayangkan petak satuan yang menutupi persegi. 3) Kalikan sisi dengan sisi.
  - penjelasan: Luas persegi = sisi × sisi = 9 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Sebuah persegi memiliki sisi 11 cm. Berapa luasnya?
  - params: `{"side":11}`
  - jawaban: `121`
  - petunjuk: 1) Luas mengukur bagian dalam bangun. 2) Bayangkan petak satuan yang menutupi persegi. 3) Kalikan sisi dengan sisi.
  - penjelasan: Luas persegi = sisi × sisi = 121 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `area-rectangle` kelas 5

30 soal dibangkitkan, 27 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `grid`: Persegi panjang berukuran 4 cm × 8 cm. Berapa luasnya?
  - params: `{"length":4,"width":8}`
  - jawaban: `32`
  - petunjuk: 1) Luas adalah banyak petak satuan di bagian dalam. 2) Bayangkan ada 4 kolom dan 8 baris. 3) Kalikan panjang dengan lebar.
  - penjelasan: Luas = panjang × lebar = 32 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Persegi panjang berukuran 15 cm × 5 cm. Berapa luasnya?
  - params: `{"length":15,"width":5}`
  - jawaban: `75`
  - petunjuk: 1) Luas adalah banyak petak satuan di bagian dalam. 2) Bayangkan ada 15 kolom dan 5 baris. 3) Kalikan panjang dengan lebar.
  - penjelasan: Luas = panjang × lebar = 75 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Persegi panjang berukuran 3 cm × 7 cm. Berapa luasnya?
  - params: `{"length":3,"width":7}`
  - jawaban: `21`
  - petunjuk: 1) Luas adalah banyak petak satuan di bagian dalam. 2) Bayangkan ada 3 kolom dan 7 baris. 3) Kalikan panjang dengan lebar.
  - penjelasan: Luas = panjang × lebar = 21 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `area-rectangle` kelas 6

30 soal dibangkitkan, 24 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 11, level 4 = 10 |

- **Contoh** visual `grid`: Persegi panjang berukuran 14 cm × 4 cm. Berapa luasnya?
  - params: `{"length":14,"width":4}`
  - jawaban: `56`
  - petunjuk: 1) Luas adalah banyak petak satuan di bagian dalam. 2) Bayangkan ada 14 kolom dan 4 baris. 3) Kalikan panjang dengan lebar.
  - penjelasan: Luas = panjang × lebar = 56 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Persegi panjang berukuran 14 cm × 7 cm. Berapa luasnya?
  - params: `{"length":14,"width":7}`
  - jawaban: `98`
  - petunjuk: 1) Luas adalah banyak petak satuan di bagian dalam. 2) Bayangkan ada 14 kolom dan 7 baris. 3) Kalikan panjang dengan lebar.
  - penjelasan: Luas = panjang × lebar = 98 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Persegi panjang berukuran 16 cm × 7 cm. Berapa luasnya?
  - params: `{"length":16,"width":7}`
  - jawaban: `112`
  - petunjuk: 1) Luas adalah banyak petak satuan di bagian dalam. 2) Bayangkan ada 16 kolom dan 7 baris. 3) Kalikan panjang dengan lebar.
  - penjelasan: Luas = panjang × lebar = 112 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `area-triangle` kelas 5

30 soal dibangkitkan, 27 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 12, level 4 = 11 |

- **Contoh** visual `grid`: Segitiga memiliki alas 10 cm dan tinggi 10 cm. Berapa luasnya?
  - params: `{"base":10,"height":10}`
  - jawaban: `50`
  - petunjuk: 1) Segitiga dapat dipasangkan menjadi satu persegi panjang. 2) Luas segitiga adalah setengah alas kali tinggi. 3) Kalikan alas dengan tinggi, lalu bagi dua.
  - penjelasan: Luas segitiga = alas × tinggi ÷ 2 = 50 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Segitiga memiliki alas 13 cm dan tinggi 10 cm. Berapa luasnya?
  - params: `{"base":13,"height":10}`
  - jawaban: `65`
  - petunjuk: 1) Segitiga dapat dipasangkan menjadi satu persegi panjang. 2) Luas segitiga adalah setengah alas kali tinggi. 3) Kalikan alas dengan tinggi, lalu bagi dua.
  - penjelasan: Luas segitiga = alas × tinggi ÷ 2 = 65 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Segitiga memiliki alas 13 cm dan tinggi 4 cm. Berapa luasnya?
  - params: `{"base":13,"height":4}`
  - jawaban: `26`
  - petunjuk: 1) Segitiga dapat dipasangkan menjadi satu persegi panjang. 2) Luas segitiga adalah setengah alas kali tinggi. 3) Kalikan alas dengan tinggi, lalu bagi dua.
  - penjelasan: Luas segitiga = alas × tinggi ÷ 2 = 26 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `area-triangle` kelas 6

30 soal dibangkitkan, 26 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |

- **Contoh** visual `grid`: Segitiga memiliki alas 16 cm dan tinggi 16 cm. Berapa luasnya?
  - params: `{"base":16,"height":16}`
  - jawaban: `128`
  - petunjuk: 1) Segitiga dapat dipasangkan menjadi satu persegi panjang. 2) Luas segitiga adalah setengah alas kali tinggi. 3) Kalikan alas dengan tinggi, lalu bagi dua.
  - penjelasan: Luas segitiga = alas × tinggi ÷ 2 = 128 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Segitiga memiliki alas 16 cm dan tinggi 22 cm. Berapa luasnya?
  - params: `{"base":16,"height":22}`
  - jawaban: `176`
  - petunjuk: 1) Segitiga dapat dipasangkan menjadi satu persegi panjang. 2) Luas segitiga adalah setengah alas kali tinggi. 3) Kalikan alas dengan tinggi, lalu bagi dua.
  - penjelasan: Luas segitiga = alas × tinggi ÷ 2 = 176 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Segitiga memiliki alas 4 cm dan tinggi 14 cm. Berapa luasnya?
  - params: `{"base":4,"height":14}`
  - jawaban: `28`
  - petunjuk: 1) Segitiga dapat dipasangkan menjadi satu persegi panjang. 2) Luas segitiga adalah setengah alas kali tinggi. 3) Kalikan alas dengan tinggi, lalu bagi dua.
  - penjelasan: Luas segitiga = alas × tinggi ÷ 2 = 28 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `area-composite` kelas 5

30 soal dibangkitkan, 29 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |

- **Contoh** visual `grid`: Bangun gabungan terdiri dari dua persegi panjang: 4 × 3 cm dan 2 × 2 cm. Berapa luas seluruhnya?
  - params: `{"a":4,"b":3,"c":2,"d":2}`
  - jawaban: `16`
  - petunjuk: 1) Pisahkan bangun menjadi dua bagian sederhana. 2) Hitung luas tiap persegi panjang. 3) Jumlahkan kedua luas.
  - penjelasan: Hitung luas masing-masing bagian lalu jumlahkan: 12 + 4 = 16 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Bangun gabungan terdiri dari dua persegi panjang: 4 × 6 cm dan 2 × 2 cm. Berapa luas seluruhnya?
  - params: `{"a":4,"b":6,"c":2,"d":2}`
  - jawaban: `28`
  - petunjuk: 1) Pisahkan bangun menjadi dua bagian sederhana. 2) Hitung luas tiap persegi panjang. 3) Jumlahkan kedua luas.
  - penjelasan: Hitung luas masing-masing bagian lalu jumlahkan: 24 + 4 = 28 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Bangun gabungan terdiri dari dua persegi panjang: 3 × 3 cm dan 6 × 5 cm. Berapa luas seluruhnya?
  - params: `{"a":3,"b":3,"c":6,"d":5}`
  - jawaban: `39`
  - petunjuk: 1) Pisahkan bangun menjadi dua bagian sederhana. 2) Hitung luas tiap persegi panjang. 3) Jumlahkan kedua luas.
  - penjelasan: Hitung luas masing-masing bagian lalu jumlahkan: 9 + 30 = 39 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `area-composite` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |

- **Contoh** visual `grid`: Bangun gabungan terdiri dari dua persegi panjang: 4 × 5 cm dan 3 × 4 cm. Berapa luas seluruhnya?
  - params: `{"a":4,"b":5,"c":3,"d":4}`
  - jawaban: `32`
  - petunjuk: 1) Pisahkan bangun menjadi dua bagian sederhana. 2) Hitung luas tiap persegi panjang. 3) Jumlahkan kedua luas.
  - penjelasan: Hitung luas masing-masing bagian lalu jumlahkan: 20 + 12 = 32 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Bangun gabungan terdiri dari dua persegi panjang: 4 × 7 cm dan 5 × 6 cm. Berapa luas seluruhnya?
  - params: `{"a":4,"b":7,"c":5,"d":6}`
  - jawaban: `58`
  - petunjuk: 1) Pisahkan bangun menjadi dua bagian sederhana. 2) Hitung luas tiap persegi panjang. 3) Jumlahkan kedua luas.
  - penjelasan: Hitung luas masing-masing bagian lalu jumlahkan: 28 + 30 = 58 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Bangun gabungan terdiri dari dua persegi panjang: 8 × 2 cm dan 6 × 2 cm. Berapa luas seluruhnya?
  - params: `{"a":8,"b":2,"c":6,"d":2}`
  - jawaban: `28`
  - petunjuk: 1) Pisahkan bangun menjadi dua bagian sederhana. 2) Hitung luas tiap persegi panjang. 3) Jumlahkan kedua luas.
  - penjelasan: Hitung luas masing-masing bagian lalu jumlahkan: 16 + 12 = 28 cm².
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Sudut dan durasi waktu (`sudut-waktu`)

#### `angle-measure` kelas 5

30 soal dibangkitkan, 3 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | angle: tanpa angle: sudut bawaan 90 derajat |
| sedang | `VISUAL-TIDAK-TAMPIL` | 30 | angle: VisualAid memakai ilustrasi CSS statis; AngleVisual (SVG sesuai derajat) tidak dipakai, jadi besar sudut tidak tergambar |
| sedang | `PETUNJUK-BOCOR` | 9 | petunjuk 1/2 sudah menyebut jawaban "90" |
| sedang | `SOAL-MONOTON` | 30 | hanya 3 soal berbeda dari 30 percobaan |

- **Contoh** visual `angle`: Besar sudut dari tiga perempat putaran adalah berapa derajat?
  - params: `{"turn":3}`
  - jawaban: `270`
  - petunjuk: 1) Satu putaran penuh adalah 360°. 2) Seperempat putaran adalah 90°. 3) Kalikan 3 dengan 90°.
  - penjelasan: Satu putaran penuh 360°. 3 bagian seperempat putaran = 270°.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `angle`: Besar sudut dari seperempat putaran adalah berapa derajat?
  - params: `{"turn":1}`
  - jawaban: `90`
  - petunjuk: 1) Satu putaran penuh adalah 360°. 2) Seperempat putaran adalah 90°. 3) Kalikan 1 dengan 90°.
  - penjelasan: Satu putaran penuh 360°. 1 bagian seperempat putaran = 90°.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `angle`: Besar sudut dari tiga perempat putaran adalah berapa derajat?
  - params: `{"turn":3}`
  - jawaban: `270`
  - petunjuk: 1) Satu putaran penuh adalah 360°. 2) Seperempat putaran adalah 90°. 3) Kalikan 3 dengan 90°.
  - penjelasan: Satu putaran penuh 360°. 3 bagian seperempat putaran = 270°.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `angle-measure` kelas 6

30 soal dibangkitkan, 3 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | angle: tanpa angle: sudut bawaan 90 derajat |
| sedang | `VISUAL-TIDAK-TAMPIL` | 30 | angle: VisualAid memakai ilustrasi CSS statis; AngleVisual (SVG sesuai derajat) tidak dipakai, jadi besar sudut tidak tergambar |
| sedang | `PETUNJUK-BOCOR` | 8 | petunjuk 1/2 sudah menyebut jawaban "90" |
| sedang | `SOAL-MONOTON` | 30 | hanya 3 soal berbeda dari 30 percobaan |

- **Contoh** visual `angle`: Besar sudut dari setengah putaran adalah berapa derajat?
  - params: `{"turn":2}`
  - jawaban: `180`
  - petunjuk: 1) Satu putaran penuh adalah 360°. 2) Seperempat putaran adalah 90°. 3) Kalikan 2 dengan 90°.
  - penjelasan: Satu putaran penuh 360°. 2 bagian seperempat putaran = 180°.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `angle`: Besar sudut dari setengah putaran adalah berapa derajat?
  - params: `{"turn":2}`
  - jawaban: `180`
  - petunjuk: 1) Satu putaran penuh adalah 360°. 2) Seperempat putaran adalah 90°. 3) Kalikan 2 dengan 90°.
  - penjelasan: Satu putaran penuh 360°. 2 bagian seperempat putaran = 180°.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `angle`: Besar sudut dari tiga perempat putaran adalah berapa derajat?
  - params: `{"turn":3}`
  - jawaban: `270`
  - petunjuk: 1) Satu putaran penuh adalah 360°. 2) Seperempat putaran adalah 90°. 3) Kalikan 3 dengan 90°.
  - penjelasan: Satu putaran penuh 360°. 3 bagian seperempat putaran = 270°.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `duration-calculate` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 1302, level 4 = 1127 |

- **Contoh** visual `number-line`: Angkot berangkat pukul 13.30 dan tiba pukul 14.58. Berapa lama perjalanan dalam menit?
  - params: `{"start":810,"duration":88,"end":898}`
  - jawaban: `88`
  - petunjuk: 1) Ubah jam menjadi menit atau hitung bertahap. 2) Ingat satu jam sama dengan 60 menit. 3) Kurangi waktu selesai dengan waktu mulai.
  - penjelasan: Selisih waktu dari mulai sampai selesai adalah 88 menit.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Angkot berangkat pukul 13.02 dan tiba pukul 15.38. Berapa lama perjalanan dalam menit?
  - params: `{"start":782,"duration":156,"end":938}`
  - jawaban: `156`
  - petunjuk: 1) Ubah jam menjadi menit atau hitung bertahap. 2) Ingat satu jam sama dengan 60 menit. 3) Kurangi waktu selesai dengan waktu mulai.
  - penjelasan: Selisih waktu dari mulai sampai selesai adalah 156 menit.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Angkot berangkat pukul 10.32 dan tiba pukul 13.08. Berapa lama perjalanan dalam menit?
  - params: `{"start":632,"duration":156,"end":788}`
  - jawaban: `156`
  - petunjuk: 1) Ubah jam menjadi menit atau hitung bertahap. 2) Ingat satu jam sama dengan 60 menit. 3) Kurangi waktu selesai dengan waktu mulai.
  - penjelasan: Selisih waktu dari mulai sampai selesai adalah 156 menit.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `duration-calculate` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | number-line: tanpa values atau a+b: garis bilangan memakai 0 dan 10 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 1281, level 4 = 1238 |

- **Contoh** visual `number-line`: Angkot berangkat pukul 10.03 dan tiba pukul 10.32. Berapa lama perjalanan dalam menit?
  - params: `{"start":603,"duration":29,"end":632}`
  - jawaban: `29`
  - petunjuk: 1) Ubah jam menjadi menit atau hitung bertahap. 2) Ingat satu jam sama dengan 60 menit. 3) Kurangi waktu selesai dengan waktu mulai.
  - penjelasan: Selisih waktu dari mulai sampai selesai adalah 29 menit.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Angkot berangkat pukul 10.12 dan tiba pukul 12.07. Berapa lama perjalanan dalam menit?
  - params: `{"start":612,"duration":115,"end":727}`
  - jawaban: `115`
  - petunjuk: 1) Ubah jam menjadi menit atau hitung bertahap. 2) Ingat satu jam sama dengan 60 menit. 3) Kurangi waktu selesai dengan waktu mulai.
  - penjelasan: Selisih waktu dari mulai sampai selesai adalah 115 menit.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `number-line`: Angkot berangkat pukul 11.28 dan tiba pukul 11.57. Berapa lama perjalanan dalam menit?
  - params: `{"start":688,"duration":29,"end":717}`
  - jawaban: `29`
  - petunjuk: 1) Ubah jam menjadi menit atau hitung bertahap. 2) Ingat satu jam sama dengan 60 menit. 3) Kurangi waktu selesai dengan waktu mulai.
  - penjelasan: Selisih waktu dari mulai sampai selesai adalah 29 menit.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Bangun ruang dan volume (`volume-ruang`)

#### `volume-unit-cubes` kelas 5

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 5, level 4 = 4 |

- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 6 panjang, 2 lebar, dan 4 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":6,"width":2,"height":4}`
  - jawaban: `48`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 6 × 2 × 4 = 48.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 2 panjang, 2 lebar, dan 2 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":2,"width":2,"height":2}`
  - jawaban: `8`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 2 × 2 × 2 = 8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 4 panjang, 2 lebar, dan 4 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":4,"width":2,"height":4}`
  - jawaban: `32`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 4 × 2 × 4 = 32.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `volume-unit-cubes` kelas 6

30 soal dibangkitkan, 25 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |

- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 6 panjang, 4 lebar, dan 3 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":6,"width":4,"height":3}`
  - jawaban: `72`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 6 × 4 × 3 = 72.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 6 panjang, 5 lebar, dan 3 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":6,"width":5,"height":3}`
  - jawaban: `90`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 6 × 5 × 3 = 90.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Balok tersusun dari kubus satuan: 6 panjang, 4 lebar, dan 3 tinggi. Berapa kubus satuan yang dibutuhkan?
  - params: `{"length":6,"width":4,"height":3}`
  - jawaban: `72`
  - petunjuk: 1) Hitung jumlah kubus pada satu lapisan. 2) Kalikan panjang dan lebar untuk satu lapisan. 3) Kalikan banyak kubus satu lapisan dengan jumlah lapisan.
  - penjelasan: Jumlah kubus = 6 × 4 × 3 = 72.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `solid-properties` kelas 5

30 soal dibangkitkan, 6 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| sedang | `SOAL-MONOTON` | 30 | hanya 6 soal berbeda dari 30 percobaan |

- **Contoh** visual `blocks`: Berapa banyak sisi pada kubus?
  - params: `{"faces":6,"edges":12,"vertices":8,"property":"faces"}`
  - jawaban: `6`
  - petunjuk: 1) Bayangkan bangun ruang dari beberapa sisi datar. 2) Bedakan sisi, rusuk, dan titik sudut. 3) Kubus dan balok memiliki jumlah sisi, rusuk, dan titik sudut yang sama.
  - penjelasan: kubus memiliki 6 sisi, 12 rusuk, dan 8 titik sudut.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Berapa banyak titik sudut pada kubus?
  - params: `{"faces":6,"edges":12,"vertices":8,"property":"vertices"}`
  - jawaban: `8`
  - petunjuk: 1) Bayangkan bangun ruang dari beberapa sisi datar. 2) Bedakan sisi, rusuk, dan titik sudut. 3) Kubus dan balok memiliki jumlah sisi, rusuk, dan titik sudut yang sama.
  - penjelasan: kubus memiliki 6 sisi, 12 rusuk, dan 8 titik sudut.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Berapa banyak rusuk pada balok?
  - params: `{"faces":6,"edges":12,"vertices":8,"property":"edges"}`
  - jawaban: `12`
  - petunjuk: 1) Bayangkan bangun ruang dari beberapa sisi datar. 2) Bedakan sisi, rusuk, dan titik sudut. 3) Kubus dan balok memiliki jumlah sisi, rusuk, dan titik sudut yang sama.
  - penjelasan: balok memiliki 6 sisi, 12 rusuk, dan 8 titik sudut.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `solid-properties` kelas 6

30 soal dibangkitkan, 6 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | blocks: params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan" |
| sedang | `SOAL-MONOTON` | 30 | hanya 6 soal berbeda dari 30 percobaan |

- **Contoh** visual `blocks`: Berapa banyak titik sudut pada kubus?
  - params: `{"faces":6,"edges":12,"vertices":8,"property":"vertices"}`
  - jawaban: `8`
  - petunjuk: 1) Bayangkan bangun ruang dari beberapa sisi datar. 2) Bedakan sisi, rusuk, dan titik sudut. 3) Kubus dan balok memiliki jumlah sisi, rusuk, dan titik sudut yang sama.
  - penjelasan: kubus memiliki 6 sisi, 12 rusuk, dan 8 titik sudut.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Berapa banyak titik sudut pada balok?
  - params: `{"faces":6,"edges":12,"vertices":8,"property":"vertices"}`
  - jawaban: `8`
  - petunjuk: 1) Bayangkan bangun ruang dari beberapa sisi datar. 2) Bedakan sisi, rusuk, dan titik sudut. 3) Kubus dan balok memiliki jumlah sisi, rusuk, dan titik sudut yang sama.
  - penjelasan: balok memiliki 6 sisi, 12 rusuk, dan 8 titik sudut.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `blocks`: Berapa banyak titik sudut pada balok?
  - params: `{"faces":6,"edges":12,"vertices":8,"property":"vertices"}`
  - jawaban: `8`
  - petunjuk: 1) Bayangkan bangun ruang dari beberapa sisi datar. 2) Bedakan sisi, rusuk, dan titik sudut. 3) Kubus dan balok memiliki jumlah sisi, rusuk, dan titik sudut yang sama.
  - penjelasan: balok memiliki 6 sisi, 12 rusuk, dan 8 titik sudut.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Lokasi pada peta berpetak (`peta-berpetak`)

#### `grid-location` kelas 5

30 soal dibangkitkan, 23 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 4, level 4 = 4 |

- **Contoh** visual `grid`: Kamu berada di petak (2, 4). Bergerak satu petak ke kiri. Kolom berubah. Berapa kolom barumu?
  - params: `{"x":2,"y":4,"nx":1,"ny":5}`
  - jawaban: `1`
  - petunjuk: 1) Koordinat pertama menunjukkan kolom. 2) Gerak ke kanan menambah kolom satu. 3) Kolom baru adalah 2 − 1.
  - penjelasan: Kolom berubah dari 2 menjadi 1; baris tetap 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Kamu berada di petak (2, 1). Bergerak satu petak ke kanan. Kolom berubah. Berapa kolom barumu?
  - params: `{"x":2,"y":1,"nx":3,"ny":2}`
  - jawaban: `3`
  - petunjuk: 1) Koordinat pertama menunjukkan kolom. 2) Gerak ke kanan menambah kolom satu. 3) Kolom baru adalah 2 + 1.
  - penjelasan: Kolom berubah dari 2 menjadi 3; baris tetap 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Kamu berada di petak (5, 4). Bergerak satu petak ke kiri. Kolom berubah. Berapa kolom barumu?
  - params: `{"x":5,"y":4,"nx":4,"ny":3}`
  - jawaban: `4`
  - petunjuk: 1) Koordinat pertama menunjukkan kolom. 2) Gerak ke kanan menambah kolom satu. 3) Kolom baru adalah 5 − 1.
  - penjelasan: Kolom berubah dari 5 menjadi 4; baris tetap 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `grid-location` kelas 6

30 soal dibangkitkan, 22 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| tinggi | `VISUAL-PARAMETER` | 30 | grid: tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3 |
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 5, level 4 = 4 |

- **Contoh** visual `grid`: Kamu berada di petak (5, 4). Bergerak satu petak ke kiri. Kolom berubah. Berapa kolom barumu?
  - params: `{"x":5,"y":4,"nx":4,"ny":5}`
  - jawaban: `4`
  - petunjuk: 1) Koordinat pertama menunjukkan kolom. 2) Gerak ke kanan menambah kolom satu. 3) Kolom baru adalah 5 − 1.
  - penjelasan: Kolom berubah dari 5 menjadi 4; baris tetap 4.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Kamu berada di petak (4, 3). Bergerak satu petak ke kanan. Kolom berubah. Berapa kolom barumu?
  - params: `{"x":4,"y":3,"nx":5,"ny":4}`
  - jawaban: `5`
  - petunjuk: 1) Koordinat pertama menunjukkan kolom. 2) Gerak ke kanan menambah kolom satu. 3) Kolom baru adalah 4 + 1.
  - penjelasan: Kolom berubah dari 4 menjadi 5; baris tetap 3.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `grid`: Kamu berada di petak (2, 5). Bergerak satu petak ke kanan. Kolom berubah. Berapa kolom barumu?
  - params: `{"x":2,"y":5,"nx":3,"ny":6}`
  - jawaban: `3`
  - petunjuk: 1) Koordinat pertama menunjukkan kolom. 2) Gerak ke kanan menambah kolom satu. 3) Kolom baru adalah 2 + 1.
  - penjelasan: Kolom berubah dari 2 menjadi 3; baris tetap 5.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

### Topik: Membaca dan menganalisis data (`data-c`)

#### `table-frequency` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 8, level 4 = 6 |

- **Contoh** visual `chart`: Data buah di pasar: Apel 7 kg, Jeruk 9 kg, Pisang 6 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[7,9,6],"index":1}`
  - jawaban: `22`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Data buah di pasar: Apel 7 kg, Jeruk 3 kg, Pisang 9 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[7,3,9],"index":1}`
  - jawaban: `19`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Data buah di pasar: Apel 5 kg, Jeruk 6 kg, Pisang 3 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[5,6,3],"index":1}`
  - jawaban: `14`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `table-frequency` kelas 6

30 soal dibangkitkan, 28 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `chart`: Data buah di pasar: Apel 3 kg, Jeruk 7 kg, Pisang 9 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[3,7,9],"index":1}`
  - jawaban: `19`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Data buah di pasar: Apel 7 kg, Jeruk 2 kg, Pisang 4 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[7,2,4],"index":1}`
  - jawaban: `13`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Data buah di pasar: Apel 8 kg, Jeruk 7 kg, Pisang 4 kg. Berapa kilogram jumlah seluruh buah?
  - params: `{"values":[8,7,4],"index":0}`
  - jawaban: `19`
  - petunjuk: 1) Perhatikan jumlah pada setiap kategori. 2) Jangan menjumlahkan nama kategori, jumlahkan angkanya. 3) Jumlahkan ketiga frekuensi.
  - penjelasan: Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `bar-chart-read` kelas 5

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 10, level 4 = 9 |

- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 2, hari 2 8, hari 3 2. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[2,8,2]}`
  - jawaban: `6`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 8 − data terkecil 2 = 6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 7, hari 2 7, hari 3 8. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[7,7,8]}`
  - jawaban: `1`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 8 − data terkecil 7 = 1.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 9, hari 2 6, hari 3 6. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[9,6,6]}`
  - jawaban: `3`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 9 − data terkecil 6 = 3.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `bar-chart-read` kelas 6

30 soal dibangkitkan, 30 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 10, level 4 = 9 |

- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 9, hari 2 11, hari 3 2. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[9,11,2]}`
  - jawaban: `9`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 11 − data terkecil 2 = 9.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 6, hari 2 4, hari 3 11. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[6,4,11]}`
  - jawaban: `7`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 11 − data terkecil 4 = 7.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 2, hari 2 8, hari 3 6. Berapa selisih kehadiran terbanyak dan tersedikit?
  - params: `{"values":[2,8,6]}`
  - jawaban: `6`
  - petunjuk: 1) Temukan batang paling tinggi dan paling rendah. 2) Baca angka pada kedua batang. 3) Kurangkan jumlah terkecil dari jumlah terbesar.
  - penjelasan: Selisih = data terbesar 8 − data terkecil 2 = 6.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `pictogram-read` kelas 5

30 soal dibangkitkan, 28 berbeda.

| Tingkat | Kode | Jumlah | Contoh |
|---|---|---|---|
| rendah | `KESULITAN-TIDAK-NAIK` | 1 | angka terbesar rata-rata level 0 = 4, level 4 = 4 |

- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 5 kg. Ada 3, 4, dan 4 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":5,"counts":[3,4,4]}`
  - jawaban: `55`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 11. Setiap gambar bernilai 5, jadi total 55.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 5 kg. Ada 2, 2, dan 3 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":5,"counts":[2,2,3]}`
  - jawaban: `35`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 7. Setiap gambar bernilai 5, jadi total 35.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 2 kg. Ada 1, 3, dan 2 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":2,"counts":[1,3,2]}`
  - jawaban: `12`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 6. Setiap gambar bernilai 2, jadi total 12.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu

#### `pictogram-read` kelas 6

30 soal dibangkitkan, 25 berbeda.

Tidak ada temuan otomatis.

- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 2 kg. Ada 1, 1, dan 2 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":2,"counts":[1,1,2]}`
  - jawaban: `8`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 4. Setiap gambar bernilai 2, jadi total 8.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 2 kg. Ada 1, 2, dan 2 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":2,"counts":[1,2,2]}`
  - jawaban: `10`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 5. Setiap gambar bernilai 2, jadi total 10.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
- **Contoh** visual `chart`: Pada piktogram kios buah, satu gambar mewakili 2 kg. Ada 1, 4, dan 4 gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?
  - params: `{"unit":2,"counts":[1,4,4]}`
  - jawaban: `18`
  - petunjuk: 1) Baca keterangan nilai satu gambar. 2) Jumlahkan semua gambar terlebih dahulu. 3) Kalikan total gambar dengan nilai setiap gambar.
  - penjelasan: Jumlah gambar 9. Setiap gambar bernilai 2, jadi total 18.
  - langkah Biji: Pahami soalnya > Pikirkan caranya > Kerjakan pelan-pelan > Cek hasilnya > Jawabanmu
