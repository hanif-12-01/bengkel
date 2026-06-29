import { productCategories, seedPromos, seedSpareparts } from "../data/catalog";
import type {
  Admin,
  AdminDashboardPayload,
  Booking,
  BookingStatus,
  DashboardPayload,
  NotificationRecord,
  Pelanggan,
  PendingOtp,
  ProductCategory,
  Session,
  SimobsDatabase,
  Sparepart,
  User,
  VehicleProfile,
  VehicleRecord,
} from "../types";

const DB_KEY = "simobs.db.v2";
const SESSION_KEY = "simobs.session.v2";
const THEME_KEY = "simobs.theme.preference";
const PASSWORD_ITERATIONS = 210_000;
const OTP_TTL_MS = 5 * 60 * 1000;
const SHOW_LOCAL_OTP = true;

const emptyVehicle: VehicleProfile = {
  jenis_kendaraan: "motor",
  model: "",
  tahun: "",
  plat: "",
  warna: "",
  terakhir_servis: "",
};

const manualCustomers: Pelanggan[] = [
  {
    id: "plg_demo_1",
    source: "admin",
    nama: "Budi Santoso",
    alamat: "Jl. Merdeka No. 21",
    telepon: "+628123456780",
    created_at: new Date().toISOString(),
  },
];

function createSeedDb(): SimobsDatabase {
  return {
    users: [],
    admins: [],
    bookings: [],
    pelanggan: manualCustomers,
    sparepart: seedSpareparts,
    notifikasi: [],
    promo: seedPromos,
    pending_otps: [],
  };
}

function wait(ms = 140) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

function loadDb(): SimobsDatabase {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seeded = createSeedDb();
    saveDb(seeded);
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SimobsDatabase>;
    return {
      users: parsed.users ?? [],
      admins: parsed.admins ?? [],
      bookings: parsed.bookings ?? [],
      pelanggan: parsed.pelanggan ?? [],
      sparepart: parsed.sparepart?.length ? parsed.sparepart : seedSpareparts,
      notifikasi: parsed.notifikasi ?? [],
      promo: parsed.promo?.length ? parsed.promo : seedPromos,
      pending_otps: parsed.pending_otps ?? [],
    };
  } catch {
    const seeded = createSeedDb();
    saveDb(seeded);
    return seeded;
  }
}

function saveDb(db: SimobsDatabase) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

function setSession(session: Session | null) {
  if (!session) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  const clean = phone.trim().replace(/\s+/g, "");
  if (clean.startsWith("0")) return `+62${clean.slice(1)}`;
  if (clean.startsWith("62")) return `+${clean}`;
  return clean;
}

function asCurrency(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toBase64(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  arr.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function randomBase64(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return toBase64(bytes);
}

async function pbkdf2(
  password: string,
  salt: string,
  iterations = PASSWORD_ITERATIONS,
) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: fromBase64(salt), iterations },
    key,
    256,
  );
  return toBase64(bits);
}

