import { SiteHeader } from '../components/SiteHeader'

export function PrivacyPage() {
  return <>
    <SiteHeader backHref="/" backLabel="Beranda" />
    <main className="page inner-page privacy-page">
      <section className="page-heading paper-card"><div><p className="eyebrow">INFORMASI PRIVASI</p><h1>Belajar dengan <span>lebih aman.</span></h1><p>Ruang Hitung dirancang untuk digunakan anak tanpa akun dan tanpa pelacakan.</p></div></section>
      <section className="privacy-content">
        <h2>Data apa yang disimpan?</h2>
        <p>Ruang Hitung tidak meminta nama, alamat, nomor telepon, email, tanggal lahir, atau data pribadi anak. Tidak ada akun, iklan, analitik, maupun pelacak pihak ketiga.</p>
        <p>Progres latihan seperti topik yang dicoba, jawaban benar, bintang, dan pengingat latihan disimpan di penyimpanan lokal browser pada perangkat yang digunakan. Data tersebut tidak dikirim ke server Ruang Hitung.</p>
        <h2>Bagaimana menghapusnya?</h2>
        <p>Orang tua atau guru dapat menghapus progres melalui pengaturan situs pada browser atau membersihkan data situs untuk Ruang Hitung. Menghapus data browser juga menghapus catatan belajar yang tersimpan.</p>
        <h2>Apakah bisa dipakai bersama?</h2>
        <p>Ya, tetapi perangkat bersama berarti pengguna lain yang memakai browser yang sama mungkin dapat melihat progres. Hindari menyimpan informasi pribadi di kolom atau perangkat bersama.</p>
        <h2>Offline</h2>
        <p>Setelah halaman dan latihan dimuat, aset aplikasi dapat disimpan di cache perangkat agar beberapa halaman tetap dapat dibuka tanpa koneksi internet. Cache hanya berisi file aplikasi, bukan catatan progres pribadi.</p>
        <h2>Dasar pelindungan</h2>
        <p>Praktik minimisasi data ini disusun dengan memperhatikan semangat Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi. Halaman ini bukan pengganti penilaian hukum atas penggunaan atau distribusi aplikasi.</p>
      </section>
      <footer className="site-footer"><a href="/">Beranda</a><a href="/laporan/">Laporan</a></footer>
    </main>
  </>
}
