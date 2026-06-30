import { apiFetch } from "./apiClient";

export type VehicleType = "mobil" | "motor";

export type BookingStatus =
  | "Menunggu Konfirmasi"
  | "Dikonfirmasi"
  | "Kendaraan Diterima"
  | "Sedang Dikerjakan"
  | "Selesai"
  | "Dibatalkan";

// ---- Vehicle ----

export interface VehiclePayload {
  vehicle_type: VehicleType;
  brand: string;
  model: string;
  year: number;
  plate_number: string;
  current_mileage: number;
}

export interface VehicleData {
  id: number;
  user_id: number | null;
  vehicle_type: VehicleType;
  brand: string;
  model: string;
  year: number;
  plate_number: string;
  current_mileage: number;
  created_at: string;
  updated_at: string;
}

export async function createVehicle(
  payload: VehiclePayload
): Promise<VehicleData> {
  return apiFetch<VehicleData>("/vehicles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---- Booking ----

export interface BookingPayload {
  customer_name: string;
  phone: string;
  email?: string;
  vehicle_id: number;
  workshop_id: number;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:MM
  complaint_note?: string;
  service_ids: number[];
}

export interface BookingServiceData {
  id: number;
  booking_id: string;
  service_id: number;
  service_name: string;
  min_price: string;
  max_price: string;
  created_at: string;
}

export interface BookingData {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  vehicle_id: number;
  workshop_id: number;
  booking_date: string;
  booking_time: string;
  complaint_note: string | null;
  estimated_min_price: string;
  estimated_max_price: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  // Joined fields from vehicles table
  vehicle_type: VehicleType;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  plate_number: string;
  current_mileage: number;
  // Joined fields from workshops table
  workshop_name: string;
  workshop_address: string;
  // Related booking services
  services: BookingServiceData[];
}

export async function createBooking(
  payload: BookingPayload
): Promise<BookingData> {
  return apiFetch<BookingData>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchBookings(): Promise<BookingData[]> {
  return apiFetch<BookingData[]>("/bookings");
}

export async function fetchBookingById(id: string): Promise<BookingData> {
  return apiFetch<BookingData>(`/bookings/${id}`);
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<BookingData> {
  return apiFetch<BookingData>(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}