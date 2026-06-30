import { apiFetch } from "./apiClient";

export interface WorkshopData {
  id: number;
  name: string;
  address: string;
  phone: string;
  opening_hours: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function fetchWorkshops(): Promise<WorkshopData[]> {
  return apiFetch<WorkshopData[]>("/workshops");
}