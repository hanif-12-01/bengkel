# Panduan & Dokumentasi Penerapan Defensive Programming

Dokumen ini menjelaskan strategi, filosofi, dan implementasi *Defensive Programming* (Pemrograman Defensif) yang diterapkan pada aplikasi booking bengkel mobil dan motor (bengkel-api & frontend React) untuk meningkatkan keamanan, stabilitas, dan ketahanan data.

---

## 1. Filosofi Defensive Programming yang Diterapkan
Penerapan defensive programming didasarkan pada dua prinsip utama:
1. **"Never Trust User Input"** (Jangan pernah mempercayai input pengguna): Semua data yang datang dari luar sistem (frontend, client API, request body, query parameter) harus dianggap berpotensi berbahaya dan harus divalidasi serta disanitasi secara ketat sebelum diproses atau disimpan ke database.
2. **"Fail Securely & Gracefully"** (Gagal dengan aman dan anggun): Ketika sistem menghadapi error, ia tidak boleh mengekspos informasi sensitif (seperti detail database atau stack trace). Error ditangani secara terpusat dan dikembalikan ke klien dalam format JSON yang bersih dan informatif.

---

## 2. Implementasi Sisi Backend (PHP Native)

### A. Restriksi Ukuran Request Body & Runtime (`index.php`)
Untuk melindungi backend dari serangan Denial of Service (DoS) atau penyerapan memori berlebihan:
- Membatasi eksekusi skrip maksimum 30 detik (`max_execution_time = 30`).
- Membatasi ukuran payload maksimum (`Content-Length` dibatasi maksimal 5MB). Request yang melebihi batas ini langsung ditolak dengan status HTTP 413 (Payload Too Large).

### B. Header Keamanan HTTP (Security Headers)
API menyajikan HTTP Security Headers yang kuat untuk meminimalkan serangan web client-side:
- `X-Content-Type-Options: nosniff`: Mencegah MIME-type sniffing.
- `X-Frame-Options: DENY`: Melindungi aplikasi dari clickjacking.
- `X-XSS-Protection: 1; mode=block`: Mengaktifkan filter XSS bawaan browser.

### C. Helper Validasi Terpusat (`helpers/validator.php`)
Seluruh input divalidasi menggunakan helper kelas `Validator` sebelum diproses oleh controller. Aturan validasi mencakup:
- **Nama & Merek/Tipe Kendaraan:** Wajib diisi, minimal 2 karakter, maksimal 50/100 karakter, hanya karakter alfanumerik dan spasi, serta tidak boleh hanya berisi whitespace.
- **Tahun Kendaraan:** Harus berupa angka numerik utuh, rentang valid antara tahun 1900 hingga tahun depan (`current_year + 1`).
- **Nomor Polisi (Pelat Nomor):** Validasi format regex pelat nomor Indonesia yang valid (contoh: `B 1234 ABC`, `AD 9876 XYZ`, dll), minimal 3 karakter dan maksimal 15 karakter setelah dibersihkan dari spasi.
- **Warna:** Wajib diisi, minimal 2 karakter, maksimal 30 karakter.
- **Tanggal Servis:** Format harus `YYYY-MM-DD`, tidak boleh tanggal masa lalu (past date).
- **Waktu Kedatangan:** Harus berada di dalam jam operasional bengkel (08:00 - 17:00).
- **Nomor Telepon:** Harus berupa angka dengan panjang 9-15 digit, diawali format standar Indonesia (08 atau 62).
- **Email:** Format email divalidasi dengan filter standard PHP (`filter_var(..., FILTER_VALIDATE_EMAIL)`).

### D. Transaksi Database Aman & Prepared Statements
- **Prepared Statements:** Menggunakan parameter binding (`PDO::prepare`) untuk setiap eksekusi query dinamis SQL guna menolak serangan SQL Injection.
- **Database Transactions:** Proses pembuatan booking melibatkan penyimpanan ke tabel `bookings` dan tabel pivot `booking_services`. Proses ini dibungkus dengan transaksi database (`beginTransaction()`, `commit()`, dan `rollBack()`) untuk memastikan integritas data (Atomicity).

### E. Penanganan Error Global dengan Safe JSON Response
Semua error ditangkap menggunakan blok `try-catch` secara global dan dikembalikan dalam bentuk respons JSON berstatus HTTP yang sesuai (400, 401, 403, 404, 422, 500) tanpa mengekspos internal stack trace ke pengguna publik.

---

## 3. Implementasi Sisi Frontend (React)

### A. Validasi Client-side Terpadu (`src/lib/validation.ts`)
Frontend menduplikasi aturan validasi backend untuk memberikan feedback instan (UX yang baik) dan mengurangi beban request ke backend:
- Menolak input tidak valid langsung di tingkat form sebelum dikirim ke API.
- Membersihkan spasi berlebih (`trim()`) dan menormalkan input secara otomatis (seperti mengubah format pelat nomor menjadi uppercase).

### B. Validasi Alur Pembuatan Booking
- **Langkah 1:** Memverifikasi pemilihan kendaraan dan jenis layanan telah terpilih sebelum melangkah ke step berikutnya.
- **Langkah 2:** Memvalidasi tanggal yang dipilih (bukan tanggal lampau) dan jam kedatangan (hanya diperbolehkan jam 08:00 - 17:00).
- **Langkah 3:** Mengharuskan pengguna mencentang persetujuan syarat & ketentuan sebelum tombol submit aktif.

---

## 4. Keuntungan Arsitektur Ini
1. **Konsistensi:** Validasi ganda di frontend (UX) dan backend (Security) memastikan data yang masuk ke database 100% bersih.
2. **Kinerja Ringan:** PHP Native + PDO meminimalkan overhead framework, menghasilkan response time yang sangat cepat.
3. **Kemudahan Pemeliharaan:** Struktur helper yang modular mempermudah penambahan aturan validasi baru jika tipe kendaraan atau layanan bertambah di kemudian hari.