async function hashPassword(password: string) {
  const salt = randomBase64();
  const hash = await pbkdf2(password, salt);
  return `pbkdf2$${PASSWORD_ITERATIONS}$${salt}$${hash}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [scheme, iterRaw, salt, hash] = storedHash.split("$");
  if (scheme !== "pbkdf2" || !iterRaw || !salt || !hash) return false;
  const next = await pbkdf2(password, salt, Number(iterRaw));
  return next === hash;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return toBase64(digest);
}

async function hashOtp(code: string, salt: string) {
  return sha256(`${salt}:${code}`);
}

function ensurePassword(password: string) {
  if (password.length < 8) throw new Error("Password minimal 8 karakter.");
}

function requireSession(role?: Session["role"]) {
  const session = getSession();
  if (!session) throw new Error("Sesi tidak ditemukan. Silakan login kembali.");
  if (role && session.role !== role)
    throw new Error("Akses tidak diizinkan untuk role ini.");
  return session;
}

function sortedBookings(bookings: Booking[]) {
  return [...bookings].sort((a, b) => {
    const keyA = `${a.tanggal || ""} ${a.waktu || ""} ${a.created_at}`;
    const keyB = `${b.tanggal || ""} ${b.waktu || ""} ${b.created_at}`;
    return keyB.localeCompare(keyA);
  });
}

function statusNotification(status: BookingStatus, booking: Booking) {
  const map: Record<string, { judul: string; pesan: string }> = {
    Diproses: {
      judul: "Servis Sedang Diproses",
      pesan: `Servis ${booking.jenis_servis} motor ${booking.motor} Anda sedang dikerjakan oleh mekanik.`,
    },
    Selesai: {
      judul: "Servis Selesai",
      pesan: `Servis ${booking.jenis_servis} motor ${booking.motor} Anda telah selesai. Silakan ambil kendaraan Anda.`,
    },
    Ditunda: {
      judul: "Servis Tertunda",
      pesan: `Servis ${booking.jenis_servis} motor ${booking.motor} Anda tertunda. Mohon tunggu konfirmasi lebih lanjut.`,
    },
  };
  return map[status];
}

function addNotification(
  db: SimobsDatabase,
  notification: Omit<NotificationRecord, "id" | "created_at">,
) {
  db.notifikasi.push({
    ...notification,
    id: newId("ntf"),
    created_at: nowIso(),
  });
}

function publicAdmin(admin: Admin) {
  const { password_hash: _passwordHash, ...safe } = admin;
  return safe;
}

export const simobsApi = {
  themeStorageKey: THEME_KEY,

  async session() {
    await wait(40);
    return clone(getSession());
  },

  async logout() {
    await wait(80);
    setSession(null);
    return { success: true };
  },

  async customerRegister(input: {
    nama: string;
    email: string;
    no_hp: string;
    password: string;
    confirmPassword: string;
  }) {
    await wait();
    const db = loadDb();
    const email = normalizeEmail(input.email);
    const phone = normalizePhone(input.no_hp);
    if (!input.nama.trim()) throw new Error("Nama lengkap wajib diisi.");
    if (!email.includes("@")) throw new Error("Email tidak valid.");
    if (!phone) throw new Error("Nomor HP wajib diisi.");
    ensurePassword(input.password);
    if (input.password !== input.confirmPassword)
      throw new Error("Password dan konfirmasi password tidak sama.");
    if (db.users.some((user) => normalizeEmail(user.email) === email))
      throw new Error("Email sudah digunakan.");
    if (db.users.some((user) => normalizePhone(user.no_hp) === phone))
      throw new Error("Nomor HP sudah digunakan.");

    const user: User = {
      id: newId("usr"),
      nama: input.nama.trim(),
      email,
      no_hp: phone,
      password_hash: await hashPassword(input.password),
      created_at: nowIso(),
      vehicle_profile: { ...emptyVehicle },
    };
    db.users.push(user);
    saveDb(db);
    return clone({ id: user.id, nama: user.nama, email: user.email });
  },

  async customerLogin(input: { identifier: string; password: string }) {
    await wait();
    const db = loadDb();
    const identifier = input.identifier.trim().toLowerCase();
    const normalizedPhone = normalizePhone(identifier);
    const user = db.users.find(
      (item) =>
        item.email.toLowerCase() === identifier ||
        normalizePhone(item.no_hp) === normalizedPhone,
    );
    if (!user) throw new Error("Email atau nomor HP tidak ditemukan.");
    const valid = await verifyPassword(input.password, user.password_hash);
    if (!valid) throw new Error("Password salah.");

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = randomBase64(12);
    const pending: PendingOtp = {
      id: newId("otp"),
      user_id: user.id,
      user_email: user.email,
      code_hash: await hashOtp(code, salt),
      salt,
      expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
      attempts: 0,
      created_at: nowIso(),
    };
    db.pending_otps = db.pending_otps.filter(
      (otp) =>
        otp.user_id !== user.id &&
        new Date(otp.expires_at).getTime() > Date.now(),
    );
    db.pending_otps.push(pending);
    saveDb(db);

    return clone({
      pending_id: pending.id,
      email: user.email,
      expires_at: pending.expires_at,
      dev_otp: SHOW_LOCAL_OTP ? code : undefined,
    });
  },

  async verifyCustomerOtp(input: { pending_id: string; otp: string }) {
    await wait();
    const db = loadDb();
    const pending = db.pending_otps.find((otp) => otp.id === input.pending_id);
    if (!pending) throw new Error("OTP tidak ditemukan. Silakan login ulang.");
    if (new Date(pending.expires_at).getTime() < Date.now()) {
      db.pending_otps = db.pending_otps.filter((otp) => otp.id !== pending.id);
      saveDb(db);
      throw new Error("OTP sudah kedaluwarsa. Silakan login ulang.");
    }
    if (pending.attempts >= 5)
      throw new Error("Terlalu banyak percobaan OTP. Silakan login ulang.");
    const valid = await hashOtp(input.otp.trim(), pending.salt);
    if (valid !== pending.code_hash) {
      pending.attempts += 1;
      saveDb(db);
      throw new Error("OTP salah. Periksa kembali 6 digit kode Anda.");
    }

    const user = db.users.find((item) => item.id === pending.user_id);
    if (!user) throw new Error("Akun tidak ditemukan.");
    db.pending_otps = db.pending_otps.filter((otp) => otp.id !== pending.id);
    saveDb(db);
    const session: Session = {
      role: "customer",
      id: user.id,
      nama: user.nama,
      email: user.email,
      verified_at: nowIso(),
    };
    setSession(session);
    return clone(session);
  },

  async adminRegister(input: {
    nama: string;
    username: string;
    password: string;
  }) {
    await wait();
    const db = loadDb();
    const username = input.username.trim().toLowerCase();
    if (!input.nama.trim()) throw new Error("Nama admin wajib diisi.");
    if (!username) throw new Error("Username wajib diisi.");
    ensurePassword(input.password);
    if (db.admins.some((admin) => admin.username.toLowerCase() === username))
      throw new Error("Username sudah digunakan.");
    const admin: Admin = {
      id: newId("adm"),
      nama: input.nama.trim(),
      username,
      password_hash: await hashPassword(input.password),
      created_at: nowIso(),
    };
    db.admins.push(admin);
    saveDb(db);
    return clone(publicAdmin(admin));
  },

  async adminLogin(input: { username: string; password: string }) {
    await wait();
    const db = loadDb();
    const username = input.username.trim().toLowerCase();
    const admin = db.admins.find(
      (item) => item.username.toLowerCase() === username,
    );
    if (!admin) throw new Error("Username atau password salah.");
    const valid = await verifyPassword(input.password, admin.password_hash);
    if (!valid) throw new Error("Username atau password salah.");
    const session: Session = {
      role: "admin",
      id: admin.id,
      nama: admin.nama,
      username: admin.username,
      verified_at: nowIso(),
    };
    setSession(session);
    return clone(session);
  },

  async customerDashboard(): Promise<DashboardPayload> {
    await wait();
    const session = requireSession("customer");
    const db = loadDb();
    const bookings = sortedBookings(
      db.bookings.filter(
        (booking) =>
          booking.user_id === session.id ||
          booking.user_email === session.email,
      ),
    );
    return clone({
      nama: session.nama,
      lastBooking: bookings[0] ?? null,
      promos: db.promo.filter((promo) => promo.active).slice(0, 3),
      unreadNotifications: db.notifikasi.filter(
        (item) => item.user_email === session.email && !item.dibaca,
      ).length,
    });
  },

  async getCustomerProfile() {
    await wait();
    const session = requireSession("customer");
    const db = loadDb();
    const user = db.users.find((item) => item.id === session.id);
    if (!user) throw new Error("Profil tidak ditemukan.");
    return clone(user);
  },

  async updateCustomerProfile(
    input: Partial<Pick<User, "nama" | "email" | "no_hp">> & {
      vehicle_profile?: VehicleProfile;
    },
  ) {
    await wait();
    const session = requireSession("customer");
    const db = loadDb();
    const index = db.users.findIndex((item) => item.id === session.id);
    if (index < 0) throw new Error("Profil tidak ditemukan.");
    const email = input.email
      ? normalizeEmail(input.email)
      : db.users[index].email;
    if (db.users.some((user) => user.id !== session.id && user.email === email))
      throw new Error("Email sudah digunakan.");
    db.users[index] = {
      ...db.users[index],
      nama: input.nama?.trim() || db.users[index].nama,
      email,
      no_hp: input.no_hp ? normalizePhone(input.no_hp) : db.users[index].no_hp,
      vehicle_profile: input.vehicle_profile
        ? { ...emptyVehicle, ...input.vehicle_profile }
        : db.users[index].vehicle_profile,
    };
    db.bookings = db.bookings.map((booking) =>
      booking.user_id === session.id
        ? {
            ...booking,
            nama: db.users[index].nama,
            nama_pelanggan: db.users[index].nama,
            user_email: email,
            updated_at: nowIso(),
          }
        : booking,
    );
    db.notifikasi = db.notifikasi.map((notification) =>
      notification.user_id === session.id
        ? { ...notification, user_email: email }
        : notification,
    );
    saveDb(db);
    setSession({ ...session, nama: db.users[index].nama, email });
    return clone(db.users[index]);
  },

  async createCustomerBooking(
    input: Pick<
      Booking,
      | "motor"
      | "plat"
      | "jenis_servis"
      | "tanggal"
      | "waktu"
      | "keluhan"
      | "jenis_kendaraan"
    >,
  ) {
    await wait();
    const session = requireSession("customer");
    const db = loadDb();
    const user = db.users.find((item) => item.id === session.id);
    if (!user) throw new Error("Akun tidak ditemukan.");
    if (
      !input.motor ||
      !input.plat ||
      !input.jenis_servis ||
      !input.tanggal ||
      !input.waktu ||
      !input.keluhan
    ) {
      throw new Error("Lengkapi semua field booking terlebih dahulu.");
    }
    const timestamp = nowIso();
    const booking: Booking = {
      id: newId("svc"),
      user_id: user.id,
      user_email: user.email,
      nama: user.nama,
      nama_pelanggan: user.nama,
      motor: input.motor,
      jenis_kendaraan: input.jenis_kendaraan ?? "motor",
      plat: input.plat.toUpperCase(),
      jenis_servis: input.jenis_servis,
      tanggal: input.tanggal,
      waktu: input.waktu,
      keluhan: input.keluhan,
      status: "Menunggu",
      estimasi_selesai: "",
      mekanik: "",
      catatan_admin: "",
      sparepart_diganti: "",
      total_sparepart: 0,
      source: "customer",
      created_at: timestamp,
      updated_at: timestamp,
    };
    db.bookings.push(booking);
    addNotification(db, {
      user_id: user.id,
      user_email: user.email,
      judul: "Booking Berhasil Dibuat",
      pesan: `Booking servis ${booking.jenis_servis} untuk motor ${booking.motor} berhasil dibuat.`,
      tipe: "booking",
      booking_id: booking.id,
      dibaca: false,
    });
    saveDb(db);
    return clone(booking);
  },

  async getCustomerBookings() {
    await wait();
    const session = requireSession("customer");
    const db = loadDb();
    return clone(
      sortedBookings(
        db.bookings.filter(
          (booking) =>
            booking.user_id === session.id ||
            booking.user_email === session.email,
        ),
      ),
    );
  },

  async getCustomerBooking(id: string) {
    await wait();
    const session = requireSession("customer");
    const db = loadDb();
    const booking = db.bookings.find((item) => item.id === id);
    if (!booking) throw new Error("Data servis tidak ditemukan.");
    if (booking.user_id !== session.id && booking.user_email !== session.email)
      throw new Error("Anda tidak memiliki akses ke booking ini.");
    return clone(booking);
  },

  async getCustomerNotifications() {
    await wait();
    const session = requireSession("customer");
    const db = loadDb();
    return clone(
      db.notifikasi
        .filter(
          (item) =>
            item.user_email === session.email || item.user_id === session.id,
        )
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    );
  },

  async markNotificationRead(id: string) {
    await wait(80);
    const session = requireSession("customer");
    const db = loadDb();
    const notification = db.notifikasi.find(
      (item) =>
        item.id === id &&
        (item.user_id === session.id || item.user_email === session.email),
    );
    if (notification) notification.dibaca = true;
    saveDb(db);
    return clone(notification ?? null);
  },

  async getSparepartCatalog() {
    await wait(80);
    return clone(productCategories);
  },

  async getSparepartCategory(slug: string): Promise<ProductCategory> {
    await wait(80);
    const category = productCategories.find((item) => item.slug === slug);
    if (!category) throw new Error("Kategori sparepart tidak ditemukan.");
    return clone(category);
  },

  async adminDashboard(): Promise<AdminDashboardPayload> {
    await wait();
    requireSession("admin");
    const db = loadDb();
    return clone({
      totalPelanggan: db.users.length + db.pelanggan.length,
      totalBooking: db.bookings.length,
      totalSparepart: db.sparepart.length,
      totalAdmin: db.admins.length,
      lowStock: db.sparepart.filter((item) => Number(item.stok) < 5),
      recentBookings: sortedBookings(db.bookings).slice(0, 5),
    });
  },

  async getAdmins() {
    await wait();
    requireSession("admin");
    const db = loadDb();
    return clone(db.admins.map(publicAdmin));
  },

  async getPelanggan(keyword = "") {
    await wait();
    requireSession("admin");
    const db = loadDb();
    const registered: Pelanggan[] = db.users.map((user) => ({
      id: user.id,
      source: "user",
      nama: user.nama,
      alamat: user.email,
      telepon: user.no_hp,
      created_at: user.created_at,
    }));
    const all = [...registered, ...db.pelanggan];
    const q = keyword.trim().toLowerCase();
    return clone(
      q
        ? all.filter((item) =>
            `${item.nama} ${item.alamat} ${item.telepon}`
              .toLowerCase()
              .includes(q),
          )
        : all,
    );
  },

  async addPelanggan(input: Pick<Pelanggan, "nama" | "alamat" | "telepon">) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    if (!input.nama.trim()) throw new Error("Nama pelanggan wajib diisi.");
    const pelanggan: Pelanggan = {
      id: newId("plg"),
      source: "admin",
      nama: input.nama.trim(),
      alamat: input.alamat.trim(),
      telepon: normalizePhone(input.telepon),
      created_at: nowIso(),
    };
    db.pelanggan.push(pelanggan);
    saveDb(db);
    return clone(pelanggan);
  },

  async updatePelanggan(
    id: string,
    input: Pick<Pelanggan, "nama" | "alamat" | "telepon">,
  ) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    const index = db.pelanggan.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Hanya pelanggan manual yang dapat diedit.");
    db.pelanggan[index] = {
      ...db.pelanggan[index],
      nama: input.nama.trim(),
      alamat: input.alamat.trim(),
      telepon: normalizePhone(input.telepon),
    };
    saveDb(db);
    return clone(db.pelanggan[index]);
  },

  async deletePelanggan(source: string, id: string) {
    await wait();
    requireSession("admin");
    if (source !== "admin")
      throw new Error(
        "Pelanggan registrasi tidak dapat dihapus dari halaman ini.",
      );
    const db = loadDb();
    db.pelanggan = db.pelanggan.filter((item) => item.id !== id);
    saveDb(db);
    return { success: true };
  },

  async getAdminBookings(keyword = "") {
    await wait();
    requireSession("admin");
    const db = loadDb();
    const q = keyword.trim().toLowerCase();
    const data = sortedBookings(db.bookings);
    if (!q) return clone(data);
    return clone(
      data.filter((booking) =>
        `${booking.nama_pelanggan} ${booking.motor} ${booking.mekanik} ${booking.status} ${booking.keluhan}`
          .toLowerCase()
          .includes(q),
      ),
    );
  },

  async getAdminBooking(id: string) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    const booking = db.bookings.find((item) => item.id === id);
    if (!booking) throw new Error("Booking tidak ditemukan.");
    return clone(booking);
  },

  async addAdminBooking(input: Partial<Booking>) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    if (!input.nama_pelanggan || !input.motor || !input.keluhan)
      throw new Error("Nama pelanggan, motor, dan keluhan wajib diisi.");
    const timestamp = nowIso();
    const booking: Booking = {
      id: newId("svc"),
      nama: input.nama_pelanggan,
      nama_pelanggan: input.nama_pelanggan,
      motor: input.motor,
      jenis_kendaraan: input.jenis_kendaraan ?? "motor",
      plat: input.plat ?? "",
      jenis_servis: input.jenis_servis ?? "Servis Bengkel",
      tanggal: input.tanggal ?? "",
      waktu: input.waktu ?? "",
      keluhan: input.keluhan,
      status: (input.status as BookingStatus) ?? "Menunggu",
      estimasi_selesai: input.estimasi_selesai ?? "",
      mekanik: input.mekanik ?? "",
      catatan_admin: input.catatan_admin ?? "",
      sparepart_diganti: input.sparepart_diganti ?? "",
      total_sparepart: asCurrency(input.total_sparepart),
      source: "admin",
      created_at: timestamp,
      updated_at: timestamp,
    };
    db.bookings.push(booking);
    saveDb(db);
    return clone(booking);
  },

  async updateAdminBooking(id: string, input: Partial<Booking>) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    const index = db.bookings.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Booking tidak ditemukan.");
    const previous = db.bookings[index];
    const status = (input.status as BookingStatus) ?? previous.status;
    const next: Booking = {
      ...previous,
      nama_pelanggan: input.nama_pelanggan ?? previous.nama_pelanggan,
      nama: input.nama_pelanggan ?? previous.nama,
      motor: input.motor ?? previous.motor,
      jenis_kendaraan:
        input.jenis_kendaraan ?? previous.jenis_kendaraan ?? "motor",
      plat: input.plat ?? previous.plat,
      jenis_servis: input.jenis_servis ?? previous.jenis_servis,
      tanggal: input.tanggal ?? previous.tanggal,
      waktu: input.waktu ?? previous.waktu,
      keluhan: input.keluhan ?? previous.keluhan,
      mekanik: input.mekanik ?? previous.mekanik,
      status,
      estimasi_selesai: input.estimasi_selesai ?? previous.estimasi_selesai,
      catatan_admin: input.catatan_admin ?? previous.catatan_admin,
      sparepart_diganti: input.sparepart_diganti ?? previous.sparepart_diganti,
      total_sparepart:
        input.total_sparepart !== undefined
          ? asCurrency(input.total_sparepart)
          : previous.total_sparepart,
      updated_at: nowIso(),
    };
    db.bookings[index] = next;
    if (previous.status !== next.status && next.user_email) {
      const payload = statusNotification(next.status, next);
      if (payload) {
        addNotification(db, {
          user_id: next.user_id,
          user_email: next.user_email,
          judul: payload.judul,
          pesan: payload.pesan,
          tipe: "status",
          booking_id: next.id,
          dibaca: false,
        });
      }
    }
    saveDb(db);
    return clone(next);
  },

  async deleteAdminBooking(id: string) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    db.bookings = db.bookings.filter((item) => item.id !== id);
    saveDb(db);
    return { success: true };
  },

  async getAdminSpareparts(keyword = "", kategori = "") {
    await wait();
    requireSession("admin");
    const db = loadDb();
    const q = keyword.trim().toLowerCase();
    return clone(
      db.sparepart
        .filter((item) => {
          const matchesKeyword =
            !q ||
            `${item.nama_sparepart} ${item.kategori}`.toLowerCase().includes(q);
          const matchesCategory = !kategori || item.kategori === kategori;
          return matchesKeyword && matchesCategory;
        })
        .sort((a, b) => a.nama_sparepart.localeCompare(b.nama_sparepart)),
    );
  },

  async addSparepart(
    input: Omit<Sparepart, "id" | "created_at" | "updated_at">,
  ) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    if (!input.nama_sparepart.trim())
      throw new Error("Nama sparepart wajib diisi.");
    const item: Sparepart = {
      id: newId("spr"),
      nama_sparepart: input.nama_sparepart.trim(),
      kategori: input.kategori,
      stok: Number(input.stok),
      harga: asCurrency(input.harga),
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    db.sparepart.push(item);
    saveDb(db);
    return clone(item);
  },

  async updateSparepart(id: string, input: Partial<Sparepart>) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    const index = db.sparepart.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Sparepart tidak ditemukan.");
    db.sparepart[index] = {
      ...db.sparepart[index],
      ...input,
      stok:
        input.stok !== undefined
          ? Number(input.stok)
          : db.sparepart[index].stok,
      harga:
        input.harga !== undefined
          ? asCurrency(input.harga)
          : db.sparepart[index].harga,
      updated_at: nowIso(),
    };
    saveDb(db);
    return clone(db.sparepart[index]);
  },

  async deleteSparepart(id: string) {
    await wait();
    requireSession("admin");
    const db = loadDb();
    db.sparepart = db.sparepart.filter((item) => item.id !== id);
    saveDb(db);
    return { success: true };
  },

  clearLocalCachePreserveData() {
    const theme = localStorage.getItem(THEME_KEY);
    Object.keys(localStorage)
      .filter((key) => key.startsWith("simobs.ui."))
      .forEach((key) => localStorage.removeItem(key));
    if (theme) localStorage.setItem(THEME_KEY, theme);
  },

  getCustomerVehicles(): VehicleRecord[] {
    const session = requireSession("customer");
    const raw = localStorage.getItem(`simobs.garasi.${session.id}`);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as VehicleRecord[];
    } catch {
      return [];
    }
  },

  addCustomerVehicle(input: Omit<VehicleRecord, "id">): VehicleRecord {
    const session = requireSession("customer");
    const key = `simobs.garasi.${session.id}`;
    const vehicles = this.getCustomerVehicles();
    const vehicle: VehicleRecord = { ...input, id: newId("veh") };
    vehicles.push(vehicle);
    localStorage.setItem(key, JSON.stringify(vehicles));
    return clone(vehicle);
  },

  deleteCustomerVehicle(id: string) {
    const session = requireSession("customer");
    const key = `simobs.garasi.${session.id}`;
    const vehicles = this.getCustomerVehicles().filter((v) => v.id !== id);
    localStorage.setItem(key, JSON.stringify(vehicles));
    return { success: true };
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    await wait();
    const session = requireSession("customer");
    if (newPassword !== confirmPassword)
      throw new Error("Password baru dan konfirmasi tidak sama.");
    ensurePassword(newPassword);
    const db = loadDb();
    const user = db.users.find((u) => u.id === session.id);
    if (!user) throw new Error("Akun tidak ditemukan.");
    const valid = await verifyPassword(currentPassword, user.password_hash);
    if (!valid) throw new Error("Password saat ini salah.");
    user.password_hash = await hashPassword(newPassword);
    saveDb(db);
    return { success: true };
  },
};

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export function shortServiceId(id: string) {
  const suffix = id
    .replace(/[^a-z0-9]/gi, "")
    .slice(-4)
    .toUpperCase()
    .padStart(4, "0");
  return `SVC-${new Date().getFullYear()}-${suffix}`;
}

export function getThemePreference() {
  return (localStorage.getItem(THEME_KEY) as string | null) ?? "auto";
}

export function setThemePreference(value: string) {
  localStorage.setItem(THEME_KEY, value);
}
