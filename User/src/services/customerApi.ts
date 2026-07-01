import { apiFetch } from "./apiClient";
import { VehicleData, VehiclePayload, BookingData, BookingPayload, BookingSlot } from "./bookingApi";

export const customerApi = {
  // Vehicles
  fetchVehicles: async (): Promise<VehicleData[]> => {
    return apiFetch<VehicleData[]>("/customer/vehicles");
  },

  createVehicle: async (payload: VehiclePayload): Promise<VehicleData> => {
    return apiFetch<VehicleData>("/customer/vehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Bookings
  fetchBookings: async (): Promise<BookingData[]> => {
    return apiFetch<BookingData[]>("/customer/bookings");
  },

  fetchBookingById: async (id: string | number): Promise<BookingData> => {
    return apiFetch<BookingData>(`/customer/bookings/${id}`);
  },

  createBooking: async (payload: BookingPayload): Promise<BookingData> => {
    return apiFetch<BookingData>("/customer/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Slots helper
  fetchBookingSlots: async (workshopId: number, date: string): Promise<BookingSlot[]> => {
    return apiFetch<BookingSlot[]>(`/booking-slots?workshop_id=${workshopId}&date=${date}`);
  },
};