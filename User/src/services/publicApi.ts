import { apiFetch } from "./apiClient";
import { ServiceData } from "./serviceApi";
import { WorkshopData } from "./workshopApi";

export const publicApi = {
  fetchServices: async (vehicleType?: "mobil" | "motor"): Promise<ServiceData[]> => {
    const query = vehicleType ? `?vehicle_type=${vehicleType}` : "";
    return apiFetch<ServiceData[]>(`/services${query}`);
  },

  fetchWorkshops: async (): Promise<WorkshopData[]> => {
    return apiFetch<WorkshopData[]>("/workshops");
  },
};