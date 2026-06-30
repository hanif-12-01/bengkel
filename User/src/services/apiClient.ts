export const API_BASE_URL = "http://localhost/bengkel-api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Ambil token dari localStorage jika tersedia
  const token = localStorage.getItem("auth_token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const payload: ApiResponse<T> = await response.json();

    if (!response.ok || !payload.success) {
      const errorMessage =
        payload.message || `HTTP error! status: ${response.status}`;
      const err = new Error(errorMessage) as Error & {
        errors: Record<string, string>;
        statusCode: number;
      };
      err.errors = payload.errors || {};
      err.statusCode = response.status;
      throw err;
    }

    return payload.data;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "statusCode" in error
    ) {
      throw error;
    }
    const netErr = new Error(
      "Gagal terhubung ke server. Pastikan XAMPP dan Apache sudah aktif."
    ) as Error & { errors: Record<string, string> };
    netErr.errors = {};
    throw netErr;
  }
}