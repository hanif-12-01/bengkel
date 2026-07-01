export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[] | string>;
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
    "Accept": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // Jika response 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const payload: ApiResponse<T> = await response.json();

    if (!response.ok || !payload.success) {
      // Parse Laravel/standard validation errors
      let formattedErrors: Record<string, string> = {};
      if (payload.errors) {
        Object.entries(payload.errors).forEach(([key, val]) => {
          formattedErrors[key] = Array.isArray(val) ? val[0] : val;
        });
      }
      
      const errorMessage =
        payload.message || `HTTP error! status: ${response.status}`;
      const err = new Error(errorMessage) as Error & {
        errors: Record<string, string>;
        statusCode: number;
      };
      err.errors = formattedErrors;
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
    
    // Check if it's a network error or syntax error from response.json()
    const errorMsg = error instanceof Error ? error.message : "";
    const netErr = new Error(
      errorMsg.includes("fetch") || errorMsg.includes("connect")
        ? "Gagal terhubung ke server Laravel. Pastikan server sudah aktif di http://127.0.0.1:8000"
        : errorMsg || "Terjadi kesalahan koneksi database atau server."
    ) as Error & { errors: Record<string, string> };
    netErr.errors = {};
    throw netErr;
  }
}