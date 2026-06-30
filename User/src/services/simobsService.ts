import type { Booking, BookingStatus, ServiceItem, VehicleType } from "../types";

export const BOOKING_STORAGE_KEY = "bengkel-bookings";

export const bookingStatuses: BookingStatus[] = [
  "Menunggu Konfirmasi",
  "Dikonfirmasi",
  "Kendaraan Diterima",
  "Sedang Dikerjakan",
  "Selesai",
  "Dibatalkan",
];

export const services: ServiceItem[] = [
  {
    id: "car-oil",
    name: "Ganti Oli",
    category: "car",
    description: "Penggantian oli mesin, filter oli, dan pengecekan fluida dasar.",
    estimatedPrice: "Mulai Rp350.000",
    duration: "45 menit",
  },
  {
    id: "car-periodic",
    name: "Servis Berkala",
    category: "car",
    description: "Pemeriksaan menyeluruh sesuai kilometer dan rekomendasi pabrikan.",
    estimatedPrice: "Mulai Rp650.000",
    duration: "2 jam",
  },
  {
    id: "car-tune-up",
    name: "Tune Up",
    category: "car",
    description: "Pembersihan dan penyetelan komponen mesin agar performa kembali optimal.",
    estimatedPrice: "Mulai Rp450.000",
    duration: "90 menit",
  },
  {
    id: "car-brake",
    name: "Rem",
    category: "car",
    description: "Pengecekan kampas rem, minyak rem, cakram, dan sistem pengereman.",
    estimatedPrice: "Mulai Rp250.000",
    duration: "60 menit",
  },
  {
    id: "car-battery",
    name: "Aki",
    category: "car",
    description: "Pemeriksaan tegangan aki, sistem pengisian, dan penggantian bila diperlukan.",
    estimatedPrice: "Mulai Rp650.000",
    duration: "30 menit",
  },
  {
    id: "car-ac",
    name: "AC Mobil",
    category: "car",
    description: "Cek freon, filter kabin, evaporator, dan performa pendinginan.",
    estimatedPrice: "Mulai Rp300.000",
    duration: "1 jam",
  },
  {
    id: "car-tire",
    name: "Ban",
    category: "car",
    description: "Pengecekan tekanan, rotasi, tambal, dan penggantian ban mobil.",
    estimatedPrice: "Mulai Rp150.000",
    duration: "45 menit",
  },
  {
    id: "car-spooring",
    name: "Spooring Balancing",
    category: "car",
    description: "Penyetelan sudut roda dan balancing untuk kenyamanan berkendara.",
    estimatedPrice: "Mulai Rp300.000",
    duration: "90 menit",
  },
  {
    id: "bike-oil",
    name: "Ganti Oli",
    category: "motorcycle",
    description: "Penggantian oli mesin dan pengecekan ringan sebelum perjalanan.",
    estimatedPrice: "Mulai Rp75.000",
    duration: "30 menit",
  },
  {
    id: "bike-light-service",
    name: "Servis Ringan",
    category: "motorcycle",
    description: "Pembersihan, penyetelan, dan pengecekan komponen dasar motor.",
    estimatedPrice: "Mulai Rp100.000",
    duration: "60 menit",
  },
  {
    id: "bike-cvt",
    name: "Servis CVT",
    category: "motorcycle",
    description: "Pembersihan CVT, pengecekan roller, v-belt, dan kampas ganda.",
    estimatedPrice: "Mulai Rp120.000",
    duration: "1 jam",
  },
  {
    id: "bike-tire",
    name: "Ganti Ban",
    category: "motorcycle",
    description: "Penggantian ban, pentil, dan pengecekan tekanan angin.",
    estimatedPrice: "Mulai Rp180.000",
    duration: "45 menit",
  },
  {
    id: "bike-brake",
    name: "Rem",
    category: "motorcycle",
    description: "Pengecekan kampas rem, minyak rem, dan penyetelan rem.",
    estimatedPrice: "Mulai Rp90.000",
    duration: "45 menit",
  },
  {
    id: "bike-battery",
    name: "Aki",
    category: "motorcycle",
    description: "Pemeriksaan aki, kelistrikan, starter, dan penggantian aki.",
    estimatedPrice: "Mulai Rp180.000",
    duration: "30 menit",
  },
  {
    id: "bike-spark-plug",
    name: "Busi",
    category: "motorcycle",
    description: "Pengecekan pembakaran dan penggantian busi motor.",
    estimatedPrice: "Mulai Rp35.000",
    duration: "20 menit",
  },
  {
    id: "bike-chain-gear",
    name: "Rantai dan Gear",
    category: "motorcycle",
    description: "Pembersihan, pelumasan, penyetelan, dan penggantian rantai gear.",
    estimatedPrice: "Mulai Rp160.000",
    duration: "60 menit",
  },
];

export const seedBookings: Booking[] = [
  {
    id: "BKG-2401",
    customerName: "Andi Pratama",
    phone: "081234567890",
    email: "andi@mail.com",
    address: "Jl. Melati No. 12, Bandung",
    vehicleType: "car",
    vehicleBrand: "Toyota",
    vehicleModel: "Avanza",
    vehicleYear: "2020",
    plateNumber: "B 1234 CD",
    currentMileage: "45000",
    selectedServices: [services[0], services[1]],
    bookingDate: "2026-07-03",
    bookingTime: "10:00",
    complaintNote: "Mesin terasa kasar saat pagi hari.",
    status: "Menunggu Konfirmasi",
    createdAt: "2026-06-30T09:00:00.000Z",
  },
  {
    id: "BKG-2402",
    customerName: "Siti Rahma",
    phone: "082112223333",
    email: "siti@mail.com",
    address: "Jl. Kenanga No. 8, Jakarta",
    vehicleType: "motorcycle",
    vehicleBrand: "Honda",
    vehicleModel: "Vario 160",
    vehicleYear: "2023",
    plateNumber: "D 4321 EF",
    currentMileage: "12000",
    selectedServices: [services[8], services[10]],
    bookingDate: "2026-07-04",
    bookingTime: "14:00",
    complaintNote: "Tarikan terasa berat.",
    status: "Dikonfirmasi",
    createdAt: "2026-06-30T10:30:00.000Z",
  },
];

export function getVehicleTypeLabel(vehicleType: VehicleType) {
  return vehicleType === "car" ? "Mobil" : "Motor";
}

export function getServicesByVehicle(vehicleType: VehicleType) {
  return services.filter((service) => service.category === vehicleType);
}

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return seedBookings;

  const storedBookings = window.localStorage.getItem(BOOKING_STORAGE_KEY);
  if (!storedBookings) {
    window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(seedBookings));
    return seedBookings;
  }

  try {
    return JSON.parse(storedBookings) as Booking[];
  } catch {
    window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(seedBookings));
    return seedBookings;
  }
}

export function saveBookings(bookings: Booking[]) {
  window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
}

export function createBooking(booking: Booking) {
  const bookings = loadBookings();
  const updatedBookings = [booking, ...bookings];
  saveBookings(updatedBookings);
  window.dispatchEvent(new Event("bookings-updated"));
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  const updatedBookings = loadBookings().map((booking) =>
    booking.id === id
      ? {
          ...booking,
          status,
          updatedAt: new Date().toISOString(),
        }
      : booking,
  );
  saveBookings(updatedBookings);
  window.dispatchEvent(new Event("bookings-updated"));
  return updatedBookings;
}