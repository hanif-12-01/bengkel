# Panduan Deploy Frontend ke Vercel

Repositori ini telah disederhanakan dengan memindahkan seluruh kode frontend ke root direktori dan menghapus backend agar dapat dideploy secara instan di Vercel.

## Langkah 1: Hubungkan GitHub ke Vercel
1. Masuk ke dashboard [Vercel](https://vercel.com).
2. Klik tombol **Add New...** -> **Project**.
3. Pilih repositori `bengkel` dari akun GitHub Anda (`hanif-12-01/bengkel`) dan klik **Import**.

## Langkah 2: Konfigurasi Project di Vercel
Karena semua file frontend sudah berada di root direktori:
1. **Root Directory**: Biarkan default (tidak perlu diubah).
2. **Framework Preset**: Vercel akan otomatis mendeteksi **Vite**.
3. **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Klik tombol **Deploy**.

## Penanganan Client-Side Routing
File `vercel.json` berada di root direktori dengan konfigurasi rewrite rule agar routing client-side React Router (seperti `/login`, `/dashboard`, dll.) tidak mengalami error 404 ketika diakses secara langsung atau ketika di-refresh.
