import { apiFetch } from "./apiClient";
import { BookingData, BookingStatus } from "./bookingApi";

export const adminApi = {
  fetchBookings: async (): Promise<BookingData[]> => {
    return apiFetch<BookingData[]>("/admin/bookings");
  },

  fetchBookingById: async (id: string | number): Promise<BookingData> => {
    return apiFetch<BookingData>(`/admin/bookings/${id}`);
  },

  updateBookingStatus: async (
    id: string | number,
    status: BookingStatus
  ): Promise<BookingData> => {
    return apiFetch<BookingData>(`/admin/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  assignMechanic: async (
    id: string | number,
    mechanicId: number | null
  ): Promise<BookingData> => {
    return apiFetch<BookingData>(`/admin/bookings/${id}/assign-mechanic`, {
      method: "PATCH",
      body: JSON.stringify({ mechanic_id: mechanicId }),
    });
  },

  fetchMechanics: async (): Promise<{ id: number; name: string }[]> => {
    return apiFetch<{ id: number; name: string }[]>("/admin/mechanics");
  },
};