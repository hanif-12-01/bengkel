# Security & Defensive Programming Test Cases

Dokumen ini berisi daftar skenario pengujian (*test cases*) untuk memverifikasi keandalan, stabilitas, dan keamanan implementasi *Defensive Programming* pada aplikasi booking bengkel baik di sisi frontend maupun backend.

---

## 1. Uji Validasi Input (Kendaraan)

### TS-01: Pendaftaran Kendaraan dengan Nama Merek/Model Terlalu Pendek atau Kosong
- **Langkah Pengujian:**
  1. Masuk ke halaman "Garasi Saya" (atau buka modal tambah kendaraan di Booking Page).
  2. Input Merek atau Model Kendaraan dengan satu karakter (misal: `X`) atau hanya spasi (`   `).
  3. Klik tombol "Simpan Kendaraan".
- **Hasil yang Diharapkan:**
  - **Frontend:** Form menolak pengiriman dan menampilkan pesan error seperti: `"Merek tidak boleh kurang dari 2 karakter."` atau `"Tipe/Model wajib diisi."`
  - **Backend:** Jika request dikirim langsung (misal via Postman), server membalas dengan status `422 Unprocessable Entity` dan detail error JSON:
    ```json
    {
      "success": false,
      "message": "Validasi gagal",
      "errors": {
        "brand": "Merek tidak boleh kurang dari 2 karakter."
      }
    }
    ```

### TS-02: Input Nomor Polisi (Pelat Nomor) Tidak Valid
- **Langkah Pengujian:**
  1. Pada form tambah kendaraan, masukkan Merek: `Toyota`, Model: `Avanza`, Tahun: `2020`, Warna: `Hitam`.
  2. Masukkan nomor polisi dengan karakter ilegal atau format tidak standar (misal: `B-1234@ABC`, `12345678`, atau `ABC`).
  3. Klik tombol "Simpan Kendaraan".
- **Hasil yang Diharapkan:**
  - **Frontend & Backend:** Menampilkan error: `"Format nomor polisi tidak valid (misal: B 1234 ABC)."`

### TS-03: Input Tahun Kendaraan di Luar Rentang Valid
- **Langkah Pengujian:**
  1. Pada form tambah kendaraan, masukkan tahun `1899` (di bawah 1900) atau `2028` (di luar batas tahun depan).
  2. Klik tombol "Simpan Kendaraan".
- **Hasil yang Diharapkan:**
  - **Frontend & Backend:** Menolak input dan menampilkan pesan: `"Tahun kendaraan harus di antara 1900 dan [Tahun Depan]."`

---

## 2. Uji Aturan Bisnis & Operasional (Business Logic Rules)

### TS-04: Booking pada Tanggal Masa Lalu (Past Date)
- **Langkah Pengujian:**
  1. Pada halaman booking langkah 2, pilih tanggal servis kemarin atau tanggal sebelum hari ini.
  2. Klik "Lanjutkan".
- **Hasil yang Diharapkan:**
  - **Frontend:** Memunculkan peringatan/alert: `"Tanggal servis tidak boleh di masa lalu."` dan mencegah melangkah ke konfirmasi.
  - **Backend:** Membatalkan pembuatan booking dengan status `422` jika dikirim paksa melalui API client.

### TS-05: Booking di Luar Jam Operasional Bengkel
- **Langkah Pengujian:**
  1. Pilih tanggal servis yang valid (misal: besok).
  2. Masukkan jam kedatangan di luar operasional seperti `07:30` atau `18:00`.
  3. Klik "Lanjutkan".
- **Hasil yang Diharapkan:**
  - **Frontend:** Menampilkan dialog alert: `"Waktu kedatangan harus berada di antara jam operasional bengkel (08:00 - 17:00)."`
  - **Backend:** Menolak request dengan status `422` dan pesan error terkait waktu operasional.

---

## 3. Uji Validasi Autentikasi (Registrasi & Login)

### TS-06: Nama Pengguna Tidak Valid saat Registrasi
- **Langkah Pengujian:**
  1. Pada halaman Register, masukkan nama dengan karakter khusus atau angka saja (misal: `@Admin!` atau `12345`).
  2. Klik "Daftar".
- **Hasil yang Diharapkan:**
  - **Frontend & Backend:** Menampilkan pesan error: `"Nama hanya boleh mengandung huruf dan spasi."`

### TS-07: Password Lemah (Terlalu Pendek)
- **Langkah Pengujian:**
  1. Masukkan password dengan panjang kurang dari 6 karakter (misal: `12345`).
  2. Klik "Daftar".
- **Hasil yang Diharapkan:**
  - **Frontend & Backend:** Menolak registrasi dengan pesan: `"Password harus minimal 6 karakter."`

---

## 4. Uji Keamanan & Ketahanan API Backend

### TS-08: Serangan SQL Injection (SQLi)
- **Langkah Pengujian:**
  1. Kirim HTTP POST request langsung ke `/api.php/vehicles` menggunakan HTTP Client (curl / Postman) dengan menyuntikkan karakter SQL Injection pada parameter `brand`:
    ```json
    {
      "vehicle_type": "mobil",
      "brand": "Toyota' OR '1'='1",
      "model": "Avanza",
      "year": 2020,
      "plate_number": "B 1234 ABC",
      "current_mileage": 10000
    }
    ```
- **Hasil yang Diharapkan:**
  - Parameter disanitasi menggunakan Prepared Statement PDO.
  - Backend menolak request dengan status `400 Bad Request` atau `422 Unprocessable Entity` karena regex validation mendeteksi karakter ilegal, dan query database tetap aman.

### TS-09: Serangan Request Body Overload (DoS Protection)
- **Langkah Pengujian:**
  1. Kirim HTTP POST request dengan payload JSON berukuran besar (> 5MB) ke endpoint mana pun di backend.
- **Hasil yang Diharapkan:**
  - Server langsung mengembalikan status `413 Payload Too Large`.
  - Skrip PHP langsung dihentikan sebelum memakan memori runtime server.

### TS-10: Pemeriksaan Security Headers pada Response
- **Langkah Pengujian:**
  1. Kirim HTTP GET request ke `/api.php/services` dan periksa response header yang dikembalikan.
- **Hasil yang Diharapkan:**
  - Response header wajib memuat:
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `X-XSS-Protection: 1; mode=block`