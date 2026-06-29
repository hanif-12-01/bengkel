# Panduan Deploy Frontend ke Vercel

Repositori ini telah disiapkan untuk deploy ke Vercel. Berikut adalah langkah-langkah untuk melakukan deployment:

## Langkah 1: Hubungkan GitHub ke Vercel
1. Masuk ke dashboard [Vercel](https://vercel.com).
2. Klik tombol **Add New...** -> **Project**.
3. Pilih repositori `bengkel` dari akun GitHub Anda (`hanif-12-01/bengkel`) dan klik **Import**.

## Langkah 2: Konfigurasi Project di Vercel
Pada halaman konfigurasi sebelum deploy:
1. **Root Directory**: Ubah ke `simobs_customer/frontend` (klik *Edit* di samping Root Directory, lalu pilih folder `simobs_customer/frontend`).
2. **Framework Preset**: Vercel akan otomatis mendeteksi **Vite**.
3. **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Environment Variables**:
   - Jika aplikasi memerlukan variabel penunjuk URL backend, tambahkan variable environment yang sesuai.
5. Klik tombol **Deploy**.

## Penanganan Client-Side Routing
File `vercel.json` telah dibuat di dalam folder `simobs_customer/frontend` dengan isi:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Ini memastikan routing client-side React Router (seperti `/login`, `/dashboard`, dll.) bekerja dengan lancar tanpa error 404 ketika diakses secara langsung di browser atau saat halaman direfresh.
