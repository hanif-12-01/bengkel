# WattWise AI

**Listrik Lebih Cerdas, Biaya Lebih Terkendali**

Frontend-only MVP/prototype untuk **WattWise AI** — asisten hemat listrik berbasis AI untuk UMKM Indonesia. Dibuat untuk demo startup competition / PLN ICE.

## Fitur Demo

- Landing page produk + CTA demo
- Dashboard pemakaian listrik UMKM
- Input data listrik manual
- Prediksi tagihan bulanan
- Deteksi pemakaian tidak normal
- Rekomendasi hemat listrik
- Simulasi penghematan Rupiah
- Preview laporan bulanan
- Pricing page
- Profil usaha
- Sidebar + mobile responsive navigation

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- lucide-react
- Recharts
- Mock data lokal, tanpa backend/database/API

## Jalankan Lokal

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## Catatan Demo

Semua data berasal dari `src/lib/mock-data.ts`. Fitur simpan, notifikasi, dan unduh PDF disimulasikan dengan local state/localStorage/toast/modal.