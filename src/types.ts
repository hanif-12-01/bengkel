export type Role = "customer" | "admin";
export type BookingStatus = "Menunggu" | "Diproses" | "Selesai" | "Ditunda";
export type ThemeName = "morning" | "afternoon" | "evening" | "night";
export type ThemePreference = ThemeName | "auto";
export type NotificationType = "booking" | "status" | "system";
export type VehicleType = "motor" | "mobil";

export interface VehicleProfile {
  jenis_kendaraan: VehicleType;
  model: string;
  tahun: string;
  plat: string;
  warna: string;
  terakhir_servis: string;
}

export interface VehicleRecord extends VehicleProfile {
  id: string;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  no_hp: string;
  password_hash: string;
  created_at: string;
  vehicle_profile: VehicleProfile;
}

export interface Admin {
  id: string;
  nama: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id?: string;
  user_email?: string;
  nama?: string;
  nama_pelanggan: string;
  motor: string;
  jenis_kendaraan?: VehicleType;
  plat: string;
  jenis_servis: string;
  tanggal: string;
  waktu: string;
  keluhan: string;
  status: BookingStatus;
  estimasi_selesai: string;
  mekanik: string;
  catatan_admin: string;
  sparepart_diganti: string;
  total_sparepart: number;
  source: "customer" | "admin" | "pengguna";
  created_at: string;
  updated_at: string;
}

export interface Pelanggan {
  id: string;
  source: "user" | "admin";
  nama: string;
  alamat: string;
  telepon: string;
  created_at: string;
}

export interface Sparepart {
  id: string;
  nama_sparepart: string;
  kategori: string;
  stok: number;
  harga: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationRecord {
  id: string;
  user_id?: string;
  user_email: string;
  judul: string;
  pesan: string;
  tipe: NotificationType;
  booking_id?: string;
  dibaca: boolean;
  created_at: string;
}

export interface Promo {
  id: string;
  judul: string;
  nama: string;
  deskripsi: string;
  diskon?: number;
  active: boolean;
}

export interface Session {
  role: Role;
  id: string;
  nama: string;
  email?: string;
  username?: string;
  verified_at: string;
}

export interface PendingOtp {
  id: string;
  user_id: string;
  user_email: string;
  code_hash: string;
  salt: string;
  expires_at: string;
  attempts: number;
  created_at: string;
}

export interface SimobsDatabase {
  users: User[];
  admins: Admin[];
  bookings: Booking[];
  pelanggan: Pelanggan[];
  sparepart: Sparepart[];
  notifikasi: NotificationRecord[];
  promo: Promo[];
  pending_otps: PendingOtp[];
}

export interface DashboardPayload {
  nama: string;
  lastBooking: Booking | null;
  promos: Promo[];
  unreadNotifications: number;
}

export interface AdminDashboardPayload {
  totalPelanggan: number;
  totalBooking: number;
  totalSparepart: number;
  totalAdmin: number;
  lowStock: Sparepart[];
  recentBookings: Booking[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  replacement: string;
  suitableFor: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  description: string;
  managementCategory: string;
  products: Product[];
  replacementInfo: Array<{ label: string; value: string }>;
}

export interface ApiResult<T> {
  data: T;
  message?: string;
}
