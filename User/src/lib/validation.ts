/**
 * Helper Validasi Frontend dengan prinsip Defensive Programming
 * Menyediakan feedback instan di UI dan memvalidasi input sebelum dikirim ke API.
 * Menghasilkan pesan error dalam bahasa Indonesia yang ramah pengguna (UX-friendly).
 */

/**
 * Validasi alamat email
 */
export function validateEmail(email: string): string {
  if (!email) return 'Email wajib diisi.';
  const trimmed = email.trim();
  if (trimmed.length > 100) {
    return 'Email maksimal 100 karakter.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Format email tidak valid (contoh: user@example.com).';
  }
  return '';
}

/**
 * Validasi nomor telepon Indonesia
 */
export function validatePhoneIndonesia(phone: string): string {
  if (!phone) return 'Nomor telepon wajib diisi.';
  const trimmed = phone.trim();
  if (trimmed.length > 20) {
    return 'Nomor telepon maksimal 20 karakter.';
  }
  const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;
  if (!phoneRegex.test(trimmed)) {
    return 'Format nomor telepon tidak valid. Gunakan format Indonesia seperti 0812xxxxxxxx atau +628xxxxxxxx.';
  }
  return '';
}

/**
 * Validasi password (minimal 8 karakter, mengandung huruf dan angka)
 */
export function validatePassword(password: string): string {
  if (!password) return 'Password wajib diisi.';
  if (password.length < 8) {
    return 'Password minimal harus 8 karakter.';
  }
  if (password.length > 100) {
    return 'Password maksimal 100 karakter.';
  }
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return 'Password harus mengandung minimal satu huruf dan satu angka.';
  }
  return '';
}

/**
 * Validasi nama lengkap
 */
export function validateName(name: string): string {
  if (!name || !name.trim()) return 'Nama lengkap wajib diisi.';
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Nama minimal harus 2 karakter.';
  }
  if (trimmed.length > 100) {
    return 'Nama maksimal 100 karakter.';
  }
  // Hanya memperbolehkan huruf, spasi, dan tanda petik/titik wajar
  const nameRegex = /^[a-zA-Z\s'.]+$/;
  if (!nameRegex.test(trimmed)) {
    return 'Nama hanya boleh mengandung huruf, spasi, tanda titik, atau petik tunggal.';
  }
  return '';
}

/**
 * Validasi plat nomor kendaraan Indonesia
 */
export function validatePlateNumber(plate: string): string {
  if (!plate || !plate.trim()) return 'Nomor polisi wajib diisi.';
  const upper = plate.toUpperCase().trim();
  if (upper.length > 20) {
    return 'Nomor polisi maksimal 20 karakter.';
  }
  const plateRegex = /^[A-Z]{1,2}\s*[0-9]{1,4}\s*[A-Z]{1,3}$/;
  if (!plateRegex.test(upper)) {
    return 'Format nomor polisi tidak valid (misal: B 1234 CD, B-1234-CD, atau B1234CD).';
  }
  return '';
}

/**
 * Validasi tahun kendaraan (1900 s/d Tahun Sekarang + 1)
 */
export function validateVehicleYear(year: string | number): string {
  if (year === undefined || year === null || year === '') return 'Tahun kendaraan wajib diisi.';
  const intYear = typeof year === 'string' ? parseInt(year, 10) : year;
  if (isNaN(intYear)) {
    return 'Tahun harus berupa angka.';
  }
  const currentYear = new Date().getFullYear();
  if (intYear < 1900 || intYear > currentYear + 1) {
    return `Tahun harus berada di antara 1900 dan ${currentYear + 1}.`;
  }
  return '';
}

/**
 * Validasi jam operasional (08:00 - 17:00)
 */
export function validateOperationalTime(time: string): string {
  if (!time) return 'Waktu booking wajib diisi.';
  const timeVal = time.substring(0, 5); // Ambil format HH:MM
  if (timeVal < '08:00' || timeVal > '17:00') {
    return 'Waktu booking harus berada dalam jam operasional bengkel (08:00 - 17:00).';
  }
  return '';
}

/**
 * Validasi tanggal tidak boleh di masa lampau
 */
export function validateDateNotPast(date: string): string {
  if (!date) return 'Tanggal booking wajib diisi.';
  
  // Format input date: YYYY-MM-DD
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    return 'Tanggal booking tidak boleh di masa lampau.';
  }
  return '';
}

/**
 * Validasi odometer / kilometer kendaraan
 */
export function validateMileage(mileage: string | number): string {
  if (mileage === undefined || mileage === null || mileage === '') {
    return 'Kilometer kendaraan wajib diisi.';
  }
  const intMileage = typeof mileage === 'string' ? parseInt(mileage, 10) : mileage;
  if (isNaN(intMileage)) {
    return 'Kilometer harus berupa angka.';
  }
  if (intMileage < 0) {
    return 'Kilometer tidak boleh bernilai negatif.';
  }
  if (intMileage > 9999999) {
    return 'Nilai kilometer kendaraan terlalu besar.';
  }
  return '';
}

/**
 * Validasi brand & model
 */
export function validateBrandOrModel(value: string, fieldName: string = 'Field'): string {
  if (!value || !value.trim()) {
    return `${fieldName} wajib diisi.`;
  }
  const trimmed = value.trim();
  if (trimmed.length > 100) {
    return `${fieldName} maksimal 100 karakter.`;
  }
  return '';
}