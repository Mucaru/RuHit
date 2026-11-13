# Riset kurikulum dan pedagogi Ruang Hitung

## Landasan kurikulum

Sumber normatif utama adalah Keputusan Kepala BSKAP Nomor 046/H/KR/2025, Lampiran II, bagian IV.1 Capaian Pembelajaran Matematika. CP reguler SD dipetakan berdasarkan fase: A (kelas 1–2), B (kelas 3–4), dan C (kelas 5–6). CP menetapkan capaian di akhir fase, bukan pembagian resmi per kelas. Karena itu, pembagian topik ke kelas 1–6 dalam `client/src/data/kurikulum.ts` merupakan usulan urutan belajar yang eksplisit diberi label, bukan klaim ATP nasional.

### Ringkasan CP yang menjadi dasar

- **Fase A:** bilangan cacah sampai 100; operasi tambah/kurang konkret sampai 20; pecahan setengah dan seperempat; kesetaraan sederhana; pola bukan bilangan; perbandingan dan pengukuran tidak baku; bangun datar/ruang dan posisi; turus/piktogram sampai empat kategori.
- **Fase B:** bilangan sampai 10.000; tambah/kurang sampai 1.000; perkalian/pembagian sampai 100; faktor/kelipatan; pecahan sederhana dan senilai; intuisi desimal serta persen; pola dan bilangan yang belum diketahui; panjang, berat, luas, volume; bangun datar; tabel, piktogram, dan diagram batang skala satu.
- **Fase C:** bilangan sampai 1.000.000; empat operasi sampai 100.000; masalah uang, KPK/FPB, pecahan termasuk campuran dan operasinya dengan bilangan asli, desimal satu angka di belakang koma; pola perkalian/pembagian, rasio satuan dan proporsi; keliling, luas, durasi, sudut; bangun ruang, visualisasi spasial, peta berpetak; tabel frekuensi, piktogram, dan diagram batang.

## Catatan agar tidak melampaui CP

1. Persen tercantum eksplisit pada Fase B dalam relasi pecahan–desimal–persen. Di kelas 5–6 persen hanya disajikan sebagai penguatan, bukan capaian baru Fase C.
2. CP Fase C menyebut analisis data dan peluang sebagai elemen, tetapi rincian kompetensinya menyebut representasi dan analisis data. Peluang sederhana tidak ditambahkan sebagai target wajib karena tidak dirinci eksplisit.
3. Fase C meminta mengonstruksi/mengurai kubus dan balok serta visualisasi spasial. Volume dengan kubus satuan dipakai sebagai intuisi pendukung, bukan rumus volume formal yang diklaim sebagai CP eksplisit Fase C.
4. Bilangan prima dipakai sebagai prasyarat/strategi untuk faktor, FPB, dan KPK. CP secara eksplisit menyebut faktor/kelipatan dan KPK/FPB, bukan target terpisah “bilangan prima”.
5. Rasio satuan dan proporsi dicakup; rasio non-proporsional atau materi rasio tingkat SMP tidak dimasukkan.

## Miskonsepsi diagnostik dan respons desain

| Topik | Pola miskonsepsi yang perlu didiagnosis | Respons belajar |
|---|---|---|
| Pecahan | Whole-number bias; membandingkan pembilang/penyebut terpisah; menjumlahkan penyebut; pecahan dianggap bagian yang tidak harus sama besar | Fraction bar/pizza, garis bilangan, pecahan senilai, penjelasan penyebut sebagai ukuran bagian |
| Desimal | Menganggap digit setelah koma sebagai bilangan bulat terpisah; salah memahami nol penanda tempat | Tabel nilai tempat, garis bilangan, bandingkan 0,5 dan 0,50 secara visual |
| Faktor/kelipatan | Faktor dan kelipatan tertukar; bilangan ganjil dianggap prima | Susunan kelompok, daftar faktor, saringan pembagi, garis kelipatan |
| Rasio | Menggunakan penambahan tetap ketika hubungan seharusnya perkalian; satuan tidak disamakan | Tabel per satuan, model kelompok setara, konteks resep/paket |
| Keliling/luas | Menganggap luas sama berarti keliling sama; tertukar mengukur batas dan bagian dalam | Grid satuan, tali keliling, bandingkan persegi panjang berlainan |
| Sudut | Mengira sudut ditentukan panjang kaki; terpaku pada sudut siku-siku | Model dua arah/pintu yang berputar; tekankan bukaan, bukan panjang garis |
| Waktu | Menggunakan basis 100 untuk menit; salah melewati pergantian jam | Jam analog dan garis waktu; hitung per 60 menit |
| Data | Tidak membaca skala/legenda; salah mengartikan kategori dan frekuensi | Tabel sumber selalu tampil bersama grafik dan label skala |
| Nilai tempat/operasi | Salah menempatkan simpanan/pinjaman atau nilai digit | Blok nilai tempat, kolom sejajar, worked example lalu latihan bertahap |

