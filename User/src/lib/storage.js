export const STORAGE_KEYS = {
  vehicles: 'simobs_vehicles',
  bookings: 'simobs_bookings',
  profile: 'simobs_profile',
  session: 'simobs_session',
};

export const DEFAULT_VEHICLES = [
  {
    id: 1,
    type: 'Mobil',
    brand: 'Toyota',
    model: 'Avanza',
    year: '2019',
    plate: 'B 1234 ABC',
    color: 'Hitam',
    lastService: '2023-10-05',
  },
  {
    id: 2,
    type: 'Mobil',
    brand: 'Honda',
    model: 'Brio',
    year: '2021',
    plate: 'B 5678 DEF',
    color: 'Merah',
    lastService: '2023-08-12',
  },
  {
    id: 3,
    type: 'Motor',
    brand: 'Honda',
    model: 'Beat',
    year: '2020',
    plate: 'B 9876 XYZ',
    color: 'Biru',
    lastService: '2023-09-20',
  },
];

export const DEFAULT_PROFILE = {
  fullName: 'John Doe',
  phone: '081234567890',
  email: 'john.doe@example.com',
  address: 'Jl. Sudirman No. 123, Jakarta',
};

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to parse localStorage value:', error);
    return fallback;
  }
};

const read = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
};

const write = (key, value) => {
  if (typeof window === 'undefined') return value;
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const getVehicles = () => read(STORAGE_KEYS.vehicles, DEFAULT_VEHICLES);
export const saveVehicles = (vehicles) => write(STORAGE_KEYS.vehicles, vehicles);

export const getBookings = () => read(STORAGE_KEYS.bookings, []);
export const saveBookings = (bookings) => write(STORAGE_KEYS.bookings, bookings);

export const addBooking = (booking) => {
  const bookings = getBookings();
  const updated = [booking, ...bookings];
  saveBookings(updated);
  return updated;
};

export const updateBookingStatus = (bookingId, status) => {
  const updated = getBookings().map((booking) =>
    booking.id === bookingId ? { ...booking, status } : booking
  );
  saveBookings(updated);
  return updated;
};

export const getProfile = () => read(STORAGE_KEYS.profile, DEFAULT_PROFILE);
export const saveProfile = (profile) => write(STORAGE_KEYS.profile, profile);

export const getSession = () => read(STORAGE_KEYS.session, null);
export const saveSession = (session) => write(STORAGE_KEYS.session, session);

export const clearSession = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEYS.session);
  }
};

export const getInitials = (name = '') => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'U';
};

export const formatVehicleLabel = (vehicle) => {
  if (!vehicle) return 'Kendaraan tidak ditemukan';
  return `${vehicle.brand} ${vehicle.model} (${vehicle.plate})`;
};

export const generateBookingId = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replaceAll('-', '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `BK-${datePart}-${randomPart}`;
};