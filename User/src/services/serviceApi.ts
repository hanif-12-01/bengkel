import { apiFetch } from "./apiClient";

export interface ServiceData {
  id: number;
  vehicle_type: "mobil" | "motor";
  name: string;
  description: string;
  min_price: string;
  max_price: string;
  estimated_duration: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export async function fetchServices(
  vehicleType?: "mobil" | "motor"
): Promise<ServiceData[]> {
  const query = vehicleType ? `?vehicle_type=${vehicleType}` : "";
  return apiFetch<ServiceData[]>(`/services${query}`);
}