Catatan miskonsepsi adalah hipotesis diagnostik untuk umpan balik, bukan label kemampuan anak dan bukan diagnosis permanen.

## Pedagogi

Ruang Hitung menggunakan **Concrete–Representational–Abstract (CRA/CPA)** secara fleksibel:

1. **Konkret:** blok nilai tempat, potongan pecahan, benda yang dikelompokkan, kubus satuan.
2. **Representasional:** gambar blok, bar pecahan, garis bilangan, grid luas, tabel/diagram.
3. **Abstrak:** simbol, operasi, rumus, dan notasi.

Urutan tiga langkah ini bukan aturan kaku. Representasi dipilih berdasarkan tujuan dan boleh dipakai kembali ketika anak membutuhkannya. Scaffolding bergerak dari contoh lengkap (Lihat), latihan dengan bantuan (Kerjakan bareng), lalu latihan mandiri (Coba sendiri). Petunjuk meningkat dari arah, langkah, sampai contoh bantuan penuh; bantuan dikurangi seiring kemajuan. Tidak ada batas waktu atau hukuman.

## Sumber

- BSKAP. (2025). *Keputusan Kepala BSKAP Nomor 046/H/KR/2025 tentang Capaian Pembelajaran pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah*. https://bpmpbabel.kemendikdasmen.go.id/PPID/wp-content/uploads/2025/07/KepKaBSKAP-046_2025-ttg-CP.pdf
- Setiyani, A., et al. (2025). *Panduan mata pelajaran matematika: fase A–F*. Repositori Kemendikdasmen. https://repositori.kemendikdasmen.go.id/33608/
- Institute of Education Sciences. (2021). *Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades*. https://ies.ed.gov/ncee/wwc/PracticeGuide/26
- Institute of Education Sciences. *Mathematics Support Grades 3–6: Representations*. https://ies.ed.gov/ncee/rel/math-support-grades-3-6/
- Sunandar, Kholid, Chandra, & Parid. (2026). *Desain Pembelajaran untuk Miskonsepsi Pecahan pada Siswa Sekolah Dasar: Sebuah Systematic Literature Review*. https://www.journal.unpas.ac.id/index.php/pendas/article/view/42836
- *Misconceptions of Elementary School Students about Comparing Decimal Numbers*. (2014). https://www.sciencedirect.com/science/article/pii/S1877042814053129
- Winarti, D. W., Amin, S. M., Lukito, A., & Van Gallen, F. (2012). Learning the concept of area and perimeter by exploring their relation. *Journal on Mathematics Education, 3*(1), 41–54. https://eric.ed.gov/?id=EJ1078518
- Tan Sisman, G., & Aksu, M. (2016). A study on sixth grade students’ misconceptions and errors in spatial measurement: Length, area, and volume. *International Journal of Science and Mathematics Education, 14*, 1293–1319. https://eric.ed.gov/?id=EJ1112633
- Devichi, C., & Munier, V. (2013). About the concept of angle in elementary school: Misconceptions and teaching sequences. *The Journal of Mathematical Behavior, 32*(1), 1–19. https://eric.ed.gov/?id=EJ995568
